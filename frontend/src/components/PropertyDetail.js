import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaTimes, FaPhone, FaEnvelope, FaUser, FaShoppingCart, FaComments } from 'react-icons/fa';
import { toast } from 'react-toastify';

// ✅ Custom Components
import { ThemeContext } from '../context/ThemeContext';

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { mode } = useContext(ThemeContext);

    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showContact, setShowContact] = useState(false);


    // Image Gallery (commented - not used currently)
    // const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // const [showImageModal, setShowImageModal] = useState(false);

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const BACKEND_URL = isLocal ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";

    // --- STYLES ---
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

                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const wishlistRes = await axios.get(`${BACKEND_URL}/api/properties/wishlist/`, { headers: { Authorization: `Bearer ${token}` } });
                        setIsWishlisted(wishlistRes.data.some(item => item.property.id === res.data.id));
                    } catch (e) { console.warn("Wishlist check failed"); }
                }
            } catch (err) { setError("Property not found."); setLoading(false); }
        };
        fetchData();
    }, [id, BACKEND_URL]);

    // --- HANDLERS ---
    const handlePaymentStart = () => {
        const token = localStorage.getItem('token');
        if (!token) { toast.error("Please Login to buy! 🔒"); navigate('/login'); return; }
        toast.info("Online purchase coming soon! Please contact owner.");
    };

    // Image Navigation (commented - not used currently)
    // const nextImage = (e) => { if (e) e.stopPropagation(); setCurrentImageIndex((prev) => prev === property.images.length - 1 ? 0 : prev + 1); };
    // const prevImage = (e) => { if (e) e.stopPropagation(); setCurrentImageIndex((prev) => prev === 0 ? property.images.length - 1 : prev - 1); };

    const handleWishlistToggle = async () => {
        const token = localStorage.getItem('token');
        if (!token) { toast.error("Please Login to save! 🔒"); navigate('/login'); return; }
        try {
            await axios.post(`${BACKEND_URL}/api/properties/${id}/toggle-wishlist/`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setIsWishlisted(!isWishlisted);
            toast.info(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist ❤️");
        } catch (err) { toast.error("Error updating wishlist"); }
    };

    const handleChat = () => {
        const token = localStorage.getItem('token');
        if (!token) { toast.error("Please Login to chat! 🔒"); navigate('/login'); return; }
        if (property.owner) navigate(`/chat/${property.owner}`);
        else toast.error("Seller info unavailable.");
    };

    // Styles Object
    const styles = {
        page: { padding: '40px 20px', background: colors.bg, minHeight: '100vh', color: colors.text, transition: '0.3s' },
        container: { maxWidth: '1200px', margin: '0 auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
        backLink: { color: '#f1c40f', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' },
        badge: { padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' },
        contentWrapper: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' },

        mainImageContainer: { position: 'relative', width: '100%', height: '400px', cursor: 'pointer', overflow: 'hidden', borderRadius: '15px', border: `1px solid ${colors.border}`, boxShadow: colors.shadow },
        mainImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
        soldOverlay: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)', background: 'rgba(231, 76, 60, 0.9)', color: 'white', padding: '15px 40px', fontSize: '2rem', fontWeight: 'bold', border: '5px solid white', borderRadius: '10px', zIndex: 2 },

        infoSection: { display: 'flex', flexDirection: 'column' },
        title: { fontSize: '2.2rem', margin: '0 0 10px 0', color: colors.text },
        price: { fontSize: '1.8rem', color: '#2ecc71', margin: '0 0 20px 0' },
        metaBox: { display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '20px', background: colors.cardBg, borderRadius: '10px', marginBottom: '25px', border: `1px solid ${colors.border}`, boxShadow: colors.shadow },
        buyBtn: { padding: '15px', background: 'linear-gradient(135deg, #27ae60, #2ecc71)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', width: '100%' },
        sellerBox: { padding: '25px', background: colors.cardBg, borderRadius: '15px', border: `1px solid ${colors.border}`, boxShadow: colors.shadow, marginTop: '20px' },

        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: colors.overlayBg, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
        modalContent: { background: colors.cardBg, padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px', position: 'relative', border: `1px solid ${colors.border}` },
    };

    if (loading) return <div style={{ ...styles.page, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>⏳ Loading...</h2></div>;
    if (error) return <div style={{ ...styles.page, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>❌ {error}</h2></div>;

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* HEADER */}
                <div style={styles.header}>
                    <Link to="/properties" style={styles.backLink}>← Back</Link>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <span style={{ ...styles.badge, background: property.category === 'RENT' ? '#f1c40f' : '#2ecc71', color: property.category === 'RENT' ? 'black' : 'white' }}>
                            {property.category}
                        </span>
                        <button onClick={handleWishlistToggle} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            {isWishlisted ? <FaHeart color="red" size={28} /> : <FaRegHeart color={colors.subText} size={28} />}
                        </button>
                    </div>
                </div>

                <div style={styles.contentWrapper}>
                    {/* IMAGES */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={styles.mainImageContainer}>
                            <img src={property.images[0]?.image || property.images[0]?.image_url} alt={property.title} style={{ ...styles.mainImage, filter: property.is_sold ? 'grayscale(80%)' : 'none' }} />
                            {property.is_sold && <div style={styles.soldOverlay}>SOLD OUT</div>}
                        </div>
                    </div>

                    {/* INFO */}
                    <div style={styles.infoSection}>
                        <h1 style={styles.title}>{property.title}</h1>
                        <h2 style={styles.price}>₹{parseFloat(property.price).toLocaleString('en-IN')}</h2>

                        <div style={styles.metaBox}>
                            <p style={{ color: colors.text }}>📍 <strong>Location:</strong> {property.location}</p>
                            <p style={{ color: colors.text }}>🛏 <strong>Bedrooms:</strong> {property.bedrooms}</p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ color: '#f1c40f', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>Description</h3>
                            <p style={{ lineHeight: '1.6', color: colors.subText }}>{property.description}</p>
                        </div>

                        {property.is_sold ? (
                            <div style={{ padding: '15px', background: colors.cardBg, color: '#e74c3c', textAlign: 'center', fontWeight: 'bold', borderRadius: '10px' }}>❌ SOLD OUT</div>
                        ) : (
                            property.category === 'SELL' && (
                                <button onClick={handlePaymentStart} style={styles.buyBtn}>
                                    <FaShoppingCart /> Buy Now
                                </button>
                            )
                        )}

                        <div style={styles.sellerBox}>
                            <h3 style={{ color: colors.text, marginBottom: '15px' }}>👤 Owner Details</h3>
                            <p style={{ color: colors.subText }}><strong>Name:</strong> {property.seller_name || "Verified Owner"}</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexDirection: 'column' }}>
                                <button onClick={() => setShowContact(true)} style={{ padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>📞 Contact Owner</button>
                                <button onClick={handleChat} style={{ padding: '12px', background: 'linear-gradient(135deg, #8e44ad, #9b59b6)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}><FaComments /> Chat</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* CONTACT MODAL */}
            {showContact && (
                <div style={styles.modalOverlay} onClick={() => setShowContact(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: colors.subText, fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setShowContact(false)}><FaTimes /></button>
                        <h2 style={{ color: '#f1c40f', textAlign: 'center', marginBottom: '20px' }}>Contact Details</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><FaUser color="#3498db" /> <strong style={{ color: colors.text }}>{property.seller_name}</strong></div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><FaEnvelope color="#3498db" /> <span style={{ color: colors.text }}>{property.seller_email}</span></div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><FaPhone color="#3498db" /> <span style={{ color: colors.text }}>{property.seller_phone}</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetail;