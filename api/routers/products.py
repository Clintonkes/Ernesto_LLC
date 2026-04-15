import logging
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import Optional
import shutil
import os
import uuid
from .. import crud, database, schemas

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/products",
    tags=["products"],
)


@router.get("", include_in_schema=False)
@router.get("/")
def list_products(
    brand: Optional[str] = None,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(database.get_db),
):
    items, total = crud.get_products(db, brand=brand, category=category, skip=skip, limit=limit)
    return {
        "items": items,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit
    }


@router.get("/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(database.get_db)):
    product = crud.get_product_by_id(db, product_id)
    if not product:
        logger.warning(f"Product #{product_id} not found")
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=schemas.Product, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@router.post("/", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
async def create_product(
    name: str = Form(...),
    oem_number: str = Form(...),
    brand: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    description: Optional[str] = Form(None),
    compatible_vehicles: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    try:
        # Save file
        upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static/uploads")
        os.makedirs(upload_dir, exist_ok=True)
        
        file_extension = os.path.splitext(image.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
            
        image_url = f"/uploads/{unique_filename}"
        
        product_data = schemas.ProductCreate(
            name=name,
            oem_number=oem_number,
            brand=brand,
            category=category,
            price=price,
            stock=stock,
            description=description,
            compatible_vehicles=compatible_vehicles,
            image_url=image_url
        )
        
        return crud.create_product(db, product_data)
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, data: schemas.ProductUpdate, db: Session = Depends(database.get_db)):
    updated = crud.update_product(db, product_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(database.get_db)):
    deleted = crud.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
