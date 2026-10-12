import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900 shadow-xs shadow-teal-900/10 focus-visible:ring-teal-700 border border-teal-800/20',
  secondary:
    'bg-slate-100 text-slate-800 hover:bg-slate-200/80 active:bg-slate-300 border border-slate-200/80 focus-visible:ring-slate-400',
  outline:
    'bg-white text-slate-700 border border-slate-300 hover:border-teal-600 hover:text-teal-800 hover:bg-teal-50/40 active:bg-teal-50 focus-visible:ring-teal-700 shadow-2xs',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200/70 border border-transparent focus-visible:ring-slate-400',
  accent:
    'bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 active:bg-amber-700 shadow-xs shadow-amber-900/10 focus-visible:ring-amber-500 border border-amber-600/30',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-xs shadow-red-900/10 focus-visible:ring-red-600 border border-red-700/30',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  xs: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-6 py-2.5 text-base font-semibold rounded-xl gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        'inline-flex items-center justify-center align-middle transition-all duration-150 select-none cursor-pointer',
        'active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!loading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
