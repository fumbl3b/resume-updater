import React from 'react';

const PDFViewer = ({ pdfUrl }) => {
  if (!pdfUrl) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end">
        <a 
          href={pdfUrl} 
          download="optimized-resume.pdf"
          className="px-4 py-2 bg-[var(--secondary-glow)]/80 text-black rounded-full hover:bg-[var(--secondary-glow)] border border-[var(--secondary-glow)] shadow-[0_0_10px_rgba(255,107,53,0.4)] hover:shadow-[0_0_15px_rgba(255,107,53,0.6)] transition-all duration-200 text-sm"
        >
          Download PDF
        </a>
      </div>
      <object
        data={pdfUrl}
        type="application/pdf"
        className="w-full h-[800px] border border-[var(--glow-color)] rounded-lg shadow-[0_0_15px_rgba(255,217,102,0.3)]"
      >
        <p className="p-4 text-center text-[var(--glow-color)]/80">
          Unable to display PDF. 
          <a href={pdfUrl} className="text-[var(--secondary-glow)] hover:text-[var(--secondary-glow)]/80 ml-1 font-bold" style={{ textShadow: '0 0 5px rgba(255, 107, 53, 0.5)' }}>
            Download
          </a> 
          instead.
        </p>
      </object>
    </div>
  );
};

export default PDFViewer;