import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import SellerDashboard from './components/SellerDashboard'; // ✅ Import confirm karein

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import PropertyList from './components/PropertyList';
import AddProperty from './components/AddProperty';
import PropertyDetail from './components/PropertyDetail';
import PackersMovers from './components/PackersMovers'; 

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/packers" element={<PackersMovers />} />
          
          {/* Property Routes */}
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/property/:id" element={<PropertyDetail />} />

          {/* ✅ SELLER DASHBOARD (Ye line zaroori hai!) */}
          <Route path="/seller-dashboard" element={<SellerDashboard />} />

          {/* Placeholders (Future Features) */}
          <Route path="/wishlist" element={<div style={{textAlign:'center', padding:'50px', color:'var(--text-primary)'}}><h2>Your DreamHome🏠 Collection (Coming Soon)</h2></div>} />
          <Route path="/company-dashboard" element={<div style={{padding:'50px'}}>Company Dashboard</div>} />
          <Route path="/admin-dashboard" element={<div style={{padding:'50px'}}>Admin Dashboard</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;