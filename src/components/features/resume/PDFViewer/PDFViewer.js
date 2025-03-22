import React from 'react';

const PDFViewer = ({ pdfUrl }) => {
  if (!pdfUrl) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end">
        <a 
          href={pdfUrl} 
          download="optimized-resume.pdf"
          className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-200 text-sm"
        >
          Download PDF
        </a>
      </div>
      <object
        data={pdfUrl}
        type="application/pdf"
        className="w-full h-[800px] border border-gray-200 rounded-lg"
      >
        <p className="p-4 text-center text-gray-600">
          Unable to display PDF. 
          <a href={pdfUrl} className="text-primary hover:text-primary-dark ml-1">
            Download
          </a> 
          instead.
        </p>
      </object>
    </div>
  );
};

export default PDFViewer;