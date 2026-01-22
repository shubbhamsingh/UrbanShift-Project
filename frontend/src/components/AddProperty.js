import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
  const navigate = useNavigate(); // ✅ अब इसका इस्तेमाल नीचे handleSubmit में हो रहा है
  
  // State for toggling Image Type
  const [imageType, setImageType] = useState('file'); // 'file' or 'url'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '', 
    imageUrl: '', 
    imageFile: null 
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'imageUrl') {
        setPreview(e.target.value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData({ ...formData, imageFile: file });
        setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Data:", formData);
    
    // Success Alert
    alert("Property Posted Successfully! (Data logged in console)");
    
    // ✅ Redirect to Home Page after success
    navigate('/'); 
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={{ textAlign: 'center', color: 'var(--accent-orange)', marginBottom: '15px' }}>🏠 Post New Property</h2>
        <p style={{ textAlign: 'center', marginBottom: '40px', opacity: 0.7 }}>Fill in the details to list your home.</p>

        <form onSubmit={handleSubmit}>
          
          {/* Title */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Property Title</label>
            <input type="text" name="title" placeholder="e.g. Luxury 2BHK in Malviya Nagar" required style={inputStyle} onChange={handleChange} />
          </div>

          {/* Description */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea name="description" placeholder="Tell us about the property..." rows="4" required style={{...inputStyle, resize:'vertical'}} onChange={handleChange}></textarea>
          </div>

          {/* Price & Location (Row) */}
          <div style={rowStyle}>
            <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={labelStyle}>Price (₹ / Month)</label>
                <input type="number" name="price" placeholder="e.g. 15000" required style={inputStyle} onChange={handleChange} />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={labelStyle}>Location (City/Area)</label>
                <input type="text" name="location" placeholder="e.g. Jaipur" required style={inputStyle} onChange={handleChange} />
            </div>
          </div>

          {/* Specs Row */}
          <div style={rowStyle}>
            <div style={smallInputDiv}>
                <label style={labelStyle}>Bedrooms</label>
                <input type="number" name="bedrooms" placeholder="2" style={inputStyle} onChange={handleChange} />
            </div>
            <div style={smallInputDiv}>
                <label style={labelStyle}>Bathrooms</label>
                <input type="number" name="bathrooms" placeholder="2" style={inputStyle} onChange={handleChange} />
            </div>
            <div style={smallInputDiv}>
                <label style={labelStyle}>Area (sq ft)</label>
                <input type="number" name="area" placeholder="1200" style={inputStyle} onChange={handleChange} />
            </div>
          </div>

          {/* --- IMAGE SECTION --- */}
          <div style={{ marginBottom: '30px', padding: '25px', background: 'var(--bg-color)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
            <label style={{...labelStyle, marginBottom: '20px', display:'block'}}>Property Image</label>
            
            {/* Toggle Buttons */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <button type="button" onClick={() => setImageType('file')} style={imageType === 'file' ? activeTabStyle : inactiveTabStyle}>📁 Upload File</button>
                <button type="button" onClick={() => setImageType('url')} style={imageType === 'url' ? activeTabStyle : inactiveTabStyle}>🔗 Image URL</button>
            </div>

            {/* Input */}
            {imageType === 'file' ? (
                <input type="file" accept="image/*" onChange={handleFileChange} style={fileInputStyle} />
            ) : (
                <input type="text" name="imageUrl" placeholder="Paste image link here..." onChange={handleChange} style={inputStyle} />
            )}

            {/* Preview */}
            {preview && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{fontSize:'0.8rem', opacity:0.7, marginBottom:'10px'}}>Preview:</p>
                    <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '15px', border: '1px solid #555' }} 
                          onError={(e) => e.target.style.display = 'none'} /> 
                </div>
            )}
          </div>

          <button type="submit" style={submitBtnStyle}>🚀 Publish Property</button>
        
        </form>
      </div>
    </div>
  );
};

// --- STYLES (More Spacious) ---
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '60px 20px', 
  color: 'var(--text-primary)'
};

const formCardStyle = {
  background: 'var(--card-bg)',
  padding: '50px', 
  borderRadius: '20px',
  boxShadow: 'var(--card-shadow)',
  width: '100%',
  maxWidth: '800px', 
  border: '1px solid var(--border-color)'
};

const inputGroupStyle = {
  marginBottom: '35px' 
};

const rowStyle = {
  display: 'flex',
  gap: '40px', 
  marginBottom: '35px', 
  flexWrap: 'wrap'
};

const smallInputDiv = {
    flex: 1,
    minWidth: '120px'
};

const labelStyle = {
    display: 'block',
    marginBottom: '10px', 
    fontWeight: '600',
    color: 'var(--text-primary)',
    fontSize: '1.05rem'
};

const inputStyle = {
  width: '100%',
  padding: '14px', 
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-color)',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  transition: 'border-color 0.3s'
};

const fileInputStyle = {
  width: '100%',
  padding: '12px',
  background: 'white',
  color: 'black',
  borderRadius: '8px',
  cursor: 'pointer'
};

const submitBtnStyle = {
  width: '100%',
  padding: '18px', 
  background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '1.3rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '15px',
  transition: 'transform 0.2s',
  boxShadow: '0 8px 20px rgba(255, 94, 98, 0.4)'
};

// Toggle Button Styles
const activeTabStyle = {
    padding: '10px 20px',
    background: 'var(--accent-orange)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem'
};

const inactiveTabStyle = {
    padding: '10px 20px',
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '0.9rem'
};

export default AddProperty;