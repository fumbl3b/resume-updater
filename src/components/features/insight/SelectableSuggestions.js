import React from 'react';
import SuggestionItem from './SuggestionItem';

const SelectableSuggestions = ({ 
  suggestions, 
  selectedSuggestions, 
  onToggle,
  additionalComments,
  setAdditionalComments,
  suggestionComments,
  onSuggestionCommentChange 
}) => {
  const selectedCount = Object.values(selectedSuggestions).filter(Boolean).length;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[var(--glow-color)]">Suggested Improvements</h2>
        <div className="text-sm bg-black/80 text-[var(--glow-color)] px-3 py-1 rounded-full border border-[var(--glow-color)] shadow-[0_0_10px_rgba(255,217,102,0.3)]">
          {selectedCount} of {suggestions.suggestions.length} selected
        </div>
      </div>
      
      <div className="p-4 bg-black/40 border-l-4 border-[var(--accent-glow)] mb-4 rounded-r">
        <p className="text-sm text-[var(--glow-color)]">
          Select which suggestions you want to apply to your resume. Click "Yes" to include a suggestion
          or "No" to exclude it from your optimized resume.
        </p>
      </div>
      
      <div className="suggestions-list space-y-6 max-h-[500px] overflow-y-auto pr-2">
        {/* Display suggestions grouped by sections */}
        {suggestions.sections.map((sectionTitle, sectionIndex) => {
          const sectionSuggestions = suggestions.suggestions.filter(s => s.sectionIndex === sectionIndex);
          
          if (sectionSuggestions.length === 0) return null;
          
          return (
            <div key={`section-${sectionIndex}`} className="mb-4">
              <h3 className="text-lg font-medium text-[var(--glow-color)] mb-3 border-b border-[var(--glow-color)]/30 pb-2" style={{ textShadow: '0 0 3px var(--glow-color)' }}>
                {sectionTitle}
              </h3>
              
              <div className="space-y-3">
                {sectionSuggestions.map((suggestion) => {
                  const index = suggestions.suggestions.indexOf(suggestion);
                  return (
                    <SuggestionItem
                      key={`suggestion-${index}`}
                      suggestion={suggestion.text}
                      index={index}
                      isSelected={!!selectedSuggestions[index]}
                      onToggle={onToggle}
                      comment={suggestionComments[index] || ''}
                      onCommentChange={onSuggestionCommentChange}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {/* Display suggestions without a section */}
        {suggestions.suggestions
          .filter(s => s.sectionIndex === -1)
          .map(suggestion => {
            const index = suggestions.suggestions.indexOf(suggestion);
            return (
              <SuggestionItem
                key={`suggestion-${index}`}
                suggestion={suggestion.text}
                index={index}
                isSelected={!!selectedSuggestions[index]}
                onToggle={onToggle}
                comment={suggestionComments[index] || ''}
                onCommentChange={onSuggestionCommentChange}
              />
            );
          })
        }
      </div>
      
      {/* Additional comments section */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-primary mb-2">Additional Comments</h3>
        <p className="text-sm text-gray-600 mb-2">
          Add any additional comments or instructions for the resume improvement process.
        </p>
        <textarea
          value={additionalComments}
          onChange={(e) => setAdditionalComments(e.target.value)}
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Example: Please focus on highlighting my leadership skills and project management experience..."
        />
      </div>
      
      <div className="flex justify-between mt-4">
        <div>
          <button 
            className="text-primary hover:text-primary-dark underline text-sm"
            onClick={() => {
              const newSelections = {};
              suggestions.suggestions.forEach((_, idx) => {
                newSelections[idx] = true;
              });
              onToggle(newSelections, null, true);
            }}
          >
            Select All
          </button>
          {' | '}
          <button 
            className="text-primary hover:text-primary-dark underline text-sm"
            onClick={() => {
              const newSelections = {};
              suggestions.suggestions.forEach((_, idx) => {
                newSelections[idx] = false;
              });
              onToggle(newSelections, null, true);
            }}
          >
            Deselect All
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {selectedCount} of {suggestions.suggestions.length} suggestions selected
        </div>
      </div>
    </div>
  );
};

export default SelectableSuggestions;