export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  MENTORS: '/mentors',
  MENTOR_DETAILS: (id: string) => `/mentors/${id}`,
  SESSIONS: '/sessions',
  MESSAGES: '/messages',
  PROFILE: '/profile',
  NOT_FOUND: '*',
} as const;
