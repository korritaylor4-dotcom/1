import axios from 'axios';
import { getAuthHeaders } from './auth';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

// Articles API
export const getArticles = async (category = null, page = 1, limit = 12) => {
  const params = { page, limit };
  if (category) params.category = category;
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
export const getBreeds = async (filters = {}, page = 1, limit = 12) => {
  const params = { ...filters, page, limit };
  const response = await axios.get(`${API_URL}/breeds`, { params });
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

// Ratings API
export const rateArticle = async (articleId, rating) => {
  const response = await axios.post(`${API_URL}/articles/${articleId}/rate`, { rating });
  return response.data;
};

export const getArticleRating = async (articleId) => {
  const response = await axios.get(`${API_URL}/articles/${articleId}/rating`);
  return response.data;
};

// Page Views API
export const trackPageView = async (pageType, pageId) => {
  const response = await axios.post(`${API_URL}/views/${pageType}/${pageId}`);
  return response.data;
};

// Analytics API
export const getPopularContent = async () => {
  const response = await axios.get(`${API_URL}/analytics/popular`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getAnalyticsStats = async () => {
  const response = await axios.get(`${API_URL}/analytics/stats`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// SEO API
export const getSEOSettings = async () => {
  const response = await axios.get(`${API_URL}/seo/settings`);
  return response.data;
};

export const updateSEOSettings = async (settings) => {
  const response = await axios.put(`${API_URL}/seo/settings`, settings, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getPageMeta = async (pageType, pageId) => {
  const response = await axios.get(`${API_URL}/seo/meta/${pageType}/${pageId}`);
  return response.data;
};

export const createPageMeta = async (metaData) => {
  const response = await axios.post(`${API_URL}/seo/meta`, metaData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updatePageMeta = async (pageType, pageId, metaData) => {
  const response = await axios.put(`${API_URL}/seo/meta/${pageType}/${pageId}`, metaData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Search API
export const searchContent = async (query) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { q: query }
  });
  return response.data;
};

export const getSearchSuggestions = async (query) => {
  const response = await axios.get(`${API_URL}/search/suggestions`, {
    params: { q: query }
  });
  return response.data;
};
