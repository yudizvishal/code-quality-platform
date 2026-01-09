import './MobileWarning.css';

const MobileWarning = () => {
    return (
        <div className="mobile-warning-container animate-fade-in">
            <div className="mobile-warning-glass glass-card">
                <div className="warning-icon-wrapper">
                    <div className="warning-glow"></div>
                    <div className="warning-icon">📱</div>
                </div>

                <h2 className="warning-title">Desktop Experience Only</h2>
                <p className="warning-description">
                    <strong>Quali Code</strong> provides a deep, intensive analysis of your complex code files. To ensure the best experience and full functionality, the platform is optimized for <strong>Tablets and Desktop computers.</strong>
                </p>

                <div className="restriction-features">
                    <div className="restriction-item">
                        <span className="restriction-icon">📦</span>
                        <span>ZIP File Extraction</span>
                    </div>
                    <div className="restriction-item">
                        <span className="restriction-icon">🔍</span>
                        <span>Multi-File Deep Analysis</span>
                    </div>
                    <div className="restriction-item">
                        <span className="restriction-icon">⚡</span>
                        <span>W3C & Page Speed Audits</span>
                    </div>
                </div>

                <div className="warning-footer">
                    <p>Please switch to a larger device to analyze your project.</p>
                    <div className="device-icons">
                        <span>💻</span>
                        <span>🖥️</span>
                        <span>⌨️</span>
                    </div>
                </div>
            </div>

            <div className="floating-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>
        </div>
    );
};

export default MobileWarning;
