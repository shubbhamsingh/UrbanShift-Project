import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// 👇 Toastify Imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Home from './components/Home'; 
import Login from './components/Login';
import Register from './components/Register';

// Property Components
import Properties from './components/Properties'; 
import AddProperty from './components/AddProperty';
import PropertyDetail from './components/PropertyDetail';

// Other Components
import SellerDashboard from './components/SellerDashboard'; 
import PackersMovers from './components/PackersMovers'; 
import Footer from './components/Footer'; // ✅ Footer Import
import Wishlist from './components/Wishlist'; // ✅ Import Wishlist

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            {/* Wrapper div ensure karta hai ki footer hamesha bottom me rahe */}
            
            <Navbar />
            
            {/* 👇 Toast Container Global Setup */}
            <ToastContainer 
                position="top-center" 
                autoClose={3000} 
                hideProgressBar={false} 
                newestOnTop={false} 
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover 
                theme="colored"
            />

            <Routes>
              {/* --- PUBLIC ROUTES --- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/packers" element={<PackersMovers />} />
              
              {/* --- PROPERTY ROUTES --- */}
              <Route path="/properties" element={<Properties />} /> 
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/property/:id" element={<PropertyDetail />} />

              {/* --- SELLER DASHBOARD --- */}
              <Route path="/seller-dashboard" element={<SellerDashboard />} />

              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/wishlist" element={<div style={placeholderStyle}><h2>Your DreamHome🏠 Collection (Coming Soon)</h2></div>} />
              <Route path="/company-dashboard" element={<div style={placeholderStyle}><h2>Company Dashboard</h2></div>} />
              <Route path="/admin-dashboard" element={<div style={placeholderStyle}><h2>Admin Dashboard</h2></div>} />
            </Routes>

            {/* ✅ FOOTER Added Here (Inside Router, Outside Routes) */}
            <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

// Simple style for placeholders
const placeholderStyle = {
    textAlign: 'center', 
    padding: '100px 20px', 
    color: 'var(--text-primary)',
    minHeight: '60vh'
};

export default App;