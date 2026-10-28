const ONBOARDING_DISMISSED_KEY_PREFIX = 'daleel_onboarding_dismissed_';

export function markOnboardingDismissed(userId?: string): void {
  if (typeof window === 'undefined' || !userId) return;
  localStorage.setItem(`${ONBOARDING_DISMISSED_KEY_PREFIX}${userId}`, 'true');
}

export function isOnboardingDismissed(userId?: string): boolean {
  if (typeof window === 'undefined' || !userId) return false;
  return (
    localStorage.getItem(`${ONBOARDING_DISMISSED_KEY_PREFIX}${userId}`) ===
    'true'
  );
}
