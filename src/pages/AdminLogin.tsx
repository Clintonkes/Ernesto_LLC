import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@raernesto.com');
  const [password, setPassword] = useState('Admin123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Set persistent session
        localStorage.setItem('ra_admin_session', 'authenticated_' + Date.now());
        navigate('/admin');
      } else {
        const data = await response.json();
        setError(data.detail || 'Invalid credentials');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('Connection to backend failed. Ensure API is running.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center p-4 animate-in fade-in duration-700 font-sans">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-t-4 border-[#00A8E8]">
        <div className="flex justify-center mb-8">
          <div className="bg-[#f0f9fc] p-5 rounded-full text-[#00A8E8] shadow-inner">
            <ShieldAlert className="h-10 w-10" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-[#0A2540] mb-2 tracking-tight">Admin Portal</h1>
        <p className="text-center text-gray-400 mb-10 text-sm">Secure access for RA Ernesto LLC management</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-8 text-center border border-red-100 animate-in shake-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@raernesto.com"
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#00A8E8] outline-none transition-all duration-300 bg-gray-50 focus:bg-white" 
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#00A8E8] outline-none transition-all duration-300 bg-gray-50 focus:bg-white" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#00A8E8] hover:bg-[#0092c9] text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#00A8E8]/30 flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Unlock Dashboard'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <button 
                onClick={() => navigate('/')}
                className="text-xs text-gray-400 hover:text-[#00A8E8] transition-colors uppercase tracking-widest font-bold"
            >
                &larr; Return to Storefront
            </button>
        </div>
      </div>
    </div>
  );
}
