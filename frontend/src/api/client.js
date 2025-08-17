import axios from 'axios';

const api = axios.create({
  baseURL: '', // use relative; in dev CRA proxy handles, in prod Nginx handles
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // adjust if you store differently
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
