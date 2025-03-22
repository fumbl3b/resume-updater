// src/components/SubmitButton.js
import React from 'react';

const SubmitButton = ({ handleSubmit, disabled }) => {
  return (
    <div className="flex justify-center my-4">
      <button 
        onClick={handleSubmit}
        disabled={disabled}
        className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitButton;