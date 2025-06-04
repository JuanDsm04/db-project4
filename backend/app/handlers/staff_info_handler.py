from fastapi import Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from .router import router
from app.models.staff_info import StaffInfo

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/staffInfo")
def all_ingredients(db: Session = Depends(get_db)):
    return db.query(StaffInfo).all()
