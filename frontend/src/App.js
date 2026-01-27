import React from 'react';
// 👇 Router hata diya, sirf Routes aur Route rakha
import { Routes, Route } from 'react-router-dom'; 
import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from '@vercel/analytics/react'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './components/Home'; 
import Login from './components/Login';
import Register from './components/Register';
import Properties from './components/Properties'; 
import AddProperty from './components/AddProperty';
import PropertyDetail from './components/PropertyDetail';
import SellerDashboard from './components/SellerDashboard'; 
import Footer from './components/Footer'; 
import Wishlist from './components/Wishlist'; 
import BookMovers from './components/BookMovers';
import CompanyDashboard from './components/CompanyDashboard';
import CompanyRequests from './components/CompanyRequests';
import ForgotPassword from './components/ForgotPassword';
import MyMoves from './components/MyMoves';
import Profile from './components/Profile';
import UserDashboard from './components/UserDashboard';

function App() {
  return (
    <ThemeProvider>
      {/* 👇 Router hata diya hai yahan se */}
      <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
          
          <Navbar />
          
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/packers" element={<BookMovers />} />
            
            <Route path="/properties" element={<Properties />} /> 
            <Route path="/add-property" element={<AddProperty />} />
            
            {/* 👇 FIX: 'property' ko 'properties' kar diya (Plural) */}
            <Route path="/properties/:id" element={<PropertyDetail />} />

            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/company-requests" element={<CompanyRequests />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/my-moves" element={<MyMoves />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />


            <Route path="/admin-dashboard" element={<div style={{textAlign: 'center', padding: '50px'}}><h2>Admin Dashboard</h2></div>} />
          </Routes>

          <Analytics />
          <Footer />
      </div>
      {/* 👆 Router closing tag bhi hat gaya */}
    </ThemeProvider>
  );
}

export default App;