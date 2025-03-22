import React, { useState } from 'react';

const SuggestionItem = ({ 
  suggestion, 
  index,
  isSelected,
  onToggle,
  comment,
  onCommentChange
}) => {
  const [showComment, setShowComment] = useState(false);
  
  return (
    <div className={`p-4 mb-3 rounded-lg border transition-colors suggestion-item ${
      isSelected ? 'bg-green-50 border-green-300 selected' : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-gray-800">{suggestion}</p>
          
          {showComment && (
            <div className="mt-3 pt-2 border-t border-gray-200">
              <textarea
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Add specific instructions for this suggestion..."
                value={comment}
                onChange={(e) => onCommentChange(index, e.target.value)}
                rows={2}
              />
            </div>
          )}
          
          <button
            className="mt-2 text-xs text-primary hover:text-primary-dark underline flex items-center"
            onClick={() => setShowComment(!showComment)}
          >
            {showComment ? 'Hide Comment' : comment ? 'Edit Comment' : 'Add Comment'}
            {comment && !showComment && (
              <span className="ml-1 text-green-500 text-xs">•</span>
            )}
          </button>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors selection-button ${
              isSelected 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => onToggle(index, true)}
            aria-label="Accept suggestion"
          >
            Yes
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors selection-button ${
              !isSelected 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => onToggle(index, false)}
            aria-label="Reject suggestion"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionItem;