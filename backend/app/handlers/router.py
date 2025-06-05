from fastapi import APIRouter
router = APIRouter()

from app.handlers import dishes_branches_handler,staff_info_handler,variety_handler
