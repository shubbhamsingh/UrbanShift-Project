import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* --- HERO SECTION (Big Image) --- */}
      <div style={styles.heroContainer}>
        {/* Dark Gradient Overlay */}
        <div style={styles.overlay}></div>
        
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Move to your <span style={{color: '#f29f05'}}>Dream Home</span> <br/> without the Stress.
          </h1>
          <p style={styles.heroSubtitle}>
            India's first platform connecting you to verified Rental Homes <br/> and trusted Packers & Movers in one place.
          </p>
          
          <div style={styles.buttonGroup}>
            <Link to="/properties" className="btn-3d-orange" style={styles.mainBtn}>
               🏠 Find a Home
            </Link>
            <Link to="/packers" className="btn-3d-orange" style={{...styles.mainBtn, background: 'white', color: '#0a7e8c'}}>
               🚚 Book Movers
            </Link>
          </div>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Choose Urban<span style={{color:'var(--accent-orange)'}}>Shift</span>?</h2>
        
        <div style={styles.cardsContainer}>
          <div className="card-3d" style={styles.card}>
            <div style={styles.icon}>🏡</div>
            <h3 style={styles.cardTitle}>Verified Listings</h3>
            <p style={styles.cardText}>Direct connections with verified property owners. No fake listings, no hidden brokers.</p>
          </div>

          <div className="card-3d" style={styles.card}>
            <div style={styles.icon}>📦</div>
            <h3 style={styles.cardTitle}>Safe Relocation</h3>
            <p style={styles.cardText}>Top-rated Packers & Movers ensuring your belongings reach safely and on time.</p>
          </div>

          <div className="card-3d" style={styles.card}>
            <div style={styles.icon}>🛡️</div>
            <h3 style={styles.cardTitle}>Secure & Trusted</h3>
            <p style={styles.cardText}>We prioritize your safety with background checks and secure payment options.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  heroContainer: {
    position: 'relative',
    height: '85vh',
    backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white'
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    padding: '20px'
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '20px',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '40px',
    opacity: '0.9'
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center'
  },
  mainBtn: {
    padding: '15px 30px',
    fontSize: '1.1rem',
    textDecoration: 'none',
    display: 'inline-block'
  },
  featuresSection: {
    padding: '60px 20px',
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    marginBottom: '50px',
    color: 'var(--text-primary)'
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '30px',
    flexWrap: 'wrap'
  },
  card: {
    flex: '1',
    minWidth: '280px',
    padding: '40px 20px',
    textAlign: 'center'
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '20px'
  },
  cardTitle: {
    color: 'var(--accent-teal)',
    marginBottom: '15px'
  },
  cardText: {
    color: 'var(--text-secondary)',
    lineHeight: '1.6'
  }
};

export default Home;