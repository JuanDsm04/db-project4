from sqlalchemy import Column, String, Date, Time, Enum, Text

from .BASE import Base

SHIFT_STATUSES = ('Scheduled', 'Completed', 'Absent')

class StaffInfo(Base):
    __tablename__ = 'staffinfo'
    __table_args__ = {'extend_existing': True}

    name = Column(String(250), nullable=False, primary_key=True)
    phone = Column(String(8), nullable=False)
    rol = Column(String(100), nullable=False,primary_key=True)
    date = Column(Date, nullable=False,primary_key=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(Enum(*SHIFT_STATUSES, name='shift_status'), default='Scheduled',primary_key=True)
    comment = Column(Text)
    location = Column(String(250), nullable=False,primary_key=True)

    def __repr__(self):
        return (f"<StaffInfo(name='{self.name}', role='{self.rol}', date={self.date}, "
                f"location='{self.location}', status='{self.status}')>")
