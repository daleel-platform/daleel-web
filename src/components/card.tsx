import { cn } from '@/utils/cn';
import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl p-6 shadow-sm transition-colors',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
