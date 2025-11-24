// Centralized API Endpoints
// Use these constants throughout the app to maintain consistency.

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },
  BUNDLES: {
    LIST: "/bundles",
    DETAILS: (id) => `/bundles/${id}`,
  },
  ORDERS: {
    CREATE: "/orders",
    LIST: "/orders",
    FULFILL: (id) => `/orders/${id}/fulfill`,
  },
  RESELLERS: {
    STATS: "/resellers/stats",
  },
}
