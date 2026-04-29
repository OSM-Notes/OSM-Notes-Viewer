// API Configuration
// Update this with your actual API endpoint

import { getUserPath } from '../js/utils/userPaths.js';

// Determine base URL based on environment variables
// Set VITE_USE_LOCAL_DATA=true to use local /data directory (same origin)
// Set VITE_DATA_BASE_URL to override the remote data host (no trailing slash)
const useLocalData = import.meta.env.VITE_USE_LOCAL_DATA === 'true';
const envDataBase = import.meta.env.VITE_DATA_BASE_URL;
const isDev = import.meta.env.DEV;

/** Canonical OSM-Notes-Data static JSON root (GitHub Pages). */
const DEFAULT_REMOTE_DATA_BASE = 'https://osm-notes.github.io/OSM-Notes-Data/data';

let baseUrl;
if (useLocalData) {
  baseUrl = '/data';
} else if (envDataBase && String(envDataBase).trim() !== '') {
  baseUrl = String(envDataBase).replace(/\/$/, '');
} else {
  // notes.osm.lat/data often 404s (custom domain not mirroring GitHub Pages data).
  // See: curl -I https://notes.osm.lat/data/metadata.json vs osm-notes.github.io/.../data/metadata.json
  baseUrl = DEFAULT_REMOTE_DATA_BASE;
}

// Debug log (only in development)
if (isDev) {
  console.log('API Config:', { useLocalData, isDev, baseUrl });
}

export const API_CONFIG = {
  BASE_URL: baseUrl,

  // Cache settings
  CACHE_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds

  // Endpoints
  ENDPOINTS: {
    metadata: '/metadata.json',
    userIndex: '/indexes/users.json',
    countryIndex: '/indexes/countries.json',
    globalStats: '/global_stats.json',
    user: (userId) => getUserPath(userId),
    country: (countryId) => `/countries/${countryId}.json`,
    // Note: Notes endpoint is handled via REST API (OSM-Notes-API), not static JSON
  },

  // Feature flags
  FEATURES: {
    enableCache: true,
    enableOfflineMode: false,
    showDebugInfo: false,
  },
};

// Helper to get full URL
export function getApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Export for convenience
export default API_CONFIG;
