import axios from 'axios';

import { User, Role } from '../types';

const API = axios.create({
  baseURL: '/api',
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

