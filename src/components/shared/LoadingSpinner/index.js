import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="w-10 h-10 border-4 border-primary-light border-t-primary rounded-full animate-spin" />
  </div>
);

export default LoadingSpinner;