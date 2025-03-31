import React from 'react';
import logoImage from '../../../r8.png';

const Logo = () => (
  <div className="fixed top-6 left-6 z-50">
    <div className="flex items-center">
      <img 
        src={logoImage} 
        alt="Resum8.io Logo" 
        className="h-10 w-10 rounded-md hover:scale-110 transition-all duration-300" 
        style={{ boxShadow: '0 0 15px rgba(255, 217, 102, 0.5)' }}
      />
      <span className="ml-2 text-2xl font-bold text-white" style={{ 
        fontFamily: "'VT323', 'Space Mono', monospace",
        color: 'var(--glow-color, #FFD966)',
        textShadow: '0 0 5px #FFD966'
      }}>
        Resum8.io
      </span>
    </div>
  </div>
);

export default Logo;