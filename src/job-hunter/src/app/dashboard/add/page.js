// This file handles the page for adding new items to the dashboard.

import { useState } from 'react';
import { sendVerificationEmail } from '../../../lib/mail';

const AddPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // Simulate checking the email against the database
    const isEmailRegistered = await checkEmailInDatabase(email);
    if (!isEmailRegistered) {
      setMessage('This email is not registered. Please try again.');
      return;
    }

    // Send verification email
    const token = generateToken(); // Implement token generation logic
    const emailSent = await sendVerificationEmail(email, token);
    if (emailSent) {
      setMessage('Verification email sent! Please check your inbox.');
    } else {
      setMessage('Failed to send verification email. Please try again later.');
    }
  };

  const checkEmailInDatabase = async (email) => {
    // Implement logic to check if the email exists in the database
    // This is a placeholder function
    return true; // Assume the email is registered for now
  };

  const generateToken = () => {
    // Implement logic to generate a unique token for email verification
    return 'sample-token'; // Placeholder token
  };

  return (
    <div>
      <h1>Add New Item</h1>
      <form onSubmit={handleEmailSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Connect Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddPage;