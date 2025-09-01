import axios from "axios";

   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
     headers: {
       "Content-Type": "application/json",
     },
   });

   api.interceptors.request.use((config) => {
     const token = localStorage.getItem("token");
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   // Auth APIs
   export const register = (data) => api.post("/auth/register", data);
   export const login = (data) => api.post("/auth/login", data);
   export const getProfile = () => api.get("/auth/profile");

   // User APIs
   export const getUsers = () => api.get("/users");
   export const updateUser = (id, data) => api.put(`/users/${id}`, data);
   export const updateUserStatus = (id, data) => api.patch(`/users/${id}/status`, data);

   // Hotel APIs
   export const getHotels = () => api.get("/hotels");
   export const getHotel = (id) => api.get(`/hotels/${id}`);
   export const createHotel = (data) => {
     const formData = new FormData();
     Object.keys(data).forEach(key => {
       if (key === "logo" || key === "cover_image") {
         if (data[key]) formData.append(key, data[key]);
       } else {
         formData.append(key, data[key]);
       }
     });
     return api.post("/hotels", formData, {
       headers: { "Content-Type": "multipart/form-data" },
     });
   };
   export const updateHotel = (id, data) => {
     const formData = new FormData();
     Object.keys(data).forEach(key => {
       if (key === "logo" || key === "cover_image") {
         if (data[key]) formData.append(key, data[key]);
       } else {
         formData.append(key, data[key]);
       }
     });
     return api.put(`/hotels/${id}`, formData, {
       headers: { "Content-Type": "multipart/form-data" },
     });
   };
   export const deleteHotel = (id) => api.delete(`/hotels/${id}`);

   // Room APIs
   export const getRooms = (hotelId) => api.get(`/rooms?hotelId=${hotelId}`);
   export const getRoom = (id) => api.get(`/rooms/${id}`);
   export const createRoom = (data) => {
     const formData = new FormData();
     Object.keys(data).forEach(key => {
       if (key === "images") {
         data[key].forEach(image => formData.append("images", image));
       } else {
         formData.append(key, data[key]);
       }
     });
     return api.post("/rooms", formData, {
       headers: { "Content-Type": "multipart/form-data" },
     });
   };
   export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data);
   export const deleteRoom = (id) => api.delete(`/rooms/${id}`);

   // Booking APIs
   export const getBookings = () => api.get("/bookings");
   export const getBooking = (id) => api.get(`/bookings/${id}`);
   export const createBooking = (data) => api.post("/bookings", data);
   export const updateBookingStatus = (id, data) => api.patch(`/bookings/${id}/status`, data);

   export default api;