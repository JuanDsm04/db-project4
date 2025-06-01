from sqlalchemy import Column, Integer, ForeignKey, DateTime, Numeric, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Invoice(Base):
    __tablename__ = 'invoices'

    id = Column(Integer, primary_key=True)
    id_customer = Column(Integer, ForeignKey('customers.id'), nullable=False)
    invoice_date = Column(DateTime, nullable=False, default=func.current_timestamp())
    total = Column(Numeric(10, 2), default=0)

    customer = relationship("Customer", backref="invoices")
    details = relationship("InvoiceDetail", back_populates="invoice", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Invoice(customer_id={self.id_customer}, date={self.invoice_date}, total={self.total})>"