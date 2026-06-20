from sqlalchemy.orm import Session

from app.models.activity import Activity


def log_activity(db: Session, user_id: int, action: str) -> None:
    db.add(Activity(user_id=user_id, action=action))
