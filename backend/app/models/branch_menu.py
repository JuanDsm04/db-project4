from sqlalchemy import Column, Integer, ForeignKey, Numeric, CheckConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class BranchMenu(Base):
    __tablename__ = 'branch_menus'

    id = Column(Integer, primary_key=True)
    id_branch = Column(Integer, ForeignKey('branches.id'), nullable=False)
    id_dish = Column(Integer, ForeignKey('dishes.id'), nullable=False)
    current_price = Column(Numeric(10, 2), nullable=False)

    __table_args__ = (
        CheckConstraint('current_price >= 0', name='check_current_price_positive'),
    )

    branch = relationship("Branch", backref="menus")
    dish = relationship("Dish", backref="branch_menus")

    def __repr__(self):
        return f"<BranchMenu(branch_id={self.id_branch}, dish_id={self.id_dish}, price={self.current_price})>"