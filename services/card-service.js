import { api } from './api-client.js';

export const cardService = {
  list() {
    return api.get('/cards');
  },
  get(publicId) {
    return api.get(`/cards/${encodeURIComponent(publicId)}`);
  },
  update(publicId, input) {
    return api.put(`/cards/${encodeURIComponent(publicId)}`, input, { csrfContext: 'access' });
  },
  publish(publicId) {
    return api.post(`/cards/${encodeURIComponent(publicId)}/publish`, null, { csrfContext: 'access' });
  },
  slugSuggestion({ fullName, mobilePhone }) {
    const params = new URLSearchParams({ fullName: fullName ?? '', mobilePhone: mobilePhone ?? '' });
    return api.get(`/cards/slug-suggestion?${params.toString()}`);
  },
  slugAvailability(slug) {
    const params = new URLSearchParams({ slug });
    return api.get(`/cards/slug-availability?${params.toString()}`);
  },
  updateSlug(publicId, slug) {
    return api.patch(`/cards/${encodeURIComponent(publicId)}/slug`, { slug }, { csrfContext: 'access' });
  },
  themes(publicId) {
    return api.get(`/cards/${encodeURIComponent(publicId)}/themes`);
  },
  updateTheme(publicId, themeCode) {
    return api.patch(`/cards/${encodeURIComponent(publicId)}/theme`, { themeCode }, { csrfContext: 'access' });
  },
};
