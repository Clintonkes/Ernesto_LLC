import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Package, ShoppingCart, MessageSquare,
  LogOut, Plus, Search, Loader2, AlertCircle,
  CheckCircle2, Clock, XCircle, RefreshCw, Trash2, X, AlertTriangle,
} from 'lucide-react';
import { api, ApiOrder, ApiEnquiry, ApiProduct, PaginatedResponse } from '../lib/api';
import { toast } from 'sonner';
import Pagination from '../components/ui/Pagination';
import ConfirmModal from '../components/ui/ConfirmModal';

// ── Types ──────────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'orders' | 'inventory' | 'enquiries';

// ── Helpers ────────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Logout Modal ───────────────────────────────────────────────────────────────
function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <LogOut className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-center text-[#0A2540] mb-2">Sign Out?</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Are you sure you want to sign out of the admin portal?</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Product Modal ──────────────────────────────────────────────────────────
function AddProductModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({
    name: '', oem_number: '', brand: '', category: '', price: '', stock: '',
    description: '', compatible_vehicles: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const BRANDS = ['Toyota', 'BMW', 'Ford', 'Mercedes-Benz', 'Honda', 'Chevrolet', 'Nissan', 'Volkswagen', 'Hyundai', 'Kia', 'Audi', 'Subaru'];
  const CATEGORIES = ['Engine Parts', 'Brakes', 'Suspension', 'Electrical', 'Transmission', 'Filters', 'Exhaust', 'Cooling', 'Steering', 'Body Parts'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image file.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('oem_number', form.oem_number);
      formData.append('brand', form.brand);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      formData.append('description', form.description);
      formData.append('compatible_vehicles', form.compatible_vehicles);
      formData.append('image', imageFile);

      await api.products.create(formData);
      toast.success('Product added successfully!');
      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-[#0A2540]">Add New Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">OEM Number *</label>
              <input required value={form.oem_number} onChange={e => setForm({ ...form, oem_number: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brand *</label>
              <select required value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none bg-white">
                <option value="">Select brand...</option>
                {BRANDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category *</label>
              <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none bg-white">
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($) *</label>
              <input required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock (units) *</label>
              <input required type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Image *</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#00A8E8] transition-colors">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                    <button 
                      type="button" 
                      onClick={() => { setImageFile(null); setImagePreview(''); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#00A8E8] hover:text-[#0092c9] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Compatible Vehicles <span className="normal-case text-gray-400">(comma-separated)</span></label>
            <input value={form.compatible_vehicles} onChange={e => setForm({ ...form, compatible_vehicles: e.target.value })} placeholder="Toyota Camry, Honda Civic..." className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-[#00A8E8] hover:bg-[#0092c9] text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Enquiry Detail Modal ───────────────────────────────────────────────────────
function EnquiryModal({ enquiry, onClose, onUpdated }: { enquiry: ApiEnquiry; onClose: () => void; onUpdated: () => void }) {
  const [updating, setUpdating] = useState(false);

  const setStatus = async (status: string) => {
    setUpdating(true);
    try {
      await api.enquiries.updateStatus(enquiry.id, status);
      onUpdated();
      onClose();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-[#0A2540]">Enquiry #{enquiry.id}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">From</span><p className="font-semibold">{enquiry.customer_name}</p></div>
            <div><span className="text-gray-500">Email</span><p className="font-semibold">{enquiry.customer_email}</p></div>
            <div><span className="text-gray-500">Subject</span><p className="font-semibold">{enquiry.subject}</p></div>
            <div><span className="text-gray-500">Date</span><p className="font-semibold">{fmt(enquiry.created_at)}</p></div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">{enquiry.message}</div>
          <div className="flex gap-2 pt-2 flex-wrap">
            {enquiry.status !== 'in_progress' && (
              <button disabled={updating} onClick={() => setStatus('in_progress')} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-sm disabled:opacity-50">
                <Clock className="h-4 w-4" /> Mark In Progress
              </button>
            )}
            {enquiry.status !== 'resolved' && (
              <button disabled={updating} onClick={() => setStatus('resolved')} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 transition-colors text-sm disabled:opacity-50">
                <CheckCircle2 className="h-4 w-4" /> Mark Resolved
              </button>
            )}
            <a href={`mailto:${enquiry.customer_email}`} className="flex items-center gap-2 px-4 py-2 bg-[#f0f9fc] text-[#00A8E8] font-semibold rounded-lg hover:bg-[#e0f4fb] transition-colors text-sm">
              Reply via Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ApiEnquiry | null>(null);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [enquiries, setEnquiries] = useState<ApiEnquiry[]>([]);
  const [apiError, setApiError] = useState('');

  // Pagination states
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersPage, setOrdersPage] = useState(1);
  const [productsTotal, setProductsTotal] = useState(0);
  const [productsPage, setProductsPage] = useState(1);
  const [enquiriesTotal, setEnquiriesTotal] = useState(0);
  const [enquiriesPage, setEnquiriesPage] = useState(1);

  // Confirm Modal state
  const [confirmData, setConfirmData] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const BRANDS = ['Toyota', 'BMW', 'Ford', 'Mercedes-Benz', 'Honda', 'Chevrolet', 'Nissan', 'Volkswagen', 'Hyundai', 'Kia', 'Audi', 'Subaru'];

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await api.orders.list((ordersPage - 1) * 10, 10);
      setOrders(res.items);
      setOrdersTotal(res.total);
      setApiError('');
    } catch (e: any) { setApiError(e.message); }
    finally { setLoadingOrders(false); }
  }, [ordersPage]);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await api.products.list({
        brand: brandFilter || undefined,
        skip: (productsPage - 1) * 10,
        limit: 10
      });
      setProducts(res.items);
      setProductsTotal(res.total);
      setApiError('');
    } catch (e: any) { setApiError(e.message); }
    finally { setLoadingProducts(false); }
  }, [brandFilter, productsPage]);

  const loadEnquiries = useCallback(async () => {
    setLoadingEnquiries(true);
    try {
      const res = await api.enquiries.list((enquiriesPage - 1) * 10, 10);
      setEnquiries(res.items);
      setEnquiriesTotal(res.total);
      setApiError('');
    } catch (e: any) { setApiError(e.message); }
    finally { setLoadingEnquiries(false); }
  }, [enquiriesPage]);

  useEffect(() => { loadOrders(); loadProducts(); loadEnquiries(); }, [ordersPage, productsPage, enquiriesPage, brandFilter]);

  // Real-time updates via SSE
  useEffect(() => {
    console.log('Connecting to SSE...');
    const eventSource = new EventSource('/api/v1/events');
    
    eventSource.onmessage = (event) => {
      console.log('SSE message received:', event.data);
      if (event.data === 'NEW_ORDER') {
        toast.info('New order received!', {
          action: { label: 'Refresh', onClick: () => loadOrders() }
        });
        loadOrders();
      } else if (event.data === 'NEW_ENQUIRY') {
        toast.info('New customer enquiry received!', {
          action: { label: 'Refresh', onClick: () => loadEnquiries() }
        });
        loadEnquiries();
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [loadOrders, loadEnquiries]);

  const handleMarkOrderComplete = async (id: number) => {
    setConfirmData({
      isOpen: true,
      title: 'Complete Order?',
      message: `Are you sure you want to mark order #${id} as completed? This will notify the customer.`,
      onConfirm: async () => {
        try {
          await api.orders.updateStatus(id, 'completed');
          toast.success(`Order #${id} completed!`);
          loadOrders();
        } catch (e: any) { toast.error(e.message); }
        setConfirmData(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteProduct = async (id: number) => {
    setConfirmData({
      isOpen: true,
      title: 'Delete Product?',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.products.delete(id);
          toast.success('Product deleted successfully');
          loadProducts();
        } catch (e: any) { toast.error(e.message); }
        setConfirmData(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const confirmLogout = () => { localStorage.removeItem('ra_admin_session'); navigate('/admin/login'); };

  // Derived stats
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total_amount, 0);
  const openEnquiries = enquiries.filter(e => e.status === 'open').length;

  const filteredProducts = products.filter(p => {
    const matchBrand = !brandFilter || p.brand === brandFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.oem_number.toLowerCase().includes(search.toLowerCase());
    return matchBrand && matchSearch;
  });

  const filteredOrders = orders.filter(o =>
    !search || o.customer_name.toLowerCase().includes(search.toLowerCase()) || o.customer_email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEnquiries = enquiries.filter(e =>
    !search || e.customer_name.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase())
  );

  const tabTitle: Record<Tab, string> = {
    overview: 'System Overview',
    orders: 'Order Management',
    inventory: 'Inventory',
    enquiries: 'Customer Service',
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A2540] text-white flex flex-col shadow-xl flex-shrink-0">
        <div className="p-8">
          <div className="text-2xl font-bold tracking-tight mb-1">
            RA Ernesto<span className="text-[#00A8E8]">.</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Admin Portal</div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          (([
            { id: 'overview', icon: BarChart3, label: 'Overview', badge: undefined as number | undefined },
            { id: 'orders', icon: ShoppingCart, label: 'Orders', badge: pendingOrders as number | undefined },
            { id: 'inventory', icon: Package, label: 'Inventory', badge: undefined as number | undefined },
            { id: 'enquiries', icon: MessageSquare, label: 'Customer Service', badge: openEnquiries as number | undefined },
          ])).map(({ id, icon: Icon, label, badge }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id as Tab); setSearch(''); setBrandFilter(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === id ? 'bg-[#00A8E8] text-white shadow-lg shadow-[#00A8E8]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span className="font-semibold text-sm">{label}</span>
              </div>
              {badge != null && badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-semibold text-sm"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Top Header */}
        <header className="bg-white h-20 flex items-center justify-between px-8 border-b border-gray-200 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-[#0A2540]">{tabTitle[activeTab]}</h1>
          <div className="flex items-center gap-4">
            {apiError && (
              <span className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {apiError}
              </span>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]/20 w-56"
              />
            </div>
            <div className="h-9 w-9 rounded-full bg-[#00A8E8]/10 border border-[#00A8E8]/20 flex items-center justify-center text-[#00A8E8] font-bold text-sm">A</div>
          </div>
        </header>

        <div className="p-8 space-y-8">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Products', value: products.length, icon: Package, color: 'blue' },
                  { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'yellow' },
                  { label: 'Revenue (Completed)', value: `$${totalRevenue.toFixed(0)}`, icon: ShoppingCart, color: 'green' },
                  { label: 'Open Enquiries', value: openEnquiries, icon: MessageSquare, color: 'purple' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className={`p-3 bg-${color}-50 text-${color}-600 rounded-xl w-fit mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
                    <p className="text-2xl font-bold text-[#0A2540]">{value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-[#0A2540]">Recent Orders</h2>
                  <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-[#00A8E8] hover:underline">View All</button>
                </div>
                {loadingOrders ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#00A8E8]" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                        <th className="px-6 py-4">Order</th><th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th>
                      </tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-bold text-sm text-[#0A2540]">#{o.id}</td>
                            <td className="px-6 py-4 text-sm"><p className="font-semibold">{o.customer_name}</p><p className="text-gray-400 text-xs">{o.customer_email}</p></td>
                            <td className="px-6 py-4 font-bold text-sm">${o.total_amount.toFixed(2)}</td>
                            <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                            <td className="px-6 py-4 text-sm text-gray-500">{fmt(o.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {orders.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No orders yet.</p>}
                  </div>
                )}
              </div>

              {/* Recent Enquiries */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-[#0A2540]">Recent Enquiries</h2>
                  <button onClick={() => setActiveTab('enquiries')} className="text-sm font-bold text-[#00A8E8] hover:underline">View All</button>
                </div>
                {loadingEnquiries ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#00A8E8]" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                        <th className="px-6 py-4">From</th><th className="px-6 py-4">Subject</th>
                        <th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th>
                      </tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {enquiries.slice(0, 5).map(e => (
                          <tr key={e.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelectedEnquiry(e)}>
                            <td className="px-6 py-4 text-sm"><p className="font-semibold">{e.customer_name}</p><p className="text-gray-400 text-xs">{e.customer_email}</p></td>
                            <td className="px-6 py-4 text-sm text-gray-700">{e.subject}</td>
                            <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
                            <td className="px-6 py-4 text-sm text-gray-500">{fmt(e.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {enquiries.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No enquiries yet.</p>}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── ORDERS ── */}
          {activeTab === 'orders' && (
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-[#0A2540]">All Orders ({ordersTotal})</h2>
                  <button onClick={() => loadOrders()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00A8E8] transition-colors">
                    <RefreshCw className="h-4 w-4" /> Refresh
                  </button>
                </div>
                {loadingOrders ? (
                  <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#00A8E8]" /></div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead><tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                          <th className="px-6 py-4">Order</th><th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Items</th><th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Action</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                          {orders.map(o => (
                            <tr key={o.id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4 font-bold text-sm text-[#0A2540]">#{o.id}</td>
                              <td className="px-6 py-4 text-sm"><p className="font-semibold">{o.customer_name}</p><p className="text-gray-400 text-xs">{o.customer_email}</p><p className="text-gray-400 text-xs">{o.shipping_address}</p></td>
                              <td className="px-6 py-4 text-sm text-gray-600">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                              <td className="px-6 py-4 font-bold text-sm">${o.total_amount.toFixed(2)}</td>
                              <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                              <td className="px-6 py-4 text-sm text-gray-500">{fmt(o.created_at)}</td>
                              <td className="px-6 py-4">
                                {o.status === 'pending' && (
                                  <button
                                    onClick={() => handleMarkOrderComplete(o.id)}
                                    className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {orders.length === 0 && <p className="text-center py-12 text-gray-400">No orders found.</p>}
                    </div>
                    <div className="border-t border-gray-100">
                      <Pagination 
                        currentPage={ordersPage} 
                        totalItems={ordersTotal} 
                        itemsPerPage={10} 
                        onPageChange={setOrdersPage} 
                      />
                    </div>
                  </>
                )}
          )}

          {/* ── INVENTORY ── */}
          {activeTab === 'inventory' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setBrandFilter('')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${!brandFilter ? 'bg-[#00A8E8] text-white' : 'bg-white border text-gray-600 hover:border-[#00A8E8]'}`}
                  >All Brands</button>
                  {BRANDS.map(b => (
                    <button
                      key={b}
                      onClick={() => setBrandFilter(b)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${brandFilter === b ? 'bg-[#00A8E8] text-white' : 'bg-white border text-gray-600 hover:border-[#00A8E8]'}`}
                    >{b}</button>
                  ))}
                </div>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center gap-2 bg-[#00A8E8] hover:bg-[#0092c9] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex-shrink-0"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-[#0A2540]">
                    {brandFilter ? `${brandFilter} Products` : 'All Products'} ({productsTotal})
                  </h2>
                  <button onClick={() => loadProducts()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00A8E8]">
                    <RefreshCw className="h-4 w-4" /> Refresh
                  </button>
                </div>
                {loadingProducts ? (
                  <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#00A8E8]" /></div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead><tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                          <th className="px-6 py-4">Product</th><th className="px-6 py-4">Brand</th>
                          <th className="px-6 py-4">Category</th><th className="px-6 py-4">OEM</th>
                          <th className="px-6 py-4">Price</th><th className="px-6 py-4">Stock</th><th className="px-6 py-4"></th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                          {products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.image_url ?? `https://placehold.co/60x60/0A2540/FFFFFF?text=${encodeURIComponent(p.name.slice(0, 2))}`}
                                    alt={p.name}
                                    className="h-10 w-10 rounded-lg object-cover border bg-gray-50 flex-shrink-0"
                                  />
                                  <span className="font-semibold text-sm text-gray-700 max-w-[160px] truncate">{p.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4"><span className="px-2 py-1 bg-[#00A8E8]/5 text-[#00A8E8] rounded text-xs font-bold">{p.brand}</span></td>
                              <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                              <td className="px-6 py-4 text-sm font-mono text-gray-500">{p.oem_number}</td>
                              <td className="px-6 py-4 font-bold text-sm text-[#0A2540]">${p.price.toFixed(2)}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className={`h-2 w-2 rounded-full ${p.stock > 10 ? 'bg-green-500' : p.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                  <span className="text-sm font-medium text-gray-600">{p.stock}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {products.length === 0 && <p className="text-center py-12 text-gray-400">No products found.</p>}
                    </div>
                    <div className="border-t border-gray-100">
                      <Pagination 
                        currentPage={productsPage} 
                        totalItems={productsTotal} 
                        itemsPerPage={10} 
                        onPageChange={setProductsPage} 
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* ── ENQUIRIES ── */}
          {activeTab === 'enquiries' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-[#0A2540]">Customer Enquiries ({enquiriesTotal})</h2>
                <button onClick={() => loadEnquiries()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00A8E8]">
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
              </div>

              <div className="flex gap-2 px-6 py-4 border-b border-gray-50">
                {['all', 'open', 'in_progress', 'resolved'].map(s => (
                  <button key={s} onClick={() => setSearch(s === 'all' ? '' : s)} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors capitalize ${search === (s === 'all' ? '' : s) ? 'bg-[#00A8E8] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s === 'all' ? 'All' : s.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {loadingEnquiries ? (
                <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#00A8E8]" /></div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                        <th className="px-6 py-4">Customer</th><th className="px-6 py-4">Subject</th>
                        <th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Action</th>
                      </tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {enquiries.map(e => (
                          <tr key={e.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 text-sm"><p className="font-semibold">{e.customer_name}</p><p className="text-gray-400 text-xs">{e.customer_email}</p></td>
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{e.subject}</td>
                            <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
                            <td className="px-6 py-4 text-sm text-gray-500">{fmt(e.created_at)}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedEnquiry(e)}
                                className="text-xs font-bold text-[#00A8E8] bg-[#f0f9fc] hover:bg-[#e0f4fb] px-3 py-2 rounded-lg transition-colors"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {enquiries.length === 0 && <p className="text-center py-12 text-gray-400">No enquiries found.</p>}
                  </div>
                  <div className="border-t border-gray-100">
                    <Pagination 
                      currentPage={enquiriesPage} 
                      totalItems={enquiriesTotal} 
                      itemsPerPage={10} 
                      onPageChange={setEnquiriesPage} 
                    />
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Modals */}
      {showLogoutModal && (
        <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />
      )}
      {showAddProduct && (
        <AddProductModal onClose={() => setShowAddProduct(false)} onAdded={loadProducts} />
      )}
      {selectedEnquiry && (
        <EnquiryModal
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onUpdated={() => { loadEnquiries(); setSelectedEnquiry(null); }}
        />
      )}
      {confirmData.isOpen && (
        <ConfirmModal
          isOpen={confirmData.isOpen}
          title={confirmData.title}
          message={confirmData.message}
          onConfirm={confirmData.onConfirm}
          onCancel={() => setConfirmData(prev => ({ ...prev, isOpen: false }))}
          isDestructive={confirmData.isDestructive}
        />
      )}
    </div>
  );
}
