from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class StaffRole(Base):
    __tablename__ = 'staff_roles'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)

    def __repr__(self):
        return f"<StaffRole(name='{self.name}')>"