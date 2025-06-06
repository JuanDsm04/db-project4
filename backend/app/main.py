from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.handlers.dishes_branches_handler import router as dishes_router
from app.handlers.orders_info_handler import router as orders_router
from app.handlers.staff_info_handler import router as staff_router
from app.handlers.variety_handler import router as variety_router

app = FastAPI()
app.include_router(dishes_router)
app.include_router(orders_router)
app.include_router(staff_router)
app.include_router(variety_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



