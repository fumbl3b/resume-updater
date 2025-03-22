import React from 'react';

const Hero = ({ onGetStarted }) => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>AI Resume Assistant</h1>
        <p className="hero-subtitle">
          Optimize your resume with AI-powered job analysis and tailored suggestions
        </p>
        <button onClick={onGetStarted} className="cta-button">
          Get Started
        </button>
      </div>
      <div className="gradient-blob-1"></div>
      <div className="gradient-blob-2"></div>
    </div>
  );
};

export default Hero;