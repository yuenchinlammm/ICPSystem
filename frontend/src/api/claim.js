import api from './client';

export const listClaims = () => api.get('/api/claims');
export const getClaimById = (id) => api.get(`/api/claims/${id}`);
export const submitClaim = (id) => api.post(`/api/claims/${id}/submit`);
export const updateClaim = (id, payload) => api.put(`/api/claims/${id}`, payload);
export const deleteClaim = (id) => api.delete(`/api/claims/${id}`);