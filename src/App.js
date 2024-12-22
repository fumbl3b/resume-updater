import React, { useState } from 'react';
import JobDescription from './components/JobDescription';
import ResumeUpload from './components/ResumeUpload';
import SubmitButton from './components/SubmitButton';
import InsightsList from './components/InsightsList';
import ResumeText from './components/ResumeText';
import Accordion from './components/Accordion';
import Logo from './components/Logo';
import PDFViewer from './components/PDFViewer';
import LatexPreview from './components/LatexPreview';
import LoadingSpinner from './components/shared/LoadingSpinner';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  throw new Error('API_URL environment variable is not set');
}

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [suggestions, setSuggestions] = useState('');        // Will hold the markdown response
  const [optimizedResume, setOptimizedResume] = useState(''); // Will hold the .tex content
  const [loading, setLoading] = useState(false);             // For showing a loading indicator
  const [keywords, setKeywords] = useState('');
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [benefits, setBenefits] = useState('');
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [latexContent, setLatexContent] = useState('');
  const [resumeGenerating, setResumeGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const handleGetSuggestions = async () => {
    if (!resumeText || !jobDescription) {
      alert('Please provide both resume and job description');
      return;
    }

    setSuggestionsLoading(true);
    try {
      const response = await fetch(`${API_URL}/suggest-improvements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription
        })
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error:', error);
      alert('Error getting suggestions');
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleGenerateOptimizedResume = () => {
    if (!suggestions) {
      alert('No suggestions to optimize. Please get suggestions first.');
      return;
    }

    // We need the original resume again. If we still have it in memory as `resumeFile`, re-read it:
    const reader = new FileReader();
    reader.onload = () => {
      const resumeText = reader.result;
      setLoading(true);
      fetch(`${API_URL}/generate-optimized-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          suggestions: suggestions,
          resume_text: resumeText
        })
      })
      .then(response => {
        setLoading(false);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Optimized Resume:', data);
        setOptimizedResume(data.optimized_resume);
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
        alert('Error occurred while processing request');
      });
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Could not read the resume file.');
    };

    reader.readAsText(resumeFile);
  };

  const handleDownloadTex = () => {
    if (!optimizedResume) return;
    const blob = new Blob([optimizedResume], { type: 'application/x-tex' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized_resume.tex';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    setKeywordLoading(true);
    setBenefitsLoading(true);
    try {
      const response = await fetch(`${API_URL}/analyze-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription })
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setKeywords(data.keywords);
      setBenefits(data.benefits);
    } catch (error) {
      console.error('Error:', error);
      alert('Error analyzing job description');
    } finally {
      setKeywordLoading(false);
      setBenefitsLoading(false);
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

  const handleExtractText = async () => {
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append('file', resumeFile);

    try {
      const response = await fetch(`${API_URL}/extract-resume-text`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setResumeText(data.text);
    } catch (error) {
      console.error('Error:', error);
      alert('Error extracting resume text');
    }
  };

  const handleGenerateResume = async () => {
    if (!suggestions || !resumeText) {
      alert('Please get suggestions first');
      return;
    }
    
    setResumeGenerating(true);
    try {
      const response = await fetch(`${API_URL}/optimize-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resume_text: resumeText,
          suggestions: suggestions
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setLatexContent(data.tex_content);
      
      // PDF generation temporarily disabled per API spec
      // Will be handled by separate /convert-to-pdf endpoint
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating resume');
    } finally {
      setResumeGenerating(false);
    }
  };

  return (
    <div className="app">
      <Logo />
      <main className="main-container">
        <Accordion title="Job Description" isOpen={true}>
          <JobDescription 
            value={jobDescription} 
            onChange={setJobDescription} 
          />
        </Accordion>

        <button 
          className="analyze-button action-button" 
          onClick={handleAnalyzeJob}
          disabled={!jobDescription.trim() || keywordLoading || benefitsLoading}
        >
          {(keywordLoading || benefitsLoading) ? 'Analyzing...' : 'Analyze Job'}
        </button>

        {(keywordLoading || benefitsLoading) && (
          <div className="loading-container">
            <LoadingSpinner />
            <p className="loading-text">Analyzing job description...</p>
          </div>
        )}
        
        {!keywordLoading && !benefitsLoading && (keywords || benefits) && (
          <Accordion title="Job Analysis" isOpen={true}>
            <InsightsList 
              keywords={keywords}
              benefits={benefits}
              onRemoveKeyword={handleRemoveKeyword}
              onRemoveBenefit={handleRemoveBenefit}
            />
          </Accordion>
        )}

        {loading && <LoadingSpinner />}

        <Accordion title="Resume Upload" isOpen={true}>
          <ResumeUpload 
            resumeFile={resumeFile} 
            setResumeFile={setResumeFile} 
          />
        </Accordion>

        <button 
          className="analyze-button action-button"
          onClick={handleExtractText}
          disabled={!resumeFile}
        >
          Extract Resume Text
        </button>

        {resumeText && (
          <Accordion title="Resume Content">
            <ResumeText text={resumeText} />
          </Accordion>
        )}

        {resumeText && (
          <button 
            className="analyze-button action-button"
            onClick={handleGetSuggestions}
            disabled={suggestionsLoading || !resumeText || !jobDescription}
          >
            {suggestionsLoading ? 'Getting Suggestions...' : 'Get Suggestions'}
          </button>
        )}

        {suggestions && (
          <Accordion title="Suggestions" isOpen={true}>
            <div className="suggestions-content">
              {suggestions.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Accordion>
        )}

        {suggestions && (
          <button 
            className="analyze-button action-button"
            onClick={handleGenerateResume}
            disabled={resumeGenerating || !suggestions}
          >
            {resumeGenerating ? 'Generating Resume...' : 'Generate Resume PDF'}
          </button>
        )}

        {latexContent && (
          <Accordion title="LaTeX Output" isOpen={true}>
            <LatexPreview content={latexContent} />
          </Accordion>
        )}

        {pdfUrl && (
          <Accordion title="Generated Resume" isOpen={true}>
            <PDFViewer pdfUrl={pdfUrl} />
          </Accordion>
        )}
      </main>
      <footer className="footer">
        © 2024 Fumble Labs. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
