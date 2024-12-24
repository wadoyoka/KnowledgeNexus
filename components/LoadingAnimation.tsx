import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 animate-pulse">
      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
    </div>
  );
};

export default LoadingAnimation;

