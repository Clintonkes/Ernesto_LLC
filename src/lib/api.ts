// Central API client — all calls go through Vite proxy → http://localhost:8000

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface ApiProduct {
  id: number;
  name: string;
  oem_number: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image_url?: string;
  description?: string;
  compatible_vehicles?: string;
}

export interface ApiOrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface ApiOrder {
  id: number;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: ApiOrderItem[];
}

export interface ApiEnquiry {
  id: number;
  customer_name: string;
  customer_email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export function resolveProductImageUrl(imageUrl: string | undefined, fallbackName: string) {
  if (!imageUrl) {
    return `https://placehold.co/800x600/0A2540/FFFFFF?text=${encodeURIComponent(fallbackName)}`;
  }

  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://') ||
    imageUrl.startsWith('data:') ||
    imageUrl.startsWith('blob:')
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/')) {
    return `${window.location.origin}${imageUrl}`;
  }

  return imageUrl;
}

// Convert a DB product to the shape the UI components expect
export function toUiProduct(p: ApiProduct) {
  const imageUrl = resolveProductImageUrl(p.image_url, p.name);

  return {
    id: String(p.id),
    name: p.name,
    oemNumber: p.oem_number,
    brand: p.brand,
    category: p.category,
    price: p.price,
    stock: p.stock,
    images: [imageUrl],
    description: p.description ?? '',
    specs: {} as Record<string, string>,
    compatibleVehicles: p.compatible_vehicles
      ? p.compatible_vehicles.split(',').map((v) => v.trim())
      : [],
  };
}

const BASE = '/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {};
  
  // Only set Content-Type to application/json if we're not sending FormData
  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, {
    headers,
    ...options,
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? 'Request failed');
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

export const api = {
  // Products
  products: {
    list: (params?: { brand?: string; category?: string; skip?: number; limit?: number }) => {
      const queryParams: Record<string, string> = {
        skip: String(params?.skip ?? 0),
        limit: String(params?.limit ?? 10),
      };
      if (params?.brand) queryParams.brand = params.brand;
      if (params?.category) queryParams.category = params.category;

      const qs = new URLSearchParams(queryParams).toString();
      return request<PaginatedResponse<ApiProduct>>(`/products?${qs}`);
    },
    get: (id: number | string) => request<ApiProduct>(`/products/${id}`),
    create: (formData: FormData) =>
      request<ApiProduct>('/products', { method: 'POST', body: formData }),
    update: (id: number, data: Partial<ApiProduct>) =>
      request<ApiProduct>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request<void>(`/products/${id}`, { method: 'DELETE' }),
  },

  // Orders
  orders: {
    create: (data: object) =>
      request<ApiOrder>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    list: (skip = 0, limit = 10) => request<PaginatedResponse<ApiOrder>>(`/orders?skip=${skip}&limit=${limit}`),
    get: (id: number) => request<ApiOrder>(`/orders/${id}`),
    updateStatus: (id: number, status: string) =>
      request<ApiOrder>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  },

  // Enquiries
  enquiries: {
    create: (data: object) =>
      request<ApiEnquiry>('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
    list: (skip = 0, limit = 10) => request<PaginatedResponse<ApiEnquiry>>(`/enquiries?skip=${skip}&limit=${limit}`),
    updateStatus: (id: number, status: string) =>
      request<ApiEnquiry>(`/enquiries/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  },
};
