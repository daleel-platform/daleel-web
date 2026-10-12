import { Link } from 'react-router';
import { Compass, Home } from 'lucide-react';

import { Button } from '@/components/button';
import { DaleelLogo } from '@/components/logo';
import { ROUTES } from '@/routes/paths';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-center">
      <div className="mb-6">
        <DaleelLogo size="lg" />
      </div>

      <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-teal-50 border border-teal-200/80 text-teal-700 shadow-sm">
        <Compass className="h-12 w-12 animate-pulse text-teal-700" />
      </div>

      <div className="mt-6">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
          Error 404
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Lost your compass?
        </h1>
        <p className="mt-3 max-w-md text-sm text-slate-500 leading-relaxed mx-auto">
          The page or destination you are looking for doesn't exist, has been
          moved, or the link was broken.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to={ROUTES.HOME}>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Home className="h-4 w-4" />}
          >
            Back to Home
          </Button>
        </Link>
        <Link to={ROUTES.MENTORS}>
          <Button
            variant="outline"
            size="md"
            leftIcon={<Compass className="h-4 w-4" />}
          >
            Explore Mentors
          </Button>
        </Link>
      </div>
    </div>
  );
}
