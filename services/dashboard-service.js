import { api } from './api-client.js';

export const dashboardService = {
  async loadOverview() {
    const [cards, subscription] = await Promise.all([
      api.get('/cards'),
      api.get('/subscriptions/current').catch((error) => {
        if (error.status === 404) return null;
        throw error;
      }),
    ]);
    return { cards: Array.isArray(cards) ? cards : [], subscription };
  },
};
