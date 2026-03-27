import React from "react";
import { AlertTriangle, Info } from "lucide-react";

const variantStyles = {
  default: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
  destructive: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
};

const iconMap = {
  default: <Info className="w-5 h-5" />,
  destructive: <AlertTriangle className="w-5 h-5" />,
};

export const Alert = ({ variant = "default", className = "", children }) => {
  const styles = variantStyles[variant] || variantStyles.default;
  const icon = iconMap[variant] || iconMap.default;

  return (
    <div
      className={`flex items-start gap-3 border rounded-lg p-4 text-sm ${styles} ${className}`}
    >
      <div className="mt-1">{icon}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export const AlertDescription = ({ className = "", children }) => (
  <p className={`leading-relaxed ${className}`}>{children}</p>
);
