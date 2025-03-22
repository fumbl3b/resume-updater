import React from 'react';
import './JobDescription.css';

const JobDescription = ({ value, onChange }) => (
  <div className="flex flex-col gap-4">
    <label>Job Description:</label>
    <textarea
      className="min-h-[200px] max-h-[300px] w-full p-4 border border-gray-200 rounded-lg outline-none bg-white resize-y"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste the job description here..."
    />
  </div>
);

export default JobDescription;