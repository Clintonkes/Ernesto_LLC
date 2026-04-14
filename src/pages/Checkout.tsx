import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { CheckCircle2, Loader2, Package } from 'lucide-react';
import { api } from '../lib/api';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  });

  useEffect(() => {
    if (items.length === 0 && !isSuccess) navigate('/catalog');
  }, [items, isSuccess, navigate]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const order = await api.orders.create({
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.zip}`,
        total_amount: getTotal(),
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      setOrderId(order.id);
      setIsSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 6000);
    } catch (err: any) {
      setError(err.message ?? 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] bg-[#F8F9FA] py-20 flex items-center justify-center animate-in zoom-in duration-500">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-12 rounded-2xl shadow-sm border text-center font-sans">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="h-20 w-20 text-[#28A745] animate-bounce" />
            </div>
            <h1 className="text-3xl font-bold text-[#0A2540] mb-4">Order Recorded!</h1>
            {orderId && (
              <div className="inline-flex items-center gap-2 bg-[#f0f9fc] border border-[#00A8E8]/20 text-[#00A8E8] font-bold px-4 py-2 rounded-lg mb-6">
                <Package className="h-4 w-4" /> Order #{orderId}
              </div>
            )}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-yellow-800 font-semibold text-sm">Status: Pending</p>
              <p className="text-yellow-700 text-sm mt-1">Your order has been received and is pending confirmation. We'll email you at <strong>{formData.email}</strong> with updates.</p>
            </div>
            <p className="text-xs text-gray-400 mb-6 italic">Redirecting to homepage in 6 seconds...</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#0A2540] hover:bg-[#153a60] text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            >
              Return Home Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-10 animate-in fade-in duration-700">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-[#0A2540] mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <form id="checkout-form" onSubmit={handleCheckout}>
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-xl font-bold text-[#0A2540] mb-4 border-b pb-2">Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input required name="firstName" onChange={handleChange} type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-[#00A8E8] outline-none" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input required name="lastName" onChange={handleChange} type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-[#00A8E8] outline-none" placeholder="Doe" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input required name="email" onChange={handleChange} type="email" className="w-full border p-2 rounded focus:ring-2 focus:ring-[#00A8E8] outline-none" placeholder="john@example.com" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input required name="address" onChange={handleChange} type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-[#00A8E8] outline-none" placeholder="123 Main St" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input required name="city" onChange={handleChange} type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-[#00A8E8] outline-none" placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input required name="zip" onChange={handleChange} type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-[#00A8E8] outline-none" placeholder="10001" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#0A2540] mb-6 border-b pb-2">Order Summary</h2>
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-[#555555] truncate max-w-[200px]">{item.quantity}x {item.name}</span>
                    <span className="font-semibold text-[#1A1A1A]">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-[#555555]">
                  <span>Subtotal</span>
                  <span className="font-semibold">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#555555]">
                  <span>Shipping</span>
                  <span className="text-[#28A745] font-semibold">Free</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-[#0A2540] border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-[#00A8E8] hover:bg-[#0092c9] text-white py-4 rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-[#00A8E8]/20"
              >
                {isProcessing ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                ) : `Place Order — $${getTotal().toFixed(2)}`}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">A confirmation email will be sent to your address</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
