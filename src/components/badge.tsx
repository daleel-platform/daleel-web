import { cn } from '@/utils/cn';
import type { HTMLAttributes, ReactNode } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'success'
    | 'warning'
    | 'accent';
  size?: 'sm' | 'md';
  children: ReactNode;
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-slate-100 text-slate-700 border-slate-200/60',
  primary: 'bg-teal-50 text-teal-700 border-teal-200/80',
  secondary: 'bg-slate-800 text-white border-transparent',
  outline: 'bg-transparent text-slate-700 border-slate-300',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
  accent: 'bg-amber-100/70 text-amber-900 border-amber-300/80',
};

const sizeStyles: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-[11px] font-medium rounded-md',
  md: 'px-2.5 py-1 text-xs font-semibold rounded-lg',
};

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border leading-none transition-colors select-none',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
