import React from 'react';

const LoadingSpinner = ({ message = 'Memuat...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const borderSize = {
    sm: 'border-2',
    md: 'border-4',
    lg: 'border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} ${borderSize[size]} border-t-blue-600 border-r-blue-600 border-b-blue-300 border-l-blue-300 rounded-full animate-spin`}
      ></div>
      {message && (
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;