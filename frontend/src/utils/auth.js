import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: getAuthHeaders()
  });
  return response.data;
};
