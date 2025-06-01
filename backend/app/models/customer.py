from sqlalchemy import Column, Integer, String, CheckConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Customer(Base):
    __tablename__ = 'customers'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    phone = Column(String(8), nullable=False)
    email = Column(String(250), nullable=False)

    __table_args__ = (
        CheckConstraint("phone ~ '^\d{8}$'", name='check_phone_format'),
        CheckConstraint("email ~* E'^[^@]+@[^@]+\\.[^@]+$'", name='check_email_format'),
    )

    def __repr__(self):
        return f"<Customer(name='{self.name}', phone='{self.phone}', email='{self.email}')>"