import React, { useState, useEffect } from 'react';

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      backgroundColor: '#333',
      color: 'white',
      textAlign: 'center',
      padding: '10px',
      zIndex: '10000',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.2)'
    }}>
      ⚠️ You are currently offline. Some features may not be available.
    </div>
  );
};

export default OfflineBanner;
