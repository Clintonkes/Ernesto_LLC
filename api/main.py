import logging
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.exception_handlers import http_exception_handler as _default_http_exception_handler
from starlette.exceptions import HTTPException as StarletteHTTPException
from . import models, database, crud, schemas
from .routers import orders, auth, products, enquiries
from .middleware.logging import ActivityLoggerMiddleware
from .sse_manager import manager
from sse_starlette.sse import EventSourceResponse

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="RA Ernesto API", version="1.0.0")

# Logging Middleware
app.add_middleware(ActivityLoggerMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files for Uploads
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "static/uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(orders.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(enquiries.router, prefix="/api/v1")

@app.get("/api/v1/events")
async def events(request: Request):
    return EventSourceResponse(manager.subscribe(request))


# ── Seed Data ─────────────────────────────────────────────────────────────────

SEED_PRODUCTS = [
    # Engine Parts
    {"name": "Bosch Platinum Spark Plug", "oem_number": "SP-541", "brand": "Toyota", "category": "Engine Parts", "price": 12.99, "stock": 150, "description": "High-performance platinum spark plug for optimal combustion and fuel efficiency.", "compatible_vehicles": "Toyota Camry, Toyota Corolla, Toyota RAV4", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Spark+Plug"},
    {"name": "Brembo Ceramic Brake Pads", "oem_number": "BP-7892", "brand": "BMW", "category": "Brakes", "price": 89.99, "stock": 75, "description": "Premium ceramic brake pads for superior stopping power and reduced noise.", "compatible_vehicles": "BMW 3 Series, BMW 5 Series, BMW X3", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Brake+Pads"},
    {"name": "Monroe Strut Assembly", "oem_number": "MS-2341", "brand": "Ford", "category": "Suspension", "price": 189.99, "stock": 45, "description": "Complete strut assembly with spring for smooth ride quality.", "compatible_vehicles": "Ford F-150, Ford Explorer, Ford Mustang", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Strut+Assembly"},
    {"name": "Denso Ignition Coil", "oem_number": "IC-4567", "brand": "Honda", "category": "Electrical", "price": 45.99, "stock": 120, "description": "OEM-quality ignition coil for reliable starting and combustion.", "compatible_vehicles": "Honda Civic, Honda Accord, Honda CR-V", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Ignition+Coil"},
    {"name": "Aisin Transmission Filter Kit", "oem_number": "TF-8891", "brand": "Toyota", "category": "Transmission", "price": 34.99, "stock": 90, "description": "Complete transmission filter kit with gasket for proper transmission service.", "compatible_vehicles": "Toyota Camry, Toyota Corolla, Toyota Highlander", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Trans+Filter+Kit"},
    {"name": "K&N High-Flow Air Filter", "oem_number": "AF-3345", "brand": "Ford", "category": "Filters", "price": 54.99, "stock": 200, "description": "Washable and reusable high-flow air filter for improved engine performance.", "compatible_vehicles": "Ford Mustang, Ford F-150, Ford Focus", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Air+Filter"},
    {"name": "Bosch Oxygen Sensor", "oem_number": "OS-1578", "brand": "Chevrolet", "category": "Engine Parts", "price": 67.99, "stock": 85, "description": "Precise oxygen sensor for optimal fuel mixture and emissions control.", "compatible_vehicles": "Chevrolet Silverado, Chevrolet Malibu, Chevrolet Equinox", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Oxygen+Sensor"},
    {"name": "Walker Catalytic Converter", "oem_number": "CC-9123", "brand": "Nissan", "category": "Exhaust", "price": 299.99, "stock": 30, "description": "OEM-spec catalytic converter for emissions compliance and performance.", "compatible_vehicles": "Nissan Altima, Nissan Maxima, Nissan Rogue", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Catalytic+Converter"},
    {"name": "Motorcraft Coolant Thermostat", "oem_number": "CT-5512", "brand": "Ford", "category": "Cooling", "price": 28.99, "stock": 110, "description": "OEM-quality thermostat for proper engine temperature control.", "compatible_vehicles": "Ford F-150, Ford Escape, Ford Edge", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Thermostat"},
    {"name": "Moog Tie Rod End", "oem_number": "TE-3321", "brand": "Honda", "category": "Steering", "price": 42.99, "stock": 95, "description": "Premium tie rod end for precise steering response and durability.", "compatible_vehicles": "Honda Civic, Honda Accord, Honda Pilot", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Tie+Rod+End"},
    {"name": "Denso Radiator Hose", "oem_number": "RH-7823", "brand": "Toyota", "category": "Cooling", "price": 24.99, "stock": 130, "description": "OEM-spec radiator hose for reliable coolant flow.", "compatible_vehicles": "Toyota Tacoma, Toyota 4Runner, Toyota Tundra", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Radiator+Hose"},
    {"name": "ACDelco Alternator", "oem_number": "ALT-2234", "brand": "Chevrolet", "category": "Electrical", "price": 189.99, "stock": 50, "description": "High-output alternator for reliable electrical system performance.", "compatible_vehicles": "Chevrolet Silverado, Chevrolet Tahoe, Chevrolet Suburban", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Alternator"},
    {"name": "Bosch Headlight Assembly", "oem_number": "HL-4456", "brand": "Volkswagen", "category": "Body Parts", "price": 124.99, "stock": 60, "description": "DOT-approved headlight assembly for clear nighttime visibility.", "compatible_vehicles": "Volkswagen Jetta, Volkswagen Golf, Volkswagen Passat", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Headlight"},
    {"name": "KYB Gas Shocks", "oem_number": "GS-6678", "brand": "Hyundai", "category": "Suspension", "price": 98.99, "stock": 70, "description": "Gas-charged shocks for improved handling and comfort.", "compatible_vehicles": "Hyundai Elantra, Hyundai Sonata, Hyundai Tucson", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Shock+Absorber"},
    {"name": "Wagner Brake Rotor", "oem_number": "BR-9901", "brand": "Kia", "category": "Brakes", "price": 72.99, "stock": 80, "description": "Drilled and slotted rotor for superior braking performance.", "compatible_vehicles": "Kia Optima, Kia Sorento, Kia Sportage", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Brake+Rotor"},
    {"name": "Mann Oil Filter", "oem_number": "OF-1122", "brand": "Mercedes-Benz", "category": "Filters", "price": 18.99, "stock": 250, "description": "Premium oil filter for extended engine protection.", "compatible_vehicles": "Mercedes C-Class, Mercedes E-Class, Mercedes ML", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Oil+Filter"},
    {"name": "NTK Fuel Injector", "oem_number": "FI-3344", "brand": "Audi", "category": "Engine Parts", "price": 89.99, "stock": 55, "description": "Precision fuel injector for optimal fuel delivery.", "compatible_vehicles": "Audi A4, Audi A6, Audi Q5", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Fuel+Injector"},
    {"name": "Cardone Starter Motor", "oem_number": "SM-5566", "brand": "Subaru", "category": "Electrical", "price": 145.99, "stock": 40, "description": "Remanufactured starter with new solenoid for reliable starting.", "compatible_vehicles": "Subaru Outback, Subaru Forester, Subaru Impreza", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Starter+Motor"},
    {"name": "Gates Timing Belt Kit", "oem_number": "TB-7788", "brand": "Honda", "category": "Engine Parts", "price": 78.99, "stock": 65, "description": "Complete timing belt kit with tensioner and idler pulleys.", "compatible_vehicles": "Honda Civic, Honda CR-V, Honda Element", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Timing+Belt+Kit"},
    {"name": "Raybestos Clutch Kit", "oem_number": "CK-8899", "brand": "Nissan", "category": "Transmission", "price": 234.99, "stock": 25, "description": "Complete clutch kit with disc, pressure plate, and bearing.", "compatible_vehicles": "Nissan 350Z, Nissan Altima, Nissan Sentra", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Clutch+Kit"},
    {"name": "ACDelco Water Pump", "oem_number": "WP-9900", "brand": "Chevrolet", "category": "Cooling", "price": 89.99, "stock": 75, "description": "OEM-quality water pump for reliable cooling system operation.", "compatible_vehicles": "Chevrolet Camaro, Chevrolet Colorado, Chevrolet Traverse", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Water+Pump"},
    {"name": "Moog Control Arm", "oem_number": "CA-1011", "brand": "BMW", "category": "Suspension", "price": 156.99, "stock": 45, "description": "Premium control arm with ball joint for precise suspension geometry.", "compatible_vehicles": "BMW 3 Series, BMW X5, BMW X1", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Control+Arm"},
    {"name": "Denso Spark Plug Wire Set", "oem_number": "SW-1213", "brand": "Ford", "category": "Engine Parts", "price": 34.99, "stock": 100, "description": "Ignition wire set with premium suppression for reliable spark.", "compatible_vehicles": "Ford Mustang, Ford Ranger, Ford Bronco", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Spark+Plug+Wires"},
    {"name": "Bosch Fuel Filter", "oem_number": "FF-1415", "brand": "Volkswagen", "category": "Filters", "price": 22.99, "stock": 140, "description": "High-capacity fuel filter for clean fuel delivery.", "compatible_vehicles": "Volkswagen Beetle, Volkswagen Tiguan, Volkswagen Atlas", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Fuel+Filter"},
    {"name": "Wagner Exhaust Manifold", "oem_number": "EM-1617", "brand": "Toyota", "category": "Exhaust", "price": 189.99, "stock": 35, "description": "OEM-spec exhaust manifold for proper exhaust flow.", "compatible_vehicles": "Toyota Camry, Toyota Avalon, Toyota Sienna", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Exhaust+Manifold"},
    {"name": "Monroe Shock Absorber", "oem_number": "SA-1819", "brand": "Hyundai", "category": "Suspension", "price": 76.99, "stock": 90, "description": "Gas-charged shock absorber for improved ride control.", "compatible_vehicles": "Hyundai Santa Fe, Hyundai Accent, Hyundai Veloster", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Shock+Absorber"},
    {"name": "Denso A/C Compressor", "oem_number": "AC-2021", "brand": "Honda", "category": "Electrical", "price": 289.99, "stock": 30, "description": "New A/C compressor for reliable cooling performance.", "compatible_vehicles": "Honda Odyssey, Honda Pilot, Honda Ridgeline", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=AC+Compressor"},
    {"name": "Bosch ABS Sensor", "oem_number": "ABS-2223", "brand": "Mercedes-Benz", "category": "Brakes", "price": 54.99, "stock": 85, "description": "ABS wheel speed sensor for brake system safety.", "compatible_vehicles": "Mercedes S-Class, Mercedes GLE, Mercedes GLC", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=ABS+Sensor"},
    {"name": "Gates Serpentine Belt", "oem_number": "SB-2425", "brand": "Kia", "category": "Engine Parts", "price": 38.99, "stock": 115, "description": "Multi-rib serpentine belt for reliable accessory drive.", "compatible_vehicles": "Kia Forte, Kia Soul, Kia Sedona", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Serpentine+Belt"},
    {"name": "Moog Steering Rack", "oem_number": "SR-2627", "brand": "Audi", "category": "Steering", "price": 345.99, "stock": 20, "description": "Remanufactured steering rack for precise steering control.", "compatible_vehicles": "Audi A3, Audi TT, Audi Q3", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Steering+Rack"},
    {"name": "K&N Cabin Air Filter", "oem_number": "CF-2829", "brand": "Subaru", "category": "Filters", "price": 29.99, "stock": 160, "description": "Premium cabin air filter for clean interior air.", "compatible_vehicles": "Subaru Legacy, Subaru Crosstrek, Subaru WRX", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Cabin+Filter"},
    {"name": "ACDelco Battery", "oem_number": "BT-3031", "brand": "Chevrolet", "category": "Electrical", "price": 179.99, "stock": 55, "description": "High-cranking power battery for reliable starting.", "compatible_vehicles": "Chevrolet Express, Chevrolet Avalanche, Chevrolet Trax", "image_url": "https://placehold.co/800x600/0A2540/FFFFFF?text=Battery"},
]


@app.on_event("startup")
def on_startup():
    logger.info("Starting RA Ernesto API — running startup checks...")

    # Create all tables
    models.Base.metadata.create_all(bind=database.engine)
    logger.info("Database tables created / verified.")

    db = database.SessionLocal()
    try:
        # Seed admin
        admin_email = "admin@raernesto.com"
        if not crud.get_admin_by_email(db, admin_email):
            crud.create_admin(db, schemas.AdminCreate(email=admin_email, password="Admin123"))
            logger.info("Default admin user created.")

        # Seed products
        if crud.count_products(db) == 0:
            logger.info("Seeding product inventory...")
            for p in SEED_PRODUCTS:
                db_product = models.Product(**p)
                db.add(db_product)
            db.commit()
            logger.info(f"Seeded {len(SEED_PRODUCTS)} products into the database.")
        else:
            logger.info(f"Products already exist ({crud.count_products(db)} records) — skipping seed.")
    except Exception as e:
        db.rollback()
        logger.error(f"Startup error: {e}")
    finally:
        db.close()


@app.get("/health")
def health_check():
    return {"message": "RA Ernesto API is running", "version": "1.0.0"}


# ── SPA Fallback (serve React frontend for all non-API routes) ────────────────
# Uses a custom exception handler instead of a catch-all route.
# A catch-all route competes with FastAPI's own routing; an exception handler
# only fires AFTER routing has already failed (no route matched), so it never
# blocks the API routers.

DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")

if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static-assets")


@app.exception_handler(StarletteHTTPException)
async def spa_fallback(request: Request, exc: StarletteHTTPException):
    """
    For 404s on non-API paths: serve index.html so React Router handles them.
    For everything else (API 404s, 4xx, 5xx): use FastAPI's default JSON response.
    """
    if (
        exc.status_code == 404
        and not request.url.path.startswith("/api/")
        and not request.url.path.startswith("/uploads/")
        and os.path.exists(DIST_DIR)
    ):
        index_path = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
    return await _default_http_exception_handler(request, exc)
