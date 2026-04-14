from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, database, schemas

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

@router.post("/login", response_model=schemas.Admin)
def login(admin: schemas.AdminCreate, db: Session = Depends(database.get_db)):
    db_admin = crud.get_admin_by_email(db, admin.email)
    if not db_admin or db_admin.hashed_password != admin.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return db_admin
