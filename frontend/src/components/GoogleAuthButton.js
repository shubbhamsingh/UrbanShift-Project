import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const GoogleAuthButton = ({ onSuccess, onError, buttonText = "Continue with Google" }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    // 👇 SMART URL SETUP
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const BACKEND_URL = isLocal 
        ? "http://127.0.0.1:8000" 
        : "https://urbanshift-project.onrender.com";

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        
        try {
            // Firebase Google Sign In
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Get Firebase ID Token
            const idToken = await user.getIdToken();
            
            // Send to backend for verification/user creation
            const response = await fetch(`${BACKEND_URL}/api/users/google-auth/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: idToken,
                    email: user.email,
                    name: user.displayName,
                    photo: user.photoURL,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onSuccess(data);
            } else {
                onError(data.error || 'Google authentication failed');
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            
            // User-friendly error messages
            if (error.code === 'auth/popup-closed-by-user') {
                onError('Sign-in cancelled');
            } else if (error.code === 'auth/network-request-failed') {
                onError('Network error. Please check your internet connection.');
            } else {
                onError(error.message || 'Google sign-in failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{
                ...buttonStyle,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
        >
            {isLoading ? (
                <span>⏳ Signing in...</span>
            ) : (
                <>
                    <FcGoogle style={{ fontSize: '1.4rem', marginRight: '10px' }} />
                    {buttonText}
                </>
            )}
        </button>
    );
};

// Styles
const buttonStyle = {
    width: '100%',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--card-bg)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '15px',
};

export default GoogleAuthButton;
