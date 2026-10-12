import { cn } from '@/utils/cn';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?:
    | 'display'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'body'
    | 'body-sm'
    | 'caption'
    | 'muted';
  children: ReactNode;
}

const variantStyles: Record<NonNullable<TextProps['variant']>, string> = {
  display:
    'text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]',
  h1: 'text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight',
  h2: 'text-2xl font-bold tracking-tight text-slate-900 leading-snug',
  h3: 'text-lg font-bold text-slate-800 leading-snug',
  h4: 'text-base font-semibold text-slate-800 leading-normal',
  body: 'text-sm text-slate-700 leading-relaxed',
  'body-sm': 'text-xs text-slate-600 leading-normal',
  caption: 'text-xs font-medium text-slate-500 uppercase tracking-wider',
  muted: 'text-xs text-slate-500 leading-normal',
};

const defaultTags: Record<NonNullable<TextProps['variant']>, ElementType> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
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
