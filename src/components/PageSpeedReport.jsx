
import { useState, useEffect } from 'react';
import { analyzePerformance } from '../utils/performanceAnalyzer';
import './PageSpeedReport.css';

const PageSpeedReport = ({ file, onClose }) => {
    const [report, setReport] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');
    const [analyzing, setAnalyzing] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            const results = analyzePerformance(file.content, file.fileName);
            // Add custom detailed suggestions with code snippets
            results.detailedSuggestions = getDetailedSuggestions(results.issues, file.content);
            setReport(results);
            setAnalyzing(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [file]);

    const getDetailedSuggestions = (issues, content) => {
        const suggestions = [];

        // Always add a core performance suggestion if score is low
        if (report?.desktopScore < 90) {
            suggestions.push({
                title: "Optimize Critical Rendering Path",
                description: "Your page has elements blocking the first paint. Priority should be given to visible content.",
                autoFix: "Add <link rel='preload'> for critical font and CSS files.",
                code: "<link rel='preload' href='main.css' as='style'>"
            });
        }

        issues.forEach(issue => {
            if (issue.title.includes('render-blocking')) {
                suggestions.push({
                    title: "Defer Non-Critical JavaScript",
                    description: "Moving scripts to the bottom or using defer improves Time to Interactive (TTI).",
                    autoFix: "Add 'defer' attribute to your script tags in the head.",
                    code: "<script src='app.js' defer></script>"
                });
            } else if (issue.title.includes('width and height')) {
                suggestions.push({
                    title: "Prevent Layout Shifts",
                    description: "Explicit dimensions help the browser reserve space before images load.",
                    autoFix: "Add width and height attributes to <img> tags.",
                    code: "<img src='logo.png' width='200' height='60' alt='Logo'>"
                });
            } else if (issue.title.includes('alt attributes')) {
                suggestions.push({
                    title: "Improve Image Accessibility",
                    description: "Alt text is crucial for screen readers and SEO when images fail to load.",
                    autoFix: "Add descriptive 'alt' text to all image elements.",
                    code: "<img src='product.jpg' alt='Blue cotton t-shirt'>"
                });
            } else if (issue.title.includes('viewport')) {
                suggestions.push({
                    title: "Mobile Responsiveness",
                    description: "A missing viewport tag causes browsers to render at desktop widths on mobile.",
                    autoFix: "Include the standard mobile viewport meta tag.",
                    code: "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                });
            } else if (issue.title.includes('DOM size')) {
                suggestions.push({
                    title: "Streamline DOM Structure",
                    description: "Large DOM trees slow down style calculations and reflows.",
                    autoFix: "Flatten your HTML structure and remove unnecessary wrapper divs.",
                    code: "// Practice: Replace <div><div><p>...</p></div></div> with <article><p>...</p></article>"
                });
            }
        });

        // Default suggestion if list is empty
        if (suggestions.length === 0) {
            suggestions.push({
                title: "Enable Text Compression",
                description: "Ensure your server sends GZIP or Brotli compressed resources.",
                autoFix: "Enable GZIP in your .htaccess or server config.",
                code: "AddOutputFilterByType DEFLATE text/html text/plain text/xml"
            });
        }

        return suggestions;
    };

    const getScoreColor = (score) => {
        if (score >= 90) return '#00DB87';
        if (score >= 50) return '#FFB302';
        return '#FF4D4D';
    };

    const handlePrint = () => {
        // Trigger print for the whole window but CSS will handle making only modal visible
        window.print();
    };

    if (!report && analyzing) {
        return (
            <div className="speed-modal-overlay">
                <div className="speed-modal" style={{ height: 'auto', padding: '60px', alignItems: 'center' }}>
                    <div className="loading-spinner" style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid rgba(79, 70, 229, 0.1)',
                        borderTopColor: '#4F46E5',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <h3 style={{ marginTop: '24px', color: 'white', fontFamily: 'JetBrains Mono' }}>Analyzing Performance...</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Generating Detailed Recommendations</p>
                </div>
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="speed-modal-overlay" onClick={onClose}>
            <div className="speed-modal" id="printable-report" onClick={e => e.stopPropagation()}>
                <div className="speed-header">
                    <h3>
                        <span className="gt-badge">SPEED REPORT</span>
                        Performance Analysis
                    </h3>
                    <div className="header-actions">
                        <button className="btn-download-pdf-sm" onClick={handlePrint} title="Download Full PDF">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Save PDF
                        </button>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </div>
                </div>

                <div className="speed-content">
                    <div className="tabs">
                        <button
                            className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                            onClick={() => setActiveTab('summary')}
                        >
                            Executive Summary
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'issues' ? 'active' : ''}`}
                            onClick={() => setActiveTab('issues')}
                        >
                            All Performance Issues ({report.issues.length})
                        </button>
                    </div>

                    <div className={`tab-pane ${activeTab === 'summary' ? 'active' : ''}`} id="summary-section">
                        <div className="scores-container">
                            <ScoreCircle
                                label="Desktop Performance"
                                score={report.desktopScore}
                                color={getScoreColor(report.desktopScore)}
                            />
                            <ScoreCircle
                                label="Mobile Performance"
                                score={report.mobileScore}
                                color={getScoreColor(report.mobileScore)}
                            />
                        </div>

                        <div className="metrics-section">
                            <h4 className="metrics-section-title">Key Web Vitals</h4>
                            <div className="metrics-grid">
                                <MetricCard label="LCP" value={report.metrics.lcp} status={report.metrics.lcp.replace('s', '') < 2.5 ? 'good' : 'ok'} />
                                <MetricCard label="TBT" value={report.metrics.tbt} status={report.metrics.tbt.replace('ms', '') < 200 ? 'good' : 'ok'} />
                                <MetricCard label="CLS" value={report.metrics.cls} status={report.metrics.cls < 0.1 ? 'good' : 'ok'} />
                                <MetricCard label="Speed Index" value={report.metrics.speedIndex} status={report.metrics.speedIndex.replace('s', '') < 3.0 ? 'good' : 'ok'} />
                            </div>
                        </div>

                        <div className="improvement-suggestions-detailed">
                            <div className="suggestions-header">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                </svg>
                                Improvement Result Suggestion & Auto Actions
                            </div>
                            <div className="detailed-suggestions-list">
                                {report.detailedSuggestions.map((s, i) => (
                                    <div key={i} className="suggestion-detail-card">
                                        <div className="suggestion-info-main">
                                            <div className="suggestion-badge-new">RECOMMENDED</div>
                                            <h5>{s.title}</h5>
                                            <p>{s.description}</p>
                                            <div className="auto-fix-instruction">
                                                <strong>Auto Suggestion:</strong> {s.autoFix}
                                            </div>
                                        </div>
                                        {s.code && (
                                            <div className="suggestion-code-block">
                                                <pre><code>{s.code}</code></pre>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={`tab-pane ${activeTab === 'issues' ? 'active' : ''}`} id="issues-section">
                        <div className="speed-issues">
                            <h4 className="section-title-print" style={{ display: 'none' }}>Detailed Audit Issues</h4>
                            {report.issues.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)' }}>
                                    <p>No significant performance issues found!</p>
                                </div>
                            ) : (
                                report.issues.map((issue, idx) => (
                                    <div key={idx} className="issue-row">
                                        <div className={`issue-impact-tag impact-${issue.impact}`}>{issue.impact}</div>
                                        <div className="issue-info">
                                            <h5>{issue.title}</h5>
                                            <p>{issue.description}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="speed-footer">
                    <button className="btn-download-pdf-full" onClick={handlePrint}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Full Performance Report (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
};

const ScoreCircle = ({ label, score, color }) => (
    <div className="score-card">
        <h4>{label}</h4>
        <div className="score-gauge" style={{ '--score-percent': score, '--score-color': color }}>
            <svg width="140" height="140">
                <circle className="bg" cx="70" cy="70" r="65" />
                <circle className="progress" cx="70" cy="70" r="65" />
            </svg>
            <div className="score-display">
                <span className="score-value">{score}</span>
            </div>
        </div>
    </div>
);

const MetricCard = ({ label, value, status }) => (
    <div className={`metric-item ${status}`}>
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value}</span>
    </div>
);

export default PageSpeedReport;
