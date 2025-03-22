import React from 'react';

const Hero = ({ onGetStarted }) => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light">
    <div className="text-center z-10 p-8 max-w-4xl">
      <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
        AI Resume Assistant
      </h1>
      <p className="text-2xl text-white/90 mb-8">
        Optimize your resume with AI-powered job analysis and tailored suggestions
      </p>
      <button 
        onClick={onGetStarted}
        className="px-8 py-4 text-xl bg-white text-primary rounded-full hover:bg-primary-light hover:text-white transition-colors shadow-lg"
      >
        Get Started
      </button>
    </div>
  </div>
);

export default Hero;