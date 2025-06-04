from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal
from pydantic import BaseModel
from app.models.dish_branch_info import DishBranchInfo
from app.models.dish import Dish
from app.models.ingredient import Ingredient
from app.models.dish_ingredient import DishIngredient
from app.models.branch import Branch
from app.models.branch_menu import BranchMenu
from app.models.invoice_detail import InvoiceDetail
from app.handlers.router import router


class modelNewDish(BaseModel):
    name:str
    description:str
    type:str
    category:str
    preparation_minutes:int
    base_price:float
    quantity:list[float]
    ingredients:list[int]
    branches:list[int]
    current_price: list[float]
    class Config:
        orm_mode = True

class modelExistentDish(BaseModel):
    id:int
    name:str
    description:str
    type:str
    category:str
    preparation_minutes:int
    base_price:float
    quantity:list[float]
    ingredients:list[int]
    branches:list[int]
    current_price: list[float]
    class Config:
        orm_mode = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/dishesInfo")
def all_ingredients(db: Session = Depends(get_db)):
    return db.query(DishBranchInfo).all()

@router.post("/newDish")
def create_new_dish(dish: modelNewDish,db: Session = Depends(get_db)):
    dish_alrExists = db.query(Dish).filter(Dish.name == dish.name).first()
    if dish_alrExists:
        raise HTTPException(status_code=400, detail="El platillo ya está registrado con ese nombre.")
    new_dish = Dish(
        name = dish.name,
        description = dish.description,
        type = dish.type,
        category =dish.category,
        preparation_minutes = dish.preparation_minutes,
        base_price = dish.base_price
    )
    db.add(new_dish)
    db.commit()
    db.refresh(new_dish)

    for i,ingredient_id in enumerate(dish.ingredients):
        ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
        if not ingredient:
            raise HTTPException(status_code=400, detail=f"Ingrediente con ID {ingredient_id} no existe.")
    
        dish_ingredient = DishIngredient(
            id_ingredient = ingredient_id,
            id_dish = new_dish.id,
            quantity =dish.quantity[i]
        )
        db.add(dish_ingredient)
    db.commit()

    for i,branch_id in enumerate(dish.branches):
        branch = db.query(Branch).filter(Branch.id == branch_id).first()
        if not branch:
            raise HTTPException(status_code=400, detail=f"Sucursal con ID {branch_id} no existe.")

        branch_menu = BranchMenu(
            id_branch = branch_id,
            id_dish = new_dish.id,
            current_price =dish.current_price[i]
        )
        db.add(branch_menu)
    db.commit()

    return {
        "message":"Se creó el platillo",
        "platillo":new_dish,
        "ingredientes":dish.ingredients,
        "sucursales":dish.branches
    }


@router.delete("/deleteDish")
def deleteDish(id_dish: int,db: Session = Depends(get_db)):
    dish_should_exist = db.query(Dish).filter(Dish.id == id_dish).first()
    if not dish_should_exist:
        raise HTTPException(status_code=400, detail="El platillo a eliminar no existe.")
    db.query(BranchMenu).filter(BranchMenu.id_dish == id_dish).delete()
    db.query(InvoiceDetail).filter(InvoiceDetail.id_dish == id_dish).delete()
    db.query(DishIngredient).filter(DishIngredient.id_dish == id_dish).delete()

    db.delete(dish_should_exist)
    db.commit()
    return{
        "message":"platillo eliminado",
        "platillo id":id_dish
    }

@router.put("/editDish")
def editDish(editable_dish: modelExistentDish,db: Session = Depends(get_db)):
    dish_should_exist = db.query(Dish).filter(Dish.id ==editable_dish.id).first()
    if not dish_should_exist:
        raise HTTPException(status_code=400, detail="El platillo a editar no existe.")
    
    dish_should_exist.name = editable_dish.name,
    dish_should_exist.description = editable_dish.description,
    dish_should_exist.type = editable_dish.type,
    dish_should_exist.category = editable_dish.category,
    dish_should_exist.preparation_minutes = editable_dish.preparation_minutes,
    dish_should_exist.base_price = editable_dish.base_price

    db.query(DishIngredient).filter(
        DishIngredient.id_dish== editable_dish.id
    ).delete(synchronize_session=False)
    db.query(BranchMenu).filter(BranchMenu.id_dish == editable_dish.id).delete(synchronize_session=False)

    for i,ingredient_id in enumerate(editable_dish.ingredients):
        # ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()

        dish_ingredient = DishIngredient(
            id_ingredient = ingredient_id,
            id_dish = editable_dish.id,
            quantity =editable_dish.quantity[i]
        )
        db.add(dish_ingredient)
    db.commit()
    db.refresh(dish_should_exist)

    for i,branch_id in enumerate(editable_dish.branches):
        branch_menu = BranchMenu(
            id_branch = branch_id,
            id_dish = editable_dish.id,
            current_price =editable_dish.current_price[i]
        )
        db.add(branch_menu)
    db.commit()
    db.refresh(dish_should_exist)

    return {
        "message":"platillo actualizado",
        "platillo": {
            "platillo":dish_should_exist,
            "nuevos ingredientes":editable_dish.ingredients,
            "nuevas sucursales":editable_dish.branches
        }
    }

