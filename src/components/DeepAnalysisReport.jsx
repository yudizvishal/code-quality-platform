import './DeepAnalysisReport.css';

const DeepAnalysisReport = ({ deepAnalysis, onClose }) => {
    if (!deepAnalysis) return null;

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'error';
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'info';
        }
    };

    const totalIssues =
        (deepAnalysis.syntaxErrors?.length || 0) +
        (deepAnalysis.antiPatterns?.length || 0) +
        (deepAnalysis.runtimeErrors?.length || 0) +
        (deepAnalysis.securityVulnerabilities?.length || 0);

    const totalWarnings =
        (deepAnalysis.semanticWarnings?.length || 0) +
        (deepAnalysis.performanceWarnings?.length || 0);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content deep-analysis-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                        Deep Code Analysis Report
                    </h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {/* Score Overview */}
                    <div className="deep-score-section glass-card">
                        <div className="score-display">
                            <div className={`score-circle quality-${deepAnalysis.deepScore >= 80 ? 'success' : deepAnalysis.deepScore >= 60 ? 'warning' : 'error'}`}>
                                <span className="score-value">{deepAnalysis.deepScore}</span>
                                <span className="score-label">/100</span>
                            </div>
                            <div className="score-stats">
                                <div className="stat-item">
                                    <span className="stat-icon">🔍</span>
                                    <span className="stat-text">{totalIssues} Issues</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">⚠️</span>
                                    <span className="stat-text">{totalWarnings} Warnings</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">✨</span>
                                    <span className="stat-text">{deepAnalysis.patterns?.length || 0} Patterns</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Design Patterns Detected */}
                    {deepAnalysis.patterns && deepAnalysis.patterns.length > 0 && (
                        <div className="analysis-section glass-card">
                            <h3 className="section-title">
                                <span className="title-icon">✅</span>
                                Design Patterns Detected
                            </h3>
                            <div className="patterns-list">
                                {deepAnalysis.patterns.map((pattern, idx) => (
                                    <div key={idx} className="pattern-item success">
                                        <div className="pattern-header">
                                            <span className="pattern-name">{pattern.name}</span>
                                            <span className={`confidence-badge confidence-${pattern.confidence}`}>
                                                {pattern.confidence} confidence
                                            </span>
                                        </div>
                                        <p className="pattern-message">{pattern.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Anti-Patterns */}
                    {deepAnalysis.antiPatterns && deepAnalysis.antiPatterns.length > 0 && (
                        <div className="analysis-section glass-card">
                            <h3 className="section-title">
                                <span className="title-icon">⚠️</span>
                                Anti-Patterns Detected
                            </h3>
                            <div className="antipatterns-list">
                                {deepAnalysis.antiPatterns.map((antiPattern, idx) => (
                                    <div key={idx} className={`antipattern-item ${getSeverityColor(antiPattern.severity)}`}>
                                        <div className="antipattern-header">
                                            <span className="antipattern-name">{antiPattern.name}</span>
                                            <span className={`badge badge-${getSeverityColor(antiPattern.severity)}`}>
                                                {antiPattern.severity}
                                            </span>
                                        </div>
                                        <p className="antipattern-message">{antiPattern.message}</p>
                                        {antiPattern.line && (
                                            <span className="line-number">Line {antiPattern.line}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Syntax Errors */}
                    {deepAnalysis.syntaxErrors && deepAnalysis.syntaxErrors.length > 0 && (
                        <div className="analysis-section glass-card">
                            <h3 className="section-title">
                                <span className="title-icon">❌</span>
                                Syntax Errors
                            </h3>
                            <div className="errors-list">
                                {deepAnalysis.syntaxErrors.map((error, idx) => (
                                    <div key={idx} className="error-item">
                                        <div className="error-header">
                                            <span className="badge badge-error">{error.severity}</span>
                                            {error.line && <span className="line-number">Line {error.line}</span>}
                                        </div>
                                        <p className="error-message">{error.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Security Vulnerabilities */}
                    {deepAnalysis.securityVulnerabilities && deepAnalysis.securityVulnerabilities.length > 0 && (
                        <div className="analysis-section glass-card">
                            <h3 className="section-title">
                                <span className="title-icon">🔒</span>
                                Security Vulnerabilities
                            </h3>
                            <div className="security-list">
                                {deepAnalysis.securityVulnerabilities.map((vuln, idx) => (
                                    <div key={idx} className="security-item critical">
                                        <div className="security-header">
                                            <span className="badge badge-error">{vuln.severity}</span>
                                            {vuln.line && <span className="line-number">Line {vuln.line}</span>}
                                        </div>
                                        <p className="security-message">{vuln.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Runtime Errors */}
                    {deepAnalysis.runtimeErrors && deepAnalysis.runtimeErrors.length > 0 && (
                        <div className="analysis-section glass-card">
                            <h3 className="section-title">
                                <span className="title-icon">⚡</span>
                                Potential Runtime Errors
                            </h3>
                            <div className="runtime-errors-list">
                                {deepAnalysis.runtimeErrors.map((error, idx) => (
                                    <div key={idx} className={`runtime-error-item ${getSeverityColor(error.severity)}`}>
                                        <div className="runtime-error-header">
                                            <span className={`badge badge-${getSeverityColor(error.severity)}`}>
                                                {error.severity}
                                            </span>
                                            {error.line && <span className="line-number">Line {error.line}</span>}
                                        </div>
                                        <p className="runtime-error-message">{error.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Performance Warnings */}
                    {deepAnalysis.performanceWarnings && deepAnalysis.performanceWarnings.length > 0 && (
                        <div className="analysis-section glass-card">
                            <h3 className="section-title">
                                <span className="title-icon">🚀</span>
                                Performance Warnings
                            </h3>
                            <div className="performance-list">
                                {deepAnalysis.performanceWarnings.map((warning, idx) => (
                                    <div key={idx} className="performance-item">
                                        <div className="performance-header">
                                            <span className={`badge badge-${getSeverityColor(warning.severity)}`}>
                                                {warning.severity}
                                            </span>
                                            {warning.line && <span className="line-number">Line {warning.line}</span>}
                                        </div>
                                        <p className="performance-message">{warning.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Semantic Warnings */}
                    {deepAnalysis.semanticWarnings && deepAnalysis.semanticWarnings.length > 0 && (
                        <div className="analysis-section glass-card">
                            <h3 className="section-title">
                                <span className="title-icon">💡</span>
                                Semantic Warnings
                            </h3>
                            <div className="semantic-list">
                                {deepAnalysis.semanticWarnings.map((warning, idx) => (
                                    <div key={idx} className="semantic-item">
                                        <div className="semantic-header">
                                            <span className={`badge badge-${getSeverityColor(warning.severity)}`}>
                                                {warning.severity}
                                            </span>
                                            {warning.line && <span className="line-number">Line {warning.line}</span>}
                                        </div>
                                        <p className="semantic-message">{warning.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dependencies (if available) */}
                    {deepAnalysis.dependencies && deepAnalysis.dependencies.circularDependencies && deepAnalysis.dependencies.circularDependencies.length > 0 && (
                        <div className="analysis-section glass-card">
                            <h3 className="section-title">
                                <span className="title-icon">🔄</span>
                                Circular Dependencies
                            </h3>
                            <div className="dependencies-list">
                                {deepAnalysis.dependencies.circularDependencies.map((dep, idx) => (
                                    <div key={idx} className="dependency-item error">
                                        <div className="dependency-header">
                                            <span className="badge badge-error">{dep.severity}</span>
                                        </div>
                                        <p className="dependency-message">{dep.message}</p>
                                        <div className="dependency-chain">
                                            {dep.files.map((file, fileIdx) => (
                                                <span key={fileIdx} className="chain-item">
                                                    {file}
                                                    {fileIdx < dep.files.length - 1 && <span className="arrow">→</span>}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Issues Found */}
                    {totalIssues === 0 && totalWarnings === 0 && (
                        <div className="no-issues-section glass-card">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="var(--success)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round" />
                            </svg>
                            <h3>Excellent Code Quality! 🎉</h3>
                            <p>No issues or warnings detected in the deep analysis.</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        Close Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeepAnalysisReport;
