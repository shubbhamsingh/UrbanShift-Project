import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaTimes, FaPhone, FaEnvelope, FaUser, FaShoppingCart, FaChevronLeft, FaChevronRight, FaExpand, FaComments } from 'react-icons/fa'; // ✅ FaComments import kiya
import { toast } from 'react-toastify';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ✅ Theme Logic
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false); 
  const [buyLoading, setBuyLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Image Gallery States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Manual Swipe States
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50; 

  // Smart URL Setup
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";

  // --- DYNAMIC COLORS ---
  const colors = {
      bg: isDark ? '#121212' : '#f4f6f8',
      cardBg: isDark ? '#1e1e1e' : '#ffffff',
      text: isDark ? '#ffffff' : '#333333',
      subText: isDark ? '#cccccc' : '#666666',
      border: isDark ? '#333' : '#e0e0e0',
      shadow: isDark ? '0 4px 10px rgba(0,0,0,0.5)' : '0 4px 15px rgba(0,0,0,0.05)',
      overlayBg: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.5)',
      contactRowBg: isDark ? 'rgba(255,255,255,0.05)' : '#f0f2f5'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/properties/${id}/`);
        setProperty(res.data);
        setLoading(false); 

        // Check Wishlist Status
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const wishlistRes = await axios.get(`${BACKEND_URL}/api/properties/wishlist/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const found = wishlistRes.data.some(item => item.property.id === res.data.id);
                setIsWishlisted(found);
            } catch (wishlistErr) { console.warn("Wishlist check failed"); }
        }
      } catch (err) {
        console.error("Main Error:", err);
        setError("Property not found or connection failed.");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, BACKEND_URL]);

  // --- IMAGE NAVIGATION LOGIC ---
  const hasMultipleImages = property?.images && property.images.length > 1;

  const nextImage = (e) => {
      if(e) e.stopPropagation(); 
      setCurrentImageIndex((prevIndex) => 
          prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
      );
  };

  const prevImage = (e) => {
      if(e) e.stopPropagation();
      setCurrentImageIndex((prevIndex) => 
          prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
      );
  };

  // --- MANUAL SWIPE HANDLERS ---
  const onTouchStart = (e) => {
    setTouchEnd(null); 
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (hasMultipleImages) {
        if (isLeftSwipe) nextImage();
        if (isRightSwipe) prevImage();
    }
  };

  // Image URL Helper
  const getImageUrl = (imageObj) => {
    if (!imageObj) return 'https://via.placeholder.com/600';
    if (imageObj.image_url) return imageObj.image_url;
    if (imageObj.image) {
        if (imageObj.image.startsWith('http')) return imageObj.image;
        return `${BACKEND_URL}${imageObj.image}`;
    }
    return 'https://via.placeholder.com/600';
  };

  // --- ACTION HANDLERS ---
  const handleWishlistToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) { toast.error("Please Login to save properties! 🔒"); navigate('/login'); return; }
    try {
        await axios.post(`${BACKEND_URL}/api/properties/${id}/toggle-wishlist/`, {}, { headers: { Authorization: `Bearer ${token}` } });
        setIsWishlisted(!isWishlisted); 
        if (!isWishlisted) toast.success("Added to DreamHome ❤️"); else toast.info("Removed from DreamHome 💔");
    } catch (err) { toast.error("Something went wrong!"); }
  };

  const handleBuyProperty = async () => {
      const token = localStorage.getItem('token');
      if (!token) { toast.error("Please Login to buy properties! 🔒"); navigate('/login'); return; }
      if (!window.confirm(`Confirm purchase of ${property.title} for ₹${property.price}? (Mock Payment)`)) return;
      setBuyLoading(true);
      try {
          await axios.post(`${BACKEND_URL}/api/properties/${id}/buy/`, {}, { headers: { Authorization: `Bearer ${token}` } });
          toast.success("Congratulations! Property Purchased! 🎉🏡");
          setProperty(prev => ({ ...prev, is_sold: true }));
          setTimeout(() => navigate('/user-dashboard'), 2000);
      } catch (error) {
          toast.error(error.response?.data?.error || "Purchase Failed. Try again.");
      } finally { setBuyLoading(false); }
  };

  // ✅ CHAT HANDLER
  const handleChat = () => {
    const token = localStorage.getItem('token');
    if (!token) { 
        toast.error("Please Login to chat with seller! 🔒"); 
        navigate('/login'); 
        return; 
    }
    // Check if property owner ID exists
    if (property.owner) {
        navigate(`/chat/${property.owner}`);
    } else {
        toast.error("Seller info not available for chat.");
    }
  };

  // --- STYLES (Moved inside) ---
  const styles = {
    page: { padding: '40px 20px', background: colors.bg, minHeight: '100vh', color: colors.text, transition: '0.3s' },
    container: { maxWidth: '1200px', margin: '0 auto' },
    loadingContainer: { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: colors.bg, color: colors.text },
    errorContainer: { minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: colors.bg, color: colors.text },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    backLink: { color: '#f1c40f', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' },
    backBtn: { marginTop: '20px', color: '#f1c40f', border: '1px solid #f1c40f', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' },
    badge: { padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' },
    wishlistBtn: { background: 'none', border: 'none', cursor: 'pointer' },
    contentWrapper: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' },
    
    // IMAGE STYLES
    imageSection: { display: 'flex', flexDirection: 'column', gap: '15px' },
    mainImageContainer: { position: 'relative', width: '100%', height: '400px', cursor: 'pointer', overflow: 'hidden', borderRadius: '15px', border: `1px solid ${colors.border}`, boxShadow: colors.shadow },
    mainImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
    soldOverlay: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)', background: 'rgba(231, 76, 60, 0.9)', color: 'white', padding: '15px 40px', fontSize: '2rem', fontWeight: 'bold', border: '5px solid white', borderRadius: '10px', zIndex: 2 },
    expandIconOverlay: { position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', pointerEvents: 'none' },
    
    navArrow: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 2, transition: '0.2s' },

    thumbnails: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' },
    thumbImg: { width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: '2px solid transparent', transition: '0.2s' },
    
    // FULLSCREEN MODAL STYLES
    imageModalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
    fullscreenImage: { maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', boxShadow: '0 0 20px rgba(0,0,0,0.5)' },
    closeImageModal: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', zIndex: 2001 },
    modalArrow: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'white', cursor: 'pointer', zIndex: 2001, padding: '20px' },
    imageCounter: { position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '20px' },

    infoSection: { display: 'flex', flexDirection: 'column' },
    title: { fontSize: '2.2rem', margin: '0 0 10px 0', color: colors.text },
    price: { fontSize: '1.8rem', color: '#2ecc71', margin: '0 0 20px 0' },
    perMonth: { fontSize: '1rem', color: colors.subText },
    metaBox: { display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '20px', background: colors.cardBg, borderRadius: '10px', marginBottom: '25px', border: `1px solid ${colors.border}`, boxShadow: colors.shadow },
    descBox: { marginBottom: '20px' },
    sectionTitle: { color: '#f1c40f', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px', marginBottom: '15px' },
    buyBtn: { padding: '15px', background: 'linear-gradient(135deg, #27ae60, #2ecc71)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', width: '100%' },
    soldBox: { padding: '15px', background: colors.cardBg, color: '#e74c3c', textAlign: 'center', borderRadius: '10px', fontWeight: 'bold', border: '1px solid #e74c3c' },
    sellerBox: { padding: '25px', background: colors.cardBg, borderRadius: '15px', border: `1px solid ${colors.border}`, boxShadow: colors.shadow },
    contactBtn: { width: '100%', marginTop: '15px', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' },
    
    // ✅ NEW CHAT BUTTON STYLE
    chatBtn: { width: '100%', marginTop: '10px', padding: '12px', background: 'linear-gradient(135deg, #8e44ad, #9b59b6)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },

    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: colors.overlayBg, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { background: colors.cardBg, padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px', position: 'relative', border: `1px solid ${colors.border}` },
    closeModal: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: colors.subText, fontSize: '1.2rem', cursor: 'pointer' },
    contactRow: { display: 'flex', alignItems: 'center', gap: '15px', background: colors.contactRowBg, padding: '10px', borderRadius: '8px' },
    modalNote: { fontSize: '0.8rem', color: '#f39c12', textAlign: 'center', marginTop: '20px', background: 'rgba(243, 156, 18, 0.1)', padding: '10px', borderRadius: '5px' }
  };

  if (loading) return <div style={styles.loadingContainer}><h2>⏳ Loading...</h2></div>;
  if (error) return <div style={styles.errorContainer}><h2>❌ {error}</h2><Link to="/properties" style={styles.backBtn}>← Back</Link></div>;

  const currentImageObj = property.images && property.images.length > 0 ? property.images[currentImageIndex] : null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* --- HEADER --- */}
        <div style={styles.header}>
            <Link to="/properties" style={styles.backLink}>← Back</Link>
            <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                <span style={{...styles.badge, background: property.category === 'RENT' ? '#f1c40f' : '#2ecc71', color: property.category === 'RENT' ? 'black' : 'white'}}>
                    {property.category}
                </span>
                <button onClick={handleWishlistToggle} style={styles.wishlistBtn} title="Add to Wishlist">
                    {isWishlisted ? <FaHeart color="red" size={28} /> : <FaRegHeart color={colors.subText} size={28} />}
                </button>
            </div>
        </div>

        <div style={styles.contentWrapper}>
            {/* LEFT: IMAGES SECTION with SWIPE & ARROWS */}
            <div style={styles.imageSection}>
                
                {/* Main Image Container with Manual Swipe handlers */}
                <div 
                    style={styles.mainImageContainer} 
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onClick={() => setShowImageModal(true)} 
                >
                    <img 
                        src={getImageUrl(currentImageObj)} 
                        alt={property.title} 
                        style={{
                            ...styles.mainImage,
                            filter: property.is_sold ? 'grayscale(80%)' : 'none'
                        }} 
                    />
                    {property.is_sold && <div style={styles.soldOverlay}>SOLD OUT</div>}
                    
                    {/* Hover Overlay Icon */}
                    <div style={styles.expandIconOverlay}>
                        <FaExpand /> Tap to enlarge
                    </div>

                    {/* Navigation Arrows (Only if multiple images) */}
                    {hasMultipleImages && (
                        <>
                            <button onClick={prevImage} style={{...styles.navArrow, left: '10px'}}><FaChevronLeft /></button>
                            <button onClick={nextImage} style={{...styles.navArrow, right: '10px'}}><FaChevronRight /></button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {hasMultipleImages && (
                    <div style={styles.thumbnails}>
                        {property.images.map((img, idx) => (
                            <img 
                                key={idx} 
                                src={getImageUrl(img)} 
                                alt="thumb" 
                                style={{
                                    ...styles.thumbImg,
                                    borderColor: idx === currentImageIndex ? '#f1c40f' : colors.subText
                                }}
                                onClick={() => setCurrentImageIndex(idx)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT: INFO SECTION */}
            <div style={styles.infoSection}>
                <h1 style={styles.title}>{property.title}</h1>
                <h2 style={styles.price}>
                    ₹{parseFloat(property.price).toLocaleString('en-IN')} 
                    {property.category === 'RENT' && <span style={styles.perMonth}> / month</span>}
                </h2>
                
                <div style={styles.metaBox}>
                    <p style={{color: colors.text}}>📍 <strong>Location:</strong> {property.location}</p>
                    <p style={{color: colors.text}}>🛏 <strong>Bedrooms:</strong> {property.bedrooms}</p>
                    <p style={{color: colors.text}}>📅 <strong>Posted:</strong> {new Date(property.created_at).toLocaleDateString()}</p>
                </div>

                <div style={styles.descBox}>
                    <h3 style={styles.sectionTitle}>Description</h3>
                    <p style={{lineHeight: '1.6', color: colors.subText}}>{property.description}</p>
                </div>

                <div style={{marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {property.is_sold ? (
                         <div style={styles.soldBox}>❌ This property is already sold.</div>
                    ) : (
                        property.category === 'SELL' && (
                            <button onClick={handleBuyProperty} disabled={buyLoading} style={styles.buyBtn}>
                                {buyLoading ? 'Processing...' : <><FaShoppingCart /> Buy Now (Mock Payment)</>}
                            </button>
                        )
                    )}
                    <div style={styles.sellerBox}>
                        <h3 style={{...styles.sectionTitle, color: colors.text, border: 'none'}}>👤 Owner Details</h3>
                        <p style={{color: colors.subText}}><strong>Name:</strong> {property.seller_name || "Verified Owner"}</p>
                        
                        <button onClick={() => setShowContact(true)} style={styles.contactBtn}>
                            📞 Contact Owner
                        </button>
                        
                        {/* ✅ CHAT BUTTON ADDED HERE */}
                        <button onClick={handleChat} style={styles.chatBtn}>
                            <FaComments /> Chat with Seller
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* CONTACT MODAL */}
      {showContact && (
        <div style={styles.modalOverlay} onClick={() => setShowContact(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeModal} onClick={() => setShowContact(false)}><FaTimes /></button>
                <h2 style={{color: '#f1c40f', textAlign: 'center', marginBottom: '20px'}}>Owner Contact Details</h2>
                 <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <div style={styles.contactRow}><FaUser size={20} color="#3498db" /><div><span style={{fontSize:'0.8rem', color: colors.subText}}>Name</span><br/><strong style={{color: colors.text}}>{property.seller_name}</strong></div></div>
                    <div style={styles.contactRow}><FaEnvelope size={20} color="#3498db" /><div><span style={{fontSize:'0.8rem', color: colors.subText}}>Email</span><br/><a href={`mailto:${property.seller_email}`} style={{color: colors.text, textDecoration:'none'}}>{property.seller_email}</a></div></div>
                    <div style={styles.contactRow}><FaPhone size={20} color="#3498db" /><div><span style={{fontSize:'0.8rem', color: colors.subText}}>Phone</span><br/><a href={`tel:${property.seller_phone}`} style={{color: colors.text, textDecoration:'none'}}>{property.seller_phone || "+91 XXXXX XXXXX"}</a></div></div>
                </div>
                <p style={styles.modalNote}>⚠️ Note: Please mention 'UrbanShift' when calling.</p>
            </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE MODAL (Lightbox with Swipe) */}
      {showImageModal && (
        <div 
            style={styles.imageModalOverlay} 
            onClick={() => setShowImageModal(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
             <button style={styles.closeImageModal} onClick={() => setShowImageModal(false)}><FaTimes size={30}/></button>
             
             {hasMultipleImages && <button onClick={prevImage} style={{...styles.modalArrow, left: '20px'}}><FaChevronLeft size={40}/></button>}
             
             <img 
                src={getImageUrl(currentImageObj)} 
                alt="fullscreen" 
                style={styles.fullscreenImage}
                onClick={(e) => e.stopPropagation()} 
             />

            {hasMultipleImages && <button onClick={nextImage} style={{...styles.modalArrow, right: '20px'}}><FaChevronRight size={40}/></button>}
            
            {hasMultipleImages && (
                 <div style={styles.imageCounter}>
                    {currentImageIndex + 1} / {property.images.length}
                 </div>
            )}
        </div>
      )}

    </div>
  );
};

export default PropertyDetail;