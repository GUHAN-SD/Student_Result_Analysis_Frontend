// ─────────────────────────────────────
// src/api/marksAPI.js
// ─────────────────────────────────────
import API from './axios';

export const saveMarks   = (data)   => API.post('/marks', data);
export const getMyMarks  = ()       => API.get('/marks/my');
export const getAnalytics= (params) => API.get('/marks/analytics', { params });