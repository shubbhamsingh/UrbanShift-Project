import React from 'react';
// 👇 FIX 1: useLocation import kiya URL check karne ke liye
import { Routes, Route, useLocation } from 'react-router-dom'; 
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

// ✅ MOVERS & PACKERS COMPONENTS
import BookMovers from './components/BookMovers';
import PackersMovers from './components/PackersMovers'; 
import OfflineBanner from './components/OfflineBanner'; // 👈 ADDED OFFLINE BANNER

import CompanyDashboard from './components/CompanyDashboard';
import CompanyRequests from './components/CompanyRequests';
import ForgotPassword from './components/ForgotPassword';
import MyMoves from './components/MyMoves';
import Profile from './components/Profile';
import UserDashboard from './components/UserDashboard';
import Chat from './components/Chat'; 
import ScrollToTop from './components/ScrollToTop'; // 👈 SCROLL FIX

function App() {
  // 👇 FIX 2: Current URL path nikala
  const location = useLocation();

  // 👇 FIX 3: Check kiya ki kya hum CHAT page par hain?
  const isChatPage = location.pathname.startsWith('/chat');

  return (
    <ThemeProvider>
      <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
          
          <ScrollToTop /> {/* 👈 Har page change par top scroll */}
          <OfflineBanner /> {/* 👈 OFFLINE INDICATOR */}
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

          {/* 👇 FIX 4: Content area ko flex: 1 diya taaki wo puri bachi hui height le */}
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* ✅ MOVERS ROUTES FIXED */}
              <Route path="/packers-movers" element={<PackersMovers />} /> {/* Listing Page */}
              <Route path="/book-movers" element={<BookMovers />} />       {/* Booking Form */}
              <Route path="/packers" element={<BookMovers />} />           {/* Fallback */}
              
              <Route path="/properties" element={<Properties />} /> 
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />

              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/wishlist" element={<Wishlist />} />
              
              <Route path="/company-dashboard" element={<CompanyDashboard />} />
              <Route path="/company-requests" element={<CompanyRequests />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/my-moves" element={<MyMoves />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />

              <Route path="/chat/:userId" element={<Chat />} /> 

              <Route path="/admin-dashboard" element={<div style={{textAlign: 'center', padding: '50px'}}><h2>Admin Dashboard</h2></div>} />
            </Routes>
          </div>

          <Analytics />
          
          {/* 👇 FIX 5: Footer tabhi dikhega jab Chat page NA ho */}
          {!isChatPage && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;