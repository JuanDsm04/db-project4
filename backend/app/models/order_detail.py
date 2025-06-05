from sqlalchemy import (
    Column, Integer, ForeignKey, Numeric, CheckConstraint
)
from sqlalchemy.orm import relationship

from .BASE import Base
class OrderDetail(Base):
    __tablename__ = 'order_details'

    id = Column(Integer, primary_key=True)
    id_order = Column(Integer, ForeignKey('orders.id'), nullable=False)
    id_ingredient = Column(Integer, ForeignKey('ingredients.id'), nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False, default=1)
    price = Column(Numeric(10, 2), nullable=False)

    __table_args__ = (
        CheckConstraint('quantity > 0', name='check_quantity_positive'),
        CheckConstraint('price >= 0', name='check_price_non_negative'),
    )

    # order = relationship("Order", backref="details")
    # ingredient = relationship("Ingredient", backref="order_usages")

    def __repr__(self):
        return f"<OrderDetail(order_id={self.id_order}, ingredient_id={self.id_ingredient}, quantity={self.quantity}, price={self.price})>"