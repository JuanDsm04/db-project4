from sqlalchemy import Column, Integer, String, CheckConstraint
from sqlalchemy.orm import relationship

from .BASE import Base

class Supplier(Base):
    __tablename__ = 'suppliers'

    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    phone = Column(String(8), nullable=False)
    address = Column(String(200), nullable=False)

    __table_args__ = (
        CheckConstraint("phone ~ '^\d{8}$'", name='check_phone_format'),
    )
    
    def __repr__(self):
        return f"<Supplier(name='{self.name}', phone='{self.phone}', address='{self.address}')>"