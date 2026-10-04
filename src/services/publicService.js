/**
 * AICIT Public API service — no authentication required
 */
import { publicApi } from './api.js';

export const verifyCertificate = (certNumber) =>
  publicApi.get(`/api/public/certificates/verify/${encodeURIComponent(certNumber)}`);

export const getPublicCourses = () =>
  publicApi.get('/api/public/courses');

export const registerInstitute = (data) =>
  publicApi.post('/api/public/institutes/register', data);

export const healthCheck = () =>
  publicApi.get('/api/public/health');

export const getPublicStats = () =>
  publicApi.get('/api/public/stats');

export const submitContact = (data) =>
  publicApi.post('/api/public/contact', data);
