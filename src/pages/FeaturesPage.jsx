import './FeaturesPage.css';

const FeaturesPage = ({ onStartAnalysis }) => {
    const features = [
        {
            icon: '🔍',
            title: 'Deep Code Analysis',
            description: 'Comprehensive static and dynamic analysis to uncover hidden issues in your codebase.',
            details: [
                'Advanced pattern recognition',
                'Syntax and semantic analysis',
                'Cross-file dependency tracking',
                'Real-time error detection'
            ],
            color: 'purple'
        },
        {
            icon: '⚡',
            title: 'Error Detection',
            description: 'Instantly identify bugs, vulnerabilities, and potential security risks.',
            details: [
                'Missing imports detection',
                'Undefined variable tracking',
                'Type mismatch identification',
                'Security vulnerability scanning'
            ],
            color: 'cyan'
        },
        {
            icon: '✨',
            title: 'Code Optimization',
            description: 'Receive actionable recommendations for performance and readability.',
            details: [
                'Performance bottleneck detection',
                'Code complexity analysis',
                'Best practices suggestions',
                'Refactoring recommendations'
            ],
            color: 'orange'
        },
        {
            icon: '🛠️',
            title: 'Auto-Fix Capabilities',
            description: 'Apply AI-suggested fixes with a single click to save time and effort.',
            details: [
                'One-click code fixes',
                'Automated refactoring',
                'Import optimization',
                'Code formatting'
            ],
            color: 'pink'
        },
        {
            icon: '📊',
            title: 'Quality Scoring',
            description: 'Get comprehensive quality scores for your entire codebase.',
            details: [
                'File-level quality metrics',
                'Project-wide statistics',
                'Trend analysis over time',
                'Customizable scoring criteria'
            ],
            color: 'green'
        },
        {
            icon: '📦',
            title: 'ZIP File Support',
            description: 'Upload entire projects as ZIP files for batch analysis.',
            details: [
                'Automatic file extraction',
                'Multi-file analysis',
                'Project structure recognition',
                'Bulk code quality reports'
            ],
            color: 'blue'
        }
    ];

    return (
        <div className="features-page animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    <span className="gradient-text">Powerful Features</span>
                </h1>
                <p className="page-subtitle">
                    Discover all the tools and capabilities that make CodeGuard the ultimate code quality platform
                </p>
            </div>

            <div className="features-showcase">
                {features.map((feature, index) => (
                    <div key={index} className={`feature-showcase-card glass-card feature-${feature.color}`}>
                        <div className="feature-showcase-icon">{feature.icon}</div>
                        <h2 className="feature-showcase-title">{feature.title}</h2>
                        <p className="feature-showcase-description">{feature.description}</p>

                        <div className="feature-details">
                            <h4>Key Capabilities:</h4>
                            <ul className="feature-details-list">
                                {feature.details.map((detail, idx) => (
                                    <li key={idx}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round" />
                                        </svg>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cta-section glass-card">
                <h2>Ready to Improve Your Code Quality?</h2>
                <p>Start analyzing your code today and see the difference!</p>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={onStartAnalysis}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V20M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Start Free Analysis
                </button>
            </div>
        </div>
    );
};

export default FeaturesPage;
