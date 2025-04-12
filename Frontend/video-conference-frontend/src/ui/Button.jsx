import React from 'react';
import clsx from 'clsx';

const Button = ({
  children,
  className = '',
  variant = 'solid',
  size = 'base',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-2xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    solid:
      'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-blue-500',
    outline:
      'border border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900 focus:ring-blue-400',
    ghost:
      'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 focus:ring-blue-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    base: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
