import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'; // 👈 Added
import { FaMapMarkerAlt, FaCalendarAlt, FaPhone, FaArrowLeft, FaHome } from 'react-icons/fa';
import PaymentStatusModal from './PaymentStatusModal'; 
import SuccessScreen from './SuccessScreen'; // 👈 IMPORT NEW SCREEN

import { ThemeContext } from '../context/ThemeContext';

const PackersMovers = () => {
    const navigate = useNavigate();
    const { mode } = useContext(ThemeContext);
    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Backend URL
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const BASE_URL = isLocal ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";

    // --- STATES ---
    const [formData, setFormData] = useState({ fromLocation: '', toLocation: '', moveDate: '', contact: '', moveSize: '1BHK' });
    const [step, setStep] = useState(1); 
    const [estimatedPrice, setEstimatedPrice] = useState(0);

    const [txnId, setTxnId] = useState('');
    const [status, setStatus] = useState(null); 
    const [modalText, setModalText] = useState({ title: '', sub: '' });

    const BOOKING_AMOUNT = 500;

    // --- HANDLERS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleQuoteSubmit = (e) => {
        e.preventDefault();
        setModalText({ title: "Calculating Quote...", sub: "Analyzing distance & load volumes..." });
        setStatus('processing');

        setTimeout(() => {
            setStatus(null);
            setEstimatedPrice(Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000);
            setStep(2);
        }, 2000);
    };

    const handleBookNow = async () => {
        const token = localStorage.getItem('token');
        if (!token) { toast.error("Please Login first! 🔒"); navigate('/login'); return; }

        setModalText({ title: "Confirming Booking...", sub: "Saving your move request..." });
        setStatus('processing');

        try {
            // 👇 Backend API Call to Save Move Request
            const response = await axios.post(`${BASE_URL}/api/relocation/submit/`, {
                source: formData.fromLocation,
                destination: formData.toLocation,
                move_date: formData.moveDate,
                move_size: formData.moveSize,
                items_list: `Contact: ${formData.contact}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Move Request Created:", response.data);
            
            const newTxnId = `REQ_${response.data.id || Math.floor(Math.random() * 1000000)}`;
            setTxnId(newTxnId);
            setStatus(null);
            setStep(3);
            toast.success("Booking Request Submitted! 🎉");

        } catch (error) {
            console.error("Booking Error:", error);
            setStatus(null);
            toast.error(error.response?.data?.detail || "Failed to submit booking. Please try again.");
        }
    };

    // --- STYLES ---
    const colors = {
        bg: isDark ? '#121212' : '#f4f6f8',
        card: isDark ? '#1e1e1e' : '#ffffff',
        text: isDark ? '#ffffff' : '#333333',
        subText: isDark ? '#aaaaaa' : '#666666',
        primary: '#f1c40f',
        inputBg: isDark ? '#2c2c2c' : '#f9f9f9',
        border: isDark ? '#333' : '#e0e0e0',
        shadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.1)'
    };

    const styles = {
        page: { minHeight: '100vh', padding: '40px 20px', background: colors.bg, color: colors.text, display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.3s' },
        container: { width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' },
        heroBox: { display: 'flex', flexDirection: 'column', gap: '20px' },
        heroTitle: { fontSize: '3rem', lineHeight: '1.2', fontWeight: '800', background: 'linear-gradient(to right, #f1c40f, #e67e22)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
        heroSub: { fontSize: '1.1rem', color: colors.subText },
        formCard: { background: colors.card, padding: '40px', borderRadius: '20px', boxShadow: colors.shadow, border: `1px solid ${colors.border}`, position: 'relative', overflow: 'hidden' },
        label: { fontSize: '0.9rem', fontWeight: 'bold', color: colors.subText, marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' },
        input: { width: '100%', padding: '14px', borderRadius: '10px', border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, outline: 'none', fontSize: '1rem', marginBottom: '20px', transition: '0.3s' },
        btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #f1c40f, #f39c12)', color: 'black', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: '0.3s', boxShadow: '0 5px 15px rgba(241, 196, 15, 0.3)' },
    };

    // If Success Step -> Show New Screen Directly (Full Page)
    if (step === 3) {
        return (
            <SuccessScreen 
                totalPrice={BOOKING_AMOUNT} 
                paymentDetails={{ id: txnId, date: new Date().toLocaleDateString() }} 
                onClose={() => navigate('/user-dashboard')}
            />
        );
    }

    return (
        <div style={styles.page}>
            <style>{`
            @keyframes pop { 0% { transform: scale(0); opacity:0; } 50% { transform: scale(1.2); } 100% { transform: scale(1); opacity:1; } }
            .pop-in { animation: pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            @media (max-width: 768px) { .grid-container { grid-template-columns: 1fr !important; } }
        `}</style>
            
            {/* Standard Processing/Confirming Animations */}
            <PaymentStatusModal status={status} title={modalText.title} subTitle={modalText.sub} />

            <div className="grid-container" style={styles.container}>
                <div style={styles.heroBox}>
                    <h1 style={styles.heroTitle}>Move Easy,<br />Move Safe. 🚚</h1>
                    <p style={styles.heroSub}>India's most trusted Packers & Movers booking platform.</p>
                </div>

                <div style={styles.formCard}>
                    {step === 1 && (
                        <form onSubmit={handleQuoteSubmit} className="pop-in">
                            <h2 style={{ margin: '0 0 20px 0', color: colors.text }}>Get Free Quote</h2>
                            <div><label style={styles.label}><FaMapMarkerAlt /> From</label><input name="fromLocation" placeholder="Current City" value={formData.fromLocation} onChange={handleChange} required style={styles.input} /></div>
                            <div><label style={styles.label}><FaMapMarkerAlt /> To</label><input name="toLocation" placeholder="Destination City" value={formData.toLocation} onChange={handleChange} required style={styles.input} /></div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}><label style={styles.label}><FaCalendarAlt /> Date</label><input name="moveDate" type="date" value={formData.moveDate} onChange={handleChange} required style={styles.input} /></div>
                                <div style={{ flex: 1 }}><label style={styles.label}><FaPhone /> Mobile</label><input name="contact" placeholder="9876..." value={formData.contact} onChange={handleChange} required style={styles.input} /></div>
                            </div>
                            <div><label style={styles.label}><FaHome /> Home Size</label>
                                <select name="moveSize" value={formData.moveSize} onChange={handleChange} required style={styles.input}>
                                    <option value="1BHK">1 BHK</option>
                                    <option value="2BHK">2 BHK</option>
                                    <option value="3BHK">3 BHK</option>
                                    <option value="4BHK">4+ BHK</option>
                                    <option value="OFFICE">Office</option>
                                </select>
                            </div>
                            <button type="submit" style={styles.btn}>🚀 Check Prices</button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="pop-in" style={{ textAlign: 'center' }}>
                            <button onClick={() => setStep(1)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: colors.subText, cursor: 'pointer' }}><FaArrowLeft /> Back</button>
                            <h2 style={{ color: colors.text }}>Estimated Cost</h2>
                            <h1 style={{ fontSize: '3.5rem', color: '#2ecc71', margin: '10px 0' }}>₹{estimatedPrice.toLocaleString()}</h1>
                            <p style={{ color: colors.subText }}>Includes Packing & Moving</p>
                            <div style={{ background: isDark ? 'rgba(241, 196, 15, 0.1)' : '#fff3cd', padding: '15px', borderRadius: '10px', margin: '20px 0', border: '1px dashed #f1c40f' }}>
                                <strong style={{ color: '#f39c12' }}>Token Amount: ₹{BOOKING_AMOUNT}</strong>
                                <div style={{ fontSize: '0.8rem', color: colors.text }}>Pay token to confirm slot.</div>
                            </div>
                            <button onClick={handleBookNow} style={styles.btn}>💳 Pay ₹{BOOKING_AMOUNT} & Book</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PackersMovers;