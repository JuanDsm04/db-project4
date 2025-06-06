from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.staff_info import StaffInfo

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/staffInfo")
def get_staff_info(db: Session = Depends(get_db)):
    return db.query(StaffInfo).all()
