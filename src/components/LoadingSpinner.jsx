import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', subMessage = '' }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
      {subMessage && <p className="loading-submessage">{subMessage}</p>}
    </div>
  );
};

export default LoadingSpinner;
