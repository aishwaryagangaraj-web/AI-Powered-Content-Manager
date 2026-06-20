from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.activity import Activity
from app.models.content import Content
from app.models.user import User

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    base = Content.user_id == user.id
    total = db.scalar(select(func.count(Content.id)).where(base)) or 0
    favorites = db.scalar(select(func.count(Content.id)).where(base, Content.is_favorite.is_(True))) or 0
    archived = db.scalar(select(func.count(Content.id)).where(base, Content.is_archived.is_(True))) or 0
    words = db.scalars(select(Content.generated_text).where(base)).all()
    type_rows = db.execute(select(Content.content_type, func.count(Content.id)).where(base).group_by(Content.content_type)).all()
    start = datetime.now(timezone.utc) - timedelta(days=6)
    daily_rows = db.execute(
        select(func.date(Content.created_at), func.count(Content.id))
        .where(base, Content.created_at >= start)
        .group_by(func.date(Content.created_at))
    ).all()
    daily_map = {str(day): count for day, count in daily_rows}
    daily = []
    for offset in range(7):
        day = (start + timedelta(days=offset)).date()
        daily.append({"date": day.strftime("%b %d"), "count": daily_map.get(str(day), 0)})
    activities = db.scalars(select(Activity).where(Activity.user_id == user.id).order_by(Activity.timestamp.desc()).limit(8)).all()
    return {
        "summary": {"total_content": total, "favorites": favorites, "archived": archived, "words_generated": sum(len(text.split()) for text in words)},
        "by_type": [{"type": name, "count": count} for name, count in type_rows],
        "daily": daily,
        "recent_activity": [{"id": a.id, "action": a.action, "timestamp": a.timestamp} for a in activities],
    }
