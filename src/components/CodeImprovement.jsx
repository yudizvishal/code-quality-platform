import { useState } from 'react';
import { improveCode, generateDownloadableFile, generateCodeComparison } from '../utils/codeImprover';
import './CodeImprovement.css';

const CodeImprovement = ({ file, onClose }) => {
    const [improvementResult, setImprovementResult] = useState(null);
    const [isImproving, setIsImproving] = useState(false);
    const [viewMode, setViewMode] = useState('comparison'); // 'comparison', 'original', 'improved'
    const [showLineNumbers, setShowLineNumbers] = useState(true);

    const handleImproveCode = () => {
        setIsImproving(true);

        // Simulate processing time for better UX
        setTimeout(() => {
            const result = improveCode(
                file.fileName,
                file.content,
                file.suggestions,
                file.issues
            );

            const comparison = generateCodeComparison(file.content, result.improvedCode);

            setImprovementResult({
                ...result,
                comparison
            });
            setIsImproving(false);
        }, 500);
    };

    const handleDownload = () => {
        if (!improvementResult) return;

        const { url, fileName } = generateDownloadableFile(
            file.fileName,
            improvementResult.improvedCode
        );

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleCopyToClipboard = () => {
        if (!improvementResult) return;

        navigator.clipboard.writeText(improvementResult.improvedCode).then(() => {
            alert('Improved code copied to clipboard!');
        });
    };

    return (
        <div className="code-improvement-modal">
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content glass-card">
                <div className="modal-header">
                    <div className="modal-title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 7H19.6404C20.0877 7 20.3113 7 20.4421 7.09404C20.5562 7.17609 20.6306 7.30239 20.6469 7.442C20.6656 7.602 20.5569 7.79751 20.3397 8.18851L18.9936 10.6115C18.9148 10.7533 18.8755 10.8242 18.86 10.8993C18.8463 10.9668 18.8463 11.0357 18.86 11.1032C18.8755 11.1784 18.9148 11.2492 18.9936 11.391L20.3397 13.814C20.5569 14.205 20.6656 14.4005 20.6469 14.5605C20.6306 14.7001 20.5562 14.8264 20.4421 14.9085C20.3113 15.0025 20.0877 15.0025 19.6404 15.0025H12.6C12.0399 15.0025 11.7599 15.0025 11.546 14.8912C11.3578 14.7942 11.2067 14.6431 11.1097 14.4549C10.9984 14.241 10.9984 13.961 10.9984 13.4009V11M4 21L4 4M4 11H12.4C12.9601 11 13.2401 11 13.454 10.8887C13.6422 10.7917 13.7933 10.6406 13.8903 10.4524C14.0016 10.2385 14.0016 9.95854 14.0016 9.39843V4.59843C14.0016 4.03832 14.0016 3.75827 13.8903 3.54433C13.7933 3.35614 13.6422 3.20502 13.454 3.10803C13.2401 2.99673 12.9601 2.99673 12.4 2.99673H4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                        <h2>Code Improvement - {file.fileName}</h2>
                    </div>
                    <button className="btn-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {!improvementResult ? (
                    <div className="improvement-intro">
                        <div className="intro-icon">✨</div>
                        <h3>Auto-Improve Your Code</h3>
                        <p>
                            Our AI-powered code improver will automatically apply fixes based on the analysis suggestions.
                            This includes removing console.log statements, replacing var with const/let, fixing indentation, and more.
                        </p>

                        <div className="improvement-stats">
                            <div className="stat-item">
                                <span className="stat-label">Auto-fixable Issues:</span>
                                <span className="stat-value">
                                    {file.suggestions.filter(s => s.autoFix).length}
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Total Suggestions:</span>
                                <span className="stat-value">{file.suggestions.length}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Current Quality Score:</span>
                                <span className="stat-value">{file.qualityScore}%</span>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary btn-large"
                            onClick={handleImproveCode}
                            disabled={isImproving}
                        >
                            {isImproving ? (
                                <>
                                    <span className="spinner"></span>
                                    Improving Code...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Start Auto-Improvement
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="improvement-results">
                        {/* Metrics Summary */}
                        <div className="metrics-summary">
                            <h3>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Improvement Summary
                            </h3>

                            {improvementResult.hasChanges ? (
                                <div className="metrics-grid">
                                    <div className="metric-card">
                                        <div className="metric-icon">✅</div>
                                        <div className="metric-info">
                                            <div className="metric-value">{improvementResult.appliedFixes.length}</div>
                                            <div className="metric-label">Fixes Applied</div>
                                        </div>
                                    </div>

                                    <div className="metric-card">
                                        <div className="metric-icon">📝</div>
                                        <div className="metric-info">
                                            <div className="metric-value">{improvementResult.metrics.linesChanged}</div>
                                            <div className="metric-label">Lines Changed</div>
                                        </div>
                                    </div>

                                    {improvementResult.metrics.consolesRemoved > 0 && (
                                        <div className="metric-card">
                                            <div className="metric-icon">🗑️</div>
                                            <div className="metric-info">
                                                <div className="metric-value">{improvementResult.metrics.consolesRemoved}</div>
                                                <div className="metric-label">Console.logs Removed</div>
                                            </div>
                                        </div>
                                    )}

                                    {improvementResult.metrics.varsReplaced > 0 && (
                                        <div className="metric-card">
                                            <div className="metric-icon">🔄</div>
                                            <div className="metric-info">
                                                <div className="metric-value">{improvementResult.metrics.varsReplaced}</div>
                                                <div className="metric-label">Vars Replaced</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="no-changes">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round" />
                                    </svg>
                                    <p>No auto-fixable changes were needed. Your code is already following best practices!</p>
                                </div>
                            )}
                        </div>

                        {improvementResult.hasChanges && (
                            <>
                                {/* Applied Fixes */}
                                {improvementResult.appliedFixes.length > 0 && (
                                    <div className="applied-fixes">
                                        <h4>✅ Applied Fixes</h4>
                                        <div className="fixes-list">
                                            {improvementResult.appliedFixes.map((fix, idx) => (
                                                <div key={idx} className="fix-item">
                                                    <span className="badge badge-success">{fix.type}</span>
                                                    <span className="fix-message">{fix.message}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* View Controls */}
                                <div className="view-controls">
                                    <div className="view-mode-tabs">
                                        <button
                                            className={`tab-btn ${viewMode === 'comparison' ? 'active' : ''}`}
                                            onClick={() => setViewMode('comparison')}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2V22M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Side-by-Side
                                        </button>
                                        <button
                                            className={`tab-btn ${viewMode === 'original' ? 'active' : ''}`}
                                            onClick={() => setViewMode('original')}
                                        >
                                            Original
                                        </button>
                                        <button
                                            className={`tab-btn ${viewMode === 'improved' ? 'active' : ''}`}
                                            onClick={() => setViewMode('improved')}
                                        >
                                            Improved
                                        </button>
                                    </div>

                                    <div className="view-options">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={showLineNumbers}
                                                onChange={(e) => setShowLineNumbers(e.target.checked)}
                                            />
                                            <span>Show Line Numbers</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Code Display */}
                                <div className="code-display">
                                    {viewMode === 'comparison' && (
                                        <div className="code-comparison">
                                            <div className="code-panel original-panel">
                                                <div className="panel-header">
                                                    <span>Original Code</span>
                                                </div>
                                                <pre className="code-content">
                                                    {improvementResult.comparison.map((line, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`code-line ${line.changeType}`}
                                                        >
                                                            {showLineNumbers && (
                                                                <span className="line-number">{line.lineNumber}</span>
                                                            )}
                                                            <span className="line-content">{line.original || ' '}</span>
                                                        </div>
                                                    ))}
                                                </pre>
                                            </div>
                                            <div className="code-panel improved-panel">
                                                <div className="panel-header">
                                                    <span>Improved Code</span>
                                                </div>
                                                <pre className="code-content">
                                                    {improvementResult.comparison.map((line, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`code-line ${line.changeType}`}
                                                        >
                                                            {showLineNumbers && (
                                                                <span className="line-number">{line.lineNumber}</span>
                                                            )}
                                                            <span className="line-content">{line.improved || ' '}</span>
                                                        </div>
                                                    ))}
                                                </pre>
                                            </div>
                                        </div>
                                    )}

                                    {viewMode === 'original' && (
                                        <div className="code-single">
                                            <pre className="code-content">
                                                {file.content.split('\n').map((line, idx) => (
                                                    <div key={idx} className="code-line">
                                                        {showLineNumbers && (
                                                            <span className="line-number">{idx + 1}</span>
                                                        )}
                                                        <span className="line-content">{line || ' '}</span>
                                                    </div>
                                                ))}
                                            </pre>
                                        </div>
                                    )}

                                    {viewMode === 'improved' && (
                                        <div className="code-single">
                                            <pre className="code-content">
                                                {improvementResult.improvedCode.split('\n').map((line, idx) => (
                                                    <div key={idx} className="code-line">
                                                        {showLineNumbers && (
                                                            <span className="line-number">{idx + 1}</span>
                                                        )}
                                                        <span className="line-content">{line || ' '}</span>
                                                    </div>
                                                ))}
                                            </pre>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="action-buttons">
                                    <button className="btn btn-secondary" onClick={handleCopyToClipboard}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 4V16C8 16.5304 8.21071 17.0391 8.58579 17.4142C8.96086 17.7893 9.46957 18 10 18H18C18.5304 18 19.0391 17.7893 19.4142 17.4142C19.7893 17.0391 20 16.5304 20 16V7.242C20 6.97556 19.9467 6.71181 19.8433 6.46624C19.7399 6.22068 19.5885 5.99824 19.398 5.812L16.083 2.57C15.7094 2.20466 15.2076 2.00007 14.685 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16 18V20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7893 14.5304 22 14 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V9C4 8.46957 4.21071 7.96086 4.58579 7.58579C4.96086 7.21071 5.46957 7 6 7H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Copy to Clipboard
                                    </button>
                                    <button className="btn btn-primary" onClick={handleDownload}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Download Improved Code
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeImprovement;
