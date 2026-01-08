
import { useState, useEffect } from 'react';
import { analyzePerformance } from '../utils/performanceAnalyzer';
import './PageSpeedReport.css';

const PageSpeedReport = ({ file, onClose }) => {
    const [report, setReport] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');
    const [analyzing, setAnalyzing] = useState(true);

    useEffect(() => {
        // Simulate analysis delay for effect
        const timer = setTimeout(() => {
            const results = analyzePerformance(file.content, file.fileName);
            setReport(results);
            setAnalyzing(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [file]);

    const getScoreClass = (score) => {
        if (score >= 90) return 'score-green';
        if (score >= 50) return 'score-orange';
        return 'score-red';
    };

    const getGrade = (score) => {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 60) return 'C';
        if (score >= 40) return 'D';
        return 'F';
    };

    if (!report && analyzing) {
        return (
            <div className="speed-modal-overlay">
                <div className="speed-modal" style={{ height: 'auto', padding: '40px', alignItems: 'center' }}>
                    <div className="loading-spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(255,255,255,0.1)',
                        borderTopColor: '#3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <h3 style={{ marginTop: '20px', color: 'white' }}>Analyzing Performance...</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Simulating device viewports and network conditions</p>
                </div>
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="speed-modal-overlay" onClick={onClose}>
            <div className="speed-modal" onClick={e => e.stopPropagation()}>
                <div className="speed-header">
                    <h3>
                        <span className="gt-badge">SPEED REPORT</span>
                        Performance Analysis: {file.fileName}
                    </h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="speed-content">
                    <div className="tabs">
                        <button
                            className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                            onClick={() => setActiveTab('summary')}
                        >
                            Summary
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'issues' ? 'active' : ''}`}
                            onClick={() => setActiveTab('issues')}
                        >
                            Issues Found ({report.issues.length})
                        </button>
                    </div>

                    {activeTab === 'summary' && (
                        <>
                            <div className="scores-container">
                                <div className="score-card">
                                    <h4>Desktop Performance</h4>
                                    <div
                                        className={`score-gauge ${getScoreClass(report.desktopScore)}`}
                                        style={{ '--score-percent': `${report.desktopScore}%` }}
                                    >
                                        <span className="score-grade">{getGrade(report.desktopScore)}</span>
                                    </div>
                                    <span className="score-value">{report.desktopScore}%</span>
                                </div>
                                <div className="score-card">
                                    <h4>Mobile Performance</h4>
                                    <div
                                        className={`score-gauge ${getScoreClass(report.mobileScore)}`}
                                        style={{ '--score-percent': `${report.mobileScore}%` }}
                                    >
                                        <span className="score-grade">{getGrade(report.mobileScore)}</span>
                                    </div>
                                    <span className="score-value">{report.mobileScore}%</span>
                                </div>
                            </div>

                            <h4 style={{ color: 'white', margin: '20px 0 10px' }}>Web Vitals (Simulated)</h4>
                            <div className="metrics-grid">
                                <div className={`metric-item ${report.metrics.lcp.replace('s', '') < 2.5 ? 'good' : 'ok'}`}>
                                    <span className="metric-label">Largest Contentful Paint</span>
                                    <span className="metric-value">{report.metrics.lcp}</span>
                                </div>
                                <div className={`metric-item ${report.metrics.tbt.replace('ms', '') < 200 ? 'good' : 'ok'}`}>
                                    <span className="metric-label">Total Blocking Time</span>
                                    <span className="metric-value">{report.metrics.tbt}</span>
                                </div>
                                <div className={`metric-item ${report.metrics.cls < 0.1 ? 'good' : 'ok'}`}>
                                    <span className="metric-label">Cumulative Layout Shift</span>
                                    <span className="metric-value">{report.metrics.cls}</span>
                                </div>
                                <div className={`metric-item ${report.metrics.speedIndex.replace('s', '') < 3.0 ? 'good' : 'ok'}`}>
                                    <span className="metric-label">Speed Index</span>
                                    <span className="metric-value">{report.metrics.speedIndex}</span>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'issues' && (
                        <div className="speed-issues">
                            <div className="issues-header">
                                <h4 style={{ color: 'white', margin: 0 }}>Top Performance Issues</h4>
                            </div>
                            {report.issues.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.6)' }}>
                                    No significant performance issues found!
                                </div>
                            ) : (
                                report.issues.map((issue, idx) => (
                                    <div key={idx} className="issue-row">
                                        <div className={`issue-icon issue-${issue.impact}`}>
                                            {issue.impact === 'high' ? 'HIGH' : issue.impact === 'medium' ? 'MED' : 'LOW'}
                                        </div>
                                        <div className="issue-content">
                                            <h5>{issue.title}</h5>
                                            <p>{issue.description}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageSpeedReport;
