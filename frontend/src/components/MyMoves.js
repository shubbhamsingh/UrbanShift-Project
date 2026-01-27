import React, { useEffect, useState, useContext, useCallback } from 'react'; // ✅ useCallback import kiya
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBoxOpen, FaPhone, FaUserTie, FaTruck, FaStar, FaTimes, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const MyMoves = ({ filterType = 'all' }) => {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Smart URL
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BASE_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  // ✅ FIX: fetchMyMoves ko useCallback me dala taaki ise useEffect aur buttons dono jagah use kar sakein
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
  }, [BASE_URL]); // Dependency added

  // ✅ useEffect ab fetchMyMoves par depend karega
  useEffect(() => {
    fetchMyMoves();
  }, [fetchMyMoves]);

  // --- PAYMENT HANDLER ---
  const handlePayment = async (moveId) => {
      if(!window.confirm("Confirm Payment of ₹5000? (This is a Mock Payment)")) return;

      try {
          const token = localStorage.getItem('token');
          await axios.post(`${BASE_URL}/api/relocation/move-requests/${moveId}/pay/`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
          toast.success("Payment Successful! 💸");
          fetchMyMoves(); 
      } catch (error) {
          console.error(error);
          toast.error("Payment Failed");
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

  // Filter Logic
  let displayedMoves = [];
  if (filterType === 'ongoing') {
      displayedMoves = moves.filter(m => ['PENDING', 'ACCEPTED'].includes(m.status));
  } else if (filterType === 'history') {
      displayedMoves = moves.filter(m => ['COMPLETED', 'CANCELLED'].includes(m.status));
  } else {
      displayedMoves = moves; 
  }

  // --- DYNAMIC COLORS ---
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
    <div style={{minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <h3 style={{color: colors.text}}>⏳ Loading your moves...</h3>
    </div>
  );

  if (displayedMoves.length === 0) {
      return (
        <div style={{...emptyStateStyle, background: colors.cardBg, border: `1px dashed ${colors.border}`}}>
            <FaTruck size={40} color={colors.subText} />
            <h3 style={{color: colors.subText, marginTop: '10px'}}>
                {filterType === 'ongoing' ? "No active bookings." : "No booking history."}
            </h3>
            {filterType === 'ongoing' && (
                <div style={{marginTop: '20px'}}>
                    <p style={{color: colors.subText, marginBottom: '15px'}}>Ready to move? Book verified packers now.</p>
                    <Link to="/packers" style={bookBtnStyle}>
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
                    // ✅ Fix: No opacity/blur for history
                    colors={colors}
                    onPayClick={() => handlePayment(move.id)}
                    onReviewClick={() => openReviewModal(move.id)}
                />
            ))}
        </div>

        {/* --- REVIEW MODAL --- */}
        {isModalOpen && (
            <div style={modalOverlay}>
                <div style={{...modalContent, background: isDark ? '#2c3e50' : 'white', color: isDark ? 'white' : 'black'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                        <h3 style={{margin:0}}>Rate Service</h3>
                        <FaTimes onClick={closeReviewModal} style={{cursor:'pointer', color:'#888'}} />
                    </div>

                    <div style={{display:'flex', gap:'10px', marginBottom:'20px', justifyContent:'center'}}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar 
                                key={star} 
                                size={30} 
                                color={star <= rating ? "#f1c40f" : "#ddd"} 
                                style={{cursor: 'pointer', transition: '0.2s'}}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>

                    <textarea 
                        rows="3" 
                        placeholder="How was your experience?" 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{...textAreaStyle, background: isDark ? '#1a252f' : '#f9f9f9', color: isDark ? 'white' : 'black'}}
                    />

                    <button onClick={submitReview} style={submitBtnStyle} disabled={reviewLoading}>
                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

// --- REUSABLE CARD COMPONENT ---
const MoveCard = ({ move, colors, onPayClick, onReviewClick }) => {
    return (
        <div style={{
            ...cardStyle, 
            background: colors.cardBg, 
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow
        }}>
            {/* Status Badge */}
            <div style={{...statusBadge, background: getStatusColor(move.status)}}>
                {move.status}
            </div>

            {/* Route Info */}
            <h3 style={{color: colors.text, fontSize: '1.2rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <FaMapMarkerAlt color="#ff7e5f" /> {move.source} <span style={{color: colors.subText}}>➝</span> {move.destination}
            </h3>

            <div style={{...lineDivider, background: colors.border}}></div>

            {/* Move Details */}
            <div style={{...detailGrid, color: colors.subText}}>
                <p style={detailItem}><FaCalendarAlt /> {move.move_date}</p>
                <p style={detailItem}><FaTruck /> {move.move_size}</p>
            </div>
            
            <div style={{marginTop: '10px', background: colors.pendingBg, padding: '10px', borderRadius: '5px'}}>
                <p style={{color: colors.text, fontSize: '0.9rem', display: 'flex', gap: '5px'}}>
                    <FaBoxOpen style={{marginTop:'3px', color: '#f39c12'}} /> 
                    <span>{move.items_list || "No items listed"}</span>
                </p>
            </div>

            {/* --- COMPANY DETAILS & PAYMENT --- */}
            {(move.status === 'ACCEPTED' || move.status === 'COMPLETED') && move.company_name && (
                <div style={{...companyCardStyle, background: colors.companyBg, borderColor: colors.border}}>
                    <h4 style={{margin:'0 0 10px 0', color: move.status === 'COMPLETED' ? '#3498db' : '#2ecc71', display:'flex', alignItems:'center', gap:'5px'}}>
                         {move.status === 'COMPLETED' ? '🏁 Job Completed by:' : '✅ Accepted by:'}
                    </h4>
                    
                    <div style={{display:'flex', flexDirection:'column', gap:'8px', color: colors.text}}>
                        <div style={contactRow}><FaUserTie /> <span>{move.company_name}</span></div>
                        <div style={contactRow}><FaPhone /> <a href={`tel:${move.company_phone}`} style={linkStyle}>{move.company_phone}</a></div>
                    </div>

                    {/* PAYMENT BUTTON */}
                    <div style={{marginTop: '15px', paddingTop: '10px', borderTop: `1px solid ${colors.border}`}}>
                        {move.is_paid ? (
                             <div style={paidBadge}>
                                <FaCheckCircle /> Payment Successful <br/>
                                <small style={{fontSize: '0.8rem', opacity: 0.8}}>Txn ID: {move.transaction_id}</small>
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

            {/* --- REVIEW BUTTON (History Only) --- */}
            {move.status === 'COMPLETED' && (
                <div style={{marginTop: '15px'}}>
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

            {/* --- PENDING STATE --- */}
            {move.status === 'PENDING' && (
                <div style={{...pendingBoxStyle, background: colors.pendingBg, borderColor: colors.border}}>
                    ⏳ <strong>Waiting for Movers...</strong> <br/>
                    <small style={{color: colors.subText}}>Verified movers will accept shortly.</small>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const getStatusColor = (s) => s==='PENDING'?'#f1c40f':s==='ACCEPTED'?'#2ecc71':s==='COMPLETED'?'#3498db':'#e74c3c';
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' };
const cardStyle = { padding: '20px', borderRadius: '15px', position: 'relative', transition: '0.3s' };
const statusBadge = { position: 'absolute', top: '15px', right: '15px', padding: '4px 10px', borderRadius: '10px', color: '#000', fontWeight: 'bold', fontSize: '0.7rem' };
const emptyStateStyle = { textAlign: 'center', padding: '40px', borderRadius: '15px' };
const bookBtnStyle = { background: 'linear-gradient(135deg, #FF9966, #FF5E62)', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' };
const payBtnStyle = { width: '100%', padding: '8px', background: '#2ecc71', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold', display:'flex', justifyContent:'center', gap:'5px'};
const reviewBtnStyle = { width: '100%', padding: '8px', background: '#f1c40f', color:'black', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'};
const paidBadge = { background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #2ecc71' };
const reviewedBadge = { width: '100%', padding: '10px', background: 'rgba(241, 196, 15, 0.2)', color: '#f1c40f', border: '1px solid #f1c40f', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' };

const companyCardStyle = { marginTop: '20px', padding: '15px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)' };
const contactRow = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' };
const linkStyle = { color: '#3498db', textDecoration: 'none' };
const pendingBoxStyle = { marginTop: '20px', padding: '15px', borderRadius: '10px', color: '#f1c40f', border: '1px solid' };
const lineDivider = { height: '1px', margin: '15px 0' };
const detailGrid = { display: 'flex', gap: '15px', fontSize: '0.9rem' };
const detailItem = { display: 'flex', alignItems: 'center', gap: '6px' };

const modalOverlay = { position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000};
const modalContent = { padding:'25px', borderRadius:'15px', width:'90%', maxWidth:'350px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'};
const textAreaStyle = { width:'100%', padding:'10px', borderRadius:'5px', border:'none', marginTop:'15px', marginBottom:'15px', resize: 'vertical'};
const submitBtnStyle = { width:'100%', padding:'10px', background:'#2ecc71', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'};

export default MyMoves;