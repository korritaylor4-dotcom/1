import axios from 'axios';
import { getAuthHeaders } from './auth';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

// Articles API
export const getArticles = async (category = null) => {
  const params = category ? { category } : {};
  const response = await axios.get(`${API_URL}/articles`, { params });
  return response.data;
};

export const getArticle = async (id) => {
  const response = await axios.get(`${API_URL}/articles/${id}`);
  return response.data;
};

export const createArticle = async (articleData) => {
  const response = await axios.post(`${API_URL}/articles`, articleData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateArticle = async (id, articleData) => {
  const response = await axios.put(`${API_URL}/articles/${id}`, articleData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteArticle = async (id) => {
  const response = await axios.delete(`${API_URL}/articles/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Breeds API
export const getBreeds = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/breeds`, { params: filters });
  return response.data;
};

export const getBreed = async (id) => {
  const response = await axios.get(`${API_URL}/breeds/${id}`);
  return response.data;
};

export const createBreed = async (breedData) => {
  const response = await axios.post(`${API_URL}/breeds`, breedData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateBreed = async (id, breedData) => {
  const response = await axios.put(`${API_URL}/breeds/${id}`, breedData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteBreed = async (id) => {
  const response = await axios.delete(`${API_URL}/breeds/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Upload API
export const uploadImage = async (file, folder = 'general') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
