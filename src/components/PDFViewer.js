import React from 'react';
import './PDFViewer.css';

const PDFViewer = ({ pdfUrl }) => {
  if (!pdfUrl) return null;

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <a 
          href={pdfUrl} 
          download="optimized-resume.pdf"
          className="download-button"
        >
          Download PDF
        </a>
      </div>
      <object
        data={pdfUrl}
        type="application/pdf"
        className="pdf-frame"
      >
        <p>Unable to display PDF. <a href={pdfUrl}>Download</a> instead.</p>
      </object>
    </div>
  );
};

export default PDFViewer;