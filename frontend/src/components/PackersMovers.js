import React, { useState } from 'react';
import './packersMovers.css'; // CSS Import

const PackersMovers = () => {
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    moveDate: '',
    contact: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filhal hum sirf UI dikha rahe hain, baad me ise Backend se jodenge
    console.log("Inquiry Data:", formData);
    setSubmitted(true);
    
    // 3 second baad form reset
    setTimeout(() => {
        setSubmitted(false);
        setFormData({fromLocation: '', toLocation: '', moveDate: '', contact: ''});
    }, 3000);
  };

  return (
    <div className="packers-page">
      
      {/* --- HERO SECTION WITH FORM --- */}
      <div className="packers-hero">
        <div className="overlay-dark"></div>
        
        <div className="hero-content-packers">
            <h1>Shift Your Home, <span className="highlight-text">Hassle-Free!</span> 🚚</h1>
            <p>Get instant quotes from verified Packers & Movers in your city.</p>
            
            {/* INQUIRY FORM */}
            <div className="quote-form-container">
                {submitted ? (
                    <div className="success-msg">
                        <h3>✅ Request Received!</h3>
                        <p>Our top movers will contact you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="quote-form">
                        <h3>Get a Free Quote</h3>
                        <div className="form-grid">
                            <input 
                                type="text" name="fromLocation" placeholder="Moving From (City/Area)" 
                                value={formData.fromLocation} onChange={handleChange} required 
                            />
                            <input 
                                type="text" name="toLocation" placeholder="Moving To (City/Area)" 
                                value={formData.toLocation} onChange={handleChange} required 
                            />
                            <input 
                                type="date" name="moveDate" 
                                value={formData.moveDate} onChange={handleChange} required 
                            />
                            <input 
                                type="tel" name="contact" placeholder="Mobile Number" 
                                value={formData.contact} onChange={handleChange} required 
                            />
                        </div>
                        <button type="submit" className="submit-btn">🚀 Check Prices</button>
                    </form>
                )}
            </div>
        </div>
      </div>

      {/* --- TOP MOVERS LIST (Static Data) --- */}
      <div className="movers-section">
        <h2 className="section-title">Top Rated <span className="highlight-text">Movers</span></h2>
        
        <div className="movers-grid">
            {/* Mover 1 */}
            <div className="mover-card">
                <div className="mover-badge">⭐ 4.8</div>
                <h3>Agarwal Packers & Movers</h3>
                <p className="mover-spec">📦 Household & Office Shifting</p>
                <p className="mover-loc">📍 Servicing: All India</p>
                <button className="call-btn">📞 Call Now</button>
            </div>

            {/* Mover 2 */}
            <div className="mover-card">
                <div className="mover-badge">⭐ 4.5</div>
                <h3>UrbanShift Logistics</h3>
                <p className="mover-spec">🚚 Express Delivery</p>
                <p className="mover-loc">📍 Servicing: Jaipur, Delhi, Mumbai</p>
                <button className="call-btn">📞 Call Now</button>
            </div>

            {/* Mover 3 */}
            <div className="mover-card">
                <div className="mover-badge">⭐ 4.7</div>
                <h3>Porter Services</h3>
                <p className="mover-spec">🚛 Mini Trucks & Tempo</p>
                <p className="mover-loc">📍 Servicing: Local City</p>
                <button className="call-btn">📞 Call Now</button>
            </div>
        </div>
      </div>

    </div>
  );
};

export default PackersMovers;