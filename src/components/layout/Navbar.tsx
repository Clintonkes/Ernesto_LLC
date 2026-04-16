import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Phone, Mail } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Spare Parts' },
  { to: '/brands', label: 'Brands' },
  { to: '/customer-service', label: 'Customer Service' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="bg-[#0A2540] text-white py-2 text-xs md:text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              +1 (860) 543-0799
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              laurafanelli@mac.com
            </span>
          </div>
          <div>1703 Prince ST, Beaufort, SC 29902</div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl relative">
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="md:hidden text-[#1A1A1A]"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <span className="text-2xl font-bold text-[#0A2540] tracking-tight">
              RA Ernesto<span className="text-[#00A8E8]">.</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1A1A1A]">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-[#00A8E8] transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#00A8E8]" />
            <input
              type="text"
              placeholder="Search parts, OEM..."
              className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] transition-all text-sm"
            />
          </div>

          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-[#00A8E8] transition-colors" onClick={closeMobileMenu}>
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center bg-[#00A8E8] text-white text-[10px] font-bold rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute left-4 right-4 top-full mt-3 md:hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <nav className="flex flex-col p-3 text-sm font-medium text-[#1A1A1A]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 hover:bg-[#F8F9FA] hover:text-[#00A8E8] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
