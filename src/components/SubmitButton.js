// src/components/SubmitButton.js
import React from 'react';

const SubmitButton = ({ handleSubmit, disabled }) => {
  return (
    <div className="flex justify-center my-4">
      <button 
        onClick={handleSubmit}
        disabled={disabled}
        className="px-6 py-2 bg-transparent text-[var(--secondary-glow)] border border-[var(--secondary-glow)] rounded-full hover:bg-[var(--secondary-glow)]/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ textShadow: '0 0 5px var(--secondary-glow)', boxShadow: '0 0 10px rgba(255, 107, 53, 0.3)' }}
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitButton;