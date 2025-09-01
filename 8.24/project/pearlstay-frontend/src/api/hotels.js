import api from './axios.js';

export const hotelsAPI = {
  list: (params = {}) => api.get('/hotels', { params }),
  get: (id) => api.get(`/hotels/${id}`),
  create: (hotelData) => api.post('/hotels', hotelData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, hotelData) => api.put(`/hotels/${id}`, hotelData),
  delete: (id) => api.delete(`/hotels/${id}`),
};