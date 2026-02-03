import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <h1 style={errorCodeStyle}>404</h1>
                <h2 style={titleStyle}>Page Not Found</h2>
                <p style={descStyle}>
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <div style={buttonContainerStyle}>
                    <Link to="/" style={homeButtonStyle}>
                        🏠 Go Home
                    </Link>
                    <Link to="/properties" style={propertiesButtonStyle}>
                        🏘️ Browse Properties
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-color)',
    padding: '20px'
};

const contentStyle = {
    textAlign: 'center',
    maxWidth: '500px'
};

const errorCodeStyle = {
    fontSize: '8rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #0a7e8c 0%, #f29f05 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    lineHeight: 1
};

const titleStyle = {
    fontSize: '1.8rem',
    color: 'var(--text-primary)',
    marginTop: '10px',
    marginBottom: '15px'
};

const descStyle = {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    marginBottom: '30px'
};

const buttonContainerStyle = {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
};

const homeButtonStyle = {
    padding: '12px 25px',
    background: 'linear-gradient(135deg, #0a7e8c 0%, #0d9488 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'transform 0.2s'
};

const propertiesButtonStyle = {
    padding: '12px 25px',
    background: 'var(--card-bg)',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    border: '1px solid var(--border-color)',
    transition: 'transform 0.2s'
};

export default NotFound;
