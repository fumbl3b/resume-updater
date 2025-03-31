import React from 'react';

const InsightsList = ({ 
  keywords, 
  benefits, 
  onRemoveKeyword, 
  onRemoveBenefit 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[var(--glow-color)]" style={{ textShadow: '0 0 5px var(--glow-color)' }}>Job Insights</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.split(',').map((keyword, index) => (
          <div 
            key={`keyword-${index}`} 
            className="flex items-center bg-black/60 text-[var(--glow-color)] px-3 py-1 rounded-full text-sm border border-[var(--glow-color)] shadow-[0_0_5px_rgba(255,217,102,0.3)]"
          >
            {keyword.trim()}
            <button 
              className="ml-2 hover:text-[var(--secondary-glow)] transition-colors"
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
            className="flex items-center bg-black/60 text-[var(--accent-glow)] px-3 py-1 rounded-full text-sm border border-[var(--accent-glow)] shadow-[0_0_5px_rgba(164,208,109,0.3)]"
          >
            {benefit.trim()}
            <button 
              className="ml-2 hover:text-[var(--secondary-glow)] transition-colors"
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