import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'; // 👈 useRef added
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBoxOpen, FaPhone, FaUserTie, FaTruck, FaStar, FaTimes, FaCreditCard, FaCheckCircle, FaReceipt } from 'react-icons/fa';
import PaymentStatusModal from './PaymentStatusModal'; 
import ReceiptModal from './ReceiptModal'; // 👈 Receipt Modal Import 

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const MyMoves = ({ filterType = 'all' }) => {
    const navigate = useNavigate(); // 👈 For redirect after payment
    const [moves, setMoves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null); 
    
    // 👈 Ref for tracking success (Fixes closure issue)
    const isPaymentSuccess = useRef(false);

    // ✅ Theme Logic
    const { mode } = useContext(ThemeContext);
    const isDark = mode === 'dark' || (
        mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    // Review & Payment States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMoveId, setCurrentMoveId] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    // Receipt Modal State
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [selectedMoveForReceipt, setSelectedMoveForReceipt] = useState(null);

    // Smart URL
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const BASE_URL = isLocal
        ? "http://127.0.0.1:8000"
        : "https://urbanshift-project.onrender.com";

    const fetchMyMoves = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_URL}/api/relocation/my-moves/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMoves(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load your bookings");
            setLoading(false);
        }
    }, [BASE_URL]);

    useEffect(() => {
        fetchMyMoves();
    }, [fetchMyMoves]);

    // --- REAL RAZORPAY HANDLER (Fixed Logic) ---
    const handlePayment = async (moveId) => {
        // Reset Ref
        isPaymentSuccess.current = false;
        
        // 1. START PROCESSING ANIMATION
        setPaymentStatus('processing'); 

        try {
            const token = localStorage.getItem('token');
            const AMOUNT = 5000; 

            // API Call to Create Order
            const orderRes = await axios.post(`${BASE_URL}/api/payments/create-order/`, 
                { amount: AMOUNT, move_id: moveId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { order_id, key, amount } = orderRes.data;

            const options = {
                key: key, 
                amount: amount * 100,
                currency: "INR",
                name: "UrbanShift",
                description: "Move Booking Payment",
                image: "/logo.png",
                order_id: order_id,
                handler: async function (response) {
                    // Mark success so ondismiss doesn't close modal
                    isPaymentSuccess.current = true;

                    // 2. PAYMENT DONE -> SHOW SAME SPINNING COIN ANIMATION
                    setPaymentStatus('processing'); // Same coin animation

                    try {
                        await axios.post(`${BASE_URL}/api/payments/verify-payment/`, {
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                          move_id: moveId
                        }, { headers: { Authorization: `Bearer ${token}` } });
                        
                        // 3. SUCCESS ANIMATION
                        setPaymentStatus('success');
                        fetchMyMoves(); 
                    } catch (err) {
                        console.error(err);
                        setPaymentStatus('failed'); 
                    }
                },
                modal: {
                    // Razorpay band hone par check karein ki success hua tha ya nahi
                    ondismiss: function() {
                        if (!isPaymentSuccess.current) {
                            setPaymentStatus(null);
                        }
                    }
                },
                prefill: {
                    name: "UrbanShift User",
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#2ecc71"
                }
            };

            // Thoda delay taaki user "Processing" animation dekh sake
            setTimeout(() => {
                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response){
                    setPaymentStatus('failed');
                });
                rzp1.open();
                
                // Note: Hum yahan 'null' set nahi kar rahe, 
                // Razorpay open hone par 'processing' modal ke upar popup aayega.
                // Agar aap chahte hain ki peeche coin ghummna band ho jaye to setPaymentStatus(null) uncomment karein.
                // Lekin 'Processing' dikhte rehna better UX hai jab tak popup load na ho jaye.
                
                // Let's keep Processing ON until user interacts with Popup or Dismisses it.
                // setPaymentStatus(null); 
            }, 1500);

        } catch (error) {
            console.error(error);
            setPaymentStatus('failed');
        }
    };

    // --- REVIEW HANDLERS ---
    const openReviewModal = (moveId) => {
        setCurrentMoveId(moveId);
        setRating(0);
        setComment('');
        setIsModalOpen(true);
    };

    const closeReviewModal = () => {
        setIsModalOpen(false);
        setCurrentMoveId(null);
    };

    const submitReview = async () => {
        if (rating === 0) {
            toast.warning("Please select a star rating! ⭐");
            return;
        }

        setReviewLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}/api/relocation/move-requests/${currentMoveId}/add-review/`,
                { rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Review Submitted! Thank you! 🎉");
            fetchMyMoves();
            closeReviewModal();

        } catch (error) {
            console.error(error);
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Failed to submit review.");
            }
        } finally {
            setReviewLoading(false);
        }
    };

    let displayedMoves = [];
    if (filterType === 'ongoing') {
        displayedMoves = moves.filter(m => ['PENDING', 'ACCEPTED'].includes(m.status));
    } else if (filterType === 'history') {
        displayedMoves = moves.filter(m => ['COMPLETED', 'CANCELLED'].includes(m.status));
    } else {
        displayedMoves = moves;
    }

    const colors = {
        cardBg: isDark ? '#1e1e1e' : '#ffffff',
        text: isDark ? '#ffffff' : '#333333',
        subText: isDark ? '#bbbbbb' : '#666666',
        border: isDark ? '#333' : '#e0e0e0',
        shadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.05)',
        companyBg: isDark ? 'rgba(46, 204, 113, 0.1)' : '#f0f9f4',
        pendingBg: isDark ? 'rgba(241, 196, 15, 0.1)' : '#fff8e1'
    };

    if (loading) return (
        <div style={{ minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h3 style={{ color: colors.text }}>⏳ Loading your moves...</h3>
        </div>
    );

    if (displayedMoves.length === 0) {
        return (
            <div style={{ ...emptyStateStyle, background: colors.cardBg, border: `1px dashed ${colors.border}` }}>
                <FaTruck size={40} color={colors.subText} />
                <h3 style={{ color: colors.subText, marginTop: '10px' }}>
                    {filterType === 'ongoing' ? "No active bookings." : "No booking history."}
                </h3>
                {filterType === 'ongoing' && (
                    <div style={{ marginTop: '20px' }}>
                        <p style={{ color: colors.subText, marginBottom: '15px' }}>Ready to move? Book verified packers now.</p>
                        <Link to="/packers-movers" style={bookBtnStyle}>
                            🚀 Book Movers
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div style={gridStyle}>
                {displayedMoves.map((move) => (
                    <MoveCard
                        key={move.id}
                        move={move}
                        colors={colors}
                        onPayClick={() => handlePayment(move.id)}
                        onReviewClick={() => openReviewModal(move.id)}
                        onReceiptClick={() => {
                            setSelectedMoveForReceipt(move);
                            setReceiptOpen(true);
                        }}
                    />
                ))}
            </div>

            {/* Receipt Modal */}
            <ReceiptModal 
                isOpen={receiptOpen}
                onClose={() => setReceiptOpen(false)}
                data={selectedMoveForReceipt ? {
                    transactionId: selectedMoveForReceipt.transaction_id || `REQ_${selectedMoveForReceipt.id}`,
                    date: new Date(selectedMoveForReceipt.created_at).toLocaleDateString('en-IN'),
                    time: new Date(selectedMoveForReceipt.created_at).toLocaleTimeString('en-IN'),
                    amount: selectedMoveForReceipt.payment_amount || 5000,
                    from: selectedMoveForReceipt.source,
                    to: selectedMoveForReceipt.destination,
                    moveSize: selectedMoveForReceipt.move_size,
                    status: selectedMoveForReceipt.is_paid ? 'PAID' : 'PENDING'
                } : {}}
            />

            {isModalOpen && (
                <div style={modalOverlay}>
                    <div style={{ ...modalContent, background: isDark ? '#2c3e50' : 'white', color: isDark ? 'white' : 'black' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>Rate Service</h3>
                            <FaTimes onClick={closeReviewModal} style={{ cursor: 'pointer', color: '#888' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={30}
                                    color={star <= rating ? "#f1c40f" : "#ddd"}
                                    style={{ cursor: 'pointer', transition: '0.2s' }}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>

                        <textarea
                            rows="3"
                            placeholder="How was your experience?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ ...textAreaStyle, background: isDark ? '#1a252f' : '#f9f9f9', color: isDark ? 'white' : 'black' }}
                        />

                        <button onClick={submitReview} style={submitBtnStyle} disabled={reviewLoading}>
                            {reviewLoading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </div>
            )}

            {/* PAYMENT ANIMATION MODAL */}
            <PaymentStatusModal 
                status={paymentStatus} 
                onClose={() => {
                    setPaymentStatus(null);
                    if (paymentStatus === 'success') {
                        // Redirect to Booking History tab
                        navigate('/user-dashboard?tab=history');
                        toast.success("Redirecting to Booking History...");
                    }
                }} 
            />
        </div>
    );
};

// --- REUSABLE COMPONENTS REMAIN SAME ---
const MoveCard = ({ move, colors, onPayClick, onReviewClick, onReceiptClick }) => {
    return (
        <div style={{
            ...cardStyle,
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow
        }}>
            <div style={{ ...statusBadge, background: getStatusColor(move.status) }}>
                {move.status}
            </div>
            <h3 style={{ color: colors.text, fontSize: '1.2rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaMapMarkerAlt color="#ff7e5f" /> {move.source} <span style={{ color: colors.subText }}>➝</span> {move.destination}
            </h3>
            <div style={{ ...lineDivider, background: colors.border }}></div>
            <div style={{ ...detailGrid, color: colors.subText }}>
                <p style={detailItem}><FaCalendarAlt /> {move.move_date}</p>
                <p style={detailItem}><FaTruck /> {move.move_size}</p>
            </div>
            <div style={{ marginTop: '10px', background: colors.pendingBg, padding: '10px', borderRadius: '5px' }}>
                <p style={{ color: colors.text, fontSize: '0.9rem', display: 'flex', gap: '5px' }}>
                    <FaBoxOpen style={{ marginTop: '3px', color: '#f39c12' }} />
                    <span>{move.items_list || "No items listed"}</span>
                </p>
            </div>
            {(move.status === 'ACCEPTED' || move.status === 'COMPLETED') && move.company_name && (
                <div style={{ ...companyCardStyle, background: colors.companyBg, borderColor: colors.border }}>
                    <h4 style={{ margin: '0 0 10px 0', color: move.status === 'COMPLETED' ? '#3498db' : '#2ecc71', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {move.status === 'COMPLETED' ? '🏁 Job Completed by:' : '✅ Accepted by:'}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: colors.text }}>
                        <div style={contactRow}><FaUserTie /> <span>{move.company_name}</span></div>
                        <div style={contactRow}><FaPhone /> <a href={`tel:${move.company_phone}`} style={linkStyle}>{move.company_phone}</a></div>
                    </div>
                    <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: `1px solid ${colors.border}` }}>
                        {move.is_paid ? (
                            <div>
                                <div style={paidBadge}>
                                    <FaCheckCircle /> Payment Successful <br />
                                    <small style={{ fontSize: '0.8rem', opacity: 0.8 }}>Txn ID: {move.transaction_id}</small>
                                </div>
                                <button onClick={onReceiptClick} style={{ ...receiptBtnStyle, marginTop: '10px' }}>
                                    <FaReceipt /> View Receipt
                                </button>
                            </div>
                        ) : (
                            move.status === 'ACCEPTED' && (
                                <button onClick={onPayClick} style={payBtnStyle}>
                                    <FaCreditCard /> Pay Now (₹5000)
                                </button>
                            )
                        )}
                    </div>
                </div>
            )}
            {move.status === 'COMPLETED' && (
                <div style={{ marginTop: '15px' }}>
                    {move.review ? (
                        <div style={reviewedBadge}>
                            ✅ You Rated: <strong>{move.review.rating} ★</strong>
                        </div>
                    ) : (
                        <button onClick={onReviewClick} style={reviewBtnStyle}>
                            ⭐ Write a Review
                        </button>
                    )}
                </div>
            )}
            {move.status === 'PENDING' && (
                <div style={{ ...pendingBoxStyle, background: colors.pendingBg, borderColor: colors.border }}>
                    ⏳ <strong>Waiting for Movers...</strong> <br />
                    <small style={{ color: colors.subText }}>Verified movers will accept shortly.</small>
                </div>
            )}
        </div>
    );
};

const getStatusColor = (s) => s === 'PENDING' ? '#f1c40f' : s === 'ACCEPTED' ? '#2ecc71' : s === 'COMPLETED' ? '#3498db' : '#e74c3c';
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' };
const cardStyle = { padding: '20px', borderRadius: '15px', position: 'relative', transition: '0.3s' };
const statusBadge = { position: 'absolute', top: '15px', right: '15px', padding: '4px 10px', borderRadius: '10px', color: '#000', fontWeight: 'bold', fontSize: '0.7rem' };
const emptyStateStyle = { textAlign: 'center', padding: '40px', borderRadius: '15px' };
const bookBtnStyle = { background: 'linear-gradient(135deg, #FF9966, #FF5E62)', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' };
const payBtnStyle = { width: '100%', padding: '8px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '5px' };
const reviewBtnStyle = { width: '100%', padding: '8px', background: '#f1c40f', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const paidBadge = { background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #2ecc71' };
const receiptBtnStyle = { width: '100%', padding: '8px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' };
const reviewedBadge = { width: '100%', padding: '10px', background: 'rgba(241, 196, 15, 0.2)', color: '#f1c40f', border: '1px solid #f1c40f', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' };
const companyCardStyle = { marginTop: '20px', padding: '15px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)' };
const contactRow = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' };
const linkStyle = { color: '#3498db', textDecoration: 'none' };
const pendingBoxStyle = { marginTop: '20px', padding: '15px', borderRadius: '10px', color: '#f1c40f', border: '1px solid' };
const lineDivider = { height: '1px', margin: '15px 0' };
const detailGrid = { display: 'flex', gap: '15px', fontSize: '0.9rem' };
const detailItem = { display: 'flex', alignItems: 'center', gap: '6px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { padding: '25px', borderRadius: '15px', width: '90%', maxWidth: '350px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' };
const textAreaStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: 'none', marginTop: '15px', marginBottom: '15px', resize: 'vertical' };
const submitBtnStyle = { width: '100%', padding: '10px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default MyMoves;