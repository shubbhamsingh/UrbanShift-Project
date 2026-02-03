import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaTimes, FaUser, FaShoppingCart, FaComments } from 'react-icons/fa';
import { toast } from 'react-toastify';
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

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const BACKEND_URL = isLocal ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";

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
    
    const BOOKING_AMOUNT = 5000; // Fixed Token Amount

    const handlePaymentStart = async () => {
        const token = localStorage.getItem('token');
        if (!token) { toast.error("Please Login to buy! 🔒"); navigate('/login'); return; }

        try {
            // 1. Create Order on Backend (Using Booking Amount)
            const orderRes = await axios.post(`${BACKEND_URL}/api/payments/create-order/`, {
                amount: BOOKING_AMOUNT 
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { order_id, amount, key, currency } = orderRes.data;

            // 2. Initialize Razorpay Options
            const options = {
                key: key, 
                amount: amount, 
                currency: currency,
                name: "UrbanShift Property",
                description: `Booking Token for ${property.title}`,
                image: "https://urbanshift-project.onrender.com/logo.png",
                order_id: order_id, 
                handler: async function (response) {
                    try {
                        toast.info("Verifying Payment... ⏳");
                        await axios.post(`${BACKEND_URL}/api/payments/verify-payment/`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: BOOKING_AMOUNT,
                            property_title: property.title,
                            property_id: property.id // ✅ Sending Property ID to trigger Seller Email
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        toast.success(`Booking Confirmed! Token of ₹${BOOKING_AMOUNT.toLocaleString('en-IN')} Paid. 🎉`);
                    } catch (err) {
                        console.error(err);
                        toast.error("Payment Verification Failed! ❌");
                    }
                },
                prefill: {
                    name: "UrbanShift User",
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: { color: "#2ecc71" }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response){
                toast.error(`Payment Failed: ${response.error.description}`);
            });
            rzp1.open();

        } catch (err) {
            console.error("Payment Start Error:", err);
            // ✅ Better Error Message for Auth Failures
            const status = err.response?.status;
            if (status === 401) {
                toast.error("Session Expired. Please Login Again. 🔒");
                localStorage.removeItem('token'); 
                navigate('/login');
            } else {
                const errorMessage = err.response?.data?.error || "Payment Initiation Failed. Check Network/Admin.";
                toast.error(errorMessage);
            }
        }
    };

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

    // Image Gallery
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // ... (rest of useEffects) ...

    // Image Helper Logic 
    const images = property?.images || [];
    const currentImage = images[currentImageIndex]?.image || images[currentImageIndex]?.image_url || property?.image; // Fallback

    const nextImage = (e) => { 
        if (e) e.stopPropagation(); 
        setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1); 
    };
    
    const prevImage = (e) => { 
        if (e) e.stopPropagation(); 
        setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1); 
    };

    // ... (rest of handlers) ...

    // Swipe Logic
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50; 

    const onTouchStart = (e) => {
        setTouchEnd(null); 
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
            nextImage();
        } else if (isRightSwipe) {
            prevImage();
        }
    };

    // ... (rest of handlers) ...

    // Styles Object (Expanded for Gallery)
    const styles = {
        // ... (existing styles) ...
        page: { padding: '20px 10px', background: colors.bg, minHeight: '100vh', color: colors.text, transition: '0.3s', overflowX: 'hidden' }, // ✅ Fix overflow & padding
        container: { maxWidth: '1200px', margin: '0 auto', width: '100%' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
        backLink: { color: '#f1c40f', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' },
        badge: { padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' },
        contentWrapper: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }, // ✅ Fix Grid for Mobile (was 350px)

        mainImageContainer: { position: 'relative', width: '100%', height: '300px', cursor: 'pointer', overflow: 'hidden', borderRadius: '15px', border: `1px solid ${colors.border}`, boxShadow: colors.shadow, touchAction: 'pan-y' }, // ✅ Adjusted height
        mainImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', userSelect: 'none' }, 
        
        // Gallery Arrows
        arrowBtn: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '50%', fontSize: '1.2rem', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' },
        
        // Thumbnails
        thumbnailContainer: { display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' },
        thumbnail: { width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: '2px solid transparent', transition: '0.2s' },
        activeThumbnail: { border: '2px solid #f1c40f', transform: 'scale(1.05)' },

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
                    {/* IMAGES SECTION */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        {/* Main Image */}
                        <div 
                            style={styles.mainImageContainer}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            {images.length > 1 && (
                                <button onClick={prevImage} style={{ ...styles.arrowBtn, left: '10px' }}>❮</button>
                            )}
                            
                            <img 
                                src={currentImage} 
                                alt={property.title} 
                                style={{ ...styles.mainImage, filter: property.is_sold ? 'grayscale(80%)' : 'none' }} 
                            />
                            
                            {images.length > 1 && (
                                <button onClick={nextImage} style={{ ...styles.arrowBtn, right: '10px' }}>❯</button>
                            )}

                            {property.is_sold && <div style={styles.soldOverlay}>SOLD OUT</div>}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div style={styles.thumbnailContainer}>
                                {images.map((img, index) => (
                                    <img 
                                        key={index} 
                                        src={img.image || img.image_url} 
                                        alt={`Thumbnail ${index}`} 
                                        style={{ 
                                            ...styles.thumbnail, 
                                            ...(index === currentImageIndex ? styles.activeThumbnail : {}) 
                                        }}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
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
                                    <FaShoppingCart /> Pay Booking Token (₹5,000)
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
                        <h2 style={{ color: '#f1c40f', textAlign: 'center', marginBottom: '20px' }}>Contact Owner</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <p style={{ textAlign: 'center', color: colors.subText, fontSize: '0.9rem' }}>Fill your details to show interest. The owner will be notified via email.</p>
                            
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const data = {
                                    name: formData.get('name'),
                                    email: formData.get('email'),
                                    phone: formData.get('phone')
                                };

                                axios.post(`${BACKEND_URL}/api/properties/${id}/contact-owner/`, data, {
                                    headers: { 
                                        'Content-Type': 'application/json',
                                        ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
                                    }
                                })
                                .then(() => {
                                    toast.success("Inquiry Sent Successfully! 📩");
                                    setShowContact(false);
                                })
                                .catch(err => {
                                    console.error(err);
                                    toast.error("Failed to send inquiry.");
                                });
                            }}>
                                <input name="name" placeholder="Your Name" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text }} />
                                <input name="email" type="email" placeholder="Your Email" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text }} />
                                <input name="phone" type="tel" placeholder="Your Phone Number" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text }} />
                                
                                <button type="submit" style={{ ...styles.buyBtn, background: '#3498db', marginTop: '10px' }}>Send Inquiry</button>
                            </form>
                            
                            <div style={{ marginTop: '10px', borderTop: `1px solid ${colors.border}`, paddingTop: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.9rem' }}><FaUser color="#3498db" /> <strong style={{ color: colors.text }}>{property.seller_name}</strong></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetail;