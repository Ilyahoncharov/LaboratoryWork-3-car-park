import axios from 'axios';

export const API_BASE = 'http://localhost:3001/api';

export const getBrands = () => axios.get(`${API_BASE}/brands`);
export const getModelsByBrand = (brandId) => axios.get(`${API_BASE}/models/by-brand/${brandId}`);
export const getGenerations = (brandId, modelId) =>
  axios.get(`${API_BASE}/generations/by-model/${modelId}/brand/${brandId}`);
export const getModifications = (brandId, modelId, generationId) =>
  axios.get(`${API_BASE}/modification/by-model/${modelId}/brand/${brandId}/generation/${generationId}`);
export const getValues = (brandId, modelId, generationId, modificationId) =>
  axios.get(`${API_BASE}/values/by-model/${modelId}/brand/${brandId}/generation/${generationId}/modification/${modificationId}`);
export const createCar = (data) => axios.post(`${API_BASE}/cars`, data);
export const deleteCar = (id) => axios.delete(`${API_BASE}/cars/${id}`);
export const saveCar = (brandId, modelId, generationId, modificationId, id) => axios.put(`${API_BASE}/cars/${id}`, {
    brand_id: brandId,
    model_id: modelId,
    generation_id: generationId,
    modification_id: modificationId,
  });
