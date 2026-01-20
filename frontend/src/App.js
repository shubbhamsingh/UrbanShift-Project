import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components Import
import Navbar from './components/Navbar';
import PropertyList from './components/PropertyList';
import PropertyDetail from './components/PropertyDetail';
import PackersMovers from './components/PackersMovers';
import Login from './components/Login'; // ✅ Ye rahi Login ki sahi import

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<h1>🏠 Home Page - Welcome to UrbanShift</h1>} />
          
          {/* Properties List */}
          <Route path="/properties" element={<PropertyList />} />
          
          {/* Property Details */}
          <Route path="/properties/:id" element={<PropertyDetail />} />

          {/* Packers & Movers */}
          <Route path="/movers" element={<PackersMovers />} />

          {/* ✅ Login Route (Isse page khulega) */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;