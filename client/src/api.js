import axios from 'axios';

const api = axios.create({
  baseURL: 'https://campusfind-ml5d.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusfind_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;