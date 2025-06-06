from sqlalchemy import Column, String, Integer, Enum, Date, Numeric
from .BASE import Base

STATUS = ('Pending', 'Delivered', 'Cancelled')
UNIT_MEASURES = ('g', 'kg', 'ml', 'l', 'unit')


class OrdersInfo(Base):
    __tablename__ = 'orders_info'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, nullable=False)
    order_number = Column(Integer, nullable=False)
    ingredient = Column(String(200), nullable=False, primary_key=True)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    unit = Column(
        Enum(*UNIT_MEASURES, name='unit_measure'),
        nullable=False
    )
    status = Column(Enum(*STATUS, name='status'), nullable=False)
    order_date = Column(Date, nullable=False)

    def __repr__(self):
        return (
            f"<OrdersInfo(ingredient_name='{self.name}', quantity='{self.quantity}', "
            f"price='{self.price}', unit='{self.unit_measure}')>"
        )
