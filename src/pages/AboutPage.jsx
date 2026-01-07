import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    About <span className="gradient-text">CodeGuard</span>
                </h1>
            </div>

            <div className="about-content">
                <div className="mission-section glass-card">
                    <div className="mission-text">
                        <h2>Our Mission</h2>
                        <p>
                            CodeGuard was founded with a simply yet ambitious goal: to democratize code quality tools.
                            We believe that every developer, regardless of experience level or team size, deserves access
                            to enterprise-grade static analysis and optimization suggestions.
                        </p>
                        <p>
                            By leveraging advanced Artificial Intelligence, we're not just finding bugs—we're teaching
                            best practices, improving performance, and helping you write cleaner, more maintainable code.
                        </p>
                    </div>
                    <div className="mission-visual">
                        <div className="visual-circle">🚀</div>
                    </div>
                </div>

                <div className="stats-row">
                    <div className="about-stat glass-card">
                        <div className="stat-number">10k+</div>
                        <div className="stat-label">Files Analyzed</div>
                    </div>
                    <div className="about-stat glass-card">
                        <div className="stat-number">98%</div>
                        <div className="stat-label">Accuracy Rate</div>
                    </div>
                    <div className="about-stat glass-card">
                        <div className="stat-number">0.5s</div>
                        <div className="stat-label">Avg. Response Time</div>
                    </div>
                </div>

                <div className="team-section">
                    <h2>Meet the Creator</h2>
                    <div className="team-member glass-card">
                        <div className="member-avatar">VK</div>
                        <div className="member-info">
                            <h3>Vishal Kacha</h3>
                            <span className="member-role">Lead Developer & Architect</span>
                            <p>
                                Passionate about building tools that make developer lives easier.
                                Expert in React, AI integration, and performant web applications.
                            </p>
                            <div className="member-socials">
                                <a href="#" className="social-link" onClick={e => e.preventDefault()}>GitHub</a>
                                <a href="#" className="social-link" onClick={e => e.preventDefault()}>LinkedIn</a>
                                <a href="#" className="social-link" onClick={e => e.preventDefault()}>Twitter</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tech-stack glass-card">
                    <h2>Powered By</h2>
                    <div className="tech-grid">
                        <div className="tech-item">
                            <span className="tech-icon">⚛️</span>
                            <span>React</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-icon">⚡</span>
                            <span>Vite</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-icon">🤖</span>
                            <span>Gemini AI</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-icon">📦</span>
                            <span>JSZip</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
