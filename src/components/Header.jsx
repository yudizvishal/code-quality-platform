import './Header.css';

const Header = ({ currentPage = 'home', onNavigate, onGetStarted }) => {
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

    return (
        <header className="header">
            <div className="header-content glass-card">
                <div className="logo" onClick={(e) => handleNavClick(e, 'home')} style={{ cursor: 'pointer' }}>
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="logo-text">CodeGuard</span>
                </div>

                <nav className="nav">
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
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleGetStarted}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Get Started
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
