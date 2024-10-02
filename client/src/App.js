import React from 'react';
import MenuAppBar from './components/Menu';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from './components/Carousel';
import Message from './components/Message';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ClientDash from './components/ClientDashboard';
import PasswordResetForm from './components/PasswordResetForm.js';

import AdminPanel from './Admin/Main.tsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the student is authenticated by checking authToken in localStorage
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Menu with logo as a link */}
        <MenuAppBar />

        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <>
                <Carousel />
                <Message />
              </>
            }
          />

          {/* Redirect to home if already logged in */ /* Login Route */}
          {!isAuthenticated && <Route path="/login" element={<LoginForm />} />}

          {/* Signup Route (only accessible if not logged in) */ /* Signup Route */}
          {!isAuthenticated && <Route path="/signup" element={<SignupForm />} />}

          {/* Password Reset Route (only accessible if not logged in) */}
          {!isAuthenticated && <Route path="/reset-password" element={<PasswordResetForm />} />}

          {/* Client Dashboard (accessible only if logged in) *//* Client Dashboard Route*/}
          {isAuthenticated ? (
            <Route path="/dashboard" element={<ClientDash />} />
          ) : (
            <Route path="*" element={<Navigate to="/" />} />
          )}

          {/* Admin Panel*/}
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>

        <Footer /> {/* This will always show at the bottom */}
      </div>
    </Router>
  );
}

export default App;
