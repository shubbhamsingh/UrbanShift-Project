import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PaymentStatusModal = ({ status, onClose, title, subTitle }) => {
  if (!status) return null;

  // --- STYLES ---
  const styles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)'
    },
    card: {
      background: 'white', padding: '40px', borderRadius: '20px',
      textAlign: 'center', width: '90%', maxWidth: '400px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative',
      animation: 'slideUp 0.3s ease-out'
    },
    title: { fontSize: '1.4rem', fontWeight: 'bold', margin: '20px 0 10px', color: '#333' },
    subTitle: { fontSize: '0.95rem', color: '#666', marginBottom: '20px' },
    animBox: { height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' },
    
    // Coin
    coin: {
      width: '60px', height: '60px', background: '#f1c40f', borderRadius: '50%',
      border: '4px solid #f39c12',
      boxShadow: '0 0 15px rgba(241, 196, 15, 0.6)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      fontSize: '30px', fontWeight: 'bold', color: '#fff',
      animation: 'spin 1.5s infinite linear'
    },

    // Pulse
    pulseRing: {
      width: '80px', height: '80px', borderRadius: '50%',
      border: '4px solid #3498db', position: 'absolute',
      animation: 'pulse 1.5s infinite ease-in-out'
    },
    
    btn: {
      padding: '12px 25px', background: '#333', color: 'white', border: 'none',
      borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
    }
  };

  let content = null;

  switch (status) {
    case 'processing':
      content = (
        <>
          <div style={styles.animBox}>
            <div style={styles.coin}>₹</div>
          </div>
          <h2 style={styles.title}>{title || "Processing..."}</h2>
          <p style={styles.subTitle}>{subTitle || "Please wait completely."}</p>
        </>
      );
      break;

    case 'confirming':
      content = (
        <>
          <div style={styles.animBox}>
             <div style={{...styles.pulseRing, borderColor: '#2ecc71'}}></div>
             <div style={{...styles.coin, background: '#2ecc71', borderColor: '#27ae60', animation: 'none'}}>
                <FaCheckCircle />
             </div>
          </div>
          <h2 style={styles.title}>{title || "Confirming..."}</h2>
          <p style={styles.subTitle}>{subTitle || "Verifying details."}</p>
        </>
      );
      break;

    case 'success':
      content = (
        <>
          {/* Invoice Style Receipt */}
          <div style={{ textAlign: 'left', fontFamily: 'monospace', background: '#f9f9f9', padding: '20px', borderRadius: '10px', border: '1px dashed #ccc', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #333', paddingBottom: '15px', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, letterSpacing: '3px', fontSize: '1.3rem' }}>URBANSHIFT</h2>
              <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: '#666' }}>Official Payment Receipt</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#666' }}>Date:</span>
              <span style={{ fontWeight: 'bold' }}>{new Date().toLocaleDateString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#666' }}>Time:</span>
              <span style={{ fontWeight: 'bold' }}>{new Date().toLocaleTimeString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#666' }}>Transaction ID:</span>
              <span style={{ fontWeight: 'bold', color: '#2ecc71' }}>{subTitle || 'TXN_XXXXX'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#666' }}>Status:</span>
              <span style={{ fontWeight: 'bold', color: '#2ecc71' }}>✓ PAID</span>
            </div>
            
            <div style={{ borderTop: '2px dashed #333', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
              <span style={{ fontWeight: 'bold' }}>TOTAL PAID</span>
              <span style={{ fontWeight: 'bold', color: '#2ecc71' }}>₹5,000.00</span>
            </div>
            
            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#888', marginTop: '15px', marginBottom: 0 }}>
              *** Thank you for your payment! ***<br/>Save this receipt for your records.
            </p>
          </div>
          
          <FaCheckCircle size={40} color="#2ecc71" style={{ marginBottom: '10px' }} />
          <h2 style={{...styles.title, margin: '10px 0'}}>{title || "Payment Successful! 🎉"}</h2>
          <button onClick={onClose} style={{...styles.btn, background: '#2ecc71'}}>Continue to Dashboard</button>
        </>
      );
      break;

    case 'failed':
      content = (
        <>
           <div style={styles.animBox}>
             <FaTimesCircle size={80} color="#e74c3c" />
          </div>
          <h2 style={{...styles.title, color: '#e74c3c'}}>Failed</h2>
          <p style={styles.subTitle}>Something went wrong.</p>
          <button onClick={onClose} style={{...styles.btn, background: '#e74c3c'}}>Close</button>
        </>
      );
      break;

    default: return null;
  }

  return (
    <div style={styles.overlay}>
      <style>{`
        @keyframes spin { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
        @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
      `}</style>
      <div style={styles.card}>{content}</div>
    </div>
  );
};
export default PaymentStatusModal;