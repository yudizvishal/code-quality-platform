
import { useState, useEffect } from 'react';
import { analyzePerformance } from '../utils/performanceAnalyzer';
import './PageSpeedReport.css';

const PageSpeedReport = ({ files, onClose }) => {
    const [report, setReport] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');
    const [analyzing, setAnalyzing] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            const allFileResults = files.map(file => {
                const results = analyzePerformance(file.content, file.fileName);
                results.detailedSuggestions = getDetailedSuggestions(results.issues, file.content);
                return {
                    fileName: file.fileName,
                    ...results
                };
            });

            // Calculate aggregate data
            const totalDesktop = allFileResults.reduce((acc, curr) => acc + curr.desktopScore, 0);
            const totalMobile = allFileResults.reduce((acc, curr) => acc + curr.mobileScore, 0);
            const count = allFileResults.length;

            const aggregateReport = {
                isProjectAudit: count > 1,
                desktopScore: Math.round(totalDesktop / count),
                mobileScore: Math.round(totalMobile / count),
                fileResults: allFileResults,
                // Average markers for metrics
                metrics: {
                    lcp: (allFileResults.reduce((acc, curr) => acc + parseFloat(curr.metrics.lcp), 0) / count).toFixed(2) + 's',
                    tbt: Math.round(allFileResults.reduce((acc, curr) => acc + parseFloat(curr.metrics.tbt), 0) / count) + 'ms',
                    cls: (allFileResults.reduce((acc, curr) => acc + parseFloat(curr.metrics.cls), 0) / count).toFixed(3),
                    speedIndex: (allFileResults.reduce((acc, curr) => acc + parseFloat(curr.metrics.speedIndex), 0) / count).toFixed(2) + 's'
                },
                totalIssues: allFileResults.reduce((acc, curr) => acc + curr.issues.length, 0)
            };

            setReport(aggregateReport);
            setAnalyzing(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [files]);

    const getDetailedSuggestions = (issues, content) => {
        const suggestions = [];

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

        // Always add a core performance suggestion if score is low
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
        window.print();
    };

    if (analyzing) {
        return (
            <div className="speed-modal-overlay">
                <div className="speed-modal" style={{ height: 'auto', padding: '60px', alignItems: 'center', background: '#0f172a' }}>
                    <div className="loading-spinner"></div>
                    <h3 style={{ marginTop: '24px', color: 'white', fontFamily: 'JetBrains Mono' }}>
                        {files.length > 1 ? 'Auditing Project Performance...' : 'Analyzing File Performance...'}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                        {files.length > 1 ? `Checking ${files.length} files` : 'Generating Detailed Recommendations'}
                    </p>
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
                        <span className="gt-badge">{report.isProjectAudit ? 'PROJECT AUDIT' : 'SPEED REPORT'}</span>
                        {report.isProjectAudit ? 'Performance Audit' : 'Performance Analysis'}
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
                            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                            onClick={() => setActiveTab('details')}
                        >
                            {report.isProjectAudit ? 'File-wise Improvements' : 'Detailed Analysis'}
                        </button>
                    </div>

                    <div className={`tab-pane ${activeTab === 'summary' ? 'active' : ''}`}>
                        <div className="scores-container">
                            <ScoreCircle
                                label={report.isProjectAudit ? "Avg Desktop Score" : "Desktop Performance"}
                                score={report.desktopScore}
                                color={getScoreColor(report.desktopScore)}
                            />
                            <ScoreCircle
                                label={report.isProjectAudit ? "Avg Mobile Score" : "Mobile Performance"}
                                score={report.mobileScore}
                                color={getScoreColor(report.mobileScore)}
                            />
                        </div>

                        <div className="metrics-section">
                            <h4 className="metrics-section-title">Aggregate Web Vitals</h4>
                            <div className="metrics-grid">
                                <MetricCard label="LCP" value={report.metrics.lcp} status={parseFloat(report.metrics.lcp) < 2.5 ? 'good' : 'ok'} />
                                <MetricCard label="TBT" value={report.metrics.tbt} status={parseInt(report.metrics.tbt) < 200 ? 'good' : 'ok'} />
                                <MetricCard label="CLS" value={report.metrics.cls} status={parseFloat(report.metrics.cls) < 0.1 ? 'good' : 'ok'} />
                                <MetricCard label="Speed Index" value={report.metrics.speedIndex} status={parseFloat(report.metrics.speedIndex) < 3.0 ? 'good' : 'ok'} />
                            </div>
                        </div>

                        {report.isProjectAudit && (
                            <div className="project-audit-notice">
                                <p>This project audit covers <strong>{files.length}</strong> technology-specific files. Switch to the <strong>File-wise Improvements</strong> tab for specific optimizations for each file.</p>
                            </div>
                        )}
                    </div>

                    <div className={`tab-pane ${activeTab === 'details' ? 'active' : ''}`}>
                        <div className="detailed-improvements-container">
                            {report.fileResults.map((fileResult, fIdx) => (
                                <div key={fIdx} className="file-improvement-group">
                                    <div className="file-improvement-header">
                                        <div className="file-name-pill">
                                            <span className="dot"></span>
                                            {fileResult.fileName}
                                        </div>
                                        <div className="file-mini-scores">
                                            <span style={{ color: getScoreColor(fileResult.desktopScore) }}>D: {fileResult.desktopScore}</span>
                                            <span style={{ color: getScoreColor(fileResult.mobileScore) }}>M: {fileResult.mobileScore}</span>
                                        </div>
                                    </div>

                                    <div className="detailed-suggestions-list">
                                        {fileResult.detailedSuggestions.length === 0 ? (
                                            <div className="no-issues-mini">No performance issues found! ✨</div>
                                        ) : (
                                            fileResult.detailedSuggestions.map((s, i) => (
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
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
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
