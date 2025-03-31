import React from 'react';

const ResumeText = ({ text }) => {
  if (!text) return null;
  
  return (
    <div className="resume-text">
      <pre className="whitespace-pre-wrap font-mono text-[var(--glow-color)]/90 leading-relaxed" style={{ fontFamily: "'Space Mono', monospace" }}>
        {text}
      </pre>
    </div>
  );
};

export default ResumeText;