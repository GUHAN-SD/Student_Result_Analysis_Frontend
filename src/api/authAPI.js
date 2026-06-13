// ─────────────────────────────────────
// src/api/authAPI.js
// ─────────────────────────────────────
import API from './axios';

export const studentLogin = (data) => API.post('/auth/student-login', data);
export const adminLogin   = (data) => API.post('/auth/admin-login', data);