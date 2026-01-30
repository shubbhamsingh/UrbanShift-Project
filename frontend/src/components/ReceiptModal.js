import React from 'react';
import { FaTimes, FaPrint } from 'react-icons/fa';

/**
 * Reusable Receipt Modal Component
 * Shows invoice/receipt details for any completed transaction
 */
const ReceiptModal = ({ isOpen, onClose, data = {} }) => {
    if (!isOpen) return null;

    const {
        transactionId = 'N/A',
        date = new Date().toLocaleDateString('en-IN'),
        time = new Date().toLocaleTimeString('en-IN'),
        amount = 0,
        from = 'N/A',
        to = 'N/A',
        moveSize = 'N/A',
        status = 'PAID'
    } = data;

    const handlePrint = () => window.print();

    const styles = {
        overlay: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 3000,
            backdropFilter: 'blur(5px)'
        },
        paper: {
            background: '#fff', width: '90%', maxWidth: '400px',
            padding: '30px', borderRadius: '15px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            fontFamily: 'monospace', color: '#333', position: 'relative'
        },
        header: {
            textAlign: 'center', borderBottom: '2px dashed #333',
            paddingBottom: '15px', marginBottom: '20px'
        },
        row: {
            display: 'flex', justifyContent: 'space-between',
            marginBottom: '10px', fontSize: '0.9rem',
            borderBottom: '1px dashed #ddd', paddingBottom: '8px'
        },
        totalRow: {
            display: 'flex', justifyContent: 'space-between',
            marginTop: '15px', paddingTop: '15px',
            borderTop: '2px dashed #333', fontSize: '1.1rem', fontWeight: 'bold'
        },
        closeBtn: {
            position: 'absolute', top: '15px', right: '15px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '1.3rem', color: '#888'
        },
        printBtn: {
            marginTop: '20px', width: '100%', padding: '12px',
            background: '#333', color: 'white', border: 'none',
            borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.paper} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeBtn} onClick={onClose}><FaTimes /></button>
                
                {/* Header */}
                <div style={styles.header}>
                    <h2 style={{ margin: 0, letterSpacing: '3px', fontSize: '1.5rem' }}>URBANSHIFT</h2>
                    <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#666' }}>Official Payment Receipt</p>
                </div>

                {/* Details */}
                <div style={styles.row}><span>Date:</span><span>{date}</span></div>
                <div style={styles.row}><span>Time:</span><span>{time}</span></div>
                <div style={styles.row}><span>Transaction ID:</span><span style={{ color: '#2ecc71' }}>{transactionId}</span></div>
                <div style={styles.row}><span>From:</span><span>{from}</span></div>
                <div style={styles.row}><span>To:</span><span>{to}</span></div>
                <div style={styles.row}><span>Move Size:</span><span>{moveSize}</span></div>
                <div style={styles.row}><span>Status:</span><span style={{ color: status === 'PAID' ? '#2ecc71' : '#f39c12' }}>✓ {status}</span></div>
                
                {/* Total */}
                <div style={styles.totalRow}>
                    <span>TOTAL PAID</span>
                    <span style={{ color: '#2ecc71' }}>₹{Number(amount).toLocaleString('en-IN')}</span>
                </div>

                {/* Footer */}
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#888', marginTop: '20px' }}>
                    *** Thank you for your payment! ***<br/>
                    Show this receipt to the mover if needed.
                </p>

                <button style={styles.printBtn} onClick={handlePrint}>
                    <FaPrint /> Print Receipt
                </button>
            </div>
        </div>
    );
};

export default ReceiptModal;
