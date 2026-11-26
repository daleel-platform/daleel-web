import { cn } from '@/utils/cn';

export interface DaleelLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'inverted';
  showTagline?: boolean;
}

export function DaleelLogo({
  className,
  size = 'md',
  variant = 'default',
  showTagline = false,
}: DaleelLogoProps) {
  const sizeMap = {
    sm: {
      mark: 'h-7 w-7',
      text: 'text-base',
      sub: 'text-[9px]',
      gap: 'gap-2',
    },
    md: {
      mark: 'h-8 w-8',
      text: 'text-lg',
      sub: 'text-[10px]',
      gap: 'gap-2.5',
    },
    lg: {
      mark: 'h-10 w-10',
      text: 'text-xl',
      sub: 'text-xs',
      gap: 'gap-3',
    },
  };

  const currentSize = sizeMap[size];
  const isInverted = variant === 'inverted';

  return (
    <div
      className={cn(
        'inline-flex items-center select-none',
        currentSize.gap,
        className,
      )}
    >
      {/* Faceted Compass Diamond Mark */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className={cn('shrink-0', currentSize.mark)}
      >
        <path
          d="M27.2 4.8L16.2 18.8L11.2 13.8L27.2 4.8Z"
          fill={isInverted ? '#FBBF24' : '#F59E0B'}
        />
        <path
          d="M4.8 27.2L15.8 13.2L20.8 18.2L4.8 27.2Z"
          fill={isInverted ? '#FFFFFF' : '#0F766E'}
        />
        <path
          d="M4.8 27.2L13.5 16L11.2 13.8L4.8 27.2Z"
          fill={isInverted ? '#CCFBF1' : '#0D9488'}
        />
        <circle
          cx="16"
          cy="16"
          r="2.2"
          fill={isInverted ? '#0F766E' : '#FFFFFF'}
        />
      </svg>

      <div className="flex flex-col leading-none">
        <span
          className={cn(
            'font-extrabold tracking-tight font-sans',
            isInverted ? 'text-white' : 'text-slate-900',
            currentSize.text,
          )}
        >
          Daleel
        </span>
        {showTagline && (
          <span
            className={cn(
              'font-medium tracking-wide mt-0.5',
              isInverted ? 'text-teal-100/80' : 'text-slate-500',
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
