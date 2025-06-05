from sqlalchemy import Column, Integer, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

from .BASE import Base

class Table(Base):
    __tablename__ = 'tables'

    id = Column(Integer, primary_key=True)
    id_branch = Column(Integer, ForeignKey('branches.id'), nullable=False)
    table_number = Column(Integer, nullable=False)
    capacity = Column(Integer, nullable=False)

    __table_args__ = (
        CheckConstraint('capacity > 0', name='check_capacity_positive'),
    )

    # branch = relationship("Branch", backref="tables")

    def __repr__(self):
        return f"<Table(branch_id={self.id_branch}, table_number={self.table_number}, capacity={self.capacity})>"