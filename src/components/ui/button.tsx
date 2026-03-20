import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends BaseButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  href?: undefined;
}

interface ButtonAsLink
  extends BaseButtonProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-primary-600 text-white shadow-sm',
    'hover:bg-primary-700 hover:shadow-md',
    'active:bg-primary-800 active:scale-[0.98]',
    'dark:bg-primary-500 dark:hover:bg-primary-600',
    'focus-visible:ring-primary-500',
  ].join(' '),

  outline: [
    'border-2 border-primary-600 text-primary-600 bg-transparent',
    'hover:bg-primary-50 hover:border-primary-700',
    'active:bg-primary-100 active:scale-[0.98]',
    'dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-950 dark:hover:border-primary-300',
    'focus-visible:ring-primary-500',
  ].join(' '),

  ghost: [
    'text-surface-600 bg-transparent',
    'hover:bg-surface-100 hover:text-surface-900',
    'active:bg-surface-200 active:scale-[0.98]',
    'dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100',
    'focus-visible:ring-surface-500',
  ].join(' '),

  danger: [
    'bg-red-600 text-white shadow-sm',
    'hover:bg-red-700 hover:shadow-md',
    'active:bg-red-800 active:scale-[0.98]',
    'dark:bg-red-500 dark:hover:bg-red-600',
    'focus-visible:ring-red-500',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 py-1.5 text-xs gap-1.5 rounded-md',
  md: 'h-10 px-5 py-2.5 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-7 py-3 text-base gap-2.5 rounded-lg',
};

const baseClasses = [
  'inline-flex items-center justify-center font-medium',
  'transition-all duration-200 ease-in-out',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-950',
  'disabled:opacity-50 disabled:pointer-events-none disabled:select-none',
  'select-none',
].join(' ');

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    loading = false,
    className,
    children,
  } = props;

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading && 'cursor-wait',
    className,
  );

  const content = (
    <>
      {loading && (
        <Loader2
          className="animate-spin shrink-0"
          size={size === 'sm' ? 12 : size === 'lg' ? 18 : 15}
          aria-hidden="true"
        />
      )}
      {children}
    </>
  );

  if (props.href !== undefined) {
    const { href, external, variant: _v, size: _s, loading: _l, children: _c, className: _cl, ...rest } = props as ButtonAsLink;

    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </Link>
    );
  }

  const { variant: _v, size: _s, loading: _l, children: _c, className: _cl, ...rest } = props as ButtonAsButton;

  return (
    <button
      className={classes}
      disabled={loading || (rest as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

export default Button;
