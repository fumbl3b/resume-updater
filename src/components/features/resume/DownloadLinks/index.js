import React from 'react';

const DownloadLinks = ({ texContent, pdfContent }) => {
  if (!texContent && !pdfContent) return null;

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {texContent && (
        <a 
          href={`data:application/x-tex;base64,${texContent}`}
          download="resume.tex"
          className="flex items-center px-6 py-3 bg-black/60 text-[var(--glow-color)] hover:bg-black/40 rounded-full border border-[var(--glow-color)] shadow-[0_0_10px_rgba(255,217,102,0.3)] hover:shadow-[0_0_15px_rgba(255,217,102,0.5)] download-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download LaTeX (.tex)
        </a>
      )}
      {pdfContent && (
        <a 
          href={`data:application/pdf;base64,${pdfContent}`}
          download="resume.pdf"
          className="flex items-center px-6 py-3 bg-[var(--secondary-glow)]/80 text-black hover:bg-[var(--secondary-glow)] rounded-full border border-[var(--secondary-glow)] shadow-[0_0_10px_rgba(255,107,53,0.4)] hover:shadow-[0_0_15px_rgba(255,107,53,0.6)] download-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download PDF
        </a>
      )}
    </div>
  );
};

export default DownloadLinks;