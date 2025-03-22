import React from 'react';

const ResumeText = ({ text }) => (
  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg min-h-[200px] max-h-[300px] overflow-y-auto">
    {text}
  </pre>
);

export default ResumeText;