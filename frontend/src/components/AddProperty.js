import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCloudUploadAlt, FaTimes, FaHome } from 'react-icons/fa';
import imageCompression from 'browser-image-compression'; // ✅ Image Compression

// ✅ Correct Import
import { ThemeContext } from '../context/ThemeContext'; 

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // ✅ FIX: Using 'mode' from Context
  const { mode } = useContext(ThemeContext);
  
  // Check Dark Mode Logic
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: 'RENT',
    bedrooms: '1BHK',
  });

  const [files, setFiles] = useState([]); 
  const [imageUrls, setImageUrls] = useState([]); 
  const [currentUrl, setCurrentUrl] = useState(''); 

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";

  // --- DYNAMIC COLORS ---
  const colors = {
      bg: isDark ? '#121212' : '#f4f6f8',
      card: isDark ? '#1e1e1e' : '#ffffff',
      text: isDark ? '#ffffff' : '#333333',
      subText: isDark ? '#cccccc' : '#555555',
      inputBg: isDark ? '#2c2c2c' : '#f9f9f9',
      border: isDark ? '#444444' : '#dddddd',
      shadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.1)'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 6) {
        toast.warning("Maximum 6 photos allowed!");
        return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const handleAddUrl = () => {
      if (!currentUrl) return;
      if (imageUrls.length + files.length >= 6) {
          toast.warning("Maximum 6 photos allowed!");
          return;
      }
      setImageUrls([...imageUrls, currentUrl]);
      setCurrentUrl('');
  };

  const removeFile = (index) => setFiles(files.filter((_, i) => i !== index));
  const removeUrl = (index) => setImageUrls(imageUrls.filter((_, i) => i !== index));

  // ✅ Compress Image Function (Max 9MB to stay under Cloudinary 10MB limit)
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 6, // Target 6MB (Cloudinary limit is 10MB)
      maxWidthOrHeight: 1920, // Max resolution
      useWebWorker: true,
    };
    try {
      const compressed = await imageCompression(file, options);
      // Removed debug log: Compressed file size
      return compressed;
    } catch (error) {
      // Keep error log for critical functionality failure but could be removed for strict production
      console.error('Compression failed:', error);
      return file; // Return original if compression fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0 && imageUrls.length === 0) {
        toast.error("Please add at least 1 photo (Upload or URL)");
        return;
    }

    setLoading(true);
    toast.info("Compressing images... 📸"); // User feedback

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      
      // ✅ Compress each image before adding to FormData
      for (const file of files) {
        const compressedFile = await compressImage(file);
        data.append('uploaded_images', compressedFile);
      }
      
      imageUrls.forEach(url => data.append('image_urls', url));

      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/properties/`, data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      toast.success("Property Listed Successfully! 🎉");
      navigate('/seller-dashboard');
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to post property. Check inputs.");
    } finally {
      setLoading(false);
    }
  };


  // --- STYLES ---
  const styles = {
    container: { minHeight: '100vh', background: colors.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', transition: '0.3s' },
    formCard: { background: colors.card, padding: '50px', borderRadius: '20px', width: '100%', maxWidth: '850px', boxShadow: `0 10px 40px ${colors.shadow}`, border: `1px solid ${colors.border}`, transition: '0.3s' },
    header: { color: colors.text, textAlign: 'center', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
    
    formGroup: { marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' },
    
    // ✅ FIX: Row ke liye ab Grid use kiya hai taaki boxes chipke nahi
    rowFlex: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Responsive columns
        gap: '20px', // Yahan gap fix kar diya
        marginBottom: '30px' 
    },
    
    flexItem: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px' 
    },

    label: { color: colors.subText, fontSize: '0.95rem', fontWeight: 'bold', marginLeft: '5px' },
    
    // ✅ FIX: boxSizing add kiya taaki padding se box bahar na nikle
    input: { width: '100%', boxSizing: 'border-box', padding: '16px', background: colors.inputBg, border: `1px solid ${colors.border}`, borderRadius: '10px', color: colors.text, outline: 'none', fontSize: '1rem', transition: '0.3s' },
    
    textArea: { width: '100%', boxSizing: 'border-box', padding: '16px', background: colors.inputBg, border: `1px solid ${colors.border}`, borderRadius: '10px', color: colors.text, outline: 'none', fontSize: '1rem', minHeight: '200px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' },

    imageSection: { background: isDark ? '#2a2a2a' : '#eaeaea', padding:'30px', borderRadius:'15px', margin:'40px 0', border: `1px dashed ${colors.border}` },
    uploadRow: { display:'flex', gap:'15px', marginBottom:'20px', alignItems:'center' },
    fileBtn: { background: '#f39c12', padding: '12px 25px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight:'bold', transition: '0.2s', border:'none' },
    addUrlBtn: { background: '#3498db', padding: '0 25px', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer', fontWeight:'bold', transition: '0.2s' },
    
    previewGrid: { display:'flex', gap:'15px', marginTop:'25px', flexWrap:'wrap' },
    previewBox: { position: 'relative', width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
    previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
    removeIcon: { position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.8)', color: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer', fontSize: '12px', zIndex: 2 },
    badge: { position: 'absolute', bottom: '0', left: '0', width:'100%', textAlign:'center', background:'#f39c12', color:'black', fontSize:'0.7rem', fontWeight:'bold', padding:'2px 0'},

    submitBtn: { width: '100%', padding: '18px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 5px 20px rgba(46, 204, 113, 0.4)', transition: '0.3s' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.header}>
            <FaHome color={isDark ? "#f1c40f" : "#f39c12"}/> Post New Property
        </h2>

        <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Property Title</label>
                <input name="title" placeholder="e.g. Luxury Apartment near Airport" onChange={handleChange} required style={styles.input} />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input name="location" placeholder="e.g. Malviya Nagar, Jaipur, Rajasthan" onChange={handleChange} required style={styles.input} />
            </div>

            {/* Price, Category, Bedrooms Row */}
            <div style={styles.rowFlex}>
                <div style={styles.flexItem}>
                    <label style={styles.label}>Price (₹)</label>
                    <input type="number" name="price" placeholder="e.g. 15000" onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.flexItem}>
                    <label style={styles.label}>Category</label>
                    <select name="category" onChange={handleChange} style={styles.input}>
                        <option value="RENT">Rent</option>
                        <option value="SELL">Sell</option>
                    </select>
                </div>
                <div style={styles.flexItem}>
                    <label style={styles.label}>Bedrooms</label>
                    <select name="bedrooms" onChange={handleChange} style={styles.input}>
                        <option value="1BHK">1 BHK</option>
                        <option value="2BHK">2 BHK</option>
                        <option value="3BHK">3 BHK</option>
                        <option value="Villa">Villa</option>
                    </select>
                </div>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea 
                    name="description" 
                    placeholder="Describe your property in detail (e.g. Amenities, Nearby places, Conditions)..." 
                    onChange={handleChange} 
                    required 
                    style={styles.textArea} 
                />
            </div>

            <div style={styles.imageSection}>
                <h4 style={{color: colors.subText, margin:'0 0 20px 0'}}>Property Photos (Max 6)</h4>
                
                <div style={styles.uploadRow}>
                    <label style={styles.fileBtn}>
                        <FaCloudUploadAlt size={20}/> Upload Files
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{display:'none'}} />
                    </label>
                    <span style={{color: colors.subText, fontSize:'0.9rem'}}>{files.length} files selected</span>
                </div>

                <div style={{display:'flex', gap:'10px'}}>
                    <input placeholder="Or paste image URL here..." value={currentUrl} onChange={(e) => setCurrentUrl(e.target.value)} style={{...styles.input, margin:0}} />
                    <button type="button" onClick={handleAddUrl} style={styles.addUrlBtn}>Add URL 🔗</button>
                </div>

                <div style={styles.previewGrid}>
                    {files.map((f, i) => (
                        <div key={i} style={styles.previewBox}>
                            <img src={URL.createObjectURL(f)} alt="preview" style={styles.previewImg} />
                            <FaTimes onClick={() => removeFile(i)} style={styles.removeIcon} />
                            <span style={styles.badge}>FILE</span>
                        </div>
                    ))}
                    {imageUrls.map((url, i) => (
                        <div key={i} style={styles.previewBox}>
                            <img src={url} alt="preview" style={styles.previewImg} onError={(e)=>e.target.src='https://via.placeholder.com/100'}/>
                            <FaTimes onClick={() => removeUrl(i)} style={styles.removeIcon} />
                            <span style={{...styles.badge, background:'#3498db'}}>URL</span>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Posting...' : '🚀 Post Property'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;