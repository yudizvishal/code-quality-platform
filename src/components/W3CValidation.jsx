import { useState } from 'react';
import './W3CValidation.css';

const W3CValidation = ({ validationResult, onClose }) => {
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
        if (score >= 90) return 'success';
        if (score >= 70) return 'warning';
        return 'error';
    };

    return (
        <div className="w3c-validation-modal">
            <div className="w3c-modal-overlay" onClick={onClose}></div>
            <div className="w3c-modal-content glass-card">
                {/* Header */}
                <div className="w3c-modal-header">
                    <div className="w3c-header-title">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                        <div>
                            <h2>W3C HTML Validation Report</h2>
                            <p className="w3c-file-name">{validationResult.fileName}</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Summary */}
                <div className="w3c-summary">
                    <div className="w3c-score-card">
                        <div className={`w3c-score-circle score-${getScoreColor(validationResult.score)}`}>
                            {validationResult.score}%
                        </div>
                        <div className="w3c-score-info">
                            <h3>Validation Score</h3>
                            <p className={`w3c-status status-${validationResult.isValid ? 'valid' : 'invalid'}`}>
                                {validationResult.summary.message}
                            </p>
                        </div>
                    </div>

                    <div className="w3c-stats-grid">
                        <div className="w3c-stat">
                            <div className="w3c-stat-icon error-icon">❌</div>
                            <div className="w3c-stat-value">{validationResult.summary.errorCount}</div>
                            <div className="w3c-stat-label">Errors</div>
                        </div>
                        <div className="w3c-stat">
                            <div className="w3c-stat-icon warning-icon">⚠️</div>
                            <div className="w3c-stat-value">{validationResult.summary.warningCount}</div>
                            <div className="w3c-stat-label">Warnings</div>
                        </div>
                        <div className="w3c-stat">
                            <div className="w3c-stat-icon suggestion-icon">💡</div>
                            <div className="w3c-stat-value">{validationResult.summary.suggestionCount}</div>
                            <div className="w3c-stat-label">Suggestions</div>
                        </div>
                    </div>
                </div>

                {/* Validation Details */}
                <div className="w3c-details">
                    {/* Errors */}
                    {validationResult.errors.length > 0 && (
                        <div className="w3c-section">
                            <h3
                                className="w3c-section-title error-title"
                                onClick={() => toggleSection('errors')}
                            >
                                <span className="section-icon">❌</span>
                                Errors ({validationResult.errors.length})
                                <span className={`expand-icon ${expandedSections.errors ? 'expanded' : ''}`}>▼</span>
                            </h3>
                            {expandedSections.errors && (
                                <div className="w3c-issues-list">
                                    {validationResult.errors.map((error, idx) => (
                                        <div key={idx} className="w3c-issue error-issue">
                                            <div className="w3c-issue-header">
                                                <span className="badge badge-error">{error.category}</span>
                                                {error.line > 0 && <span className="issue-line">Line {error.line}</span>}
                                            </div>
                                            <div className="w3c-issue-message">{error.message}</div>
                                            <div className="w3c-issue-suggestion">
                                                <strong>💡 Suggestion:</strong> {error.suggestion}
                                            </div>
                                            {error.fixCode && (
                                                <div className="w3c-fix-code">
                                                    <strong>Fix:</strong>
                                                    <code>{error.fixCode}</code>
                                                    {error.autoFix && (
                                                        <span className="auto-fix-badge">🔧 Auto-fixable</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Warnings */}
                    {validationResult.warnings.length > 0 && (
                        <div className="w3c-section">
                            <h3
                                className="w3c-section-title warning-title"
                                onClick={() => toggleSection('warnings')}
                            >
                                <span className="section-icon">⚠️</span>
                                Warnings ({validationResult.warnings.length})
                                <span className={`expand-icon ${expandedSections.warnings ? 'expanded' : ''}`}>▼</span>
                            </h3>
                            {expandedSections.warnings && (
                                <div className="w3c-issues-list">
                                    {validationResult.warnings.map((warning, idx) => (
                                        <div key={idx} className="w3c-issue warning-issue">
                                            <div className="w3c-issue-header">
                                                <span className="badge badge-warning">{warning.category}</span>
                                                {warning.line > 0 && <span className="issue-line">Line {warning.line}</span>}
                                            </div>
                                            <div className="w3c-issue-message">{warning.message}</div>
                                            <div className="w3c-issue-suggestion">
                                                <strong>💡 Suggestion:</strong> {warning.suggestion}
                                            </div>
                                            {warning.fixCode && (
                                                <div className="w3c-fix-code">
                                                    <strong>Fix:</strong>
                                                    <code>{warning.fixCode}</code>
                                                    {warning.autoFix && (
                                                        <span className="auto-fix-badge">🔧 Auto-fixable</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Suggestions */}
                    {validationResult.suggestions.length > 0 && (
                        <div className="w3c-section">
                            <h3
                                className="w3c-section-title suggestion-title"
                                onClick={() => toggleSection('suggestions')}
                            >
                                <span className="section-icon">💡</span>
                                Best Practice Suggestions ({validationResult.suggestions.length})
                                <span className={`expand-icon ${expandedSections.suggestions ? 'expanded' : ''}`}>▼</span>
                            </h3>
                            {expandedSections.suggestions && (
                                <div className="w3c-issues-list">
                                    {validationResult.suggestions.map((suggestion, idx) => (
                                        <div key={idx} className="w3c-issue suggestion-issue">
                                            <div className="w3c-issue-header">
                                                <span className="badge badge-info">{suggestion.category}</span>
                                            </div>
                                            <div className="w3c-issue-message">{suggestion.message}</div>
                                            <div className="w3c-issue-suggestion">
                                                <strong>💡 Suggestion:</strong> {suggestion.suggestion}
                                            </div>
                                            {suggestion.fixCode && (
                                                <div className="w3c-fix-code">
                                                    <strong>Recommendation:</strong>
                                                    <code>{suggestion.fixCode}</code>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* No Issues */}
                    {validationResult.errors.length === 0 &&
                        validationResult.warnings.length === 0 &&
                        validationResult.suggestions.length === 0 && (
                            <div className="w3c-no-issues">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg>
                                <h3>Perfect! No Issues Found</h3>
                                <p>Your HTML code is fully compliant with W3C standards! 🎉</p>
                            </div>
                        )}
                </div>

                {/* Footer */}
                <div className="w3c-modal-footer">
                    <div className="w3c-footer-info">
                        <span>Validated: {new Date(validationResult.timestamp).toLocaleString()}</span>
                        <span>Validator: {validationResult.validator}</span>
                    </div>
                    <button className="btn btn-primary" onClick={onClose}>
                        Close Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default W3CValidation;
