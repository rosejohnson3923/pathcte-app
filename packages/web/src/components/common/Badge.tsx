/**
 * Badge Component
 * ===============
 * Small status indicator or label
 * Supports rarity colors and variants
 */

import React from 'react';
import clsx from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  rarity,
  size = 'md',
  children,
  className,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  // Rarity colors take precedence
  const rarityClasses = {
    common: 'bg-gray-100 text-gray-800',
    uncommon: 'bg-green-100 text-green-800',
    rare: 'bg-blue-100 text-blue-800',
    epic: 'bg-purple-100 text-purple-800',
    legendary: 'bg-amber-100 text-amber-800',
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    outline: 'bg-transparent border border-gray-300 text-gray-700',
  };

  const colorClasses = rarity ? rarityClasses[rarity] : variantClasses[variant];

  return (
    <span className={clsx(baseClasses, sizeClasses[size], colorClasses, className)} {...props}>
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
