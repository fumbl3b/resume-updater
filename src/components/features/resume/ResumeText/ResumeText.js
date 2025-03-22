import React from 'react';

const ResumeText = ({ text }) => {
  if (!text) return null;
  
  return (
    <div className="resume-text">
      <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
        {text}
      </pre>
    </div>
  );
};

export default ResumeText;