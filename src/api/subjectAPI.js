import API from './axios';

export const getSubjectsAPI = (department, semester) =>
  API.get('/subjects', { params: { department, semester } });

export const addSubject = (data) => API.post('/subjects', data);