import React from 'react';
import '../styles/ErrorDisplay.css';  
interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="error-display">
      <h2>Oops!</h2>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;
