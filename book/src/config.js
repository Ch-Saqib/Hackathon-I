// Physical AI Textbook - Frontend Configuration

// API Base URL
// Uses environment variable when available (during build/SSR), defaults to localhost for browser runtime
const envApiBaseUrl =
  typeof process !== "undefined" &&
  process.env &&
  process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : null;

export const API_BASE_URL = envApiBaseUrl || "https://hackathon-i.onrender.com";

// API Endpoints
export const API_ENDPOINTS = {
  // Health check
  health: `${API_BASE_URL}/health`,

  // Authentication endpoints
  signup: `${API_BASE_URL}/api/auth/signup`,
  login: `${API_BASE_URL}/api/auth/login`,
  logout: `${API_BASE_URL}/api/auth/logout`,

  // User profile endpoints
  profile: `${API_BASE_URL}/api/user/profile`,

  // Chat endpoints
  chat: `${API_BASE_URL}/api/chat`,
  chatHistory: `${API_BASE_URL}/api/chat/history`,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
