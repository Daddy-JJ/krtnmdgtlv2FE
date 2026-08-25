import { api } from './api-client.js';

export const starterService = {
  create(input) {
    return api.post('/starter/cards', input, { csrfContext: null, skipRefresh: true });
  },
  openAccess(publicId, token) {
    return api.post('/starter/access', { publicId, token }, { csrfContext: null, skipRefresh: true });
  },
  update(publicId, input) {
    return api.put(`/starter/cards/${encodeURIComponent(publicId)}`, input, { csrfContext: 'access' });
  },
  claim(publicId) {
    return api.post(`/starter/cards/${encodeURIComponent(publicId)}/claim`, null, { csrfContext: 'starter' });
  },
};
