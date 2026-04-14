import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0A2540] text-gray-300 py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold text-white tracking-tight block mb-4">
              RA Ernesto<span className="text-[#00A8E8]">.</span>
            </span>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Premium automotive spare parts and components. Delivering reliability and top-tier OEM parts to mechanics and enthusiasts nationwide.
            </p>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="text-[#00A8E8] mr-2">📍</span> 
                1703 Prince ST<br/>Beaufort, SC 29902
              </li>
              <li className="flex items-center">
                <span className="text-[#00A8E8] mr-2">📞</span> 
                +1 (860) 543-0799
              </li>
              <li className="flex items-center">
                <span className="text-[#00A8E8] mr-2">✉️</span> 
                raernesto1110@gmail.com
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/catalog" className="hover:text-[#00A8E8] transition-colors">All Spare Parts</Link></li>
              <li><Link to="/brands" className="hover:text-[#00A8E8] transition-colors">Shop by Brand</Link></li>
              <li><Link to="/" className="hover:text-[#00A8E8] transition-colors">About Us</Link></li>
              <li><Link to="/customer-service" className="hover:text-[#00A8E8] transition-colors">Customer Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">Subscribe for the latest parts and industry discounts.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="w-full px-4 text-sm py-2 rounded-l-md bg-[#1a2d47] border border-gray-700 text-white focus:outline-none focus:border-[#00A8E8]" 
              />
              <button className="bg-[#00A8E8] hover:bg-[#0092c9] text-white px-4 py-2 rounded-r-md transition-colors text-sm font-medium">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} RA Ernesto LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
