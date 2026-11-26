/**
 * MilkMart Fullstack API Client
 * Seamlessly interfaces with Node/Express REST API on /api
 * Handles JWT tokens, role headers, error formatting, and resilient fallbacks.
 */

const API_BASE = '/api';

const getToken = () => {
  return localStorage.getItem('milkmart_token') || '';
};

const setToken = (token) => {
  if (token) {
    localStorage.setItem('milkmart_token', token);
  } else {
    localStorage.removeItem('milkmart_token');
  }
};

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data?.message || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    console.warn(`API [${options.method || 'GET'} ${endpoint}] error:`, err.message);
    throw err;
  }
}

export const api = {
  getToken,
  setToken,

  // --- HEALTH ---
  health: () => request('/health'),

  // --- AUTH ---
  auth: {
    login: async (email, password, role) => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role })
      });
      if (res.token) setToken(res.token);
      return res;
    },
    register: async (userData) => {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res.token) setToken(res.token);
      return res;
    },
    getMe: () => request('/auth/me'),
    updateProfile: (updates) => request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),
    updatePassword: (currentPassword, newPassword) => request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    }),
    forgotPassword: (email, newPassword) => request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword })
    }),
    logout: () => {
      setToken(null);
    }
  },

  // --- PRODUCTS ---
  products: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, v);
      });
      const qs = query.toString();
      const res = await request(`/products${qs ? `?${qs}` : ''}`);
      return res.products || res;
    },
    getById: async (id) => {
      const res = await request(`/products/${id}`);
      return res.product || res;
    },
    create: async (productData) => {
      const res = await request('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      return res.product || res;
    },
    update: async (id, updates) => {
      const res = await request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return res.product || res;
    },
    delete: (id) => request(`/products/${id}`, {
      method: 'DELETE'
    }),
    setApproval: async (id, status, reason) => {
      const res = await request(`/products/${id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason })
      });
      return res.product || res;
    },
    adjustStock: async (id, { action, amount, exactValue }) => {
      const res = await request(`/products/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ action, amount, exactValue })
      });
      return res.product || res;
    }
  },

  // --- FARMS ---
  farms: {
    getAll: async () => {
      const res = await request('/farms');
      return res.farms || res;
    },
    getById: async (id) => {
      const res = await request(`/farms/${id}`);
      return res.farm || res;
    },
    update: async (id, updates) => {
      const res = await request(`/farms/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return res.farm || res;
    },
    addPhoto: (farmId, photoData) => request(`/farms/${farmId}/photos`, {
      method: 'POST',
      body: JSON.stringify(photoData)
    }),
    deletePhoto: (farmId, photoId) => request(`/farms/${farmId}/photos/${photoId}`, {
      method: 'DELETE'
    })
  },

  // --- ORDERS ---
  orders: {
    getAll: async () => {
      const res = await request('/orders');
      return res.orders || res;
    },
    getById: async (id) => {
      const res = await request(`/orders/${id}`);
      return res.order || res;
    },
    create: (orderData) => request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),
    updateStatus: async (id, status, partnerInfo) => {
      const res = await request(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, partnerInfo })
      });
      return res.order || res;
    },
    cancel: (id) => request(`/orders/${id}/cancel`, {
      method: 'POST'
    })
  },

  // --- SUBSCRIPTIONS ---
  subscriptions: {
    getAll: async () => {
      const res = await request('/subscriptions');
      return res.subscriptions || res;
    },
    create: async (subData) => {
      const res = await request('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(subData)
      });
      return res.subscription || res;
    },
    pause: async (id) => {
      const res = await request(`/subscriptions/${id}/pause`, { method: 'PATCH' });
      return res.subscription || res;
    },
    resume: async (id) => {
      const res = await request(`/subscriptions/${id}/resume`, { method: 'PATCH' });
      return res.subscription || res;
    },
    skip: async (id) => {
      const res = await request(`/subscriptions/${id}/skip`, { method: 'PATCH' });
      return res.subscription || res;
    },
    updateQuantity: async (id, quantity) => {
      const res = await request(`/subscriptions/${id}/quantity`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity })
      });
      return res.subscription || res;
    },
    modifyQuantity: async (id, quantity) => {
      const res = await request(`/subscriptions/${id}/quantity`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity })
      });
      return res.subscription || res;
    },
    cancel: (id) => request(`/subscriptions/${id}`, {
      method: 'DELETE'
    })
  },

  // --- DELIVERY FLEET ---
  delivery: {
    getRoute: () => request('/delivery/route'),
    completeDelivery: (payload) => request('/delivery/complete', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    getBottleLogs: () => request('/delivery/bottles')
  },

  // --- WALLET ---
  wallet: {
    getWallet: () => request('/wallet'),
    topup: (amount, paymentMethod) => request('/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod })
    })
  },

  // --- BATCHES & PURITY ---
  batches: {
    getAll: async (sellerId) => {
      const res = await request(`/batches${sellerId ? `?sellerId=${sellerId}` : ''}`);
      return res.batches || res;
    },
    getById: async (id) => {
      const res = await request(`/batches/${id}`);
      return res.batch || res;
    },
    create: async (batchData) => {
      const res = await request('/batches', {
        method: 'POST',
        body: JSON.stringify(batchData)
      });
      return res.batch || res;
    }
  },

  // --- REVIEWS ---
  reviews: {
    getAll: async (productId) => {
      const res = await request(`/reviews${productId ? `?productId=${productId}` : ''}`);
      return res.reviews || res;
    },
    create: async (reviewData) => {
      const res = await request('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });
      return res.review || res;
    }
  },

  // --- NOTIFICATIONS ---
  notifications: {
    getAll: async () => {
      const res = await request('/notifications');
      return res.notifications || res;
    },
    markRead: (id) => request(`/notifications/${id}/read`, {
      method: 'PATCH'
    }),
    markAllRead: () => request('/notifications/read-all', {
      method: 'PATCH'
    })
  },

  // --- ANALYTICS ---
  analytics: {
    getSeller: async (sellerId) => {
      const res = await request(`/analytics/seller/${sellerId}`);
      return res.analytics || res;
    },
    getSellerAnalytics: async (sellerId) => {
      const res = await request(`/analytics/seller/${sellerId}`);
      return res.analytics || res;
    },
    getAdmin: async () => {
      const res = await request('/analytics/admin');
      return res.metrics || res;
    },
    getAdminAnalytics: async () => {
      const res = await request('/analytics/admin');
      return res.metrics || res;
    }
  },

  // --- UPLOAD ---
  upload: {
    image: async (file) => {
      const formData = new FormData();
      formData.append('image', file);

      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Image upload failed');
      return data.url || data;
    }
  }
};
