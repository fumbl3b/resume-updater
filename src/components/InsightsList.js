import React from 'react';
import './InsightsList.css';

const InsightsList = ({ 
  keywords, 
  benefits, 
  onRemoveKeyword, 
  onRemoveBenefit 
}) => {
  return (
    <div className="insights-list">
      <h2>Job Insights</h2>
      <div className="insights-pills">
        {keywords.split(',').map((keyword, index) => (
          <div key={`keyword-${index}`} className="keyword-pill">
            {keyword.trim()}
            <button 
              className="remove-insight" 
              onClick={() => onRemoveKeyword(index)}
              aria-label={`Remove ${keyword.trim()}`}
            >
              ×
            </button>
          </div>
        ))}
        {benefits.split(',').map((benefit, index) => (
          <div key={`benefit-${index}`} className="benefit-pill">
            {benefit.trim()}
            <button 
              className="remove-insight" 
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

export default InsightsList;