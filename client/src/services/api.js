import axios from 'axios';

// ─── Axios Instance ────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30s timeout for AI/image calls
});

// ─── Request Interceptor — Attach JWT Token ────────────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('krishi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Handle Token Expiry ───────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Auto-logout on 401 (expired / invalid token)
    if (status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/');
      if (!isAuthRoute) {
        localStorage.removeItem('krishi_token');
        localStorage.removeItem('krishi_user');
        // Redirect to login but only if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?session=expired';
        }
      }
    }

    return Promise.reject(error);
  }
);

// ─── Typed API Helpers ─────────────────────────────────────────────────────

/** Authentication */
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  forgotPassword: (phone) => API.post('/auth/forgot-password', { phone }),
  resetPassword: (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
};

/** Soil Analysis */
export const soilAPI = {
  analyze: (data) => API.post('/soil/analyze', data),
  getHistory: () => API.get('/soil/history'),
  getReport: (id) => API.get(`/soil/${id}`),
  deleteReport: (id) => API.delete(`/soil/${id}`),
};

/** Government Schemes */
export const schemesAPI = {
  getSchemes: (filters = {}) => API.get('/schemes', { params: filters }),
  chat: (prompt, language, imageBase64 = null) =>
    API.post('/schemes/chat', { prompt, language, imageBase64 }),
  apply: (schemeId, farmerNotes) =>
    API.post('/schemes/apply', { schemeId, farmerNotes }),
};

/** Notifications */
export const notificationsAPI = {
  getAll: (page = 1) => API.get('/notifications', { params: { page } }),
  markRead: (id) => API.patch(`/notifications/${id}/read`),
  markAllRead: () => API.patch('/notifications/mark-all-read'),
  delete: (id) => API.delete(`/notifications/${id}`),
};

/** Feedback */
export const feedbackAPI = {
  submit: (data) => API.post('/feedback', data),
};

/** Admin */
export const adminAPI = {
  getAnalytics: () => API.get('/admin/analytics'),
  getUsers: (params = {}) => API.get('/admin/users', { params }),
  getUserById: (id) => API.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => API.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  createScheme: (data) => API.post('/admin/schemes', data),
  updateScheme: (id, data) => API.put(`/admin/schemes/${id}`, data),
  deleteScheme: (id) => API.delete(`/admin/schemes/${id}`),
  getApplications: (params = {}) => API.get('/admin/applications', { params }),
  updateApplicationStatus: (id, status, notes) =>
    API.patch(`/admin/applications/${id}/status`, { status, adminNotes: notes }),
  broadcast: (data) => API.post('/admin/broadcast', data),
  getFeedback: (params = {}) => API.get('/admin/feedback', { params }),
  updateFeedback: (id, data) => API.patch(`/admin/feedback/${id}`, data),
};

/** Health Check */
export const healthCheck = () => API.get('/health');

export default API;
