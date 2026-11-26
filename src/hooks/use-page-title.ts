import { useEffect } from 'react';

const APP_NAME = 'Daleel';
const DEFAULT_TITLE = 'Daleel — Career Mentorship & Guidance';

export function usePageTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} — ${APP_NAME}` : DEFAULT_TITLE;

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
}
