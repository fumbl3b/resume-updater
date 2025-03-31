import React from 'react';

const LatexPreview = ({ content }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="bg-black/70 border border-[var(--glow-color)] rounded p-4 max-h-[400px] overflow-y-auto shadow-[0_0_15px_rgba(255,217,102,0.2)]">
      <div className="flex justify-end mb-2">
        <button 
          onClick={handleCopy} 
          className="bg-transparent text-[var(--secondary-glow)] border border-[var(--secondary-glow)] rounded px-2 py-1 text-xs cursor-pointer hover:bg-[var(--secondary-glow)]/10"
          style={{ textShadow: '0 0 3px rgba(255, 107, 53, 0.3)', boxShadow: '0 0 5px rgba(255, 107, 53, 0.2)' }}
        >
          Copy LaTeX
        </button>
      </div>
      <pre className="font-mono whitespace-pre-wrap text-xs leading-relaxed text-[var(--glow-color)]" style={{ fontFamily: "'Space Mono', monospace" }}>
        {content}
      </pre>
    </div>
  );
};

export default LatexPreview;