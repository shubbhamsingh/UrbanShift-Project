import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Slider ke liye state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/properties/${id}/`);
        const data = await response.json();
        setProperty(data);
        
        // Saari images (Main + Extra) ko ek list me daal rahe hain
        let imagesList = [];
        if (data.image) imagesList.push(data.image); // Main image
        
        // Agar extra images hain to unhe bhi list me jodein
        if (data.images && data.images.length > 0) {
          data.images.forEach(img => imagesList.push(img.image)); 
        }
        
        setAllImages(imagesList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

// ✅ WhatsApp Button Logic (Fixed)
  const handleWhatsApp = () => {
    if (property && property.phone_number) {
      
      // 1. Pehle non-digits hatayein (Spaces, +, - sab hat jayega)
      let number = property.phone_number.replace(/\D/g, ''); 

      // 2. Check karein ki kya number pehle se 91 se shuru ho raha hai?
      // Agar number 10 digit ka hai (Jaise 9876543210), to aage 91 lagayein.
      if (number.length === 10) {
        number = '91' + number;
      }
      // Agar number 12 digit ka hai aur 91 se shuru hai, to kuch mat karein.

      const url = `https://wa.me/${number}?text=Hello, I am interested in your property: ${property.title}`;
      window.open(url, '_blank');
    } else {
      alert("Owner phone number not available");
    }
  };

  // Slider Logic (Next/Prev)
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading... ⏳</h2>;
  if (!property) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>❌ Property Not Found</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
      
      {/* Back Button */}
      <Link to="/properties" style={{ textDecoration: 'none', color: '#007bff', fontSize: '18px' }}>
        ← Back to List
      </Link>

      {/* Title & Price */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h1 style={{ margin: 0 }}>{property.title}</h1>
        <h2 style={{ color: '#28a745', margin: 0 }}>₹{property.price}/mo</h2>
      </div>
      <p style={{ color: '#666', fontSize: '18px' }}>📍 {property.city} - {property.address}</p>

      {/* --- IMAGE SLIDER --- */}
      <div style={{ position: 'relative', width: '100%', height: '400px', marginTop: '20px', backgroundColor: '#000', borderRadius: '10px', overflow: 'hidden' }}>
        
        {allImages.length > 0 ? (
          <>
            {/* Image Source Fix: Agar URL http se shuru nahi hota to backend URL jodo */}
            <img 
              src={allImages[currentImageIndex].startsWith('http') ? allImages[currentImageIndex] : `http://127.0.0.1:8000${allImages[currentImageIndex]}`}
              alt="Property" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
            
            {/* Left Arrow */}
            {allImages.length > 1 && (
              <button onClick={prevImage} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '50%', fontSize: '20px' }}>
                ❮
              </button>
            )}

            {/* Right Arrow */}
            {allImages.length > 1 && (
              <button onClick={nextImage} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '50%', fontSize: '20px' }}>
                ❯
              </button>
            )}

            {/* Image Counter */}
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>No Images Available</div>
        )}
      </div>

      {/* Description */}
      <div style={{ marginTop: '30px' }}>
        <h3>🏡 Description</h3>
        <p style={{ lineHeight: '1.6', fontSize: '16px' }}>{property.description}</p>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <span style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
            🛏️ {property.bedrooms ? `${property.bedrooms} Bedrooms` : 'N/A'}
          </span>
          <span style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
            🚿 {property.bathrooms ? `${property.bathrooms} Bathrooms` : 'N/A'}
          </span>
          <span style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
            🛋️ {property.is_furnished ? 'Furnished' : 'Unfurnished'}
          </span>
        </div>
      </div>

      {/* Buttons Section */}
      <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
        
        {/* WhatsApp Button */}
        <button 
          onClick={handleWhatsApp}
          style={{ flex: 1, padding: '15px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span>💬</span> Chat on WhatsApp
        </button>

        {/* Book Visit Button */}
        <button 
          onClick={() => alert('Booking feature coming soon! Please contact owner on WhatsApp.')}
          style={{ flex: 1, padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}>
          📅 Book Visit
        </button>

      </div>

    </div>
  );
};

export default PropertyDetail;