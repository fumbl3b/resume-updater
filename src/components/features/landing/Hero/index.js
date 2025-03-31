import React from 'react';
import logo from '../../../../logo.png';

const Hero = ({ onGetStarted }) => {
  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
  <div className="retro-body">
    <div className="retro-container">
      <header className="retro-header">
        <div className="retro-logo">
          <div className="retro-logo-img"></div>
          Resum8.io
        </div>
        <nav className="retro-nav">
          <ul>
            <li><a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')}>Process</a></li>
            <li><a href="#features" onClick={(e) => handleNavClick(e, 'features')}>Features</a></li>
            <li><a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')}>Reviews</a></li>
            <li><a href="#start" onClick={onGetStarted} className="retro-cta-button">Login</a></li>
          </ul>
        </nav>
      </header>
      
      <section className="retro-hero">
        <div className="retro-hero-content">
          <h1 className="retro-typing">AI-POWERED RESUME OPTIMIZATION</h1>
          <div className="retro-terminal-text">
            <p>&gt; Analyzing job description...<br />
            &gt; Extracting key requirements...<br />
            &gt; Matching skills to your profile...<br />
            &gt; Generating optimized resume...<br />
            &gt; Download ready. Success rate: 93%<span className="retro-blink">_</span></p>
          </div>
          <p>Resum8.io uses advanced AI to analyze job listings, match your experience, and generate tailored resumes that bypass ATS systems and land interviews. Currently optimized for IT roles with trade expansions coming soon.</p>
          <button onClick={onGetStarted} className="retro-cta-button retro-main-cta" style={{ transform: 'scale(1.1)' }}>START OPTIMIZING NOW</button>
        </div>
        <div className="retro-hero-image">
          <img src={logo} alt="AI Resume Optimization" />
        </div>
      </section>
      
      <section id="how-it-works" className="retro-process-section">
        <h2 className="retro-section-title">THE PROCESS</h2>
        <div className="retro-process-steps">
          <div className="retro-process-step">
            <div className="retro-step-number">1</div>
            <h3 className="retro-step-title">PASTE JOB LISTING</h3>
            <p className="retro-step-desc">Copy and paste the job description you want to apply for. Our AI identifies key requirements and skills.</p>
          </div>
          <div className="retro-process-step">
            <div className="retro-step-number">2</div>
            <h3 className="retro-step-title">UPLOAD YOUR RESUME</h3>
            <p className="retro-step-desc">Upload your existing resume. The system analyzes your experience and skills against the job requirements.</p>
          </div>
          <div className="retro-process-step">
            <div className="retro-step-number">3</div>
            <h3 className="retro-step-title">DOWNLOAD & APPLY</h3>
            <p className="retro-step-desc">Get your fully optimized, ATS-friendly resume with highlighted matching skills and properly formatted sections.</p>
          </div>
        </div>
      </section>
      
      <section id="features" className="retro-features-section">
        <h2 className="retro-section-title">KEY FEATURES</h2>
        <div className="retro-features-grid">
          <div className="retro-feature-card">
            <div className="retro-feature-icon">&lt;/&gt;</div>
            <h3>IT ROLE SPECIALIZATION</h3>
            <p>Optimized keyword matching for software development, cybersecurity, system administration, data science, and more IT positions.</p>
          </div>
          <div className="retro-feature-card">
            <div className="retro-feature-icon">&#128202;</div>
            <h3>ATS COMPATIBILITY</h3>
            <p>Format your resume to pass through Applicant Tracking Systems with the right keywords, formatting, and section structure.</p>
          </div>
          <div className="retro-feature-card">
            <div className="retro-feature-icon">&#128300;</div>
            <h3>SKILL GAP ANALYSIS</h3>
            <p>Identify missing skills and experience with suggestions for addressing gaps in your application and cover letter.</p>
          </div>
          <div className="retro-feature-card">
            <div className="retro-feature-icon">&#128190;</div>
            <h3>MULTIPLE FORMATS</h3>
            <p>Download your optimized resume in PDF, DOCX, or plaintext formats, depending on application requirements.</p>
          </div>
          <div className="retro-feature-card">
            <div className="retro-feature-icon">&#128101;</div>
            <h3>EXPERIENCE HIGHLIGHTING</h3>
            <p>Automatically emphasizes relevant past experience and achievements that match the job description.</p>
          </div>
          <div className="retro-feature-card">
            <div className="retro-feature-icon">&#128195;</div>
            <h3>COVER LETTER GENERATION</h3>
            <p>Creates matching cover letters that complement your optimized resume and address specific job requirements.</p>
          </div>
        </div>
      </section>
      
      <section id="testimonials" className="retro-testimonials">
        <h2 className="retro-section-title">USER FEEDBACK</h2>
        <div className="retro-testimonial-card">
          <p className="retro-quote">After applying to 30+ software developer positions with no responses, I used Resum8.io to optimize my resume for each application. Within two weeks, I had 5 interview requests. The AI identified keyword gaps I never would have noticed.</p>
          <div className="retro-author">
            Alex K. <span>Full Stack Developer</span>
          </div>
        </div>
        <div className="retro-testimonial-card">
          <p className="retro-quote">As a career-switcher into cybersecurity, I was struggling to get my resume noticed. Resum8.io helped me translate my transferable skills into industry-specific language. The before/after difference was amazing.</p>
          <div className="retro-author">
            Priya M. <span>Security Analyst</span>
          </div>
        </div>
      </section>
      
      <section className="retro-cta-section">
        <div className="retro-cta-content">
          <h2>READY TO OPTIMIZE YOUR RESUME?</h2>
          <p>Get more interviews with targeted resumes that match exactly what employers are looking for.</p>
          <button onClick={onGetStarted} className="retro-cta-button retro-main-cta" style={{ transform: 'scale(1.1)' }}>START OPTIMIZING NOW</button>
        </div>
      </section>
      
      <footer className="retro-footer">
        <div className="retro-footer-content">
          <div className="retro-footer-column">
            <h3>Resum8.io</h3>
            <p>AI-powered resume optimization for IT professionals. Tailored to match job descriptions and pass ATS systems.</p>
          </div>
          <div className="retro-footer-column">
            <h3>Resources</h3>
            <ul className="retro-footer-links">
              <li><a href="#">Resume Tips</a></li>
              <li><a href="#">IT Career Blog</a></li>
              <li><a href="#">Technical Interview Guide</a></li>
              <li><a href="#">Job Search Strategy</a></li>
            </ul>
          </div>
          <div className="retro-footer-column">
            <h3>Support</h3>
            <ul className="retro-footer-links">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="retro-copyright">
          <p>&copy; {new Date().getFullYear()} Resum8.io | All rights reserved<span className="retro-blink">_</span></p>
        </div>
      </footer>
    </div>
  </div>
  );
};

export default Hero;