// src/components/JobModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';

const JobModal = ({ isOpen, onRequestClose, job }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // Call the API to send verification email
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (data.success) {
      setMessage('Verification email sent! Please check your inbox.');
    } else {
      setMessage(data.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>{job ? job.title : 'Job Details'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Connect your email for website login:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default JobModal;