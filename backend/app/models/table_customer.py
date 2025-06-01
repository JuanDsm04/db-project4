from sqlalchemy import (
    Column, Integer, ForeignKey, DateTime, func
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class TableCustomer(Base):
    __tablename__ = 'table_customers'

    id = Column(Integer, primary_key=True)
    id_customer = Column(Integer, ForeignKey('customers.id'), nullable=False)
    id_waiter_shift = Column(Integer, ForeignKey('shift_records.id'), nullable=False)
    arrival_time = Column(DateTime, nullable=False, default=func.current_timestamp())
    departure_time = Column(DateTime)

    customer = relationship("Customer", backref="table_customers")
    waiter_shift = relationship("ShiftRecord", backref="table_customers")

    def __repr__(self):
        return (
            f"<TableCustomer(customer_id={self.id_customer}, waiter_shift_id={self.id_waiter_shift}, "
            f"arrival_time={self.arrival_time}, departure_time={self.departure_time})>"
        )