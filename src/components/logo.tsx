import { cn } from '@/utils/cn';

export interface DaleelLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function DaleelLogo({
  className,
  size = 'md',
  showTagline = false,
}: DaleelLogoProps) {
  const sizeMap = {
    sm: {
      mark: 'h-7 w-7',
      text: 'text-lg',
      sub: 'text-[9px]',
    },
    md: {
      mark: 'h-9 w-9',
      text: 'text-xl',
      sub: 'text-[10px]',
    },
    lg: {
      mark: 'h-11 w-11',
      text: 'text-2xl',
      sub: 'text-xs',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className={cn('inline-flex items-center gap-2.5 select-none', className)}
    >
      {/* Guiding Compass Mark */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-sm ring-1 ring-teal-900/10 transition-transform hover:scale-105',
          currentSize.mark,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3/5 w-3/5"
        >
          {/* Compass outer ring */}
          <circle
            cx="12"
            cy="12"
            r="9"
            className="opacity-40"
            strokeWidth="1.5"
          />
          {/* North needle in amber */}
          <polygon
            points="12 4 15 12 12 10 9 12"
            fill="#F59E0B"
            stroke="#F59E0B"
            strokeWidth="1"
          />
          {/* South needle in white */}
          <polygon
            points="12 20 15 12 12 14 9 12"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            className="opacity-70"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              'font-extrabold tracking-tight text-slate-900 font-sans',
              currentSize.text,
            )}
          >
            Daleel
          </span>
          <span className="text-[11px] font-semibold text-teal-700 tracking-wide">
            دليل
          </span>
        </div>
        {showTagline && (
          <span
            className={cn(
              'font-medium text-slate-500 tracking-wide mt-0.5',
              currentSize.sub,
            )}
          >
            Career Mentorship Compass
          </span>
        )}
      </div>
    </div>
  );
}
