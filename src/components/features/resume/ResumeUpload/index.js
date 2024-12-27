// src/components/ResumeUpload.js
import React from 'react';
import { useDropzone } from 'react-dropzone';
import './ResumeUpload.css';

const ResumeUpload = ({ resumeFile, setResumeFile }) => {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    setResumeFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf, .doc, .docx, .tex',
    multiple: false,
  });

  return (
    <div className="resume-upload">
      <label>Upload Your Resume:</label>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the resume here...</p>
        ) : (
          <p>Drag & drop your resume here, or click to select a file</p>
        )}
      </div>
      {resumeFile && (
        <div className="file-info">
          <strong>Selected File:</strong> {resumeFile.name}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;