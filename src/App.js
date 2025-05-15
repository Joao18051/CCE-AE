import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './Components/LoginSingup/LoginSingup';
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  return (
    <Routes>
      {/* Default to login/signup */}
      <Route path="/" element={<LoginSignup />} />
      {/* After login, user lands here */}
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Catch‑all: redirect unknown URLs back to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;