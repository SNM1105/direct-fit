// API Service - centralized API calls
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  verify: async (token) => {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  verifyEmail: async (token, email) => {
    const response = await fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email })
    });
    return response.json();
  },

  resendVerification: async (email) => {
    const response = await fetch(`${API_BASE}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return response.json();
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateProfile: async (token, profileData) => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    return response.json();
  }
};

// Cart API
export const cartAPI = {
  get: async (token) => {
    const response = await fetch(`${API_BASE}/cart`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  add: async (token, item) => {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
    return response.json();
  },

  update: async (token, itemId, quantity) => {
    const response = await fetch(`${API_BASE}/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity })
    });
    return response.json();
  },

  remove: async (token, itemId) => {
    const response = await fetch(`${API_BASE}/cart/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  clear: async (token) => {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

// Wishlist API
export const wishlistAPI = {
  get: async (token) => {
    const response = await fetch(`${API_BASE}/wishlist`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  add: async (token, product) => {
    const response = await fetch(`${API_BASE}/wishlist`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
    return response.json();
  },

  remove: async (token, productId) => {
    const response = await fetch(`${API_BASE}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

// Garage API
export const garageAPI = {
  get: async (token) => {
    const response = await fetch(`${API_BASE}/garage`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  add: async (token, vehicle) => {
    const response = await fetch(`${API_BASE}/garage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehicle)
    });
    return response.json();
  },

  remove: async (token, vehicleId) => {
    const response = await fetch(`${API_BASE}/garage/${vehicleId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

// Orders API
export const ordersAPI = {
  get: async (token) => {
    const response = await fetch(`${API_BASE}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  create: async (token, orderData) => {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    return response.json();
  }
};

// Payment API
export const paymentAPI = {
  createIntent: async (token, amount, orderId, description) => {
    const response = await fetch(`${API_BASE}/payment/create-intent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, orderId, description })
    });
    return response.json();
  },

  confirm: async (token, paymentData) => {
    const response = await fetch(`${API_BASE}/payment/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  }
};

// Vehicle Data API
export const vehicleAPI = {
  getMakes: async () => {
    const response = await fetch(`${API_BASE}/vehicle-data/makes`);
    return response.json();
  },

  getModels: async (make) => {
    const response = await fetch(`${API_BASE}/vehicle-data/models/${encodeURIComponent(make)}`);
    return response.json();
  }
};

// Admin API
export const adminAPI = {
  getUsers: async (token) => {
    const response = await fetch(`${API_BASE}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateUserMargin: async (token, userId, margin) => {
    const response = await fetch(`${API_BASE}/admin/users/${userId}/margin`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ margin })
    });
    return response.json();
  }
};

export { API_BASE };
