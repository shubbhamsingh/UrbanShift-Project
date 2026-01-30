import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaBoxOpen, FaCalculator, FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const BookMovers = () => {
  const navigate = useNavigate();
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const [formData, setFormData] = useState({
    source: '',           
    destination: '',      
    move_date: '',        
    move_size: '1BHK',    
    items_list: ''        
  });

  // 👇 INVENTORY STATE
  const [inventory, setInventory] = useState({
      sofa: 0, bed: 0, wardrobe: 0, table: 0, chair: 0,
      tv: 0, fridge: 0, washing_machine: 0, ac: 0,
      boxes_small: 0, boxes_medium: 0, boxes_large: 0
  });

  const [step, setStep] = useState(1); // 1: Form, 2: Quote & Pay
  const [estimatedCost, setEstimatedCost] = useState(0);
  
  const BOOKING_TOKEN_AMOUNT = 500; // Fixed Token Amount

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👇 Update Inventory Count
  const updateInventory = (item, delta) => {
      setInventory(prev => ({
          ...prev,
          [item]: Math.max(0, prev[item] + delta)
      }));
  };

  // 1. Calculate Quote (Smart Logic)
  const handleCalculateQuote = (e) => {
    e.preventDefault();
    
    // Base Cost
    let baseCost = 3000;
    
    // Distance multiplier (Fake for now)
    if (formData.move_size === '2BHK') baseCost += 2000;
    if (formData.move_size === '3BHK') baseCost += 4000;
    if (formData.move_size === 'Villa') baseCost += 6000;

    // Item Cost
    let itemCost = 0;
    itemCost += inventory.sofa * 500;
    itemCost += inventory.bed * 600;
    itemCost += inventory.wardrobe * 800;
    itemCost += inventory.tv * 400;
    itemCost += inventory.fridge * 500;
    itemCost += inventory.ac * 600;
    itemCost += (inventory.boxes_small + inventory.boxes_medium + inventory.boxes_large) * 100;

    const total = baseCost + itemCost;
    setEstimatedCost(total);

    // Generate Summary String for Backend
    const summary = Object.entries(inventory)
        .filter(([_, count]) => count > 0)
        .map(([item, count]) => `${item.replace('_', ' ').toUpperCase()} x${count}`)
        .join(', ');
    
    setFormData({...formData, items_list: summary || "No specific items listed"});

    setStep(2);
  };

  // 2. Open Payment Modal (Updated to simple booking for now)
  const handleProceedToPay = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        toast.error("Please Login to book movers! 🚚");
        navigate('/login');
        return;
    }
    
    // Direct Booking for now since PaymentModal is removed
    await handleBookingSubmission();
  };

  // 3. Booking Submission
  const handleBookingSubmission = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${BACKEND_URL}/api/relocation/move-requests/`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Booking Request Sent! 🚚 Check My Moves to Pay.");
      navigate('/user-dashboard'); 
    } catch (error) {
       console.error("Submission Error:", error);
       toast.error("Failed to book.");
    }
  };

  // --- STYLES ---
  const colors = {
      bg: isDark ? '#121212' : '#f4f6f8',
      cardBg: isDark ? '#1e1e1e' : '#ffffff',
      text: isDark ? '#ffffff' : '#333333',
      subText: isDark ? '#bbbbbb' : '#666666',
      inputBg: isDark ? '#2c2c2c' : '#f9f9f9',
      border: isDark ? '#333' : '#ddd',
      shadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)',
      icon: isDark ? '#FF9966' : '#FF5E62'
  };

  const styles = {
    container: { padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: colors.bg, minHeight:'90vh', transition: '0.3s' },
    formCard: { width: '100%', maxWidth: '800px', background: colors.cardBg, padding: '40px', borderRadius: '20px', boxShadow: colors.shadow, border: `1px solid ${colors.border}`, transition: '0.3s' },
    header: { color: colors.text, textAlign:'center', fontSize: '1.8rem', marginBottom: '10px' },
    subHeader: { textAlign:'center', color: colors.subText, marginBottom:'30px', fontSize: '0.95rem' },
    inputGroup: { marginBottom: '20px', display:'flex', flexDirection:'column', gap:'8px', color: colors.text, fontWeight:'600' },
    labelIcon: { display: 'flex', alignItems: 'center', gap: '8px', color: colors.subText, fontSize: '0.9rem' },
    input: { padding: '14px', borderRadius: '10px', border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, outline: 'none', fontSize: '1rem', transition: '0.3s' },
    btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #FF9966, #FF5E62)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer', fontWeight:'bold', marginTop:'20px', boxShadow: '0 4px 15px rgba(255, 94, 98, 0.4)', transition: 'transform 0.2s' },
    backBtn: { background:'transparent', border:'none', color: colors.subText, cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', marginBottom:'20px', fontSize:'0.9rem' },
    quoteBox: { textAlign:'center', padding:'30px 20px', background: isDark ? '#2c2c2c' : '#fff8e1', borderRadius:'15px', border: isDark ? '1px solid #444' : '1px solid #ffe082' },
    
    // Inventory Styles
    inventoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '10px' },
    inventoryItem: { background: colors.inputBg, padding: '15px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', border: `1px solid ${colors.border}` },
    counterControls: { display: 'flex', alignItems: 'center', gap: '15px' },
    controlBtn: { width: '30px', height: '30px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        
        {step === 2 && (
            <button onClick={() => setStep(1)} style={styles.backBtn}><FaArrowLeft /> Back to details</button>
        )}

        <h2 style={styles.header}>
            <FaTruck color={colors.icon} style={{marginRight: '10px'}}/> 
            {step === 1 ? 'Book Packers & Movers' : 'Review & Pay'}
        </h2>
        
        {step === 1 ? (
            /* STEP 1: FORM */
            <form onSubmit={handleCalculateQuote}>
                <div style={{display:'flex', gap:'20px'}}>
                    <div style={{flex:1, ...styles.inputGroup}}>
                        <div style={styles.labelIcon}><FaMapMarkerAlt /> Moving From</div>
                        <input name="source" value={formData.source} placeholder="Jaipur" onChange={handleChange} required style={styles.input} />
                    </div>
                    <div style={{flex:1, ...styles.inputGroup}}>
                        <div style={styles.labelIcon}><FaMapMarkerAlt /> Moving To</div>
                        <input name="destination" value={formData.destination} placeholder="Bangalore" onChange={handleChange} required style={styles.input} />
                    </div>
                </div>

                <div style={{display:'flex', gap:'20px', marginBottom:'20px'}}>
                    <div style={{flex:1, display:'flex', flexDirection:'column', gap:'8px'}}>
                        <div style={styles.labelIcon}><FaCalendarAlt /> Date</div>
                        <input name="move_date" type="date" value={formData.move_date} onChange={handleChange} required style={styles.input} />
                    </div>
                    <div style={{flex:1, display:'flex', flexDirection:'column', gap:'8px'}}>
                        <div style={styles.labelIcon}><FaBoxOpen /> Home Size</div>
                        <select name="move_size" value={formData.move_size} onChange={handleChange} style={styles.input}>
                            <option>1BHK</option>
                            <option>2BHK</option>
                            <option>3BHK</option>
                            <option>Villa</option>
                        </select>
                    </div>
                </div>

                {/* --- INVENTORY SECTION --- */}
                <div style={{marginBottom:'30px'}}>
                    <h3 style={{color: colors.text, borderBottom: `1px solid ${colors.border}`, paddingBottom:'10px'}}>📦 Inventory</h3>
                    
                    <h4 style={{color: colors.subText, fontSize:'0.9rem', marginTop:'15px'}}>🛋️ Furniture</h4>
                    <div style={styles.inventoryGrid}>
                        {['sofa', 'bed', 'wardrobe', 'table', 'chair'].map(item => (
                            <div key={item} style={styles.inventoryItem}>
                                <span style={{color: colors.text, textTransform:'capitalize'}}>{item}</span>
                                <div style={styles.counterControls}>
                                    <button type="button" onClick={() => updateInventory(item, -1)} style={{...styles.controlBtn, background:'#e74c3c', color:'white'}}><FaMinus size={10}/></button>
                                    <span style={{color: colors.text, fontWeight:'bold'}}>{inventory[item]}</span>
                                    <button type="button" onClick={() => updateInventory(item, 1)} style={{...styles.controlBtn, background:'#2ecc71', color:'white'}}><FaPlus size={10}/></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h4 style={{color: colors.subText, fontSize:'0.9rem', marginTop:'15px'}}>📺 Appliances</h4>
                    <div style={styles.inventoryGrid}>
                        {['tv', 'fridge', 'washing_machine', 'ac'].map(item => (
                            <div key={item} style={styles.inventoryItem}>
                                <span style={{color: colors.text, textTransform:'capitalize'}}>{item.replace('_', ' ')}</span>
                                <div style={styles.counterControls}>
                                    <button type="button" onClick={() => updateInventory(item, -1)} style={{...styles.controlBtn, background:'#e74c3c', color:'white'}}><FaMinus size={10}/></button>
                                    <span style={{color: colors.text, fontWeight:'bold'}}>{inventory[item]}</span>
                                    <button type="button" onClick={() => updateInventory(item, 1)} style={{...styles.controlBtn, background:'#2ecc71', color:'white'}}><FaPlus size={10}/></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h4 style={{color: colors.subText, fontSize:'0.9rem', marginTop:'15px'}}>📦 Boxes</h4>
                    <div style={styles.inventoryGrid}>
                        {['boxes_small', 'boxes_medium', 'boxes_large'].map(item => (
                            <div key={item} style={styles.inventoryItem}>
                                <span style={{color: colors.text, textTransform:'capitalize'}}>{item.replace('boxes_', '')} Box</span>
                                <div style={styles.counterControls}>
                                    <button type="button" onClick={() => updateInventory(item, -1)} style={{...styles.controlBtn, background:'#e74c3c', color:'white'}}><FaMinus size={10}/></button>
                                    <span style={{color: colors.text, fontWeight:'bold'}}>{inventory[item]}</span>
                                    <button type="button" onClick={() => updateInventory(item, 1)} style={{...styles.controlBtn, background:'#2ecc71', color:'white'}}><FaPlus size={10}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" style={styles.btn}><FaCalculator /> Calculate Quote</button>
            </form>
        ) : (
            /* STEP 2: QUOTE & PAY */
            <div style={{marginTop:'20px'}}>
                <div style={styles.quoteBox}>
                    <h3 style={{color: colors.text, margin:0}}>Estimated Cost</h3>
                    <h1 style={{fontSize:'2.5rem', color: '#2ecc71', margin:'10px 0'}}>₹{estimatedCost.toLocaleString()}</h1>
                    <p style={{color: colors.subText, fontSize:'0.9rem'}}>Based on your {formData.move_size} and {Object.values(inventory).reduce((a,b)=>a+b,0)} items.</p>
                </div>

                <div style={{marginTop:'20px', padding:'15px', border:`1px dashed ${colors.border}`, borderRadius:'10px', background: colors.inputBg}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', color: colors.text}}>
                        <span>Booking Token Amount:</span>
                        <strong>₹{BOOKING_TOKEN_AMOUNT}</strong>
                    </div>
                    <div style={{fontSize:'0.8rem', color: colors.subText}}>
                        * Pay ₹{BOOKING_TOKEN_AMOUNT} now to confirm slot. Rest amount payable after service.
                    </div>
                </div>

                <button onClick={handleProceedToPay} style={styles.btn}>
                    💳 Pay ₹{BOOKING_TOKEN_AMOUNT} & Book
                </button>
            </div>
        )}
      </div>

    </div>
  );
};

export default BookMovers;