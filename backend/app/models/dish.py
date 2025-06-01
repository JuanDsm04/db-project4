from sqlalchemy import (
    Column, Integer, String, Text, Enum,
    Numeric, CheckConstraint
)
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

DISH_TYPES = ('Appetizer', 'Main', 'Dessert', 'Beverage')
CATEGORIES = ('Salads', 'Pasta', 'Grill', 'Soup', 'Seafood')

class Dish(Base):
    __tablename__ = 'dishes'

    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    type = Column(Enum(*DISH_TYPES, name='dish_type'), nullable=False)
    category = Column(Enum(*CATEGORIES, name='category'), nullable=False)
    preparation_minutes = Column(Integer)
    base_price = Column(Numeric(10, 2), nullable=False)

    __table_args__ = (
        CheckConstraint('preparation_minutes >= 0', name='check_preparation_minutes'),
        CheckConstraint('base_price >= 0', name='check_base_price'),
    )

    def __repr__(self):
        return f"<Dish(name='{self.name}', type='{self.type}', category='{self.category}', price={self.base_price})>"