import api from './client';

export const listClaims = () => api.get('/api/claims');
export const getClaimById = (id) => api.get(`/api/claims/${id}`);
