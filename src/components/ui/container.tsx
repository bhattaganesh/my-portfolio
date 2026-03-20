import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({
  children,
  className,
  as: Component = 'div',
  ...props
}: ContainerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const El = Component as React.FC<any>;
  return (
    <El
      className={cn('mx-auto max-w-6xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </El>
  );
}

export default Container;
