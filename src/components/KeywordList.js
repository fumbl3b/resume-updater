import React from 'react';
import './KeywordList.css';

const KeywordList = ({ keywords, onRemoveKeyword }) => {
  return (
    <div className="keyword-list">
      <h2>Key Words</h2>
      <div className="keyword-pills">
        {keywords.split(',').map((keyword, index) => (
          <div key={index} className="keyword-pill">
            {keyword.trim()}
            <button 
              className="remove-keyword" 
              onClick={() => onRemoveKeyword(index)}
              aria-label={`Remove ${keyword.trim()}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordList;