import React from 'react';
import './DownloadLinks.css';

const DownloadLinks = ({ texContent, pdfContent }) => {
  if (!texContent && !pdfContent) return null;

  return (
    <div className="download-links">
      {texContent && (
        <a 
          href={`data:application/x-tex;base64,${texContent}`}
          download="resume.tex"
          className="download-button"
        >
          Download LaTeX
        </a>
      )}
      {pdfContent && (
        <a 
          href={`data:application/pdf;base64,${pdfContent}`}
          download="resume.pdf"
          className="download-button"
        >
          Download PDF
        </a>
      )}
    </div>
  );
};

export default DownloadLinks;