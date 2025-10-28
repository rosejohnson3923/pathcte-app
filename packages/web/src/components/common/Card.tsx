/**
 * Card Component
 * ==============
 * Reusable card container for content
 * Supports hover effects and variants
 */

import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = false, padding = 'md', children, className, ...props }, ref) => {
    const baseClasses = 'rounded-xl bg-bg-primary transition-all';

    const variantClasses = {
      default: 'shadow-md',
      elevated: 'shadow-lg',
      glass: 'backdrop-blur-lg bg-glass-bg-base shadow-md border border-glass-border',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverClasses = hoverable
      ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          hoverClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardRoot.displayName = 'Card';

// Card sub-components for better composition
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={clsx('mb-4', className)} {...props}>
    {children}
  </div>
);

CardHeader.displayName = 'CardHeader';

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={clsx('text-xl font-bold text-text-primary', className)} {...props}>
    {children}
  </h3>
);

CardTitle.displayName = 'CardTitle';

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={clsx('text-sm text-text-secondary', className)} {...props}>
    {children}
  </p>
);

CardDescription.displayName = 'CardDescription';

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={className} {...props}>
    {children}
  </div>
);

CardContent.displayName = 'CardContent';

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={clsx('mt-4 pt-4 border-t border-border-default', className)} {...props}>
    {children}
  </div>
);

CardFooter.displayName = 'CardFooter';

// Attach sub-components to Card and export
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
