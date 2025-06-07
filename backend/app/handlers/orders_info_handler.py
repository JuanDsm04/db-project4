from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db import SessionLocal
from pydantic import BaseModel
from typing import Optional
from datetime import date
import io
import csv
from app.models.orders_info import OrdersInfo
from app.models.order_detail import OrderDetail
from app.models.ingredient import Ingredient
from app.models.order import Order

router = APIRouter()


class modelNewOrder(BaseModel):
    quantity: int
    price: float
    order_number: int
    ingredient: str

    class Config:
        orm_mode = True


class modelUpdateOrderDetail(BaseModel):
    quantity: Optional[float] = None
    price: Optional[float] = None
    ingredient: Optional[str] = None

    class Config:
        orm_mode = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/orders")
def get_all_orders(db: Session = Depends(get_db)):
    return db.query(OrdersInfo).all()


@router.post("/orders")
def create_order_detail(order_data: modelNewOrder, db: Session = Depends(get_db)):
    ingredient = db.query(Ingredient).filter(
        Ingredient.name == order_data.ingredient).first()
    if not ingredient:
        raise HTTPException(
            status_code=404, detail="Ingrediente no encontrado")

    order = db.query(Order).filter(Order.id == order_data.order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")

    new_detail = OrderDetail(
        id_order=order.id,
        id_ingredient=ingredient.id,
        quantity=order_data.quantity,
        price=order_data.price
    )

    db.add(new_detail)
    db.commit()
    db.refresh(new_detail)

    return {"message": "Entrada agregada correctamente", "order_detail": new_detail}


@router.delete("/orders/{order_detail_id}")
def delete_order_detail(order_detail_id: int, db: Session = Depends(get_db)):
    order_detail = db.query(OrderDetail).filter(
        OrderDetail.id == order_detail_id).first()

    if not order_detail:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")

    db.delete(order_detail)
    db.commit()

    return {"message": "Entrada eliminada correctamente"}


@router.put("/orders/{order_detail_id}")
def update_order_detail(order_detail_id: int, update_data: modelUpdateOrderDetail, db: Session = Depends(get_db)):
    order_detail = db.query(OrderDetail).filter(
        OrderDetail.id == order_detail_id).first()
    if not order_detail:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")

    if update_data.quantity is not None:
        order_detail.quantity = update_data.quantity
    if update_data.price is not None:
        order_detail.price = update_data.price

    if update_data.ingredient is not None:
        ingredient = db.query(Ingredient).filter(
            Ingredient.name == update_data.ingredient).first()
        if not ingredient:
            raise HTTPException(status_code=404, detail="Ingredient not found")

        order_detail.id_ingredient = ingredient.id

    db.commit()
    db.refresh(order_detail)

    return {
        "message": "Entrada actualizada exitosamente",
        "order_detail": {
            "id": order_detail.id,
            "quantity": order_detail.quantity,
            "price": order_detail.price,
            "ingredient_id": order_detail.id_ingredient
        }
    }


@router.get("/orders/export")
def export_orders_csv(
    db: Session = Depends(get_db),
    order_date: Optional[date] = Query(None),
    status: Optional[str] = Query(None),
    order_number: Optional[int] = Query(None),
    ingredient: Optional[str] = Query(None),
    max_price: Optional[float] = Query(None)
):
    query = db.query(OrdersInfo)

    if order_date:
        query = query.filter(OrdersInfo.order_date.cast(date) == order_date)
    if status:
        query = query.filter(OrdersInfo.status == status)
    if order_number:
        query = query.filter(OrdersInfo.order_number == order_number)
    if ingredient:
        query = query.filter(OrdersInfo.ingredient.ilike(f"%{ingredient}%"))
    if max_price is not None:
        query = query.filter(OrdersInfo.price <= max_price)

    results = query.all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Order Number", "Ingredient",
                    "Quantity", "Price", "Unit", "Order Date", "Status"])

    for row in results:
        writer.writerow([
            row.id,
            row.order_number,
            row.ingredient,
            row.quantity,
            row.price,
            row.unit,
            row.order_date.strftime(
                "%Y-%m-%d %H:%M:%S") if row.order_date else "",
            row.status
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=filtered_orders.csv"}
    )
