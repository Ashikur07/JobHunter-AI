// src/app/dashboard/page.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const DashboardPage = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/telegram/connect-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    });

    const data = await response.json();
    if (data.success) {
      setMessage('Verification email sent! Please check your inbox.');
    } else {
      setMessage(data.message || 'An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    // Redirect to login if user is not authenticated
    const isAuthenticated = false; // Replace with actual authentication check
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [router]);

  return (
    <div>
      <h1>Dashboard</h1>
      <form onSubmit={handleEmailSubmit}>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Connect Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DashboardPage;