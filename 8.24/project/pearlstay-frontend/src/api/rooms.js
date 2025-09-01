import api from './axios.js';

export const roomsAPI = {
  list: (params = {}) => api.get('/rooms', { params }),
  get: (id) => api.get(`/rooms/${id}`),
  create: (roomData) => api.post('/rooms', roomData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  delete: (id) => api.delete(`/rooms/${id}`),
};