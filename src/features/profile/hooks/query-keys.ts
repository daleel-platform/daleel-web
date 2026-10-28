export const profileQueryKeys = {
  all: ['profile'] as const,
  userProfile: () => [...profileQueryKeys.all, 'user-profile'] as const,
};
