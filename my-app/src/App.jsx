import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import UploadPage from './pages/UploadPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import AuthRoute from '../components/AuthRoute';
import { Toaster } from 'sonner';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/check-auth', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
     <Toaster richColors position="top-center" />
   <Routes>
  <Route path="/" element={<Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />

  <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
  <Route path="/signup" element={<SignupPage setIsAuthenticated={setIsAuthenticated} />} />

  <Route element={<AuthRoute isAuthenticated={isAuthenticated} />}>
    <Route path="/map" element={<MapPage />} />
    <Route path="/upload" element={<UploadPage />} />
  </Route>
</Routes>
   </>
  );
};

export default App;