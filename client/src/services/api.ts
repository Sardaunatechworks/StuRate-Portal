import axios from 'axios';

import { User, Role } from '../types';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const baseURL = import.meta.env.VITE_API_URL || (isLocal ? '/api' : 'https://sturate-portal.onrender.com/api');

const API = axios.create({
  baseURL,
});


// Intercept requests to attach JWT Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

