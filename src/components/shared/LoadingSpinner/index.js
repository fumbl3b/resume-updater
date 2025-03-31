import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div 
      className="w-10 h-10 border-4 rounded-full animate-spin" 
      style={{ 
        borderColor: 'rgba(255, 217, 102, 0.3)',
        borderTopColor: 'var(--glow-color, #FFD966)',
        boxShadow: '0 0 15px rgba(255, 217, 102, 0.5)'
      }} 
    />
  </div>
);

export default LoadingSpinner;