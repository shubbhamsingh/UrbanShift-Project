import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [stage, setStage] = useState(0);

    useEffect(() => {
        // Timeline:
        // 0-0.1s: Stage 1 - Particles appear
        // 0.5s: Stage 2 - Particles start moving
        // 2s: Stage 3 - Logo revealed
        // 3s: Stage 4 - Text appears
        // 4s: Stage 5 - Tagline
        // 4.5s: Fade out
        
        const timers = [
            setTimeout(() => setStage(1), 100),
            setTimeout(() => setStage(2), 500),
            setTimeout(() => setStage(3), 2000),
            setTimeout(() => setStage(4), 3000),
            setTimeout(() => setStage(5), 4000),
            setTimeout(() => setFadeOut(true), 4500),
            setTimeout(() => {
                setIsVisible(false);
                if (onComplete) onComplete();
            }, 5500)
        ];

        return () => timers.forEach(t => clearTimeout(t));
    }, [onComplete]);

    if (!isVisible) return null;

    // Generate floating particles
    const particles = Array.from({ length: 30 }, (_, i) => (
        <div 
            key={i} 
            className={`particle particle-${i % 3}`}
            style={{
                '--delay': `${Math.random() * 0.5}s`,
                '--x': `${Math.random() * 100 - 50}px`,
                '--y': `${Math.random() * 100 - 50}px`,
                '--size': `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
            }}
        />
    ));

    return (
        <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
            {/* Animated Background */}
            <div className="splash-bg">
                <div className="bg-gradient"></div>
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>

            <div className={`splash-content stage-${stage}`}>
                {/* Logo Section */}
                <div className="logo-section">
                    {/* Rotating Border */}
                    <div className="rotating-border"></div>
                    
                    {/* Particles that form logo */}
                    <div className="particles-container">
                        {particles}
                    </div>
                    
                    {/* Main Logo */}
                    <div className="logo-wrapper">
                        <img 
                            src={process.env.PUBLIC_URL + '/urbanshift-logo.png'} 
                            alt="UrbanShift"
                            className="main-logo"
                        />
                    </div>
                    
                    {/* Glowing pulse */}
                    <div className="pulse-ring pulse-1"></div>
                    <div className="pulse-ring pulse-2"></div>
                </div>

                {/* Text Section */}
                <div className="text-section">
                    <h1 className="brand-name">
                        <span className="char-urban">
                            {'Urban'.split('').map((char, i) => (
                                <span key={i} className="char" style={{ '--char-delay': `${i * 0.08}s` }}>{char}</span>
                            ))}
                        </span>
                        <span className="char-shift">
                            {'Shift'.split('').map((char, i) => (
                                <span key={i} className="char" style={{ '--char-delay': `${(i + 5) * 0.08}s` }}>{char}</span>
                            ))}
                        </span>
                    </h1>
                    
                    <p className="tagline">
                        <span className="tagline-line"></span>
                        <span className="tagline-text">Relocation & Property Solutions</span>
                        <span className="tagline-line"></span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
