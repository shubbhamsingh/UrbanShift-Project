import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyMoves = () => {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyMoves();
  }, []);

  const fetchMyMoves = async () => {
    try {
      const token = localStorage.getItem('token');
      // Render ka live URL agar live ho, warna localhost
      const BASE_URL = "https://urbanshift-project.onrender.com"; 
      // Local check ke liye: "http://127.0.0.1:8000"

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

  if (loading) return <h3 style={{textAlign: 'center', color: 'white'}}>Loading your moves...</h3>;

  return (
    <div style={containerStyle}>
      <h2 style={{ borderBottom: '2px solid #ff7e5f', paddingBottom: '10px' }}>📦 My Move Requests</h2>

      {moves.length === 0 ? (
        <p>You haven't made any move requests yet.</p>
      ) : (
        <div style={gridStyle}>
          {moves.map((move) => (
            <div key={move.id} style={cardStyle}>
              
              {/* Status Badge */}
              <div style={{...statusBadge, background: getStatusColor(move.status)}}>
                {move.status}
              </div>

              <h3>📍 {move.source_city} ➝ {move.destination_city}</h3>
              <p><strong>📅 Date:</strong> {move.moving_date}</p>
              <p><strong>📦 Items:</strong> {move.items_description}</p>
              
              {move.status === 'ACCEPTED' && (
                <div style={companyInfo}>
                  ✅ <strong>Accepted!</strong> A company is reviewing your request.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const getStatusColor = (status) => {
    if (status === 'PENDING') return '#f1c40f'; // Yellow
    if (status === 'ACCEPTED') return '#3498db'; // Blue
    if (status === 'COMPLETED') return '#2ecc71'; // Green
    if (status === 'CANCELLED') return '#e74c3c'; // Red
    return '#ccc';
};

const containerStyle = { padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'white' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' };
const cardStyle = { background: '#2c3e50', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', position: 'relative' };
const statusBadge = { position: 'absolute', top: '10px', right: '10px', padding: '5px 10px', borderRadius: '20px', color: '#000', fontWeight: 'bold', fontSize: '0.8rem' };
const companyInfo = { marginTop: '15px', padding: '10px', background: 'rgba(46, 204, 113, 0.2)', borderRadius: '5px', color: '#2ecc71' };

export default MyMoves;