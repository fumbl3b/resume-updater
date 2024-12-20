import React from 'react';
import './ResumeText.css';

const ResumeText = ({ text }) => {
  if (!text) return null;
  
  return (
    <div className="resume-text">
      <h3>Resume Content</h3>
      <div className="text-content">
        {text}
      </div>
    </div>
  );
};

export default ResumeText;