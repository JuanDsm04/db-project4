from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

UNIT_MEASURES = ('g', 'kg', 'ml', 'l', 'unit')

class Ingredient(Base):
    __tablename__ = 'ingredients'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    unit_measure = Column(Enum(*UNIT_MEASURES, name='unit_measure'), nullable=False)
    id_supplier = Column(Integer, ForeignKey('suppliers.id'), nullable=False)

    supplier = relationship("Supplier", backref="ingredients")

    def __repr__(self):
        return f"<Ingredient(name='{self.name}', unit_measure='{self.unit_measure}', supplier_id={self.id_supplier})>"