import { api } from './api-client.js';

export const contentService = {
  listSocial(cardId) {
    return api.get(`/cards/${encodeURIComponent(cardId)}/social-links`);
  },
  createSocial(cardId, input) {
    return api.post(`/cards/${encodeURIComponent(cardId)}/social-links`, input, { csrfContext: 'access' });
  },
  deleteSocial(cardId, linkId) {
    return api.delete(`/cards/${encodeURIComponent(cardId)}/social-links/${encodeURIComponent(linkId)}`, { csrfContext: 'access' });
  },
  listCatalog(cardId) {
    return api.get(`/cards/${encodeURIComponent(cardId)}/catalog-items`);
  },
  createCatalog(cardId, input) {
    return api.post(`/cards/${encodeURIComponent(cardId)}/catalog-items`, input, { csrfContext: 'access' });
  },
  deleteCatalog(cardId, itemId) {
    return api.delete(`/cards/${encodeURIComponent(cardId)}/catalog-items/${encodeURIComponent(itemId)}`, { csrfContext: 'access' });
  },
};
