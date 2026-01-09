import { useState } from 'react';
import './AnalysisResults.css';
import CodeImprovement from './CodeImprovement';
import W3CValidation from './W3CValidation';
import PageSpeedReport from './PageSpeedReport';
import DeepAnalysisReport from './DeepAnalysisReport';
import CircularProgress from './CircularProgress';
import { generateW3CReport } from '../utils/w3cValidator';

const AnalysisResults = ({ data, onReset }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [improvingFile, setImprovingFile] = useState(null);
    const [w3cValidationResult, setW3cValidationResult] = useState(null);
    const [speedReportFiles, setSpeedReportFiles] = useState(null);
    const [deepAnalysisFile, setDeepAnalysisFile] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        errors: true,
        warnings: true,
        suggestions: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    const getStatusBadge = (status) => {
        if (status === 'passed') {
            return <span className="badge badge-success">✓ Passed</span>;
        }
        return <span className="badge badge-error">✗ Failed</span>;
    };

    const handleW3CValidation = (file) => {
        const validationReport = generateW3CReport(file.content, file.fileName);
        setW3cValidationResult(validationReport);
    };

    return (
        <div className="analysis-results animate-fade-in">
            {/* Summary Card */}
            <div className="summary-card glass-card">
                <div className="summary-header">
                    <h2>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                        Analysis Complete
                    </h2>
                    <div className="summary-actions" style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-primary" onClick={() => window.print()}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Export PDF Report
                        </button>
                        <button className="btn btn-secondary" onClick={onReset}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 12C4 7.58172 7.58172 4 12 4C14.5264 4 16.7792 5.17108 18.2454 7M20 12C20 16.4183 16.4183 20 12 20C9.47362 20 7.22082 18.8289 5.75463 17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round" />
                                <path d="M16 7H20V3M8 17H4V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Analyze New Files
                        </button>
                    </div>
                </div>

                <div className="summary-stats">
                    <div className="stat-card">
                        <div className="stat-icon files-icon">📁</div>
                        <div className="stat-info">
                            <div className="stat-value">{data.totalFiles}</div>
                            <div className="stat-label">Files Analyzed</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon score-icon">
                            <CircularProgress
                                value={data.summary.averageQualityScore}
                                max={100}
                                size={80}
                                strokeWidth={6}
                                color={
                                    data.summary.averageQualityScore >= 80 ? 'success' :
                                        data.summary.averageQualityScore >= 60 ? 'warning' : 'error'
                                }
                            />
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">{data.summary.averageQualityScore}/100</div>
                            <div className="stat-label">Quality Score</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon errors-icon">
                            {data.summary.totalErrors > 0 ? '❌' : '✅'}
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">{data.summary.totalErrors}</div>
                            <div className="stat-label">Errors Found</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon warnings-icon">⚠️</div>
                        <div className="stat-info">
                            <div className="stat-value">{data.summary.totalWarnings}</div>
                            <div className="stat-label">Warnings</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon lines-icon">📝</div>
                        <div className="stat-info">
                            <div className="stat-value">{data.summary.totalLines.toLocaleString()}</div>
                            <div className="stat-label">Lines of Code</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon status-icon">
                            {data.summary.status === 'passed' ? '🎉' : '🔧'}
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">{getStatusBadge(data.summary.status)}</div>
                            <div className="stat-label">Status</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Files List */}
            <div className="files-analysis glass-card">
                <h3 className="section-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7H21M3 12H21M3 17H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Detailed File Analysis
                </h3>

                <div className="files-grid">
                    {data.files.map((file, index) => (
                        <div
                            key={index}
                            className={`file-analysis-card quality-${getScoreColor(file.qualityScore)} ${selectedFile === index ? 'selected' : ''}`}
                            onClick={() => setSelectedFile(selectedFile === index ? null : index)}
                        >
                            <div className="file-card-header">
                                <div className="file-title">
                                    <span className="file-icon">
                                        {file.fileName.endsWith('.jsx') || file.fileName.endsWith('.tsx') ? '⚛️' :
                                            file.fileName.endsWith('.css') ? '🎨' :
                                                file.fileName.endsWith('.json') ? '📋' : '📄'}
                                    </span>
                                    <span className="file-name-text">{file.fileName}</span>
                                </div>
                                <div className={`quality-badge quality-${getScoreColor(file.qualityScore)}`}>
                                    {file.qualityScore}%
                                </div>
                            </div>

                            <div className="file-meta">
                                <span className="meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {file.lines} lines
                                </span>
                                {file.errorCount > 0 && (
                                    <span className="badge badge-error">{file.errorCount} errors</span>
                                )}
                                {file.warningCount > 0 && (
                                    <span className="badge badge-warning">{file.warningCount} warnings</span>
                                )}
                            </div>

                            {selectedFile === index && (
                                <div className="file-details">
                                    {/* Issues */}
                                    {file.issues.length > 0 && (
                                        <div className="issues-section">
                                            <h4
                                                className="subsection-title"
                                                onClick={() => toggleSection('errors')}
                                            >
                                                Issues Found ({file.issues.length})
                                                <span className={`expand-icon ${expandedSections.errors ? 'expanded' : ''}`}>▼</span>
                                            </h4>
                                            {expandedSections.errors && (
                                                <div className="issues-list">
                                                    {file.issues.map((issue, idx) => (
                                                        <div key={idx} className={`issue-item issue-${issue.type}`}>
                                                            <div className="issue-header">
                                                                <span className={`badge badge-${issue.type === 'error' ? 'error' : issue.type === 'warning' ? 'warning' : 'info'}`}>
                                                                    {issue.type.toUpperCase()}
                                                                </span>
                                                                <span className="issue-line">Line {issue.line}</span>
                                                            </div>
                                                            <div className="issue-message">{issue.message}</div>
                                                            <div className="issue-code">{issue.code}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Suggestions */}
                                    {file.suggestions.length > 0 && (
                                        <div className="suggestions-section">
                                            <h4
                                                className="subsection-title"
                                                onClick={() => toggleSection('suggestions')}
                                            >
                                                Optimization Suggestions ({file.suggestions.length})
                                                <span className={`expand-icon ${expandedSections.suggestions ? 'expanded' : ''}`}>▼</span>
                                            </h4>
                                            {expandedSections.suggestions && (
                                                <div className="suggestions-list">
                                                    {file.suggestions.map((suggestion, idx) => (
                                                        <div key={idx} className="suggestion-item">
                                                            <div className="suggestion-header">
                                                                <span className="badge badge-info">{suggestion.type}</span>
                                                                {suggestion.autoFix && (
                                                                    <span className="auto-fix-badge">
                                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M14 7H19.6404C20.0877 7 20.3113 7 20.4421 7.09404C20.5562 7.17609 20.6306 7.30239 20.6469 7.442C20.6656 7.602 20.5569 7.79751 20.3397 8.18851L18.9936 10.6115C18.9148 10.7533 18.8755 10.8242 18.86 10.8993C18.8463 10.9668 18.8463 11.0357 18.8755 11.1784 18.9148 11.2492 18.9936 11.391L20.3397 13.814C20.5569 14.205 20.6656 14.4005 20.6469 14.5605C20.6306 14.7001 20.5562 14.8264 20.4421 14.9085C20.3113 15.0025 20.0877 15.0025 19.6404 15.0025H12.6C12.0399 15.0025 11.7599 15.0025 11.546 14.8912C11.3578 14.7942 11.2067 14.6431 11.1097 14.4549C10.9984 14.241 10.9984 13.961 10.9984 13.4009V11M4 21L4 4M4 11H12.4C12.9601 11 13.2401 11 13.454 10.8887C13.6422 10.7917 13.7933 10.6406 13.8903 10.4524C14.0016 10.2385 14.0016 9.95854 14.0016 9.39843V4.59843C14.0016 4.03832 14.0016 3.75827 13.8903 3.54433C13.7933 3.35614 13.6422 3.20502 13.454 3.10803C13.2401 2.99673 12.9601 2.99673 12.4 2.99673H4"
                                                                                stroke="currentColor"
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round" />
                                                                        </svg>
                                                                        Auto-Fix Available
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="suggestion-message">{suggestion.message}</div>
                                                            {suggestion.fixCode && (
                                                                <div className="fix-preview">
                                                                    <code>{suggestion.fixCode}</code>
                                                                </div>
                                                            )}
                                                            {suggestion.impact && (
                                                                <div className={`impact-badge impact-${suggestion.impact}`}>
                                                                    Impact: {suggestion.impact}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons Grid */}
                                    <div className="file-actions-grid">
                                        {/* Auto-Improve Button */}
                                        {file.suggestions.some(s => s.autoFix) && (
                                            <div className="action-card auto-improve-card">
                                                <div className="action-card-header">
                                                    <span className="action-icon">✨</span>
                                                    <h4>Auto-Improve</h4>
                                                </div>
                                                <p>Apply {file.suggestions.filter(s => s.autoFix).length} fixes automatically</p>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImprovingFile(file);
                                                    }}
                                                >
                                                    Start Improving
                                                </button>
                                            </div>
                                        )}

                                        {/* W3C Validator Button */}
                                        {file.fileName.endsWith('.html') && (
                                            <div className="action-card w3c-card">
                                                <div className="action-card-header">
                                                    <span className="action-icon">✓</span>
                                                    <h4>W3C Validation</h4>
                                                </div>
                                                <p>Validate HTML compliance</p>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleW3CValidation(file);
                                                    }}
                                                >
                                                    Validate Now
                                                </button>
                                            </div>
                                        )}

                                        {/* Page Speed Analysis */}
                                        {(file.fileName.endsWith('.html') || file.fileName.endsWith('.jsx') || file.fileName.endsWith('.tsx')) && (
                                            <div className="action-card speed-card">
                                                <div className="action-card-header">
                                                    <span className="action-icon">🚀</span>
                                                    <h4>Page Speed</h4>
                                                </div>
                                                <p>Check performance score</p>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSpeedReportFiles([file]);
                                                    }}
                                                >
                                                    Analyze Speed
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {file.issues.length === 0 && file.suggestions.length === 0 && (
                                        <div className="no-issues">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </svg>
                                            <p>No issues found! This file looks great! 🎉</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendations */}
            <div className="recommendations glass-card">
                <h3 className="section-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg>
                    Overall Recommendations
                </h3>

                <div className="recommendations-list">
                    {data.summary.totalErrors === 0 ? (
                        <div className="recommendation-item success">
                            <div className="rec-icon">✅</div>
                            <div className="rec-content">
                                <h4>Excellent! No Critical Errors</h4>
                                <p>Your code is free from critical errors. Great job maintaining code quality!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="recommendation-item error">
                            <div className="rec-icon">🚨</div>
                            <div className="rec-content">
                                <h4>Fix Critical Errors First</h4>
                                <p>Address the {data.summary.totalErrors} error(s) found in your code before deploying.</p>
                            </div>
                        </div>
                    )}

                    {data.summary.totalWarnings > 0 && (
                        <div className="recommendation-item warning">
                            <div className="rec-icon">⚠️</div>
                            <div className="rec-content">
                                <h4>Review Warnings</h4>
                                <p>{data.summary.totalWarnings} warning(s) detected. While not critical, addressing these will improve code quality.</p>
                            </div>
                        </div>
                    )}

                    <div className="recommendation-item info">
                        <div className="rec-icon">�</div>
                        <div className="rec-content">
                            <h4>Project Performance Audit</h4>
                            <p>Run a combined performance analysis for all {data.totalFiles} files in your project.</p>
                            <button
                                className="btn btn-secondary btn-sm"
                                style={{ marginTop: '8px' }}
                                onClick={() => setSpeedReportFiles(data.files)}
                            >
                                Run Project Audit
                            </button>
                        </div>
                    </div>

                    <div className="recommendation-item info">
                        <div className="rec-icon">�💡</div>
                        <div className="rec-content">
                            <h4>Code Optimization</h4>
                            <p>Review the optimization suggestions to improve performance and maintainability.</p>
                        </div>
                    </div>

                    <div className="recommendation-item info">
                        <div className="rec-icon">📚</div>
                        <div className="rec-content">
                            <h4>Best Practices</h4>
                            <p>Consider implementing auto-fix suggestions to align with React and JavaScript best practices.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Improvement Modal */}
            {improvingFile && (
                <CodeImprovement
                    file={improvingFile}
                    onClose={() => setImprovingFile(null)}
                />
            )}

            {/* W3C Validation Modal */}
            {w3cValidationResult && (
                <W3CValidation
                    validationResult={w3cValidationResult}
                    onClose={() => setW3cValidationResult(null)}
                />
            )}

            {/* Page Speed Report Modal */}
            {speedReportFiles && (
                <PageSpeedReport
                    files={speedReportFiles}
                    onClose={() => setSpeedReportFiles(null)}
                />
            )}

            {/* Deep Analysis Report Modal */}
            {deepAnalysisFile && (
                <DeepAnalysisReport
                    deepAnalysis={deepAnalysisFile.deepAnalysis}
                    onClose={() => setDeepAnalysisFile(null)}
                />
            )}
        </div>
    );
};

export default AnalysisResults;
