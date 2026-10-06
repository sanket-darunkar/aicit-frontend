/**
 * AICIT Admin API service
 * All calls go through the JWT-authenticated adminApi client.
 */
import { adminApi } from './api.js';

// ── Auth ──────────────────────────────────────────────────────
export const adminLogin = (email, password) =>
  adminApi.post('/api/auth/admin/login', { email, password });

// ── Dashboard ─────────────────────────────────────────────────
export const getAdminStats = () =>
  adminApi.get('/api/admin/dashboard/stats');

// ── Institutes ────────────────────────────────────────────────
export const listInstitutes = ({ page = 0, size = 15, status = '', search = '' } = {}) => {
  const params = new URLSearchParams({ page, size });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  return adminApi.get(`/api/admin/institutes?${params}`);
};

export const getInstitute = (id) =>
  adminApi.get(`/api/admin/institutes/${id}`);

export const approveInstitute = (id) =>
  adminApi.post(`/api/admin/institutes/${id}/approve`);

export const rejectInstitute = (id, reason = '') =>
  adminApi.post(`/api/admin/institutes/${id}/reject`, { reason });

export const suspendInstitute = (id, reason = '') =>
  adminApi.post(`/api/admin/institutes/${id}/suspend`, { reason });

export const activateInstitute = (id) =>
  adminApi.post(`/api/admin/institutes/${id}/activate`);

export const deactivateInstitute = (id) =>
  adminApi.post(`/api/admin/institutes/${id}/deactivate`);

export const resetInstitutePassword = (id) =>
  adminApi.post(`/api/admin/institutes/${id}/reset-password`, {});

export const deleteInstitute = (id) =>
  adminApi.delete(`/api/admin/institutes/${id}`);

// ── Students (platform-wide) ──────────────────────────────────
export const listAllStudents = ({ page = 0, size = 20, search = '', instituteId = '' } = {}) => {
  const params = new URLSearchParams({ page, size });
  if (search)      params.set('search', search);
  if (instituteId) params.set('instituteId', instituteId);
  return adminApi.get(`/api/admin/students?${params}`);
};

export const getAdminStudent = (id) =>
  adminApi.get(`/api/admin/students/${id}`);

// ── Certificates ──────────────────────────────────────────────
export const listAdminCertificates = ({ page = 0, size = 20, status = '', search = '' } = {}) => {
  const params = new URLSearchParams({ page, size });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  return adminApi.get(`/api/admin/certificates?${params}`);
};

export const getAdminCertificate = (id) =>
  adminApi.get(`/api/admin/certificates/${id}`);

export const approveCertificate = (id, data = {}) =>
  adminApi.post(`/api/admin/certificates/${id}/approve`, data);

export const rejectCertificate = (id, reason = '') =>
  adminApi.post(`/api/admin/certificates/${id}/reject`, { reason });

export const revokeCertificate = (id, reason = '') =>
  adminApi.post(`/api/admin/certificates/${id}/revoke`, { reason });

// ── Certificate Batches (payment verification + processing) ──
export const listAdminBatches = ({ page = 0, size = 20, paymentStatus = '' } = {}) => {
  const params = new URLSearchParams({ page, size });
  if (paymentStatus) params.set('paymentStatus', paymentStatus);
  return adminApi.get(`/api/admin/batches?${params}`);
};

export const getAdminBatch = (id) =>
  adminApi.get(`/api/admin/batches/${id}`);

export const verifyBatchPayment = (id, reason = '') =>
  adminApi.post(`/api/admin/batches/${id}/verify-payment`, { reason });

export const rejectBatchPayment = (id, reason = '') =>
  adminApi.post(`/api/admin/batches/${id}/reject-payment`, { reason });

export const processBatch = (id) =>
  adminApi.post(`/api/admin/batches/${id}/process`, {});

export const downloadAdminBatchZip = (id) =>
  adminApi.get(`/api/admin/batches/${id}/download`, { responseType: 'blob' });

// ── Certificate PDF download (blob via authed client) ─────────
export const downloadAdminCertificatePdf = (id) =>
  adminApi.get(`/api/admin/certificates/${id}/download`, { responseType: 'blob' });

// ── Courses ───────────────────────────────────────────────────
export const listCourses = () =>
  adminApi.get('/api/admin/courses');

export const createCourse = (data) =>
  adminApi.post('/api/admin/courses', data);

export const updateCourse = (id, data) =>
  adminApi.put(`/api/admin/courses/${id}`, data);

export const toggleCourseStatus = (id, active) =>
  adminApi.patch(`/api/admin/courses/${id}/status?active=${active}`);

// ── Audit Logs ────────────────────────────────────────────────
export const listAuditLogs = ({ page = 0, size = 50 } = {}) =>
  adminApi.get(`/api/admin/audit-logs?page=${page}&size=${size}`);

export const listAuditLogsByEntity = (entityType, entityId, { page = 0, size = 50 } = {}) =>
  adminApi.get(`/api/admin/audit-logs/entity/${entityType}/${entityId}?page=${page}&size=${size}`);
