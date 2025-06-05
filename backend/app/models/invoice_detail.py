from sqlalchemy import (
    Column, Integer, ForeignKey, Numeric, CheckConstraint
)
from sqlalchemy.orm import relationship

from .BASE import Base
class InvoiceDetail(Base):
    __tablename__ = 'invoice_details'

    id = Column(Integer, primary_key=True)
    id_invoice = Column(Integer, ForeignKey('invoices.id'), nullable=False)
    id_dish = Column(Integer, ForeignKey('dishes.id'), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), default=0)

    __table_args__ = (
        CheckConstraint('quantity > 0', name='check_quantity_positive'),
        CheckConstraint('unit_price >= 0', name='check_unit_price_positive'),
    )

    # invoice = relationship("Invoice", back_populates="details")
    # dish = relationship("Dish")

    def __repr__(self):
        return (
            f"<InvoiceDetail(invoice_id={self.id_invoice}, dish_id={self.id_dish}, "
            f"quantity={self.quantity}, unit_price={self.unit_price}, subtotal={self.subtotal})>"
        )