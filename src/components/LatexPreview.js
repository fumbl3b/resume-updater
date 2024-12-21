import React from 'react';
import './LatexPreview.css';

const LatexPreview = ({ content }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="latex-preview">
      <div className="latex-controls">
        <button onClick={handleCopy} className="copy-button">
          Copy LaTeX
        </button>
      </div>
      <pre className="latex-content">
        {content}
      </pre>
    </div>
  );
};

export default LatexPreview;