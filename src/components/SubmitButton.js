// src/components/SubmitButton.js
import React from 'react';
import './SubmitButton.css';

const SubmitButton = ({ handleSubmit }) => {
  return (
    <div className="submit-button">
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SubmitButton;