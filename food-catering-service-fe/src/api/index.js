import { apiClient } from './apiClient';

/**
 * Authentication Endpoints (/api/auth)
 */
export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  refreshToken: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),
  getCurrentUser: () => apiClient.get('/auth/me'),
};

/**
 * Category Endpoints (/api/categories)
 */
export const categoriesApi = {
  getAll: () => apiClient.get('/categories'),
  getAllAdmin: () => apiClient.get('/categories/admin'),
  getById: (id) => apiClient.get(`/categories/${id}`),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};

/**
 * Catering Menu Items Endpoints (/api/menu-items)
 */
export const menuItemsApi = {
  getAll: (params = {}) => apiClient.get('/menu-items', { params }),
  getAllAdmin: () => apiClient.get('/menu-items/admin'),
  getById: (id) => apiClient.get(`/menu-items/${id}`),
  create: (data) => apiClient.post('/menu-items', data),
  update: (id, data) => apiClient.put(`/menu-items/${id}`, data),
  toggleAvailability: (id) => apiClient.patch(`/menu-items/${id}/toggle-availability`),
  delete: (id) => apiClient.delete(`/menu-items/${id}`),
};

/**
 * Catering Orders & Bookings Endpoints (/api/orders)
 */
export const ordersApi = {
  create: (orderData) => apiClient.post('/orders', orderData),
  getAll: (params = {}) => apiClient.get('/orders', { params }),
  getById: (id) => apiClient.get(`/orders/${id}`),
  getByNumber: (orderNumber) => apiClient.get(`/orders/number/${orderNumber}`),
  updateStatus: (id, status) => apiClient.patch(`/orders/${id}/status`, { status }),
  sendReceipt: (id) => apiClient.post(`/orders/${id}/send-receipt`),
};

/**
 * Kitchen Display System (KDS) Endpoints (/api/kitchen)
 */
export const kitchenApi = {
  getActiveTickets: () => apiClient.get('/kitchen/tickets'),
  updateTicketStatus: (id, status) => apiClient.patch(`/kitchen/tickets/${id}/status`, { status }),
};

/**
 * Financial Reports & Analytics Endpoints (/api/reports)
 */
export const reportsApi = {
  getDailyIncome: (date) => apiClient.get('/reports/daily', { params: { date } }),
  getMonthlyAnalytics: (year, month) => apiClient.get('/reports/monthly', { params: { year, month } }),
};

/**
 * Digital PDF Receipts Endpoints (/api/receipts)
 */
export const receiptsApi = {
  getViewUrl: (orderId, token = '') => {
    const base = `${apiClient.defaults.baseURL || '/api'}/receipts/${orderId}/view`;
    return token ? `${base}?token=${token}` : base;
  },
  getDownloadUrl: (orderId, token = '') => {
    const base = `${apiClient.defaults.baseURL || '/api'}/receipts/${orderId}/download`;
    return token ? `${base}?token=${token}` : base;
  },
};

/**
 * User Management Endpoints (/api/users)
 */
export const usersApi = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post('/users', data),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  toggleActive: (id) => apiClient.patch(`/users/${id}/toggle-active`),
  delete: (id) => apiClient.delete(`/users/${id}`),
};

export default {
  auth: authApi,
  categories: categoriesApi,
  menuItems: menuItemsApi,
  orders: ordersApi,
  kitchen: kitchenApi,
  reports: reportsApi,
  receipts: receiptsApi,
  users: usersApi,
};

