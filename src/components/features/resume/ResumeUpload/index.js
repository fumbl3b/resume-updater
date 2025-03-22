// src/components/ResumeUpload.js
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const ResumeUpload = ({ resumeFile, setResumeFile }) => {
  const onDrop = useCallback((acceptedFiles) => {
    setResumeFile(acceptedFiles[0]);
  }, [setResumeFile]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div 
      {...getRootProps()} 
      className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center text-center cursor-pointer hover:border-primary transition-colors"
    >
      <input {...getInputProps()} />
      {resumeFile ? (
        <p>Selected file: {resumeFile.name}</p>
      ) : (
        <p>Drag 'n' drop a resume file here, or click to select one</p>
      )}
    </div>
  );
};

export default ResumeUpload;