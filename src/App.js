import React, { useState } from 'react';
import JobDescription from './components/JobDescription';
import ResumeUpload from './components/ResumeUpload';
import SubmitButton from './components/SubmitButton';
import './App.css';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [suggestions, setSuggestions] = useState('');        // Will hold the markdown response
  const [optimizedResume, setOptimizedResume] = useState(''); // Will hold the .tex content
  const [loading, setLoading] = useState(false);             // For showing a loading indicator
  const [keywords, setKeywords] = useState('');
  const [keywordLoading, setKeywordLoading] = useState(false);

  const handleJobDescriptionChange = async (text) => {
    setJobDescription(text);
    if (text.trim()) {
      setKeywordLoading(true);
      try {
        const response = await fetch('http://localhost:5001/extract-keywords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_description: text })
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setKeywords(data.keywords);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setKeywordLoading(false);
      }
    }
  };

  const handleGetSuggestions = () => {
    if (!jobDescription || !resumeFile) {
      alert('Please fill in all fields');
      return;
    }

    // Read the resume file as text before sending
    const reader = new FileReader();
    reader.onload = () => {
      const resumeText = reader.result;

      fetch('http://localhost:5001/suggest-improvements', {
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
      fetch('http://localhost:5001/generate-optimized-resume', {
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
    try {
      const response = await fetch('http://localhost:5001/extract-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription })
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setKeywords(data.keywords);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setKeywordLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Resume Suggestions Tool</h1>
      </header>
      <main className="main">
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
        {keywordLoading && <div className="keyword-loading">Analyzing job description...</div>}
        {keywords && (
          <div className="keywords-section">
            <h2>Key Requirements</h2>
            <p>{keywords}</p>
          </div>
        )}
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
        <p>&copy; 2024 Resume Suggestions Tool. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
