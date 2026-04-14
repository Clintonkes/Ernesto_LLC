import { useState } from 'react';
import { MessageSquare, Phone, Mail, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export default function CustomerService() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.enquiries.create(formData);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message ?? 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] bg-[#F8F9FA] flex items-center justify-center py-20">
        <div className="bg-white p-12 rounded-2xl shadow-sm border text-center max-w-lg mx-auto">
          <CheckCircle2 className="h-16 w-16 text-[#28A745] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0A2540] mb-3">Enquiry Submitted!</h2>
          <p className="text-[#555555] mb-6">
            Thank you for reaching out. We've received your message and will get back to you within 1–2 business days. A confirmation has been sent to your email.
          </p>
          <button
            onClick={() => { setIsSuccess(false); setFormData({ customer_name: '', customer_email: '', subject: '', message: '' }); }}
            className="bg-[#00A8E8] hover:bg-[#0092c9] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-[#0A2540] mb-3">Customer Service</h1>
          <p className="text-[#555555] text-lg max-w-2xl mx-auto">
            Have a question about a part, your order, or need expert advice? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#0A2540] mb-6">Contact Details</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#f0f9fc] rounded-full text-[#00A8E8] flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A] text-sm">Phone</p>
                    <p className="text-[#555555] text-sm">+1 (860) 543-0799</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#f0f9fc] rounded-full text-[#00A8E8] flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A] text-sm">Email</p>
                    <p className="text-[#555555] text-sm">raernesto1110@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#f0f9fc] rounded-full text-[#00A8E8] flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A] text-sm">Address</p>
                    <p className="text-[#555555] text-sm">1703 Prince ST<br />Beaufort, SC 29902</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#f0f9fc] rounded-full text-[#00A8E8] flex-shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A] text-sm">Business Hours</p>
                    <p className="text-[#555555] text-sm">Mon – Fri: 8am – 6pm EST<br />Sat: 9am – 2pm EST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0A2540] text-white rounded-2xl p-6">
              <h3 className="font-bold mb-2">Need Parts Advice?</h3>
              <p className="text-gray-300 text-sm mb-4">Our team of expert mechanics can help you find the right part for your vehicle.</p>
              <a href="tel:+18605430799" className="block text-center bg-[#00A8E8] hover:bg-[#0092c9] text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                Call Us Now
              </a>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border shadow-sm p-8">
              <h2 className="text-xl font-bold text-[#0A2540] mb-6">Send Us a Message</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      required
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      type="text"
                      placeholder="John Doe"
                      className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      required
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      type="email"
                      placeholder="john@example.com"
                      className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    required
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none transition-all bg-white"
                  >
                    <option value="">Select a topic...</option>
                    <option value="Order Inquiry">Order Inquiry</option>
                    <option value="Part Compatibility">Part Compatibility Question</option>
                    <option value="Return / Refund">Return / Refund</option>
                    <option value="Shipping Issue">Shipping Issue</option>
                    <option value="Product Availability">Product Availability</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Describe your question or issue in detail..."
                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#00A8E8]/20 focus:border-[#00A8E8] outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00A8E8] hover:bg-[#0092c9] text-white py-4 rounded-lg font-bold flex items-center justify-center transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 shadow-lg shadow-[#00A8E8]/20"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>
                  ) : 'Send Enquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
