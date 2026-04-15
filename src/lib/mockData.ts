export interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    image: string;
    images: string[];
    oemNumber: string;
    description: string;
    inStock: boolean;
}

export const brands = [
    'Toyota', 'BMW', 'Ford', 'Mercedes-Benz', 'Honda', 
    'Chevrolet', 'Nissan', 'Volkswagen', 'Hyundai', 'Audi'
];

export const categories = [
    'Engine Parts', 'Brakes', 'Suspension', 'Electrical', 
    'Transmission', 'Filters', 'Body Parts', 'Accessories'
];

export const products: Product[] = [
    {
        id: 'prod_1',
        name: 'Ceramic Brake Pads Set',
        brand: 'Toyota',
        category: 'Brakes',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1486006920555-c77dcf181934?auto=format&fit=crop&q=80&w=800', 
        images: ['https://images.unsplash.com/photo-1486006920555-c77dcf181934?auto=format&fit=crop&q=80&w=800'],
        oemNumber: 'OEM-04465-AZ202',
        description: 'High-performance ceramic brake pads designed to reduce noise and dust. Provides superior stopping power for your Toyota vehicles.',
        inStock: true,
    },
    {
        id: 'prod_2',
        name: 'High-Flow Air Filter',
        brand: 'BMW',
        category: 'Filters',
        price: 65.50,
        image: 'https://images.unsplash.com/photo-1621359953476-b0600b42820d?auto=format&fit=crop&q=80&w=800', 
        images: ['https://images.unsplash.com/photo-1621359953476-b0600b42820d?auto=format&fit=crop&q=80&w=800'],
        oemNumber: 'BMW-1372-HV12',
        description: 'Advanced filtration technology allows up to 50% more airflow. Washable and reusable design for extended lifespan.',
        inStock: true,
    },
    {
        id: 'prod_3',
        name: 'Heavy-Duty Alternator 150 AMP',
        brand: 'Ford',
        category: 'Electrical',
        price: 189.99,
        image: 'https://images.unsplash.com/photo-1632733711679-5292d7767116?auto=format&fit=crop&q=80&w=800', 
        images: ['https://images.unsplash.com/photo-1632733711679-5292d7767116?auto=format&fit=crop&q=80&w=800'],
        oemNumber: 'FD-ALT-10A12A',
        description: 'Ensure your truck never runs out of juice. This heavy-duty alternator handles extreme conditions and auxiliary electrical loads effortlessly.',
        inStock: true,
    },
    {
        id: 'prod_4',
        name: 'Performance Ignition Coils Pack',
        brand: 'Mercedes-Benz',
        category: 'Electrical',
        price: 245.00,
        image: 'https://images.unsplash.com/photo-1616715103444-245842825bc5?auto=format&fit=crop&q=80&w=800', 
        images: ['https://images.unsplash.com/photo-1616715103444-245842825bc5?auto=format&fit=crop&q=80&w=800'],
        oemNumber: 'MB-000-150-19-80',
        description: 'Increases engine responsiveness and fuel economy. Engineered specifically for Mercedes-Benz V6 and V8 engines.',
        inStock: true,
    },
    {
        id: 'prod_5',
        name: 'Premium Oil Filter',
        brand: 'Honda',
        category: 'Filters',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1635811776856-4c7403487f94?auto=format&fit=crop&q=80&w=800', 
        images: ['https://images.unsplash.com/photo-1635811776856-4c7403487f94?auto=format&fit=crop&q=80&w=800'],
        oemNumber: '15400-PLM-A02',
        description: 'Protects the engine by trapping 99% of damaging contaminants and maintaining consistent oil flow.',
        inStock: true,
    },
    {
        id: 'prod_6',
        name: 'Front Suspension Strut Assembly',
        brand: 'Chevrolet',
        category: 'Suspension',
        price: 135.00,
        image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=800', 
        images: ['https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=800'],
        oemNumber: 'CH-843-980',
        description: 'Complete strut assembly, ready to install out of the box. Restores your vehicle’s factory ride height and handling.',
        inStock: true,
    },
    {
        id: 'prod_7',
        name: 'CV Axle Shaft Assembly',
        brand: 'Nissan',
        category: 'Transmission',
        price: 98.50,
        image: 'https://images.unsplash.com/photo-1493238531238-142279140fa9?auto=format&fit=crop&q=80&w=800', 
        images: ['https://images.unsplash.com/photo-1493238531238-142279140fa9?auto=format&fit=crop&q=80&w=800'],
        oemNumber: 'NS-CV-4422',
        description: 'Built to exceed OEM specifications for fit, form, and function. Precision-machined for smooth operation.',
        inStock: true,
    },
    {
        id: 'prod_8',
        name: 'Halogen Headlight Bulb (H11)',
        brand: 'Volkswagen',
        category: 'Electrical',
        price: 22.95,
        image: 'https://images.unsplash.com/photo-1590674899484-13da0d1b5ec1?auto=format&fit=crop&q=80&w=800', 
        images: ['https://images.unsplash.com/photo-1590674899484-13da0d1b5ec1?auto=format&fit=crop&q=80&w=800'],
        oemNumber: 'N-101-300-01',
        description: 'Standard replacement H11 bulb offering improved brightness and longer lifespan for nighttime driving safety.',
        inStock: true,
    },
    {
        id: 'prod_9',
        name: 'Timing Belt Kit with Water Pump',
        brand: 'Hyundai',
        category: 'Engine Parts',
        price: 175.20,
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800', 
        images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800'],
        oemNumber: 'HY-TBK-45001',
        description: 'Comprehensive timing belt replacement kit ensuring optimal engine timing synchronization and cooling efficiency.',
        inStock: true,
    },
    {
        id: 'prod_10',
        name: 'Quattro Sport Brake Rotors',
        brand: 'Audi',
        category: 'Brakes',
        price: 210.00,
        image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=800', 
        images: ['https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=800'],
        oemNumber: '8K0-615-301-A',
        description: 'Drilled and slotted performance rotors ideal for rigorous driving. Rapidly disperses heat during harsh braking.',
        inStock: true,
    }
];
