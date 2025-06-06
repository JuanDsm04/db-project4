from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.ingredient import Ingredient

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/getIngredients")
def get_all_ingredients(db: Session = Depends(get_db)):
    return db.query(Ingredient).all()
