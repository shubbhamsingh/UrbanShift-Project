import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBoxOpen, FaPhone, FaEnvelope, FaUserTie, FaTruck } from 'react-icons/fa';

const MyMoves = () => {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BASE_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  useEffect(() => {
    fetchMyMoves();
  }, []);

  const fetchMyMoves = async () => {
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
  };

  // Data Filters
  const ongoingMoves = moves.filter(m => ['PENDING', 'ACCEPTED'].includes(m.status));
  const historyMoves = moves.filter(m => ['COMPLETED', 'CANCELLED'].includes(m.status));

  if (loading) return (
    <div style={{minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <h3 style={{color: 'white'}}>⏳ Loading your moves...</h3>
    </div>
  );

  return (
    <div style={containerStyle}>
      
      {/* --- HEADER (Gap Fixed Here) --- */}
      <div style={headerStyle}>
        <div style={{flex: 1}}>
            <h2 style={{ color: 'white', margin: '0 0 5px 0' }}>📦 My Move Requests</h2>
            <p style={{ color: '#aaa', margin: 0, fontSize: '0.9rem' }}>Track your active and past shifts.</p>
        </div>
        {/* Button ab alag div me nahi, balki gap ke sath rahega */}
        <Link to="/packers" style={bookBtnStyle}>➕ New Booking</Link>
      </div>

      {moves.length === 0 ? (
        <div style={emptyStateStyle}>
            <FaTruck size={50} color="#555" />
            <h3 style={{color: '#ccc', marginTop: '10px'}}>No bookings found.</h3>
            <p style={{color: '#888'}}>Ready to move? Book verified packers now.</p>
            <Link to="/packers" style={{...bookBtnStyle, marginTop: '20px', display: 'inline-block'}}>
                🚀 Book Movers
            </Link>
        </div>
      ) : (
        <>
            {/* --- SECTION 1: ONGOING MOVES --- */}
            <h3 style={sectionTitleStyle}>🚚 Ongoing Moves</h3>
            
            {ongoingMoves.length === 0 ? (
                <p style={{color: '#666', marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius:'10px'}}>
                    No active moves right now.
                </p>
            ) : (
                <div style={gridStyle}>
                    {ongoingMoves.map((move) => (
                        <MoveCard key={move.id} move={move} />
                    ))}
                </div>
            )}

            {/* --- SECTION 2: HISTORY --- */}
            {historyMoves.length > 0 && (
                <>
                    <div style={divider}></div>
                    <h3 style={{...sectionTitleStyle, color: '#3498db', borderLeft: '4px solid #3498db'}}>📜 Booking History</h3>
                    <div style={gridStyle}>
                        {historyMoves.map((move) => (
                            <MoveCard key={move.id} move={move} isHistory={true} />
                        ))}
                    </div>
                </>
            )}
        </>
      )}
    </div>
  );
};

// --- REUSABLE CARD COMPONENT ---
const MoveCard = ({ move, isHistory }) => {
    return (
        <div style={{...cardStyle, opacity: isHistory ? 0.7 : 1}}>
            {/* Status Badge */}
            <div style={{...statusBadge, background: getStatusColor(move.status)}}>
                {move.status}
            </div>

            {/* Route Info */}
            <h3 style={{color: '#fff', fontSize: '1.2rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <FaMapMarkerAlt color={isHistory ? "#888" : "#ff7e5f"} /> {move.source} <span style={{color:'#888'}}>➝</span> {move.destination}
            </h3>

            <div style={lineDivider}></div>

            {/* Move Details */}
            <div style={detailGrid}>
                <p style={detailItem}><FaCalendarAlt color="#ccc"/> {move.move_date}</p>
                <p style={detailItem}><FaTruck color="#ccc"/> {move.move_size}</p>
            </div>
            
            <div style={{marginTop: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '5px'}}>
                <p style={{color: '#ccc', fontSize: '0.9rem', display: 'flex', gap: '5px'}}>
                    <FaBoxOpen style={{marginTop:'3px'}} /> 
                    <span>{move.items_list || "No items listed"}</span>
                </p>
            </div>

            {/* --- COMPANY DETAILS (Only for Accepted) --- */}
            {move.status === 'ACCEPTED' && (
                <div style={companyCardStyle}>
                    <h4 style={{margin:'0 0 10px 0', color:'#2ecc71', display:'flex', alignItems:'center', gap:'5px'}}>
                        ✅ Request Accepted!
                    </h4>
                    
                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                        <div style={contactRow}><FaUserTie /> <span>{move.company_name}</span></div>
                        <div style={contactRow}><FaPhone /> <a href={`tel:${move.company_phone}`} style={linkStyle}>{move.company_phone}</a></div>
                        <div style={contactRow}><FaEnvelope /> <a href={`mailto:${move.company_email}`} style={linkStyle}>{move.company_email}</a></div>
                    </div>

                    <a href={`tel:${move.company_phone}`} style={callBtnStyle}>📞 Call Company</a>
                </div>
            )}

            {/* --- PENDING STATE --- */}
            {move.status === 'PENDING' && (
                <div style={pendingBoxStyle}>
                    ⏳ <strong>Waiting for Movers...</strong> <br/>
                    <small>Verified movers will accept shortly.</small>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---
const getStatusColor = (status) => {
    if (status === 'PENDING') return '#f1c40f'; 
    if (status === 'ACCEPTED') return '#2ecc71'; 
    if (status === 'COMPLETED') return '#3498db'; 
    if (status === 'CANCELLED') return '#e74c3c'; 
    return '#ccc';
};

const containerStyle = { padding: '40px', maxWidth: '1100px', margin: '0 auto', minHeight: '90vh' };

// ✅ FIX: Added 'gap', 'width: 100%', and 'flexWrap' to prevent sticking
const headerStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottom: '1px solid #333', 
    paddingBottom: '25px', 
    marginBottom: '40px',
    flexWrap: 'wrap', // Choti screen par niche aa jayega
    gap: '20px'       // Button aur Text ke bich 20px ka gap rahega hamesha
};

const bookBtnStyle = { background: 'linear-gradient(135deg, #FF9966, #FF5E62)', color: 'white', padding: '12px 25px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(255, 94, 98, 0.4)', whiteSpace: 'nowrap' };
const emptyStateStyle = { textAlign: 'center', marginTop: '50px', padding: '40px', background: '#1e1e1e', borderRadius: '15px', border: '1px dashed #444' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', marginBottom: '30px' };
const cardStyle = { background: '#1e1e1e', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.3)', position: 'relative', border: '1px solid #333', transition: 'transform 0.2s' };
const statusBadge = { position: 'absolute', top: '15px', right: '15px', padding: '5px 12px', borderRadius: '20px', color: '#000', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' };
const lineDivider = { height: '1px', background: '#333', margin: '15px 0' };
const divider = { height: '1px', background: '#444', margin: '40px 0' };
const detailGrid = { display: 'flex', gap: '15px', color: '#bbb', fontSize: '0.9rem' };
const detailItem = { display: 'flex', alignItems: 'center', gap: '6px' };
const sectionTitleStyle = { color: '#f1c40f', borderLeft: '4px solid #f1c40f', paddingLeft: '10px', marginBottom: '20px' };

const companyCardStyle = { marginTop: '20px', padding: '15px', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '10px', border: '1px solid rgba(46, 204, 113, 0.3)' };
const contactRow = { display: 'flex', alignItems: 'center', gap: '10px', color: '#ddd', fontSize: '0.95rem' };
const linkStyle = { color: '#3498db', textDecoration: 'none' };
const callBtnStyle = { display: 'block', textAlign: 'center', background: '#2ecc71', color: 'white', padding: '10px', borderRadius: '8px', marginTop: '15px', textDecoration: 'none', fontWeight: 'bold' };
const pendingBoxStyle = { marginTop: '20px', padding: '15px', background: 'rgba(241, 196, 15, 0.1)', borderRadius: '10px', color: '#f1c40f', border: '1px solid rgba(241, 196, 15, 0.3)' };

export default MyMoves;