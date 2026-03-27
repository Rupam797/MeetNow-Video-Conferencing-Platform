import React from "react";
import clsx from "clsx";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={clsx("px-6 py-4 border-b border-gray-200 dark:border-gray-700", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={clsx("text-lg font-semibold text-gray-900 dark:text-white", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }) {
  return (
    <p className={clsx("text-sm text-gray-500 dark:text-gray-400", className)}>{children}</p>
  );
}

export function CardContent({ className, children }) {
  return <div className={clsx("px-6 py-4", className)}>{children}</div>;
}
