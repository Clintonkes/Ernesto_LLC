import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, database
from .. import email_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/orders",
    tags=["orders"],
)


@router.post("", response_model=schemas.Order, status_code=201, include_in_schema=False)
@router.post("/", response_model=schemas.Order, status_code=201)
def create_order(order: schemas.OrderCreate, db: Session = Depends(database.get_db)):
    try:
        db_order = crud.create_order(db, order)
        email_service.send_order_confirmation(db_order)
        email_service.send_admin_new_order_notification(db_order)
        return db_order
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Failed to place order")


@router.get("", include_in_schema=False)
@router.get("/")
def list_orders(skip: int = 0, limit: int = 10, db: Session = Depends(database.get_db)):
    items, total = crud.get_orders(db, skip=skip, limit=limit)
    return {
        "items": items,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit
    }


@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(database.get_db)):
    order = crud.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/{order_id}/status", response_model=schemas.Order)
def update_order_status(
    order_id: int,
    data: schemas.OrderStatusUpdate,
    db: Session = Depends(database.get_db),
):
    valid_statuses = {"pending", "processing", "completed", "cancelled"}
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {valid_statuses}")

    updated = crud.update_order_status(db, order_id, data.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")

    if data.status == "completed":
        email_service.send_order_completed_notification(updated)

    return updated
