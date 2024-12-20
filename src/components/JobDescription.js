import React, { useRef, useEffect } from 'react';
import './JobDescription.css';

const JobDescription = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerText = value;
    }
  }, [value]);

  const handleInput = (e) => {
    const text = e.target.innerText;
    onChange(text);
  };

  return (
    <div className="job-description">
      <label>Job Description:</label>
      <div
        ref={editorRef}
        className="editable-content"
        contentEditable
        onInput={handleInput}
        data-placeholder="Paste the job description here..."
        role="textbox"
        aria-multiline="true"
      />
    </div>
  );
};

export default JobDescription;