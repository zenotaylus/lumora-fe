import React from 'react';

const Header = ({ currentMode, onModeChange }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">✨ Lumora</h1>
        <p className="app-subtitle">AI-Powered Fashion Assistant</p>
      </div>

      <nav className="mode-nav">
        <button
          className={`mode-btn ${currentMode === 'rater' ? 'active' : ''}`}
          onClick={() => onModeChange('rater')}
        >
          ⭐ Outfit Rater
        </button>
        <button
          className={`mode-btn ${currentMode === 'generator' ? 'active' : ''}`}
          onClick={() => onModeChange('generator')}
        >
          🎨 Outfit Generator
        </button>
        <button
          className={`mode-btn ${currentMode === 'arena' ? 'active' : ''}`}
          onClick={() => onModeChange('arena')}
        >
          🏆 Fashion Arena
        </button>
      </nav>
    </header>
  );
};

export default Header;
