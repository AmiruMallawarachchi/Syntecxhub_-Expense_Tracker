export const BASE_URL = "http://localhost:5000/api";

export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/signup`,
    ME: `${BASE_URL}/auth/me`,
    UPLOAD_PROFILE: `${BASE_URL}/auth/profile-image`
  },
  INCOME: {
    ADD: `${BASE_URL}/income`,
    LIST: `${BASE_URL}/income`,
    DELETE: (id) => `${BASE_URL}/income/${id}`,
    DOWNLOAD: `${BASE_URL}/income/download`
  },
  EXPENSE: {
    ADD: `${BASE_URL}/expense`,
    LIST: `${BASE_URL}/expense`,
    DELETE: (id) => `${BASE_URL}/expense/${id}`,
    DOWNLOAD: `${BASE_URL}/expense/download`
  },
  DASHBOARD: {
    SUMMARY: `${BASE_URL}/dashboard`
  }
};
