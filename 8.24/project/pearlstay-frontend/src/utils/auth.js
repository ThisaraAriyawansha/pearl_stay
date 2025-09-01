import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'pearlstay_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }
    return decoded;
  } catch (error) {
    console.error('Invalid token:', error);
    removeToken();
    return null;
  }
};

export const isAuthenticated = () => {
  return getUserFromToken() !== null;
};

export const hasRole = (role) => {
  const user = getUserFromToken();
  return user && user.role === role;
};

export const logout = () => {
  removeToken();
  window.location.href = '/';
};