import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Clock, ShoppingCart, Loader2 } from 'lucide-react';
import { api, toUiProduct } from '../lib/api';
const brands = ['Toyota', 'BMW', 'Ford', 'Mercedes-Benz', 'Honda', 'Chevrolet', 'Nissan', 'Volkswagen', 'Hyundai', 'Kia', 'Audi', 'Subaru'];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ReturnType<typeof toUiProduct>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.products.list({ limit: 4 })
      .then((data) => setFeaturedProducts(data.items.map(toUiProduct)))
      .catch((e) => console.error('Failed to load products:', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative bg-[#0A2540] text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://placehold.co/2000x800/0A2540/FFFFFF?text=Premium+Auto+Parts"
            alt="Auto parts background"
            className="w-full h-full object-cover animate-pulse"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540] via-[#0A2540]/90 to-transparent" />

        <div className="container relative mx-auto px-4 max-w-7xl animate-in slide-in-from-left duration-1000">
          <div className="max-w-2xl">
            <span className="text-[#00A8E8] font-bold text-sm tracking-wider uppercase mb-4 block">
              100% Guaranteed Fit
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Premium Auto Spare Parts & Components
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-xl">
              Keep your vehicle running at peak performance. We stock thousands of high-quality OEM and aftermarket parts for all major brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog" className="bg-[#00A8E8] hover:bg-[#0092c9] text-white px-8 py-4 rounded-md font-semibold flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#00A8E8]/20">
                Shop All Parts <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/brands" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-md font-semibold flex items-center justify-center transition-all hover:scale-105 active:scale-95">
                Browse by Brand
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 justify-center md:justify-start group transition-all">
              <div className="bg-[#f0f9fc] p-3 rounded-full text-[#00A8E8] group-hover:bg-[#00A8E8] group-hover:text-white transition-all duration-300 transform group-hover:rotate-12">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="group-hover:translate-x-2 transition-transform">
                <h3 className="font-bold text-[#1A1A1A]">OEM Quality</h3>
                <p className="text-sm text-[#555555]">Certified authentic parts</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start group transition-all">
              <div className="bg-[#f0f9fc] p-3 rounded-full text-[#00A8E8] group-hover:bg-[#00A8E8] group-hover:text-white transition-all duration-300 transform group-hover:translate-y-[-4px]">
                <Truck className="h-8 w-8" />
              </div>
              <div className="group-hover:translate-x-2 transition-transform">
                <h3 className="font-bold text-[#1A1A1A]">Fast Shipping</h3>
                <p className="text-sm text-[#555555]">Nationwide delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start group transition-all">
              <div className="bg-[#f0f9fc] p-3 rounded-full text-[#00A8E8] group-hover:bg-[#00A8E8] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                <Clock className="h-8 w-8" />
              </div>
              <div className="group-hover:translate-x-2 transition-transform">
                <h3 className="font-bold text-[#1A1A1A]">24/7 Support</h3>
                <p className="text-sm text-[#555555]">Expert mechanic advice</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Shop by Brand</h2>
              <p className="text-[#555555]">Find components specifically tailored to your vehicle manufacturer.</p>
            </div>
            <Link to="/brands" className="text-[#00A8E8] font-semibold hover:underline hidden sm:block">
              View All Brands &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {brands.map((brand, idx) => (
              <Link
                key={brand}
                to={`/catalog?brand=${brand}`}
                className="bg-white border hover:border-[#00A8E8] rounded-lg p-6 flex items-center justify-center transition-all hover:shadow-xl hover:scale-110 group animate-in fade-in duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <span className="font-bold text-gray-700 group-hover:text-[#00A8E8]">{brand}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Latest Arrivals</h2>
              <p className="text-[#555555]">Recently added auto parts in stock.</p>
            </div>
            <Link to="/catalog" className="text-[#00A8E8] font-semibold hover:underline hidden sm:block">
              View Entire Catalog
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-[#00A8E8]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, idx) => (
                <Link
                  to={`/catalog/${product.id}`}
                  key={product.id}
                  className="group animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="bg-white border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95">
                    <div className="relative h-48 w-full bg-gray-100 border-b">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.stock > 0 && (
                        <span className="absolute top-2 right-2 bg-[#28A745] text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">
                          In Stock
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="text-xs mb-2 font-medium bg-[#f0f9fc] text-[#00A8E8] inline-block px-2 py-1 rounded-sm">
                        {product.brand}
                      </div>
                      <h3 className="font-bold text-[#1A1A1A] mb-1 truncate group-hover:text-[#00A8E8] transition-colors">{product.name}</h3>
                      <p className="text-xs text-[#555555] mb-4 font-mono">{product.oemNumber}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-[#0A2540]">${product.price.toFixed(2)}</span>
                        <span className="text-[#00A8E8] group-hover:text-white group-hover:bg-[#00A8E8] border border-[#00A8E8] rounded-full p-2 transition-all">
                          <ShoppingCart className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
