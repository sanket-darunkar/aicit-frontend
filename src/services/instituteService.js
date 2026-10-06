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

/** Download a single issued certificate PDF. Returns a Blob. */
export const downloadCertificatePdf = (id) =>
  instituteApi.get(`/api/institute/certificates/${id}/download`, { responseType: 'blob' });

// ── Batch Certificate Flow (NEW) ──────────────────────────────
// Pricing is server-authoritative (₹250/cert). Never trust client amount.

/** Create a SINGLE-certificate batch. data = { studentId, courseId, marks?, grade? } */
export const createSingleBatch = (data) =>
  instituteApi.post('/api/institute/batches/single', data);

/** Validate a bulk CSV (does NOT create anything). Returns CsvValidationResponse. */
export const validateBulkCsv = (file) => {
  const form = new FormData();
  form.append('file', file);
  return instituteApi.post('/api/institute/batches/bulk/validate', form, {
    headers: { 'Content-Type': undefined },
  });
};

/** Create a BULK batch from a CSV file. Returns BatchResponse. */
export const createBulkBatch = (file) => {
  const form = new FormData();
  form.append('file', file);
  return instituteApi.post('/api/institute/batches/bulk', form, {
    headers: { 'Content-Type': undefined },
  });
};

/** Download the bulk CSV template (text/csv). Returns a Blob. */
export const downloadBatchTemplate = () =>
  instituteApi.get('/api/institute/batches/template', { responseType: 'blob' });

/** Submit the UPI UTR/reference number for a batch after payment. */
export const submitBatchUtr = (batchId, utrNumber) =>
  instituteApi.post(`/api/institute/batches/${batchId}/utr`, { utrNumber });

/** List batches (paged). Items in list have NULL certificates. */
export const listBatches = ({ page = 0, size = 20, paymentStatus = '' } = {}) => {
  const params = new URLSearchParams({ page, size });
  if (paymentStatus) params.set('paymentStatus', paymentStatus);
  return instituteApi.get(`/api/institute/batches?${params}`);
};

/** Get a single batch WITH its certificates. */
export const getBatch = (id) =>
  instituteApi.get(`/api/institute/batches/${id}`);

/** Download issued certificate PDFs for a batch as a ZIP. Returns a Blob (or 204). */
export const downloadBatchZip = (id) =>
  instituteApi.get(`/api/institute/batches/${id}/download`, { responseType: 'blob' });
