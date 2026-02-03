import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; 
import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from '@vercel/analytics/react'; 
import { SpeedInsights } from '@vercel/speed-insights/react';
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
import OfflineBanner from './components/OfflineBanner';

import CompanyDashboard from './components/CompanyDashboard';
import CompanyRequests from './components/CompanyRequests';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import MyMoves from './components/MyMoves';
import Profile from './components/Profile';
import UserDashboard from './components/UserDashboard';
import Chat from './components/Chat'; 
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import NotFound from './components/NotFound'; // ✅ 404 Page
import ProtectedRoute from './components/ProtectedRoute'; // ✅ Protected Routes

function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);

  const isChatPage = location.pathname.startsWith('/chat');

  return (
    <ThemeProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
          
          <ScrollToTop />
          <OfflineBanner />
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

          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Properties (Public) */}
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              
              {/* Movers (Public) */}
              <Route path="/packers-movers" element={<PackersMovers />} />
              <Route path="/book-movers" element={<BookMovers />} />
              <Route path="/packers" element={<BookMovers />} />

              {/* ✅ PROTECTED ROUTES - Require Login */}
              <Route path="/add-property" element={
                <ProtectedRoute allowedRoles={['SELLER']}>
                  <AddProperty />
                </ProtectedRoute>
              } />
              
              <Route path="/seller-dashboard" element={
                <ProtectedRoute allowedRoles={['SELLER']}>
                  <SellerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/company-dashboard" element={
                <ProtectedRoute allowedRoles={['COMPANY']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/company-requests" element={
                <ProtectedRoute allowedRoles={['COMPANY']}>
                  <CompanyRequests />
                </ProtectedRoute>
              } />
              
              <Route path="/user-dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              
              <Route path="/my-moves" element={
                <ProtectedRoute>
                  <MyMoves />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/chat/:userId" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />

              <Route path="/admin-dashboard" element={
                <div style={{textAlign: 'center', padding: '50px'}}>
                  <h2>Admin Dashboard</h2>
                </div>
              } />
              
              {/* ✅ 404 Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          <Analytics />
          <SpeedInsights />
          
          {!isChatPage && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;