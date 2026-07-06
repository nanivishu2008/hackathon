import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_TIMEOUT = process.env.REACT_APP_API_TIMEOUT || 30000;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email, password, firstName, lastName) =>
    api.post('/auth/register', { email, password, firstName, lastName }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  logout: () =>
    api.post('/auth/logout'),
};

// Chat API
export const chatAPI = {
  sendMessage: (chatId, content) =>
    api.post('/chat/send-message', { chatId, content }),
  getHistory: (chatId) =>
    api.get(`/chat/history/${chatId}`),
  getAllChats: () =>
    api.get('/chat/all'),
  deleteChat: (chatId) =>
    api.delete(`/chat/${chatId}`),
  createChat: (title) =>
    api.post('/chat/create', { title }),
};

// Knowledge Base API
export const kbAPI = {
  upload: (formData) =>
    api.post('/kb/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  search: (query) =>
    api.get('/kb/search', { params: { q: query } }),
  getAllDocuments: () =>
    api.get('/kb/all'),
  deleteDocument: (docId) =>
    api.delete(`/kb/${docId}`),
};

// Analytics API
export const analyticsAPI = {
  getSummary: () =>
    api.get('/analytics/summary'),
  getDetailedStats: () =>
    api.get('/analytics/detailed'),
};

export default api;
