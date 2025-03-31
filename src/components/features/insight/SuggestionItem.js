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
      isSelected ? 'bg-black/60 border-[var(--accent-glow)] selected shadow-[0_0_10px_rgba(164,208,109,0.3)]' : 'bg-black/40 border-[var(--glow-color)]/30'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-[var(--glow-color)]">{suggestion}</p>
          
          {showComment && (
            <div className="mt-3 pt-2 border-t border-[var(--glow-color)]/30">
              <textarea
                className="w-full p-2 text-sm bg-black/70 text-[var(--glow-color)] border border-[var(--glow-color)] rounded focus:ring-1 focus:ring-[var(--glow-color)] focus:border-[var(--glow-color)] shadow-[0_0_5px_rgba(255,217,102,0.2)]"
                placeholder="Add specific instructions for this suggestion..."
                value={comment}
                onChange={(e) => onCommentChange(index, e.target.value)}
                rows={2}
              />
            </div>
          )}
          
          <button
            className="mt-2 text-xs text-[var(--secondary-glow)] hover:text-[var(--secondary-glow)]/80 underline flex items-center"
            onClick={() => setShowComment(!showComment)}
            style={{ textShadow: '0 0 3px rgba(255, 107, 53, 0.3)' }}
          >
            {showComment ? 'Hide Comment' : comment ? 'Edit Comment' : 'Add Comment'}
            {comment && !showComment && (
              <span className="ml-1 text-[var(--accent-glow)] text-xs">•</span>
            )}
          </button>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors selection-button ${
              isSelected 
                ? 'bg-[var(--accent-glow)] text-black border border-[var(--accent-glow)] shadow-[0_0_5px_rgba(164,208,109,0.5)]' 
                : 'bg-black text-[var(--glow-color)] border border-[var(--glow-color)]/50 hover:border-[var(--glow-color)]'
            }`}
            onClick={() => onToggle(index, true)}
            aria-label="Accept suggestion"
          >
            Yes
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors selection-button ${
              !isSelected 
                ? 'bg-[var(--secondary-glow)] text-black border border-[var(--secondary-glow)] shadow-[0_0_5px_rgba(255,107,53,0.5)]' 
                : 'bg-black text-[var(--glow-color)] border border-[var(--glow-color)]/50 hover:border-[var(--glow-color)]'
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