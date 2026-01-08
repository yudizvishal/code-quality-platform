import { useState } from 'react';
import './Header.css';

const Header = ({ currentPage = 'home', onNavigate, onGetStarted }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(true);

    const handleNavClick = (e, page) => {
        e.preventDefault();
        if (onNavigate) {
            onNavigate(page);
        }
    };

    const handleGetStarted = () => {
        if (onGetStarted) {
            onGetStarted();
        } else if (onNavigate) {
            onNavigate('home');
        }
    };

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
        document.body.classList.toggle('light-theme');
    };

    return (
        <header className="header">
            <div className="header-content glass-card">
                <div className="header-left">
                    <div className="logo" onClick={(e) => handleNavClick(e, 'home')} style={{ cursor: 'pointer' }}>
                        <div className="logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" fill="currentColor" opacity="0.2" />
                                <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="logo-text" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Quali Code</span>
                    </div>
                </div>

                <div className="header-right">
                    <nav className="nav-links">
                        <a
                            href="#features"
                            className={`nav-link ${currentPage === 'features' ? 'active' : ''}`}
                            onClick={(e) => handleNavClick(e, 'features')}
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className={`nav-link ${currentPage === 'how-it-works' ? 'active' : ''}`}
                            onClick={(e) => handleNavClick(e, 'how-it-works')}
                        >
                            How it Works
                        </a>
                        <a
                            href="#about"
                            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
                            onClick={(e) => handleNavClick(e, 'about')}
                        >
                            About
                        </a>
                    </nav>

                    {/* Theme Toggle */}
                    <button
                        className="theme-toggle glass-card"
                        onClick={toggleTheme}
                    >
                        {isDarkTheme ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="currentColor" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
