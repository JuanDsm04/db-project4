from sqlalchemy import (
    Column, Integer, ForeignKey, Enum,
    DateTime, Numeric, func
)
from sqlalchemy.orm import relationship

from .BASE import Base
ORDER_STATUSES = ('Pending', 'Delivered', 'Cancelled')

class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    id_supplier = Column(Integer, ForeignKey('suppliers.id'), nullable=False)
    order_date = Column(DateTime, nullable=False, default=func.now())
    status = Column(Enum(*ORDER_STATUSES, name='order_status'), nullable=False, default='Pending')
    total = Column(Numeric(10, 2), default=0.00)

    # supplier = relationship("Supplier", backref="orders")

    def __repr__(self):
        return f"<Order(id={self.id}, supplier_id={self.id_supplier}, date={self.order_date}, status='{self.status}', total={self.total})>"