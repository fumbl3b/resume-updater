import React from 'react';

const InsightsList = ({ 
  keywords, 
  benefits, 
  onRemoveKeyword, 
  onRemoveBenefit 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Job Insights</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.split(',').map((keyword, index) => (
          <div 
            key={`keyword-${index}`} 
            className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
          >
            {keyword.trim()}
            <button 
              className="ml-2 hover:text-primary-dark transition-colors"
              onClick={() => onRemoveKeyword(index)}
              aria-label={`Remove ${keyword.trim()}`}
            >
              ×
            </button>
          </div>
        ))}
        {benefits.split(',').map((benefit, index) => (
          <div 
            key={`benefit-${index}`} 
            className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
          >
            {benefit.trim()}
            <button 
              className="ml-2 hover:text-green-900 transition-colors"
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