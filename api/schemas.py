from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ── Order ──────────────────────────────────────────────────────────────────────

class OrderItemBase(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_name: str
    customer_email: str
    shipping_address: str
    total_amount: float


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderStatusUpdate(BaseModel):
    status: str


class Order(OrderBase):
    id: int
    created_at: datetime
    status: str
    items: List[OrderItem]

    class Config:
        from_attributes = True


# ── Admin ──────────────────────────────────────────────────────────────────────

class AdminBase(BaseModel):
    email: str


class AdminCreate(AdminBase):
    password: str


class Admin(AdminBase):
    id: int

    class Config:
        from_attributes = True


# ── Product ────────────────────────────────────────────────────────────────────

class ProductBase(BaseModel):
    name: str
    oem_number: str
    brand: str
    category: str
    price: float
    stock: int
    image_url: Optional[str] = None
    description: Optional[str] = None
    compatible_vehicles: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    oem_number: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    compatible_vehicles: Optional[str] = None


class Product(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Enquiry ────────────────────────────────────────────────────────────────────

class EnquiryBase(BaseModel):
    customer_name: str
    customer_email: str
    subject: str
    message: str


class EnquiryCreate(EnquiryBase):
    pass


class EnquiryStatusUpdate(BaseModel):
    status: str


class Enquiry(EnquiryBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
