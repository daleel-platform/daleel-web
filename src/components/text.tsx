import { cn } from '@/utils/cn';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'muted';
  children: ReactNode;
}

const variantStyles: Record<NonNullable<TextProps['variant']>, string> = {
  h1: 'text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white',
  h2: 'text-xl font-bold text-slate-800 dark:text-slate-100',
  h3: 'text-lg font-semibold text-slate-800 dark:text-slate-100',
  body: 'text-sm text-slate-700 dark:text-slate-300',
  caption: 'text-xs text-slate-500 dark:text-slate-400',
  muted: 'text-xs text-muted',
};

export function Text({
  as: Component = 'p',
  variant = 'body',
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
