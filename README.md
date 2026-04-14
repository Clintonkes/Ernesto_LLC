# RA Ernesto LLC - Auto Spare Parts

Premium automotive spare parts and components e-commerce platform.

## Technology Stack
- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Routing**: React Router v7
- **State Management**: Zustand
- **Backend API**: FastAPI (Proxy configured on port 8000)

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- Python 3.x (for the backend API)

### Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Frontend (Vite)**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to see the result.

3. **Start Backend**:
   Ensure your backend is running on `http://localhost:8000` (or as configured in `vite.config.ts`).

### Build
To build for production:
```bash
npm run build
```

## Project Structure
- `src/pages/`: Application views/pages.
- `src/components/`: Reusable React components.
- `src/lib/`: Utilities and mock data.
- `src/store/`: State management.
- `public/`: Static assets.
