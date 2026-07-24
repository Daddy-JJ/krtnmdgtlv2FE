import { api } from './api-client.js';

export const feedbackService = {
  submit(message) {
    return api.post('/feedback', { message }, { csrfContext: 'access' });
  },
};
