import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* Top Bar */}
      <div className="bg-[#0A2540] text-white py-2 text-xs md:text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
          <div className="flex gap-4">
            <span>📞 +1 (860) 543-0799</span>
            <span className="hidden sm:inline">✉️ raernesto1110@gmail.com</span>
          </div>
          <div>1703 Prince ST, Beaufort, SC 29902</div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-6">
          <button className="md:hidden text-[#1A1A1A]">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#0A2540] tracking-tight">
              RA Ernesto<span className="text-[#00A8E8]">.</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1A1A1A]">
          <Link to="/" className="hover:text-[#00A8E8] transition-colors">Home</Link>
          <Link to="/catalog" className="hover:text-[#00A8E8] transition-colors">Spare Parts</Link>
          <Link to="/brands" className="hover:text-[#00A8E8] transition-colors">Brands</Link>
          <Link to="/customer-service" className="hover:text-[#00A8E8] transition-colors">Customer Service</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#00A8E8]" />
            <input
              type="text"
              placeholder="Search parts, OEM..."
              className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] transition-all text-sm"
            />
          </div>

          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-[#00A8E8] transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center bg-[#00A8E8] text-white text-[10px] font-bold rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
