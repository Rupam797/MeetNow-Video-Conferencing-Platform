import React from "react";

const Card = ({ className = "", children }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const CardTitle = ({ className = "", children }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
);

export const CardDescription = ({ className = "", children }) => (
  <p className={`text-gray-600 dark:text-gray-400 text-sm ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

export const CardFooter = ({ children }) => (
  <div className="mt-6">{children}</div>
);

export default Card;
