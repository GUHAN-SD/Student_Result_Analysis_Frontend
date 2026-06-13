// ─────────────────────────────────────
// src/api/studentAPI.js
// ─────────────────────────────────────
import API from './axios';

export const getStudents   = (params) => API.get('/students', { params });
export const addStudent    = (data)   => API.post('/students', data);
export const updateStudent = (regNo, data) => API.put(`/students/${regNo}`, data);
export const deleteStudent = (regNo)  => API.delete(`/students/${regNo}`);