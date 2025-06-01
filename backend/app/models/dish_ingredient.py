from sqlalchemy import Column, Integer, ForeignKey, Numeric, CheckConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class DishIngredient(Base):
    __tablename__ = 'dish_ingredients'

    id = Column(Integer, primary_key=True)
    id_ingredient = Column(Integer, ForeignKey('ingredients.id'), nullable=False)
    id_dish = Column(Integer, ForeignKey('dishes.id'), nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False, default=1)

    __table_args__ = (
        CheckConstraint('quantity > 0', name='check_quantity_positive'),
    )

    ingredient = relationship("Ingredient", backref="dish_links")
    dish = relationship("Dish", backref="ingredient_links")

    def __repr__(self):
        return f"<DishIngredient(dish_id={self.id_dish}, ingredient_id={self.id_ingredient}, quantity={self.quantity})>"