import React, { useState, useEffect } from 'react';
import JobDescription from './components/features/job/JobDescription';
import ResumeUpload from './components/features/resume/ResumeUpload';
import InsightsList from './components/features/insight/InsightsList';
import SelectableSuggestions from './components/features/insight/SelectableSuggestions';
import LatexPreview from './components/LatexPreview';
import ResumeText from './components/features/resume/ResumeText';
import Accordion from './components/layout/Accordion';
import Logo from './components/layout/Logo';
import Hero from './components/features/landing/Hero';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { extractLatexCode } from './utils/latexParser';
import DownloadLinks from './components/features/resume/DownloadLinks';
import logger from './utils/logger';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

// Environment configuration
const API_URL = process.env.REACT_APP_API_URL;
const IS_DEV_MODE = process.env.REACT_APP_DEV_MODE === 'true';

if (!API_URL) {
  throw new Error('API_URL environment variable is not set');
}

// Log application startup
logger.info('Application starting', {
  apiUrl: API_URL,
  devMode: IS_DEV_MODE,
  version: process.env.REACT_APP_VERSION || '0.1.0'
});

// Helper function to parse suggestions from markdown
function parseSuggestions(markdownText) {
  // Split by list item markers, typically starting with "- " or "* " in markdown
  // or numbered items like "1. ", "2. ", etc.
  const lines = markdownText.split('\n');
  const result = {
    sections: [], // To store section headers
    suggestions: [] // To store actual suggestions
  };
  
  let currentSuggestion = '';
  let currentSectionIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isNewItem = line.match(/^(-|\*|\d+\.)\s/) !== null;
    const isSectionHeader = line.match(/\*\*.*\*\*/) !== null; // Matches text with **anything**
    
    // Handle section headers - skip them entirely for suggestions list
    if (isSectionHeader) {
      // If we have collected text for a suggestion, save it before starting a new section
      if (currentSuggestion) {
        result.suggestions.push({
          text: currentSuggestion.trim().replace(/^(-|\*|\d+\.)\s+/, ''),
          sectionIndex: currentSectionIndex,
          comment: ''
        });
        currentSuggestion = '';
      }
      
      // Only add as a section if it's exactly **Title** format
      if (line.match(/^\*\*.*\*\*$/) !== null) {
        // Add the new section, removing the ** markers
        const sectionTitle = line.replace(/^\*\*|\*\*$/g, '');
        result.sections.push(sectionTitle);
        currentSectionIndex = result.sections.length - 1;
      }
      continue; // Skip this line and do not include it as a suggestion
    }
    
    // Skip empty lines and headings
    if (line === '' || line.startsWith('#')) {
      // If we have collected text for a suggestion, save it before moving on
      if (currentSuggestion) {
        result.suggestions.push({
          text: currentSuggestion.trim().replace(/^(-|\*|\d+\.)\s+/, ''),
          sectionIndex: currentSectionIndex,
          comment: ''
        });
        currentSuggestion = '';
      }
      continue;
    }
    
    // If it's a new list item and we have text from a previous item
    if (isNewItem && currentSuggestion) {
      result.suggestions.push({
        text: currentSuggestion.trim().replace(/^(-|\*|\d+\.)\s+/, ''),
        sectionIndex: currentSectionIndex,
        comment: ''
      });
      currentSuggestion = line;
    } else if (isNewItem) {
      // Start of a new suggestion
      currentSuggestion = line;
    } else if (currentSuggestion) {
      // Continuation of the current suggestion
      currentSuggestion += ' ' + line;
    }
  }
  
  // Add the last suggestion if there is one
  if (currentSuggestion) {
    result.suggestions.push({
      text: currentSuggestion.trim().replace(/^(-|\*|\d+\.)\s+/, ''),
      sectionIndex: currentSectionIndex,
      comment: ''
    });
  }
  
  // Filter out any empty strings and any entries that contain ** (section headers)
  result.suggestions = result.suggestions
    .filter(s => s.text.length > 0)
    .filter(s => !s.text.includes('**')); // Make sure no title with ** slips through
  
  return result;
}

function App() {
  // Step management
  const STEPS = {
    LANDING: 'landing',
    JOB_DESCRIPTION: 'job_description',
    JOB_ANALYSIS: 'job_analysis',
    RESUME_UPLOAD: 'resume_upload',
    RESUME_PREVIEW: 'resume_preview',
    SUGGESTIONS: 'suggestions',
    FINAL_RESUME: 'final_resume'
  };
  
  const [currentStep, setCurrentStep] = useState(STEPS.LANDING);
  
  // Form state
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [suggestionsList, setSuggestionsList] = useState({ sections: [], suggestions: [] });
  const [selectedSuggestions, setSelectedSuggestions] = useState({});
  const [suggestionComments, setSuggestionComments] = useState({});
  const [additionalComments, setAdditionalComments] = useState('');
  const [texContent, setTexContent] = useState('');
  const [pdfContent, setPdfContent] = useState('');
  
  // Analysis state
  const [keywords, setKeywords] = useState('');
  const [benefits, setBenefits] = useState('');
  
  // Loading states
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [resumeGenerating, setResumeGenerating] = useState(false);
  
  // Navigation state
  const [shakingStep, setShakingStep] = useState(null);
  
  // Dev mode state
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [apiLatency, setApiLatency] = useState(0);
  const [apiCalls, setApiCalls] = useState(0);
  const [devLogLevel, setDevLogLevel] = useState(process.env.REACT_APP_LOG_LEVEL || 'info');
  
  // UI state
  const [showJobDesc, setShowJobDesc] = useState(false);
  
  // Track API performance in dev mode
  useEffect(() => {
    if (IS_DEV_MODE) {
      // Setup simulated API latency monitoring
      const interval = setInterval(() => {
        // This would normally get real values from performance monitoring
        setApiLatency(prev => {
          const fluctuation = Math.random() * 20 - 10; // -10 to +10ms
          return Math.max(50, Math.min(500, prev + fluctuation));
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  // Log step changes
  useEffect(() => {
    logger.component('App', 'step change', { previousStep: currentStep });
  }, [currentStep]);
  
  // Update log level when changed in dev panel
  useEffect(() => {
    if (IS_DEV_MODE) {
      logger.logLevel = devLogLevel;
      logger.info(`Log level changed to ${devLogLevel}`);
    }
  }, [devLogLevel]);

  // Navigation handlers
  const handleGetStarted = () => {
    setCurrentStep(STEPS.JOB_DESCRIPTION);
  };
  
  const handleBack = () => {
    const stepOrder = [
      STEPS.LANDING,
      STEPS.JOB_DESCRIPTION,
      STEPS.JOB_ANALYSIS,
      STEPS.RESUME_UPLOAD,
      STEPS.RESUME_PREVIEW,
      STEPS.SUGGESTIONS,
      STEPS.FINAL_RESUME
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 1) { // Don't go back before JOB_DESCRIPTION
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim()) {
      logger.warn('Analyze job attempted with empty description');
      alert('Please enter a job description');
      return;
    }

    logger.action('Analyze Job', { descriptionLength: jobDescription.length });
    const startTime = performance.now();
    
    setKeywordLoading(true);
    setBenefitsLoading(true);
    try {
      // Prepare request payload
      const payload = { job_description: jobDescription };
      
      // Log the actual payload being sent
      logger.request('POST', `${API_URL}/analyze/job`, payload);
      
      if (IS_DEV_MODE) {
        console.log('Job Description Content:', jobDescription);
      }
      
      const response = await fetch(`${API_URL}/analyze/job`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Debug response
      if (IS_DEV_MODE) {
        console.log('Response Data:', data);
      }
      
      logger.response('POST', `${API_URL}/analyze/job`, response.status, {
        keywordsCount: data.keywords?.split(',').length || 0,
        benefitsCount: data.benefits?.split(',').length || 0
      });
      
      // Make sure we have the data
      if (!data.keywords && !data.benefits) {
        throw new Error('API response missing expected data');
      }
      
      setKeywords(data.keywords || '');
      setBenefits(data.benefits || '');
      
      // Move to the next step
      setCurrentStep(STEPS.JOB_ANALYSIS);
      logger.info('Advanced to job analysis step');
    } catch (error) {
      logger.error('Job analysis failed', { error: error.message });
      alert(`Error analyzing job description: ${error.message}`);
    } finally {
      setKeywordLoading(false);
      setBenefitsLoading(false);
      logger.performance('Job Analysis', performance.now() - startTime);
    }
  };

  const handleRemoveKeyword = (index) => {
    const keywordArray = keywords.split(',');
    keywordArray.splice(index, 1);
    setKeywords(keywordArray.join(','));
  };

  const handleRemoveBenefit = (index) => {
    const benefitArray = benefits.split(',');
    benefitArray.splice(index, 1);
    setBenefits(benefitArray.join(','));
  };

  const handleContinueToResume = () => {
    setCurrentStep(STEPS.RESUME_UPLOAD);
  };
  
  const handleToggleSuggestion = (indexOrSelections, value, isMultiple = false) => {
    logger.action('Toggle Suggestion', { index: isMultiple ? 'multiple' : indexOrSelections, value });
    
    if (isMultiple) {
      // Handle bulk selection/deselection
      setSelectedSuggestions({...indexOrSelections});
    } else {
      // Handle single toggle
      setSelectedSuggestions(prev => ({
        ...prev,
        [indexOrSelections]: value
      }));
    }
  };
  
  const handleSuggestionCommentChange = (index, commentText) => {
    logger.action('Update Suggestion Comment', { index, commentLength: commentText.length });
    
    setSuggestionComments(prev => ({
      ...prev,
      [index]: commentText
    }));
  };

  const handleExtractText = async () => {
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append('file', resumeFile);

    try {
      const response = await fetch(`${API_URL}/resume/extract-text`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setResumeText(data.text);
      
      // Move to the next step
      setCurrentStep(STEPS.RESUME_PREVIEW);
    } catch (error) {
      console.error('Error:', error);
      alert('Error extracting resume text');
    }
  };

  const handleGetSuggestions = async () => {
    if (!resumeText || !jobDescription) {
      logger.warn('Get suggestions attempted with missing data', { 
        hasResumeText: !!resumeText, 
        hasJobDescription: !!jobDescription 
      });
      alert('Please provide both resume and job description');
      return;
    }

    logger.action('Get Resume Suggestions', { 
      resumeTextLength: resumeText.length,
      jobDescriptionLength: jobDescription.length 
    });
    const startTime = performance.now();
    
    setSuggestionsLoading(true);
    try {
      // Prepare request payload
      const payload = {
        resume_text: resumeText,
        job_description: jobDescription
      };
      
      // Log the actual payload being sent
      logger.request('POST', `${API_URL}/resume/suggest-improvements`, {
        resume_text_length: resumeText.length,
        job_description_length: jobDescription.length
      });
      
      if (IS_DEV_MODE) {
        console.log('Suggestions Request Payload:', {
          resumeTextLength: resumeText.length,
          jobDescriptionLength: jobDescription.length,
          jobDescriptionSample: jobDescription.substring(0, 50) + '...'
        });
      }
      
      const response = await fetch(`${API_URL}/resume/suggest-improvements`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Debug response
      if (IS_DEV_MODE) {
        console.log('Suggestions Response Data:', {
          suggestionsLength: data.suggestions?.length || 0,
          suggestionsSample: data.suggestions?.substring(0, 50) + '...' || 'No suggestions'
        });
      }
      
      logger.response('POST', `${API_URL}/resume/suggest-improvements`, response.status, {
        suggestionsLength: data.suggestions?.length || 0
      });
      
      if (!data.suggestions) {
        throw new Error('API response missing expected suggestions data');
      }
      
      setSuggestions(data.suggestions);
      
      // Parse suggestions into separate items for selection
      const parsedData = parseSuggestions(data.suggestions);
      setSuggestionsList(parsedData);
      
      // Initialize all suggestions as selected by default
      const initialSelections = {};
      const initialComments = {};
      parsedData.suggestions.forEach((suggestion, index) => {
        initialSelections[index] = true;
        initialComments[index] = suggestion.comment || '';
      });
      setSelectedSuggestions(initialSelections);
      setSuggestionComments(initialComments);
      
      // Move to the next step
      setCurrentStep(STEPS.SUGGESTIONS);
      logger.info('Advanced to suggestions step');
    } catch (error) {
      logger.error('Getting suggestions failed', { error: error.message });
      alert(`Error getting suggestions: ${error.message}`);
    } finally {
      setSuggestionsLoading(false);
      logger.performance('Get Suggestions', performance.now() - startTime);
    }
  };

  const handleGenerateResume = async () => {
    if (!suggestions || !resumeText) {
      alert('Please get suggestions first');
      return;
    }
    
    logger.action('Generate Optimized Resume', {
      selectedSuggestionsCount: Object.values(selectedSuggestions).filter(Boolean).length,
      totalSuggestionsCount: suggestionsList.length
    });
    
    setResumeGenerating(true);
    try {
      // Filter and combine only the selected suggestions
      const selectedSuggestionsArray = suggestionsList.suggestions
        .filter((_, index) => selectedSuggestions[index])
        .map(suggestion => suggestion.text);
        
      // Group suggestions by section
      let finalSuggestionsText = '';
      
      // Add section headers and their suggestions
      suggestionsList.sections.forEach((sectionTitle, sectionIndex) => {
        const sectionSuggestionsWithIndex = suggestionsList.suggestions
          .map((s, index) => ({ ...s, index }))
          .filter(s => s.sectionIndex === sectionIndex && selectedSuggestions[s.index]);
          
        if (sectionSuggestionsWithIndex.length > 0) {
          finalSuggestionsText += `**${sectionTitle}**\n\n`;
          sectionSuggestionsWithIndex.forEach(s => {
            finalSuggestionsText += `- ${s.text}\n`;
            // Add individual comment if it exists
            if (suggestionComments[s.index]?.trim()) {
              finalSuggestionsText += `  *Comment: ${suggestionComments[s.index].trim()}*\n`;
            }
            finalSuggestionsText += '\n';
          });
        }
      });
      
      // Add suggestions without sections
      const unclassifiedSuggestionsWithIndex = suggestionsList.suggestions
        .map((s, index) => ({ ...s, index }))
        .filter(s => s.sectionIndex === -1 && selectedSuggestions[s.index]);
        
      if (unclassifiedSuggestionsWithIndex.length > 0) {
        unclassifiedSuggestionsWithIndex.forEach(s => {
          finalSuggestionsText += `- ${s.text}\n`;
          // Add individual comment if it exists
          if (suggestionComments[s.index]?.trim()) {
            finalSuggestionsText += `  *Comment: ${suggestionComments[s.index].trim()}*\n`;
          }
          finalSuggestionsText += '\n';
        });
      }
      
      // Add additional comments if any
      if (additionalComments.trim()) {
        finalSuggestionsText += `\n**Additional Comments**\n\n${additionalComments.trim()}\n\n`;
      }
      
      const finalSuggestions = finalSuggestionsText.trim();
      
      if (IS_DEV_MODE) {
        console.log('Selected Suggestions Count:', Object.values(selectedSuggestions).filter(Boolean).length);
        console.log('Final Suggestions Text Length:', finalSuggestions.length);
      }
      
      // First get optimized resume
      const optimizeResponse = await fetch(`${API_URL}/resume/apply-improvements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resume_text: resumeText,
          suggestions: finalSuggestions || 'No suggestions selected.' // Fallback text if nothing selected
        })
      });
      
      // Log the request
      logger.request('POST', `${API_URL}/resume/apply-improvements`, {
        resumeTextLength: resumeText.length,
        suggestionsLength: finalSuggestions.length,
        selectedCount: Object.values(selectedSuggestions).filter(Boolean).length
      });
      
      const optimizeData = await optimizeResponse.json();
      if (!optimizeResponse.ok) throw new Error(optimizeData.error);
      
      // Extract LaTeX code from response
      const cleanLatex = extractLatexCode(optimizeData.tex_content);
      
      // Convert LaTeX to PDF
      const convertResponse = await fetch(`${API_URL}/convert/latex`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          latex_content: cleanLatex
        })
      });
      
      const convertData = await convertResponse.json();
      if (!convertResponse.ok) throw new Error(convertData.error);
      
      setTexContent(convertData.tex_content);
      setPdfContent(convertData.pdf_content);
      
      // Move to the final step
      setCurrentStep(STEPS.FINAL_RESUME);
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating resume');
    } finally {
      setResumeGenerating(false);
    }
  };

  // Render different steps
  if (currentStep === STEPS.LANDING) {
    // Return the retro landing page
    return <Hero onGetStarted={handleGetStarted} />;
  }

  // Get step number for progress display
  const getStepNumber = (step) => {
    const stepOrder = [
      STEPS.LANDING,
      STEPS.JOB_DESCRIPTION,
      STEPS.JOB_ANALYSIS,
      STEPS.RESUME_UPLOAD,
      STEPS.RESUME_PREVIEW,
      STEPS.SUGGESTIONS,
      STEPS.FINAL_RESUME
    ];
    return stepOrder.indexOf(step);
  };

  const currentStepNumber = getStepNumber(currentStep);
  const totalSteps = 6; // Not counting landing page

  // Navigate to a specific step if allowed
  const navigateToStep = (stepIndex) => {
    const stepOrder = [
      STEPS.LANDING,
      STEPS.JOB_DESCRIPTION,
      STEPS.JOB_ANALYSIS,
      STEPS.RESUME_UPLOAD,
      STEPS.RESUME_PREVIEW,
      STEPS.SUGGESTIONS,
      STEPS.FINAL_RESUME
    ];
    
    // Current step index
    const currentIndex = getStepNumber(currentStep);
    
    // Only allow navigation to completed steps or the current step
    if (stepIndex <= currentIndex) {
      const targetStep = stepOrder[stepIndex];
      logger.action('Navigate', { from: currentStep, to: targetStep });
      setCurrentStep(targetStep);
    } else {
      // Animate the current step indicator to show it's not possible
      logger.action('Navigation Blocked', { attemptedStep: stepIndex, currentStep: currentIndex });
      
      // Trigger shake animation
      setShakingStep(stepIndex);
      setTimeout(() => {
        setShakingStep(null);
      }, 820); // Animation duration is 820ms
    }
  };
  
  // Toggle dev panel
  const toggleDevPanel = () => {
    setShowDevPanel(prev => !prev);
    console.log(`Dev panel ${showDevPanel ? 'hidden' : 'shown'}`);
  };
  
  // Simulate an API error (for testing)
  const simulateApiError = () => {
    logger.error('Simulated API error', { endpoint: '/simulate-error', status: 500 });
    alert('Simulated API error triggered. Check console logs.');
  };
  
  // Clear local storage (for testing)
  const clearLocalData = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      logger.info('Local storage cleared');
      alert('Local storage cleared');
    } catch (e) {
      logger.error('Failed to clear storage', { error: e.message });
    }
  };

  return (
    <div className={`min-h-screen p-8 ${currentStep !== STEPS.LANDING ? "retro-body" : ""}`}>
      {/* Only show the Logo on non-landing pages */}
      {currentStep !== STEPS.LANDING && <Logo />}
      
      {/* Dev Mode Button - only visible in dev mode */}
      {IS_DEV_MODE && (
        <button
          onClick={toggleDevPanel}
          className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-2 py-1 text-xs rounded-md opacity-50 hover:opacity-100"
        >
          {showDevPanel ? 'Hide' : 'Show'} Dev Tools
        </button>
      )}
      
      {/* Dev Panel - only in dev mode */}
      {IS_DEV_MODE && showDevPanel && (
        <div className="fixed right-4 top-12 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-50 text-sm">
          <h3 className="text-lg font-bold mb-2 flex justify-between">
            Development Tools
            <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">DEV</span>
          </h3>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span>API Latency:</span>
              <span className={`font-mono ${apiLatency > 200 ? 'text-red-400' : 'text-green-400'}`}>
                {apiLatency.toFixed(0)}ms
              </span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${apiLatency > 200 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, (apiLatency / 500) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Log Level:</label>
            <select 
              value={devLogLevel}
              onChange={(e) => setDevLogLevel(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-1">Application State:</h4>
            <div className="bg-gray-800 p-2 rounded text-xs font-mono overflow-auto max-h-32">
              <div>Step: {currentStep}</div>
              <div>Job Keywords: {keywords ? keywords.split(',').length : 0}</div>
              <div>Resume: {resumeFile ? resumeFile.name : 'None'}</div>
              <div>Suggestions: {suggestionsList.suggestions?.length > 0 ? `${suggestionsList.suggestions.length} total` : 'None'}</div>
              {suggestionsList.suggestions?.length > 0 && (
                <div>
                  Selected: {Object.values(selectedSuggestions).filter(Boolean).length} of {suggestionsList.suggestions.length}
                </div>
              )}
              {Object.keys(suggestionComments).length > 0 && (
                <div>
                  Item Comments: {Object.values(suggestionComments).filter(c => c.trim()).length}
                </div>
              )}
              {additionalComments && (
                <div>Global Comments: {additionalComments.length} chars</div>
              )}
              <div>PDF Ready: {pdfContent ? 'Yes' : 'No'}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={simulateApiError}
              className="bg-red-700 hover:bg-red-600 text-white rounded px-2 py-1 text-xs"
            >
              Simulate Error
            </button>
            <button 
              onClick={clearLocalData}
              className="bg-gray-700 hover:bg-gray-600 text-white rounded px-2 py-1 text-xs"
            >
              Clear Storage
            </button>
            <button 
              onClick={() => console.clear()}
              className="bg-gray-700 hover:bg-gray-600 text-white rounded px-2 py-1 text-xs"
            >
              Clear Console
            </button>
            <button 
              onClick={() => setApiCalls(0)}
              className="bg-gray-700 hover:bg-gray-600 text-white rounded px-2 py-1 text-xs"
            >
              Reset Counters
            </button>
          </div>
        </div>
      )}
      
      {/* Progress Indicator */}
      {currentStep !== STEPS.LANDING && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex justify-between mb-2 relative progress-steps">
            {/* Progress Bar */}
            <div className="absolute h-1 bg-gray-300 top-7 left-4 right-4 z-0"></div>
            <div 
              className="absolute h-1 bg-[var(--glow-color)] top-7 left-4 z-0 transition-all duration-500 ease-in-out" 
              style={{ width: `${(currentStepNumber / (totalSteps - 1)) * (100 - (8/totalSteps))}%` }}
            ></div>
            
            {/* Step Indicators */}
            {Array.from({ length: totalSteps }).map((_, i) => {
              // Determine if this step is completed, current, or upcoming
              const isCompleted = i < currentStepNumber;
              const isCurrent = i === currentStepNumber;
              const isUpcoming = i > currentStepNumber;
              
              // Get step name for hover tooltip
              const stepOrder = [
                STEPS.LANDING,
                STEPS.JOB_DESCRIPTION,
                STEPS.JOB_ANALYSIS,
                STEPS.RESUME_UPLOAD,
                STEPS.RESUME_PREVIEW,
                STEPS.SUGGESTIONS,
                STEPS.FINAL_RESUME
              ];
              const stepName = stepOrder[i+1].replace(/_/g, ' ');
              
              return (
                <div key={i} className="flex flex-col items-center z-10 relative">
                  <button
                    onClick={() => navigateToStep(i+1)}
                    disabled={isUpcoming}
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center text-sm font-medium 
                      transform transition-all duration-300 ease-in-out step-indicator
                      ${isCompleted ? 'bg-[var(--accent-glow)] text-black hover:bg-[var(--accent-glow)]/80 shadow-md hover:scale-110 completed' : 
                        isCurrent ? 'bg-[var(--glow-color)] text-black shadow-lg scale-110 pulse-animation current' : 
                        'bg-gray-700 text-gray-300 cursor-not-allowed opacity-70 disabled'}
                      ${shakingStep === i+1 ? 'shake' : ''}`}
                    title={`${isUpcoming ? 'Complete current step first' : `Go to ${stepName}`}`}
                  >
                    <span className="text-sm">
                      {isCompleted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                  </button>
                  
                  <div className={`mt-2 text-xs text-center max-w-[80px] font-medium step-name
                    transition-all duration-300 ease-in-out
                    ${isCurrent ? 'text-[var(--glow-color)] font-semibold' : 
                      isCompleted ? 'text-[var(--accent-glow)]' : 'text-gray-500'}`}>
                    {stepName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Debug Info - only in dev mode */}
      {IS_DEV_MODE && (
        <div className="fixed bottom-4 left-4 p-2 bg-gray-800 text-white text-xs rounded opacity-70 hover:opacity-100 z-50">
          ENV: {process.env.NODE_ENV} | 
          DEV: {process.env.REACT_APP_DEV_MODE || 'Not set'} | 
          LOG: {process.env.REACT_APP_LOG_LEVEL || 'Not set'} |
          <button 
            onClick={() => console.log('App state:', { 
              currentStep, jobDescription, keywords, benefits, resumeText, suggestions 
            })}
            className="ml-2 underline"
          >
            Log State
          </button>
        </div>
      )}
      
      <main className="max-w-4xl mx-auto space-y-6 bg-black/90 backdrop-blur-md rounded-lg p-8 shadow-lg border border-[var(--glow-color)]" 
        style={{ boxShadow: '0 0 20px rgba(255, 217, 102, 0.2)' }}>
        {/* Step 1: Job Description */}
        {currentStep === STEPS.JOB_DESCRIPTION && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Step 1: Enter Job Description</h2>
            </div>
            <JobDescription 
              value={jobDescription} 
              onChange={setJobDescription} 
            />
            <button 
              className="w-full py-3 rounded-lg"
              onClick={handleAnalyzeJob}
              disabled={!jobDescription.trim() || keywordLoading || benefitsLoading}
            >
              {(keywordLoading || benefitsLoading) ? 'Analyzing...' : 'Analyze Job'}
            </button>

            {(keywordLoading || benefitsLoading) && (
              <div className="flex flex-col items-center justify-center p-4">
                <LoadingSpinner />
                <p className="mt-2 text-[var(--glow-color)]">Analyzing job description...</p>
              </div>
            )}
          </>
        )}

        {/* Step 2: Job Analysis */}
        {currentStep === STEPS.JOB_ANALYSIS && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Step 2: Review Job Analysis</h2>
              <button 
                onClick={handleBack}
                className="px-3 py-1 text-sm rounded"
              >
                Back
              </button>
            </div>
            <div className="bg-black/60 p-4 rounded-lg mb-4 border border-[var(--glow-color)]">
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => setShowJobDesc(prev => !prev)}
              >
                <h3 className="text-lg font-medium text-[var(--glow-color)]">Job Description</h3>
                <button className="text-sm px-2 py-1 text-[var(--glow-color)]/70 hover:bg-black/40 rounded border border-[var(--glow-color)]/50">
                  {showJobDesc ? 'Hide' : 'Show'}
                </button>
              </div>
              {showJobDesc && (
                <div className="mt-2 pt-2 border-t border-[var(--glow-color)]/30">
                  <p className="whitespace-pre-wrap">{jobDescription}</p>
                </div>
              )}
            </div>
            
            <div className="bg-black/60 rounded-lg border border-[var(--glow-color)] p-4 mb-4 shadow-[0_0_15px_rgba(255,217,102,0.2)]">
              <h3 className="text-lg font-medium text-[var(--glow-color)] mb-2">Key Skills & Requirements</h3>
              <InsightsList 
                keywords={keywords}
                benefits={benefits}
                onRemoveKeyword={handleRemoveKeyword}
                onRemoveBenefit={handleRemoveBenefit}
              />
            </div>
            
            <button 
              className="w-full py-3 rounded-lg"
              onClick={handleContinueToResume}
            >
              Continue to Resume Upload
            </button>
          </>
        )}

        {/* Step 3: Resume Upload */}
        {currentStep === STEPS.RESUME_UPLOAD && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Step 3: Upload Your Resume</h2>
              <button 
                onClick={handleBack}
                className="px-3 py-1 text-sm rounded"
              >
                Back
              </button>
            </div>
            <div className="bg-black/60 p-4 rounded-lg mb-4 border border-[var(--glow-color)]">
              <h3 className="text-lg font-medium mb-2">Target Skills</h3>
              <p>{keywords}</p>
            </div>
            
            <ResumeUpload 
              resumeFile={resumeFile} 
              setResumeFile={setResumeFile} 
            />
            
            <button 
              className="w-full py-3 rounded-lg mt-4"
              onClick={handleExtractText}
              disabled={!resumeFile}
            >
              Extract Resume Text
            </button>
          </>
        )}

        {/* Step 4: Resume Preview */}
        {currentStep === STEPS.RESUME_PREVIEW && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Step 4: Review Your Resume</h2>
              <button 
                onClick={handleBack}
                className="px-3 py-1 text-sm rounded"
              >
                Back
              </button>
            </div>
            <div className="bg-black/60 rounded-lg border border-[var(--glow-color)] p-6 mb-4 shadow-[0_0_15px_rgba(255,217,102,0.2)]">
              <div className="flex items-center mb-4">
                <div className="bg-black/80 p-2 rounded-full mr-3 border border-[var(--glow-color)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--glow-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--glow-color)]">Resume Content</h3>
              </div>
              
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 mb-4">
                <p className="text-sm text-yellow-700">
                  Review your resume content below. Make sure all the important information has been extracted correctly.
                </p>
              </div>
              
              <ResumeText text={resumeText} />
            </div>
            
            <div className="bg-black/60 rounded-lg border border-[var(--glow-color)] p-6 mb-4 text-center shadow-[0_0_15px_rgba(255,217,102,0.2)]">
              <h3 className="text-lg font-medium text-[var(--glow-color)] mb-3">Ready for AI-Powered Suggestions?</h3>
              <p className="text-[var(--glow-color)]/80 mb-4">Get personalized recommendations to tailor your resume for this job</p>
              <button 
                className="px-6 py-3 font-medium rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center mx-auto retro-cta-button"
                onClick={handleGetSuggestions}
                disabled={suggestionsLoading || !resumeText}
              >
                {suggestionsLoading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Get Improvement Suggestions
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Step 5: Suggestions */}
        {currentStep === STEPS.SUGGESTIONS && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Step 5: Review Suggestions</h2>
              <button 
                onClick={handleBack}
                className="px-3 py-1 text-sm rounded"
              >
                Back
              </button>
            </div>
            <div className="bg-black/60 rounded-lg border border-[var(--glow-color)] p-6 mb-4 shadow-[0_0_15px_rgba(255,217,102,0.2)]">
              <div className="flex items-center mb-4">
                <div className="bg-black/80 p-2 rounded-full mr-3 border border-[var(--glow-color)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--glow-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--glow-color)]">Improvement Suggestions</h3>
              </div>
              
              {/* Selectable suggestions list */}
              <SelectableSuggestions
                suggestions={suggestionsList}
                selectedSuggestions={selectedSuggestions}
                onToggle={handleToggleSuggestion}
                additionalComments={additionalComments}
                setAdditionalComments={setAdditionalComments}
                suggestionComments={suggestionComments}
                onSuggestionCommentChange={handleSuggestionCommentChange}
              />
            </div>
            
            <div className="bg-black/60 rounded-lg border border-[var(--glow-color)] p-6 mb-4 text-center shadow-[0_0_15px_rgba(255,217,102,0.2)]">
              <h3 className="text-lg font-medium text-[var(--glow-color)] mb-3">Ready to Create Your Optimized Resume?</h3>
              <p className="text-[var(--glow-color)]/80 mb-4">
                Click below to generate a professional LaTeX resume that incorporates your selected suggestions 
                <span className="font-semibold text-[var(--accent-glow)]">
                  ({Object.values(selectedSuggestions).filter(Boolean).length} of {suggestionsList.suggestions?.length || 0})
                </span>
              </p>
              <button 
                className="px-6 py-3 font-medium rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center mx-auto retro-cta-button"
                onClick={handleGenerateResume}
                disabled={resumeGenerating || Object.values(selectedSuggestions).filter(Boolean).length === 0}
              >
                {resumeGenerating ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Generating Resume...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Generate Optimized Resume
                  </>
                )}
              </button>
              {Object.values(selectedSuggestions).filter(Boolean).length === 0 && (
                <p className="text-red-500 text-sm mt-2">Please select at least one suggestion</p>
              )}
              {Object.values(selectedSuggestions).filter(Boolean).length > 0 && additionalComments.trim() && (
                <p className="text-green-600 text-sm mt-2">
                  <span className="inline-block animate-pulse mr-1">✓</span>
                  Your additional comments will be included
                </p>
              )}
            </div>
          </>
        )}

        {/* Step 6: Final Resume */}
        {currentStep === STEPS.FINAL_RESUME && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Step 6: Your Optimized Resume</h2>
              <button 
                onClick={handleBack}
                className="px-3 py-1 text-sm rounded"
              >
                Back
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Your Optimized Resume is Ready!</h3>
                <p className="text-[var(--glow-color)]/80 mt-2">Preview your resume below or download it to use right away</p>
              </div>
              
              <div className="w-full max-w-xl mx-auto bg-black/70 rounded-lg border border-[var(--glow-color)] p-4 mb-6 shadow-[0_0_15px_rgba(255,217,102,0.3)]">
                {pdfContent ? (
                  <div className="w-full aspect-[1/1.414] min-h-[600px] border border-[var(--glow-color)] rounded bg-white/90 relative pdf-preview shadow-[0_0_10px_rgba(255,217,102,0.3)]">
                    <iframe
                      src={`data:application/pdf;base64,${pdfContent}#toolbar=0`}
                      className="w-full h-full"
                      title="Resume PDF"
                    ></iframe>
                    {/* <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 hidden pdf-fallback">
                      <div className="text-center p-4">
                        <p className="text-gray-700 mb-4">Your browser may not display the PDF preview correctly.</p>
                        <p className="text-[var(--glow-color)]">Please use the download buttons below to view your resume.</p>
                      </div>
                    </div> */}
                  </div>
                ) : (
                  <LatexPreview content={texContent} />
                )}
              </div>
              
              <div className="bg-gradient-to-r from-black/80 to-black/60 rounded-xl p-8 mb-6 w-full max-w-2xl border border-[var(--glow-color)] shadow-[0_0_15px_rgba(255,217,102,0.3)]">
                <h3 className="text-lg font-medium text-[var(--glow-color)] mb-6 text-center">Download Your Resume</h3>
                <DownloadLinks 
                  texContent={texContent}
                  pdfContent={pdfContent}
                />
                
                <div className="mt-6 text-center text-sm text-[var(--glow-color)]/70">
                  <p>These files are saved locally on your device. Your privacy is our priority.</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                className="flex-1 py-3 bg-black/60 text-[var(--glow-color)] font-medium rounded-lg border border-[var(--glow-color)] hover:bg-black/40 shadow-[0_0_10px_rgba(255,217,102,0.2)]"
                onClick={() => setCurrentStep(STEPS.JOB_DESCRIPTION)}
              >
                Start Over
              </button>
              
              <button 
                className="flex-1 py-3 font-medium rounded-lg retro-cta-button"
                onClick={() => setCurrentStep(STEPS.SUGGESTIONS)}
              >
                Back to Suggestions
              </button>
            </div>
          </>
        )}
      </main>
      
      <footer className="mt-8 text-center text-sm opacity-80">
        © {new Date().getFullYear()} Resum8.io | All rights reserved<span className="retro-blink">_</span>
      </footer>
    </div>
  );
}

export default App;