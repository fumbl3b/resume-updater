import React, { useState } from 'react';
import JobDescription from './components/JobDescription';
import ResumeUpload from './components/ResumeUpload';
import SubmitButton from './components/SubmitButton';
import InsightsList from './components/InsightsList';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

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

  const handleGetSuggestions = () => {
    if (!jobDescription || !resumeFile) {
      alert('Please fill in all fields');
      return;
    }

    // Read the resume file as text before sending
    const reader = new FileReader();
    reader.onload = () => {
      const resumeText = reader.result;

      fetch(`${API_URL}/suggest-improvements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_description: jobDescription,
          resume_text: resumeText
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Suggestions:', data);
        setSuggestions(data.suggestions); // suggestions should be markdown text
      })
      .catch(error => {
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

  const handleAnalyzeClick = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    setKeywordLoading(true);
    setBenefitsLoading(true);

    try {
      // Fetch keywords and benefits in parallel
      const [keywordsResponse, benefitsResponse] = await Promise.all([
        fetch(`${API_URL}/extract-keywords`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_description: jobDescription })
        }),
        fetch(`${API_URL}/extract-benefits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_description: jobDescription })
        })
      ]);

      const keywordsData = await keywordsResponse.json();
      const benefitsData = await benefitsResponse.json();

      setKeywords(keywordsData.keywords);
      setBenefits(benefitsData.keywords); // Assuming same response structure
    } catch (error) {
      console.error('Error:', error);
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

  return (
    <div className="app">
      <header className="header">
        <h1>Resume Suggestions Tool</h1>
      </header>
      <main className="main-container">
        <div className="left-panel">
          <JobDescription 
            value={jobDescription} 
            onChange={setJobDescription} 
          />
          <button 
            className="analyze-button" 
            onClick={handleAnalyzeClick}
            disabled={!jobDescription.trim()}
          >
            Analyze Job Description
          </button>
        </div>
        <div className="right-panel">
          {(keywordLoading || benefitsLoading) && 
            <div className="keyword-loading">Analyzing...</div>
          }
          {(keywords || benefits) && (
            <InsightsList 
              keywords={keywords}
              benefits={benefits}
              onRemoveKeyword={handleRemoveKeyword}
              onRemoveBenefit={handleRemoveBenefit}
            />
          )}
        </div>
        <ResumeUpload resumeFile={resumeFile} setResumeFile={setResumeFile} />
        
        {/* First button: Get Suggestions */}
        <SubmitButton handleSubmit={handleGetSuggestions} text="Get Suggestions" />

        {/* If we have suggestions, show them in markdown */}
        {suggestions && (
          <div className="suggestions">
            <h2>Suggestions</h2>
            {suggestions}

            {/* Now that we have suggestions, a button to generate optimized resume */}
            <button onClick={handleGenerateOptimizedResume}>Generate Optimized Resume</button>
          </div>
        )}

        {/* If loading, show a loading indicator */}
        {loading && (
          <div className="loading">
            <p>Generating optimized resume, please wait...</p>
          </div>
        )}

        {/* If we have the optimized resume, show a download button */}
        {optimizedResume && (
          <div className="optimized-resume">
            <h2>Optimized Resume Generated</h2>
            <p>Your LaTeX-formatted optimized resume is ready.</p>
            <button onClick={handleDownloadTex}>Download .tex file</button>
          </div>
        )}
      </main>
      <footer className="footer">
        <p>&copy; 2024 Fumble Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
