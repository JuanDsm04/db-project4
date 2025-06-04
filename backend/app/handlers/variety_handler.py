from fastapi import Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from .router import router
from app.models.ingredient import Ingredient

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/getIngredients")
def get_all_ingredients(db: Session = Depends(get_db)):
    return db.query(Ingredient).all()

