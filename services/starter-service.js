import { api } from './api-client.js';

export const starterService = {
  create(input) {
    return api.post('/starter/cards', input, { csrfContext: null, skipRefresh: true });
  },
  update(publicId, input) {
    return api.put(`/starter/cards/${encodeURIComponent(publicId)}`, input, { csrfContext: 'starter' });
  },
  claim(publicId) {
    return api.post(`/starter/cards/${encodeURIComponent(publicId)}/claim`, null, { csrfContext: 'starter' });
  },
};
