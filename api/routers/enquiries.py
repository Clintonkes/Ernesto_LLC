import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, database, schemas
from .. import email_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/enquiries",
    tags=["enquiries"],
)


@router.post("", response_model=schemas.Enquiry, status_code=201, include_in_schema=False)
@router.post("/", response_model=schemas.Enquiry, status_code=201)
def create_enquiry(enquiry: schemas.EnquiryCreate, db: Session = Depends(database.get_db)):
    try:
        db_enquiry = crud.create_enquiry(db, enquiry)
        email_service.send_enquiry_acknowledgement(db_enquiry)
        email_service.send_admin_enquiry_notification(db_enquiry)
        return db_enquiry
    except Exception as e:
        logger.error(f"Error creating enquiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit enquiry")


@router.get("", include_in_schema=False)
@router.get("/")
def list_enquiries(skip: int = 0, limit: int = 10, db: Session = Depends(database.get_db)):
    items, total = crud.get_enquiries(db, skip=skip, limit=limit)
    return {
        "items": items,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit
    }


@router.get("/{enquiry_id}", response_model=schemas.Enquiry)
def get_enquiry(enquiry_id: int, db: Session = Depends(database.get_db)):
    enquiry = crud.get_enquiry_by_id(db, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return enquiry


@router.put("/{enquiry_id}/status", response_model=schemas.Enquiry)
def update_enquiry_status(
    enquiry_id: int,
    data: schemas.EnquiryStatusUpdate,
    db: Session = Depends(database.get_db),
):
    valid_statuses = {"open", "in_progress", "resolved"}
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {valid_statuses}")
    updated = crud.update_enquiry_status(db, enquiry_id, data.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return updated
