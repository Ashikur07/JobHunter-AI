// src/app/layout.js
import React from 'react';
import './globals.css';

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Job Hunter AI</h1>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/register">Register</a></li>
              <li><a href="/signin">Sign In</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>&copy; {new Date().getFullYear()} Job Hunter AI. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
};

export default Layout;