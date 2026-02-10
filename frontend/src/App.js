import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; 
import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from '@vercel/analytics/react'; 
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import OfflineBanner from './components/OfflineBanner';
import ProtectedRoute from './components/ProtectedRoute';

// ✅ Lazy Load Pages for Better Performance
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const Properties = lazy(() => import('./components/Properties'));
const PropertyDetail = lazy(() => import('./components/PropertyDetail'));
const AddProperty = lazy(() => import('./components/AddProperty'));
const SellerDashboard = lazy(() => import('./components/SellerDashboard'));
const Wishlist = lazy(() => import('./components/Wishlist'));
const CompanyDashboard = lazy(() => import('./components/CompanyDashboard'));
const CompanyRequests = lazy(() => import('./components/CompanyRequests'));
const PackersMovers = lazy(() => import('./components/PackersMovers'));
const BookMovers = lazy(() => import('./components/BookMovers'));
const MyMoves = lazy(() => import('./components/MyMoves'));
const Profile = lazy(() => import('./components/Profile'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const Chat = lazy(() => import('./components/Chat'));
const NotFound = lazy(() => import('./components/NotFound'));

// 🔄 Loading Fallback Component
const FullPageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

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
            <Suspense fallback={<FullPageLoader />}>
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
                <Route path="/packers" element={<BookMovers />} /> {/* Kept for backward compatibility */}

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
            </Suspense>
          </div>

          <Analytics />
          <SpeedInsights />
          
          {!isChatPage && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;