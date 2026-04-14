import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { ShieldCheck, Truck, ArrowLeft, Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';
import { api, toUiProduct } from '../lib/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);

  const [product, setProduct] = useState<ReturnType<typeof toUiProduct> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.products.get(id)
      .then((data) => setProduct(toUiProduct(data)))
      .catch((e) => setError(e.message ?? 'Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#00A8E8]" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/catalog" className="text-[#00A8E8] hover:underline">Return to Catalog</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product as any);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen py-10 transition-all duration-300">
      <div className="container mx-auto px-4 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-[#555555] hover:text-[#00A8E8] mb-8 transition-all hover:translate-x-[-4px]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative bg-[#F8F9FA] rounded-2xl overflow-hidden border p-8 flex items-center justify-center group h-[500px]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-bold text-[#00A8E8] bg-[#f0f9fc] px-2 py-1 rounded border border-[#00A8E8]/20 uppercase tracking-wider">{product.brand}</span>
              <span className="text-xs text-gray-500">{product.category}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-4">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-2 rounded w-fit border">OEM Number: <span className="font-mono text-gray-800">{product.oemNumber}</span></p>

            <div className="text-3xl font-bold text-[#0A2540] mb-6">${product.price.toFixed(2)}</div>

            <div className="mb-8 text-[#555555] leading-relaxed">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">Description</h3>
              <p>{product.description}</p>
            </div>

            {product.compatibleVehicles.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">Compatible Vehicles</h3>
                <div className="flex flex-wrap gap-2">
                  {product.compatibleVehicles.map((v) => (
                    <span key={v} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{v}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8 p-4 bg-[#f0f9fc] border border-[#00A8E8]/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <ShieldCheck className="h-4 w-4 text-[#00A8E8]" /> 12-Month Fitment Guarantee
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Truck className="h-4 w-4 text-[#00A8E8]" /> Free Standard Shipping
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="mt-auto pb-4 border-b">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-[#28A745] font-semibold mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#28A745]"></span> In Stock and ready to ship
                </div>
              ) : (
                <div className="text-red-500 font-semibold mb-4">Out of Stock</div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden h-14 w-full sm:w-auto hover:border-[#00A8E8] transition-colors">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-4 hover:bg-gray-100 transition text-[#555555]" disabled={product.stock <= 0}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="p-4 hover:bg-gray-100 transition text-[#555555]" disabled={product.stock <= 0}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 h-14 rounded-lg flex items-center justify-center font-bold text-white transition-all transform hover:scale-[1.02] active:scale-95 ${added ? 'bg-[#28A745]' : 'bg-[#00A8E8] hover:bg-[#0092c9]'} disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#00A8E8]/20`}
                >
                  {added ? 'Added to Cart!' : <><ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
