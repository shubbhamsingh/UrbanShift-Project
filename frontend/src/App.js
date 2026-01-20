import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PropertyList from './components/PropertyList';
import PropertyDetail from './components/PropertyDetail'; // ✅ Ye nayi file import ki hai

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<h1>🏠 Home Page - Welcome to UrbanShift</h1>} />
          <Route path="/properties" element={<PropertyList />} />
          
          {/* 👇 Ye nayi line hai jo detail page kholegi 👇 */}
          <Route path="/properties/:id" element={<PropertyDetail />} />

          <Route path="/movers" element={<h1>🚚 Packers & Movers Service (Coming Soon)</h1>} />
          <Route path="/login" element={<h1>🔑 Login Page (Coming Soon)</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;