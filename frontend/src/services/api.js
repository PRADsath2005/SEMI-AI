/**
 * API service layer for SEMI-AI.
 *
 * In development, Vite proxies /api → http://localhost:5000/api so these
 * requests are same-origin and have no CORS issues.
 * In production, update BASE to your deployed API URL.
 */

const BASE = '/api';

const get = async (path) => {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

const post = async (path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    body,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const api = {
  health:           ()           => get('/health'),
  reloadModel:      ()           => post('/reload', null),
  dashboardStats:   ()           => get('/dashboard/stats'),
  dashboardHistory: ()           => get('/dashboard/history'),
  predict:          (formData)   => post('/predict', formData),
  predictions:      (page = 1)   => get(`/predictions?page=${page}`),
  shapGlobal:       ()           => get('/shap/global'),
  shapLocal:        (id)         => get(`/shap/local/${id}`),
  riskAnalysis:     ()           => get('/risk-analysis'),
};
