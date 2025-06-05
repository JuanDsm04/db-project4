# app/models/init_models.py
from sqlalchemy.orm import relationship

from .branch_menu import BranchMenu
from .branch import Branch
from .dish import Dish
from .ingredient import Ingredient
from .dish_ingredient import DishIngredient
from .supplier import Supplier
from .invoice import Invoice
from .invoice_detail import InvoiceDetail
from .customer import Customer
from .order import Order
from .order_detail import OrderDetail
from .staff import Staff
from .shift_record import ShiftRecord
from .staff_role import StaffRole
from .table_customer import TableCustomer
from .table import Table

def init_relationships():
    # Branch <-> BranchMenu
    Branch.menus = relationship(
        "BranchMenu",
        back_populates="branch",
        cascade="all, delete-orphan"
    )
    BranchMenu.branch = relationship(
        "Branch",
        back_populates="menus"
    )

    Dish.branch_menus = relationship(
        "BranchMenu",
        back_populates="dish",
        cascade="all, delete-orphan"
    )
    BranchMenu.dish = relationship(
        "Dish",
        back_populates="branch_menus"
    )

    # Dish <-> DishIngredient
    Dish.ingredient_links = relationship(
        "DishIngredient",
        back_populates="dish",
        cascade="all, delete-orphan"
    )
    DishIngredient.dish = relationship(
        "Dish",
        back_populates="ingredient_links"
    )

    # Ingredient <-> DishIngredient
    Ingredient.dish_links = relationship(
        "DishIngredient",
        back_populates="ingredient",
        cascade="all, delete-orphan"
    )
    DishIngredient.ingredient = relationship(
        "Ingredient",
        back_populates="dish_links"
    )
    Supplier.ingredients = relationship(
        "Ingredient",
        back_populates="supplier",
        cascade="all, delete-orphan"
    )
    Ingredient.supplier = relationship(
        "Supplier",
        back_populates="ingredients",
        cascade="all, delete"
    )
        # Invoice <-> InvoiceDetail
    Invoice.details = relationship(
        "InvoiceDetail",
        back_populates="invoice",
        cascade="all, delete-orphan"
    )
    InvoiceDetail.invoice = relationship(
        "Invoice",
        back_populates="details"
    )

    # Dish <-> InvoiceDetail (una vía)
    InvoiceDetail.dish = relationship("Dish")
    Dish.invoice_details = relationship("InvoiceDetail", back_populates="dish")

    # Customer <-> Invoice
    Customer.invoices = relationship(
        "Invoice",
        back_populates="customer",
        cascade="all, delete-orphan"
    )
    Invoice.customer = relationship(
        "Customer",
        back_populates="invoices"
    )

        # Order <-> OrderDetail
    Order.details = relationship(
        "OrderDetail",
        back_populates="order",
        cascade="all, delete-orphan"
    )
    OrderDetail.order = relationship(
        "Order",
        back_populates="details"
    )

    # Ingredient <-> OrderDetail
    Ingredient.order_usages = relationship(
        "OrderDetail",
        back_populates="ingredient",
        cascade="all, delete-orphan"
    )
    OrderDetail.ingredient = relationship(
        "Ingredient",
        back_populates="order_usages"
    )
    Supplier.orders = relationship(
        "Order",
        back_populates="supplier",
        cascade="all, delete-orphan"
    )
    Order.supplier = relationship(
        "Supplier",
        back_populates="orders"
    )
    # Staff <-> ShiftRecord
    Staff.shift_records = relationship(
        "ShiftRecord",
        back_populates="employee",
        cascade="all, delete-orphan"
    )
    ShiftRecord.employee = relationship(
        "Staff",
        back_populates="shift_records"
    )

    # Branch <-> ShiftRecord
    Branch.shift_records = relationship(
        "ShiftRecord",
        back_populates="branch",
        cascade="all, delete-orphan"
    )
    ShiftRecord.branch = relationship(
        "Branch",
        back_populates="shift_records"
    )
    # StaffRole <-> Staff
    StaffRole.staff_members = relationship(
        "Staff",
        back_populates="role",
        cascade="all, delete-orphan"
    )
    Staff.role = relationship(
        "StaffRole",
        back_populates="staff_members"
    )

    # Customer <-> TableCustomer
    Customer.table_customers = relationship(
        "TableCustomer",
        back_populates="customer",
        cascade="all, delete-orphan"
    )
    TableCustomer.customer = relationship(
        "Customer",
        back_populates="table_customers"
    )

    # ShiftRecord <-> TableCustomer
    ShiftRecord.table_customers = relationship(
        "TableCustomer",
        back_populates="waiter_shift",
        cascade="all, delete-orphan"
    )
    TableCustomer.waiter_shift = relationship(
        "ShiftRecord",
        back_populates="table_customers"
    )
    # Branch <-> Table
    Branch.tables = relationship(
        "Table",
        back_populates="branch",
        cascade="all, delete-orphan"
    )
    Table.branch = relationship(
        "Branch",
        back_populates="tables"
    )
