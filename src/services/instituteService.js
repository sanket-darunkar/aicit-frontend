/**
 * AICIT Institute API service
 * All calls go through the JWT-authenticated instituteApi client.
 */
import { instituteApi } from './api.js';

// ── Auth ──────────────────────────────────────────────────────
export const instituteLogin = (email, password) =>
  instituteApi.post('/api/auth/institute/login', { email, password });

// ── Students ──────────────────────────────────────────────────
export const listStudents = ({ page = 0, size = 20, search = '', status = '' } = {}) => {
  const params = new URLSearchParams({ page, size });
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  return instituteApi.get(`/api/institute/students?${params}`);
};

export const getStudent = (id) =>
  instituteApi.get(`/api/institute/students/${id}`);

export const createStudent = (data, photoFile = null) => {
  const form = new FormData();
  form.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (photoFile) form.append('photo', photoFile);
  return instituteApi.post('/api/institute/students', form, {
    headers: { 'Content-Type': undefined },
  });
};

export const updateStudent = (id, data, photoFile = null) => {
  const form = new FormData();
  form.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (photoFile) form.append('photo', photoFile);
  return instituteApi.put(`/api/institute/students/${id}`, form, {
    headers: { 'Content-Type': undefined },
  });
};

export const deleteStudent = (id) =>
  instituteApi.delete(`/api/institute/students/${id}`);

// ── Certificates ──────────────────────────────────────────────
export const listCertificates = ({ page = 0, size = 20, status = '' } = {}) => {
  const params = new URLSearchParams({ page, size });
  if (status) params.set('status', status);
  return instituteApi.get(`/api/institute/certificates?${params}`);
};

export const requestCertificate = (data) =>
  instituteApi.post('/api/institute/certificates/request', data);
