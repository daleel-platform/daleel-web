import { cn } from '@/utils/cn';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'body-sm' | 'caption' | 'muted';
  children: ReactNode;
}

const variantStyles: Record<NonNullable<TextProps['variant']>, string> = {
  h1: 'text-3xl font-extrabold tracking-tight text-slate-900',
  h2: 'text-xl font-bold text-slate-800',
  h3: 'text-lg font-semibold text-slate-800',
  body: 'text-sm text-slate-700',
  'body-sm': 'text-xs text-slate-600',
  caption: 'text-xs text-slate-500',
  muted: 'text-xs text-muted',
};

const defaultTags: Record<NonNullable<TextProps['variant']>, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  muted: 'span',
};

export function Text({
  as,
  variant = 'body',
  className,
  children,
  ...props
}: TextProps) {
  const Component = as ?? defaultTags[variant];
  return (
    <Component className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
