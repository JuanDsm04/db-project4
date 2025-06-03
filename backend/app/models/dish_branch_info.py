from sqlalchemy import Column, String, Integer,Enum,Text,Numeric
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
DISH_TYPES = ('Appetizer', 'Main', 'Dessert', 'Beverage')
CATEGORIES = ('Salads', 'Pasta', 'Grill', 'Soup', 'Seafood')
UNIT_MEASURES = ('g', 'kg', 'ml', 'l', 'unit')

class DishBranchInfo(Base):
    __tablename__ = 'dishesbranchinfo' 
    __table_args__ = {'extend_existing': True}
    
    name = Column(String(200), nullable=False,primary_key=True)
    description = Column(Text)
    type = Column(Enum(*DISH_TYPES, name='dish_type'), nullable=False)
    category = Column(Enum(*CATEGORIES, name='category'), nullable=False)
    preparation_minutes = Column(Integer)
    base_price =Column(Numeric(10, 2), nullable=False)
    current_price = Column(Numeric(10, 2), nullable=False)
    location = Column(String(250), nullable=False,primary_key=True)
    quantity = Column(Numeric(10, 2), nullable=False, default=1)
    ingredient = Column(String(250), nullable=False,primary_key=True)
    unit_measure = Column(Enum(*UNIT_MEASURES, name='unit_measure'), nullable=False)
    
    def __repr__(self):
        return (f"<DishesBranchInfo(dish_name='{self.name}', branch='{self.location}', "
                f"ingredient='{self.ingredient}', quantity={self.quantity}, unit='{self.unit_measure}')>")
    


