// Stub service to prevent import errors  
export class AIAnalyticsService {
  trackSearch() {}
  trackQuery() {}
  getAnalytics() { return {}; }
}

export const aiAnalyticsService = new AIAnalyticsService();
export default aiAnalyticsService;
