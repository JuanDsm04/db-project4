from sqlalchemy import Column, Integer, String, ForeignKey, Date, CheckConstraint, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Staff(Base):
    __tablename__ = 'staff'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    id_role = Column(Integer, ForeignKey('staff_roles.id'), nullable=False)
    phone = Column(String(8), nullable=False)
    hire_date = Column(Date, nullable=False, default=func.current_date())

    __table_args__ = (
        CheckConstraint("phone ~ '^\d{8}$'", name='check_phone_format'),
    )

    role = relationship("StaffRole", backref="staff_members")

    def __repr__(self):
        return f"<Staff(name='{self.name}', role_id={self.id_role}, phone='{self.phone}', hire_date={self.hire_date})>"