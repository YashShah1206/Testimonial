import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Wall from './pages/Wall';
import Widget from './pages/Widget';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wall" element={<Wall />} />
        <Route path="/widget" element={<Widget />} />
      </Routes>
    </Router>
  );
};

export default App;
