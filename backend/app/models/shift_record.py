from sqlalchemy import (
    Column, Integer, ForeignKey, Date, Time, Interval, Text,
    Enum, CheckConstraint
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

SHIFT_STATUSES = ('Scheduled', 'Completed', 'Absent')

class ShiftRecord(Base):
    __tablename__ = 'shift_records'

    id = Column(Integer, primary_key=True)
    id_employee = Column(Integer, ForeignKey('staff.id'), nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    total_hours = Column(Interval)
    id_branch = Column(Integer, ForeignKey('branches.id'), nullable=False)
    status = Column(Enum(*SHIFT_STATUSES, name='shift_status'), default='Scheduled')
    comment = Column(Text)

    __table_args__ = (
        CheckConstraint('end_time > start_time', name='check_time_order'),
    )

    employee = relationship("Staff", backref="shift_records")
    branch = relationship("Branch", backref="shift_records")

    def __repr__(self):
        return (
            f"<ShiftRecord(employee_id={self.id_employee}, date={self.date}, "
            f"start_time={self.start_time}, end_time={self.end_time}, status='{self.status}')>"
        )
