/**
 * AICIT Public API service — no authentication required
 */
import { publicApi } from './api.js';

export const verifyCertificate = (certNumber) =>
  publicApi.get(`/api/public/certificates/verify/${encodeURIComponent(certNumber)}`);

export const getPublicCourses = () =>
  publicApi.get('/api/public/courses');

/**
 * Paginated/searchable course lookup used by the reusable CourseFinder.
 * params: { search, category, sort, direction, page, size }
 */
export const searchPublicCourses = ({ search = '', category = '', sort = 'name',
                                      direction = 'asc', page = 0, size = 20 } = {}) => {
  const p = new URLSearchParams({ sort, direction, page, size });
  if (search)   p.set('search', search);
  if (category) p.set('category', category);
  return publicApi.get(`/api/public/courses/search?${p}`);
};

export const registerInstitute = (data) =>
  publicApi.post('/api/public/institutes/register', data);

export const healthCheck = () =>
  publicApi.get('/api/public/health');

export const getPublicStats = () =>
  publicApi.get('/api/public/stats');

export const submitContact = (data) =>
  publicApi.post('/api/public/contact', data);
