import React, { useState } from 'react';

const Accordion = ({ title, children, isOpen = false }) => {
  const [expanded, setExpanded] = useState(isOpen);
  
  return (
    <div className="w-full mb-4 bg-white rounded-lg shadow">
      <button 
        className="w-full flex justify-between items-center p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl text-primary">{title}</h2>
        <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {expanded && (
        <div className="p-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;