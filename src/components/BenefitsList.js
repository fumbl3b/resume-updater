import React from 'react';
import './BenefitsList.css';

const BenefitsList = ({ benefits, onRemoveBenefit }) => {
  return (
    <div className="benefits-list">
      <h2>Benefits</h2>
      <div className="benefit-pills">
        {benefits.split(',').map((benefit, index) => (
          <div key={index} className="benefit-pill">
            {benefit.trim()}
            <button 
              className="remove-benefit" 
              onClick={() => onRemoveBenefit(index)}
              aria-label={`Remove ${benefit.trim()}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsList;