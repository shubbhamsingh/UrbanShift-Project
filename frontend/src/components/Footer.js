import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'; 
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* --- Column 1: Brand Info --- */}
        <div className="footer-col">
            <h2 className="footer-logo">Urban<span className="highlight">Shift</span></h2>
            <p className="footer-text">
                Move to your dream home without the stress. <br/>
                India's most trusted platform for Rentals & Relocation.
            </p>
        </div>

        {/* --- Column 2: Quick Links --- */}
        <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/properties">Find Homes</Link></li>
                <li><Link to="/packers">Packers & Movers</Link></li>
                <li><Link to="/seller-dashboard">Seller Dashboard</Link></li>
            </ul>
        </div>

        {/* --- Column 3: Contact & Social --- */}
        <div className="footer-col">
            <h3>Contact Us</h3>
            <ul className="footer-contact">
                <li>📍 Sitapura, Jaipur, Rajasthan</li>
                <li>📧 urbanshiftt@gmail.com</li>
                <li>📞 +91 98765 43210</li>
            </ul>
            
            {/* ✅ YOUR REAL SOCIAL LINKS ADDED HERE */}
            <div className="social-icons">
                <a href="https://www.facebook.com/share/17wZJFc8rj/" target="_blank" rel="noreferrer" className="icon-box facebook">
                    <FaFacebookF />
                </a>
                <a href="https://www.instagram.com/shubham_singh_840?igsh=MWF0aHcxeGx0OWoxNg==" target="_blank" rel="noreferrer" className="icon-box instagram">
                    <FaInstagram />
                </a>
                <a href="https://x.com/Shubham_Singh84" target="_blank" rel="noreferrer" className="icon-box twitter">
                    <FaTwitter />
                </a>
                <a href="https://www.linkedin.com/in/shubham-raj-562974306?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer" className="icon-box linkedin">
                    <FaLinkedinIn />
                </a>
            </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 UrbanShift. All rights reserved. | Designed & Developed by <span style={{color:'#fff', fontWeight:'bold'}}>Shubham Raj</span> ❤️</p>
      </div>
    </footer>
  );
};

export default Footer;