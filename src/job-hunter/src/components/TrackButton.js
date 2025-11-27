// src/components/TrackButton.js
import React from 'react';

const TrackButton = ({ onClick, label }) => {
  return (
    <button 
      onClick={onClick} 
      style={{
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
      }}
    >
      {label}
    </button>
  );
};

export default TrackButton;