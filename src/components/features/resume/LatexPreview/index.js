const LatexPreview = ({ content }) => (
  <div className="space-y-4">
    <div className="flex justify-end">
      <button 
        onClick={() => navigator.clipboard.writeText(content)}
        className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
      >
        Copy LaTeX
      </button>
    </div>
    <pre className="font-mono bg-gray-50 p-4 rounded-lg whitespace-pre-wrap overflow-x-auto">
      {content}
    </pre>
  </div>
);

export default LatexPreview