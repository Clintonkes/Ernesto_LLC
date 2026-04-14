import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-white p-16 rounded-2xl shadow-sm border flex flex-col items-center">
            <div className="bg-gray-100 p-6 rounded-full mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-[#0A2540] mb-4">Your cart is empty</h1>
            <p className="text-[#555555] mb-8 max-w-md">Looks like you haven't added any spare parts to your cart yet. Let's get your vehicle back on the road.</p>
            <Link to="/catalog" className="bg-[#00A8E8] hover:bg-[#0092c9] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-bold text-[#0A2540] mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-sm font-semibold text-[#555555] uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
                    <div className="sm:w-1/2 flex items-center gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-md p-2 flex-shrink-0">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded" />
                      </div>
                      <div>
                        <Link to={`/catalog/${item.id}`} className="font-bold text-[#1A1A1A] hover:text-[#00A8E8] text-base sm:text-lg line-clamp-2">{item.name}</Link>
                        <p className="text-xs text-gray-500 mt-1">Brand: {item.brand}</p>
                        <p className="text-xs text-gray-500 font-mono">OEM: {item.oemNumber}</p>
                        
                        <div className="sm:hidden mt-2 font-bold text-[#0A2540]">${item.price.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="hidden sm:block sm:w-1/6 text-center font-bold text-[#0A2540]">
                      ${item.price.toFixed(2)}
                    </div>

                    <div className="sm:w-1/6 flex items-center justify-center">
                      <div className="flex items-center border rounded-md overflow-hidden bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-[#555555] transition"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-[#555555] transition"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="sm:w-1/6 flex justify-between sm:justify-end items-center mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0">
                      <span className="sm:hidden text-sm text-gray-500">Subtotal:</span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg text-[#0A2540]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600 transition p-2 bg-red-50 rounded-md"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#0A2540] mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#555555]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1A1A1A]">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#555555]">
                  <span>Shipping Estimation</span>
                  <span className="font-semibold text-[#28A745]">Free</span>
                </div>
                <div className="flex justify-between text-[#555555]">
                  <span>Tax</span>
                  <span className="font-semibold text-[#1A1A1A]">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-[#0A2540]">Estimated Total</span>
                  <span className="font-bold text-2xl text-[#0A2540]">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="w-full bg-[#00A8E8] hover:bg-[#0092c9] text-white py-4 rounded-lg font-bold flex items-center justify-center transition-colors">
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <div className="mt-4 text-center">
                <Link to="/catalog" className="text-sm text-[#00A8E8] hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
