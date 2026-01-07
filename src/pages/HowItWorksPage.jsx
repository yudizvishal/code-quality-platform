import './HowItWorksPage.css';

const HowItWorksPage = () => {
    const steps = [
        {
            number: '01',
            title: 'Upload Your Code',
            description: 'Drag and drop your files or upload a ZIP archive containing your project. We support JavaScript, TypeScript, JSX, CSS, HTML, and JSON files.',
            icon: '📁'
        },
        {
            number: '02',
            title: 'AI Analysis',
            description: 'Our advanced AI engine scans your code for patterns, errors, security vulnerabilities, and optimization opportunities in real-time.',
            icon: '🧠'
        },
        {
            number: '03',
            title: 'Get Results',
            description: 'View a comprehensive report with a quality score, detailed error list, warnings, and performance metrics for every file.',
            icon: '📊'
        },
        {
            number: '04',
            title: 'Apply Fixes',
            description: 'Use our auto-fix suggestions to automatically resolve issues, modernize your code, and improve performance with a single click.',
            icon: '✨'
        }
    ];

    return (
        <div className="how-it-works-page animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    How <span className="gradient-text">CodeGuard</span> Works
                </h1>
                <p className="page-subtitle">
                    Four simple steps to transform your code quality and reliability
                </p>
            </div>

            <div className="steps-container">
                {steps.map((step, index) => (
                    <div key={index} className="step-card glass-card">
                        <div className="step-number">{step.number}</div>
                        <div className="step-icon-wrapper">
                            <div className="step-icon">{step.icon}</div>
                        </div>
                        <h3 className="step-title">{step.title}</h3>
                        <p className="step-description">{step.description}</p>
                        {index < steps.length - 1 && (
                            <div className="step-connector"></div>
                        )}
                    </div>
                ))}
            </div>

            <div className="demo-section glass-card">
                <div className="demo-content">
                    <h2>See It in Action</h2>
                    <p>Watch how CodeGuard analyzes a complex React component in seconds.</p>

                    <div className="demo-visual">
                        <div className="code-window">
                            <div className="window-header">
                                <span className="dot red"></span>
                                <span className="dot yellow"></span>
                                <span className="dot green"></span>
                            </div>
                            <div className="window-body">
                                <div className="code-line">
                                    <span className="keyword">const</span> <span className="function">App</span> = () ={'&gt;'} {'{'}
                                </div>
                                <div className="code-line indent-1">
                                    <span className="comment">// AI analyzing...</span>
                                </div>
                                <div className="code-line indent-1">
                                    <span className="keyword">var</span> data = <span className="string">"test"</span>; <span className="marker-warning">⚠️</span>
                                </div>
                                <div className="code-line indent-1">
                                    console.<span className="function">log</span>(data); <span className="marker-error">❌</span>
                                </div>
                                <div className="code-line">{'}'};</div>

                                <div className="ai-cursor"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksPage;
