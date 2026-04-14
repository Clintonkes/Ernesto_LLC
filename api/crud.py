import logging
from sqlalchemy.orm import Session
from . import models, schemas

from .sse_manager import manager
import asyncio

from .sse_manager import manager
import asyncio

logger = logging.getLogger(__name__)


# ── Orders ─────────────────────────────────────────────────────────────────────

def create_order(db: Session, order: schemas.OrderCreate):
    try:
        db_order = models.Order(
            customer_name=order.customer_name,
            customer_email=order.customer_email,
            shipping_address=order.shipping_address,
            total_amount=order.total_amount,
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)

        for item in order.items:
            db_item = models.OrderItem(
                order_id=db_order.id,
                product_id=item.product_id,
                product_name=item.product_name,
                quantity=item.quantity,
                price=item.price,
            )
            db.add(db_item)

        db.commit()
        db.refresh(db_order)
        logger.info(f"Order #{db_order.id} created for {order.customer_email}")
        
        # Broadcast event for real-time update
        asyncio.create_task(manager.broadcast("NEW_ORDER"))
        
        return db_order
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating order: {e}")
        raise


def get_orders(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(models.Order).count()
    items = (
        db.query(models.Order)
        .order_by(models.Order.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items, total


def get_order_by_id(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()


def update_order_status(db: Session, order_id: int, status: str):
    db_order = get_order_by_id(db, order_id)
    if not db_order:
        return None
    db_order.status = status
    db.commit()
    db.refresh(db_order)
    logger.info(f"Order #{order_id} status updated to '{status}'")
    return db_order


# ── Admin ──────────────────────────────────────────────────────────────────────

def get_admin_by_email(db: Session, email: str):
    return db.query(models.Admin).filter(models.Admin.email == email).first()


def create_admin(db: Session, admin: schemas.AdminCreate):
    db_admin = models.Admin(email=admin.email, hashed_password=admin.password)
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    logger.info(f"Admin user created: {admin.email}")
    return db_admin


# ── Products ───────────────────────────────────────────────────────────────────

def get_products(db: Session, brand: str = None, category: str = None, skip: int = 0, limit: int = 200):
    q = db.query(models.Product)
    if brand:
        q = q.filter(models.Product.brand.ilike(brand))
    if category:
        q = q.filter(models.Product.category.ilike(category))
    
    total = q.count()
    items = q.order_by(models.Product.brand, models.Product.name).offset(skip).limit(limit).all()
    return items, total


def get_product_by_id(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    logger.info(f"Product created: {product.name} (brand={product.brand})")
    return db_product


def update_product(db: Session, product_id: int, data: schemas.ProductUpdate):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(db_product, field, value)
    db.commit()
    db.refresh(db_product)
    logger.info(f"Product #{product_id} updated")
    return db_product


def delete_product(db: Session, product_id: int):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return False
    db.delete(db_product)
    db.commit()
    logger.info(f"Product #{product_id} deleted")
    return True


def count_products(db: Session) -> int:
    return db.query(models.Product).count()


# ── Enquiries ──────────────────────────────────────────────────────────────────

def create_enquiry(db: Session, enquiry: schemas.EnquiryCreate):
    db_enquiry = models.Enquiry(**enquiry.model_dump())
    db.add(db_enquiry)
    db.commit()
    db.refresh(db_enquiry)
    logger.info(f"Enquiry #{db_enquiry.id} created from {enquiry.customer_email}")
    
    # Broadcast event for real-time update
    asyncio.create_task(manager.broadcast("NEW_ENQUIRY"))
    
    return db_enquiry


def get_enquiries(db: Session, skip: int = 0, limit: int = 100):
    total = db.query(models.Enquiry).count()
    items = (
        db.query(models.Enquiry)
        .order_by(models.Enquiry.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items, total


def get_enquiry_by_id(db: Session, enquiry_id: int):
    return db.query(models.Enquiry).filter(models.Enquiry.id == enquiry_id).first()


def update_enquiry_status(db: Session, enquiry_id: int, status: str):
    db_enquiry = get_enquiry_by_id(db, enquiry_id)
    if not db_enquiry:
        return None
    db_enquiry.status = status
    db.commit()
    db.refresh(db_enquiry)
    logger.info(f"Enquiry #{enquiry_id} status updated to '{status}'")
    return db_enquiry
