import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'offline';
}

const sizeStyles = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg font-bold',
};

const statusSizeStyles = {
  xs: 'h-1.5 w-1.5 ring-1',
  sm: 'h-2 w-2 ring-1.5',
  md: 'h-2.5 w-2.5 ring-2',
  lg: 'h-3 w-3 ring-2',
  xl: 'h-3.5 w-3.5 ring-2',
};

const statusColors = {
  online: 'bg-emerald-500',
  busy: 'bg-amber-500',
  offline: 'bg-slate-400',
};

function getInitials(name?: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function Avatar({
  name,
  src,
  size = 'md',
  status,
  className,
  ...props
}: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn('relative inline-flex shrink-0 select-none', className)}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={cn(
            'rounded-full object-cover border border-slate-200/80 shadow-xs',
            sizeStyles[size],
          )}
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-gradient-to-tr from-teal-700 to-teal-600 font-semibold text-white shadow-xs',
            sizeStyles[size],
          )}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white',
            statusSizeStyles[size],
            statusColors[status],
          )}
          aria-label={status}
        />
      )}
    </div>
  );
}
