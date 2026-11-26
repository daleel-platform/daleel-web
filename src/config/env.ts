export const env = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  wsBaseUrl:
    import.meta.env.VITE_WS_BASE_URL ||
    (import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/api(\/v\d+)?\/?$/, '')
      : 'http://localhost:3000'),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
