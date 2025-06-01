from sqlalchemy import (
    Column, Integer, String, Time, CheckConstraint
)
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Branch(Base):
    __tablename__ = 'branches'

    id = Column(Integer, primary_key=True)
    location = Column(String(250), nullable=False)
    opening_time = Column(Time, nullable=False)
    closing_time = Column(Time, nullable=False)
    phone = Column(String(8), nullable=False)
    email = Column(String(250), nullable=False)

    __table_args__ = (
        CheckConstraint("phone ~ '^\d{8}$'", name='check_phone_format'),
        CheckConstraint("email ~* E'^[^@]+@[^@]+\\.[^@]+$'", name='check_email_format'),
        CheckConstraint('closing_time > opening_time', name='check_time_order'),
    )

    def __repr__(self):
        return f"<Branch(location='{self.location}', phone='{self.phone}', email='{self.email}')>"