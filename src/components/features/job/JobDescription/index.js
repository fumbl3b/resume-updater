import React from 'react';
import './JobDescription.css';

const JobDescription = ({ value, onChange }) => {
  return (
    <div className="job-description">
      <label>Job Description:</label>
      <textarea
        className="editable-content"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        aria-label="Job Description Input"
      />
    </div>
  );
};

export default JobDescription;