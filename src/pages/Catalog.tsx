import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search, ChevronRight, LayoutGrid, List as ListIcon, Loader2, ShoppingCart } from 'lucide-react';
import { api, toUiProduct, ApiProduct } from '../lib/api';
import Pagination from '../components/ui/Pagination';
const brands = ['Toyota', 'BMW', 'Ford', 'Mercedes-Benz', 'Honda', 'Chevrolet', 'Nissan', 'Volkswagen', 'Hyundai', 'Kia', 'Audi', 'Subaru'];
const categories = ['Engine Parts', 'Brakes', 'Suspension', 'Electrical', 'Transmission', 'Filters', 'Exhaust', 'Cooling', 'Steering', 'Body Parts'];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const brandFilter = searchParams.get('brand');
  const categoryFilter = searchParams.get('category');
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState<ReturnType<typeof toUiProduct>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    setError('');
    
    const params: any = {
      skip: (pageParam - 1) * itemsPerPage,
      limit: itemsPerPage
    };
    if (brandFilter) params.brand = brandFilter;
    if (categoryFilter) params.category = categoryFilter;

    api.products.list(params)
      .then((res) => {
        setProducts(res.items.map(toUiProduct));
        setTotalItems(res.total);
      })
      .catch((e) => setError(e.message ?? 'Failed to load products'))
      .finally(() => setLoading(false));
  }, [brandFilter, categoryFilter, pageParam]);

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    setSearchParams(nextParams);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-[#0A2540] font-bold text-lg">
                <Filter className="h-5 w-5" /> Filters
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider text-[#555555]">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/catalog" className={`text-sm ${!categoryFilter ? 'text-[#00A8E8] font-semibold' : 'text-gray-600 hover:text-[#00A8E8]'}`}>All Categories</Link>
                  </li>
                  {categories.map(cat => (
                    <li key={cat}>
                      <Link
                        to={`/catalog?category=${cat}${brandFilter ? `&brand=${brandFilter}` : ''}`}
                        className={`text-sm block ${categoryFilter === cat ? 'text-[#00A8E8] font-semibold' : 'text-gray-600 hover:text-[#00A8E8]'}`}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider text-[#555555]">Brands</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/catalog" className={`text-sm ${!brandFilter ? 'text-[#00A8E8] font-semibold' : 'text-gray-600 hover:text-[#00A8E8]'}`}>All Brands</Link>
                  </li>
                  {brands.map(brand => (
                    <li key={brand}>
                      <Link
                        to={`/catalog?brand=${brand}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
                        className={`text-sm block ${brandFilter === brand ? 'text-[#00A8E8] font-semibold' : 'text-gray-600 hover:text-[#00A8E8]'}`}
                      >
                        {brand}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0A2540]">
                {brandFilter ? `${brandFilter} Parts` : categoryFilter ? categoryFilter : 'All Spare Parts'}
              </h1>
              {!loading && (
                <p className="text-[#555555] mt-2">Showing {products.length} high-quality spare parts.</p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-[#00A8E8]" />
              </div>
            ) : error ? (
              <div className="bg-white p-10 text-center rounded-lg border">
                <p className="text-red-500">{error}</p>
                <button onClick={() => window.location.reload()} className="text-[#00A8E8] hover:underline mt-4 inline-block">Retry</button>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-10 text-center rounded-lg border">
                <p className="text-[#555555]">No products found matching your filters.</p>
                <Link to="/catalog" className="text-[#00A8E8] hover:underline mt-4 inline-block">Clear filters</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link to={`/catalog/${product.id}`} key={product.id} className="group">
                    <div className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                      <div className="relative h-56 w-full bg-gray-100">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.stock > 0 && (
                          <span className="absolute top-2 right-2 bg-[#28A745] text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                            In Stock
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="text-xs text-[#00A8E8] mb-2 font-medium bg-[#f0f9fc] inline-block px-2 py-1 rounded-sm w-fit">
                          {product.brand}
                        </div>
                        <h3 className="font-bold text-lg text-[#1A1A1A] mb-1 leading-snug">{product.name}</h3>
                        <p className="text-xs text-[#555555] mb-4">OEM: {product.oemNumber}</p>
                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                          <span className="text-xl font-bold text-[#0A2540]">${product.price.toFixed(2)}</span>
                          <span className="text-[#00A8E8] group-hover:text-white group-hover:bg-[#00A8E8] border border-[#00A8E8] rounded-full p-2 transition-colors">
                            <ShoppingCart className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {/* Pagination */}
            <div className="mt-8 bg-white border border-gray-100 rounded-xl shadow-sm">
              <Pagination 
                currentPage={pageParam} 
                totalItems={totalItems} 
                itemsPerPage={10} 
                onPageChange={handlePageChange} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
