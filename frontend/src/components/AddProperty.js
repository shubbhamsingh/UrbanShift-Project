import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; 

const AddProperty = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // 👇 LIVE SERVER URL
  const BACKEND_URL = 'https://urbanshift-project.onrender.com';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: 'RENT', 
    bedrooms: '1BHK'
  });

  // 🖼️ Mixed State: Can contain File objects OR URL strings
  const [images, setImages] = useState([]);
  const [tempUrl, setTempUrl] = useState(''); 

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Handle File Selection
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (images.length + selectedFiles.length > 6) {
        toast.warning("Max 6 photos allowed! 📸");
        return;
    }

    const validFiles = [];
    selectedFiles.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) { // 5MB Limit
            toast.error(`Skipped "${file.name}" (>5MB) ⚠️`);
        } else {
            validFiles.push(file);
        }
    });

    setImages([...images, ...validFiles]);
  };

  // 2. Handle URL Addition
  const handleAddUrl = () => {
    if (!tempUrl) return;

    if (images.length >= 6) {
        toast.warning("Max 6 photos allowed! 📸");
        return;
    }

    // Basic URL validation
    if (!tempUrl.match(/\.(jpeg|jpg|gif|png|webp)$/) && !tempUrl.includes('http')) {
        toast.warning("Please enter a valid image URL 🔗");
        return;
    }

    setImages([...images, tempUrl]); 
    setTempUrl(''); 
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
        toast.error("Add at least 1 photo (File or URL)! 🖼️");
        return;
    }

    if (formData.price < 0) {
        toast.error("Price cannot be negative! ❌");
        return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('category', formData.category);
    data.append('bedrooms', formData.bedrooms);
    
    // 🧠 Separate Files and URLs for Backend
    images.forEach((img) => {
        if (typeof img === 'string') {
            data.append('image_urls', img); 
        } else {
            data.append('photos', img); 
        }
    });

    try {
      const token = localStorage.getItem('token'); 
      
      if (!token) {
          toast.error("You are not logged in!");
          navigate('/login');
          return;
      }

      // 👇 Use BACKEND_URL here
      await axios.post(`${BACKEND_URL}/api/properties/`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Property Listed Successfully! 🎉");
      navigate('/seller-dashboard');

    } catch (error) {
      console.error("Upload Error:", error.response?.data || error);
      
      if (error.response && error.response.status === 403) {
          toast.error("Permission Denied! Verification Required. 🛑");
      } else if (error.response && error.response.status === 401) {
          toast.error("Session Expired. Please Login Again. 🔄");
          navigate('/login');
      } else {
          toast.error("Failed to list property. Check connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-primary)' }}>🏡 Add New Property</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Property Title</label>
            <input type="text" name="title" placeholder="e.g. 2BHK Flat in Jaipur" onChange={handleChange} style={inputStyle} required />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea name="description" rows="3" placeholder="Details..." onChange={handleChange} style={inputStyle} required />
          </div>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ ...inputGroupStyle, flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Price (₹/Month)</label>
                <input 
                    type="number" name="price" placeholder="15000" onChange={handleChange} style={inputStyle} required 
                    min="0" onKeyDown={(e) => ["-", "e", "+"].includes(e.key) && e.preventDefault()}
                />
            </div>
            <div style={{ ...inputGroupStyle, flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Location</label>
                <input type="text" name="location" placeholder="City, Area" onChange={handleChange} style={inputStyle} required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ ...inputGroupStyle, flex: 1 }}>
                <label style={labelStyle}>Category</label>
                <select name="category" onChange={handleChange} style={inputStyle}>
                    <option value="RENT">Rent</option>
                    <option value="SELL">Sell</option>
                </select>
            </div>
            <div style={{ ...inputGroupStyle, flex: 1 }}>
                <label style={labelStyle}>Bedrooms</label>
                <select name="bedrooms" onChange={handleChange} style={inputStyle}>
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="Villa">Villa</option>
                </select>
            </div>
          </div>

          {/* 📸 IMAGE SECTION */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Property Photos (Max 6)</label>
            
            <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                <input 
                    type="file" multiple accept="image/*"
                    onChange={handleImageChange}
                    style={{...inputStyle, padding: '10px', flex: 1}}
                />
            </div>

            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                <input 
                    type="text" 
                    placeholder="Or paste image URL here..." 
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    style={{...inputStyle, flex: 1}}
                />
                <button type="button" onClick={handleAddUrl} style={urlBtnStyle}>
                    Add URL 🔗
                </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                {images.length} / 6 images selected
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {images.map((img, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                        <img 
                            src={typeof img === 'string' ? img : URL.createObjectURL(img)} 
                            alt="preview" 
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                        />
                        <button type="button" onClick={() => removeImage(index)} style={removeBtnStyle}>×</button>
                        <span style={typeBadgeStyle}>{typeof img === 'string' ? 'URL' : 'FILE'}</span>
                    </div>
                ))}
            </div>
          </div>

          <button type="submit" style={{...buttonStyle, opacity: isLoading ? 0.7 : 1}} disabled={isLoading}>
            {isLoading ? 'Uploading...' : '🚀 Post Property'}
          </button>

        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const pageContainerStyle = { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '40px 20px' };
const cardStyle = { background: 'var(--card-bg)', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', width: '100%', maxWidth: '600px', border: '1px solid var(--border-color)' };
const inputGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' };
const buttonStyle = { width: '100%', padding: '15px', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const urlBtnStyle = { padding: '12px 20px', background: 'var(--accent-teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const removeBtnStyle = { position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', zIndex: 2 };
const typeBadgeStyle = { position: 'absolute', bottom: 0, left: 0, right:0, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', textAlign: 'center', padding: '2px', borderRadius: '0 0 8px 8px'};

export default AddProperty;