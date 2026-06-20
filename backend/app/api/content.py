from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.content import Content
from app.models.user import User
from app.schemas.content import ContentCreate, ContentResponse, ContentUpdate, PaginatedContents
from app.utils.activity import log_activity

router = APIRouter(prefix="/content", tags=["Content"])


def owned_content(content_id: int, user_id: int, db: Session) -> Content:
    item = db.scalar(select(Content).where(Content.id == content_id, Content.user_id == user_id))
    if not item:
        raise HTTPException(status_code=404, detail="Content not found")
    return item


@router.get("", response_model=PaginatedContents)
def list_content(
    search: str | None = None,
    content_type: str | None = None,
    favorite: bool | None = None,
    archived: bool | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    filters = [Content.user_id == user.id]
    if search:
        term = f"%{search.strip()}%"
        filters.append(or_(Content.title.ilike(term), Content.prompt.ilike(term), Content.generated_text.ilike(term)))
    if content_type and content_type != "all":
        filters.append(Content.content_type == content_type)
    if favorite is not None:
        filters.append(Content.is_favorite == favorite)
    if archived is not None:
        filters.append(Content.is_archived == archived)
    total = db.scalar(select(func.count(Content.id)).where(*filters)) or 0
    items = db.scalars(select(Content).where(*filters).order_by(Content.updated_at.desc()).offset((page - 1) * page_size).limit(page_size)).all()
    return PaginatedContents(
        items=[ContentResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=ContentResponse, status_code=status.HTTP_201_CREATED)
def create_content(payload: ContentCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    item = Content(user_id=user.id, **payload.model_dump())
    db.add(item)
    db.flush()
    log_activity(db, user.id, f"Created {item.content_type}: {item.title}")
    db.commit()
    db.refresh(item)
    return item


@router.get("/{content_id}", response_model=ContentResponse)
def get_content(content_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return owned_content(content_id, user.id, db)


@router.put("/{content_id}", response_model=ContentResponse)
def update_content(content_id: int, payload: ContentUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    item = owned_content(content_id, user.id, db)
    changes = payload.model_dump(exclude_unset=True, exclude_none=True)
    if not changes:
        raise HTTPException(status_code=422, detail="Provide at least one field to update")
    for field, value in changes.items():
        setattr(item, field, value)
    log_activity(db, user.id, f"Updated content: {item.title}")
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_content(content_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    item = owned_content(content_id, user.id, db)
    title = item.title
    db.delete(item)
    log_activity(db, user.id, f"Deleted content: {title}")
    db.commit()
