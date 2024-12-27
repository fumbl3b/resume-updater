import React, { useState } from 'react';
import './Accordion.css';

const Accordion = ({ title, children, isOpen = false }) => {
  const [expanded, setExpanded] = useState(isOpen);

  return (
    <div className="accordion">
      <button 
        className="accordion-header"
        onClick={() => setExpanded(!expanded)}
      >
        <h2>{title}</h2>
        <span className={`arrow ${expanded ? 'expanded' : ''}`}>▼</span>
      </button>
      {expanded && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default Accordion;