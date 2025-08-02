import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import UploadPage from './pages/UploadPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
       <Route path="/map" element={<MapPage />} />
        <Route path="/upload" element={<UploadPage />} />
      <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
};

export default App;
