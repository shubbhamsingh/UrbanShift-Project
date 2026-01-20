import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/properties/${id}/`)
      .then(response => {
        const propData = response.data;
        setProperty(propData);

        let images = [];
        // Main Image
        if (propData.image) {
          images.push({
            original: propData.image,
            thumbnail: propData.image,
          });
        }
        // Gallery Images
        if (propData.images && propData.images.length > 0) {
          propData.images.forEach(imgObj => {
            images.push({
              original: imgObj.image,
              thumbnail: imgObj.image,
            });
          });
        }
        setGalleryImages(images);
      })
      .catch(error => {
        console.error("Error fetching property details:", error);
      });
  }, [id]);

  if (!property) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</h2>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/properties" style={{ textDecoration: 'none', color: '#007bff', display: 'inline-block', marginBottom: '15px' }}>← Back to Properties</Link>

      <h1 style={{ margin: '0' }}>{property.title}</h1>
      <p style={{ color: 'gray', marginTop: '5px' }}>📍 {property.city}</p>

      {/* Gallery Section */}
      <div style={{ marginTop: '20px', borderRadius: '10px', overflow: 'hidden', background: '#f0f0f0' }}>
        {galleryImages.length > 0 ? (
          <ImageGallery
            items={galleryImages}
            showPlayButton={false}
            showFullscreenButton={true}
            showThumbnails={true}
            showNav={true}
            thumbnailPosition="bottom"
            useBrowserFullscreen={false}
          />
        ) : (
          <div style={{ height: '500px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#666' }}>
            No Images Available
          </div>
        )}
      </div>

      {/* Details Box */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', marginTop: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <h2 style={{ color: '#28a745', margin: '0' }}>Price: ₹{property.price.toLocaleString()}</h2>
          <span style={{ background: '#007bff', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '14px' }}>
            {property.property_type}
          </span>
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
        
        <h3>Description</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>{property.description}</p>
        
        {/* Contact Owner Button with WhatsApp Logic */}
        <button 
          onClick={() => {
            const message = `Hello, I am interested in your property: ${property.title} located in ${property.city}. Please share more details.`;
            const phoneNumber = property.phone_number || "919999999999"; 
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
          style={{ 
            padding: '15px 30px', background: '#25D366', color: 'white', border: 'none', 
            borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', 
            marginTop: '20px', width: '100%', transition: 'background 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}
          onMouseOver={(e) => e.target.style.background = '#1da851'}
          onMouseOut={(e) => e.target.style.background = '#25D366'}
        >
          <span style={{ fontSize: '20px' }}>💬</span> Chat on WhatsApp
        </button>

      </div>
    </div>
  );
};

export default PropertyDetail;