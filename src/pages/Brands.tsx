import { Link } from 'react-router-dom';
import { brands } from '../lib/mockData';

export default function Brands() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-7xl animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A2540] mb-4">Shop by Brand</h1>
          <p className="text-lg text-[#555555] max-w-2xl mx-auto">
            Find the perfect high-quality spare parts specifically engineered for your vehicle manufacturer.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {brands.map((brand) => (
            <Link 
              key={brand} 
              to={`/catalog?brand=${brand}`}
              className="bg-white border hover:border-[#00A8E8] rounded-xl p-8 flex flex-col items-center justify-center transition-all hover:shadow-xl hover:scale-110 group h-40"
            >
              <div className="w-12 h-12 bg-[#f0f9fc] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#00A8E8] transition-colors">
                <span className="text-[#00A8E8] font-bold text-xl group-hover:text-white">{brand[0]}</span>
              </div>
              <span className="font-bold text-lg text-gray-700 group-hover:text-[#00A8E8] transition-colors">{brand}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
