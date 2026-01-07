import { useState, useRef } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import AnalysisResults from './components/AnalysisResults';
import Header from './components/Header';
import FeaturesPage from './pages/FeaturesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const fileUploaderRef = useRef(null);

  const handleFilesAnalyzed = (data) => {
    setAnalysisData(data);
    setIsAnalyzing(false);
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setAnalysisData(null);
  };

  const handleReset = () => {
    setAnalysisData(null);
    setIsAnalyzing(false);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAnalysis = () => {
    setCurrentPage('home');
    // Small timeout to allow state update and DOM render if switching from another page
    setTimeout(() => {
      fileUploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="app">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onGetStarted={handleStartAnalysis}
      />

      <main className="container">
        {currentPage === 'home' && (
          <>
            {!analysisData && !isAnalyzing && (
              <div className="hero-section animate-fade-in">
                <div className="hero-glass-container">
                  <h1 className="hero-title">
                    Code Quality Platform
                  </h1>
                  <p className="hero-subtitle">
                    Elevate your code. Analyze, detect errors, optimize, and auto-fix with advanced AI.
                  </p>

                  <button
                    className="btn btn-primary hero-btn"
                    onClick={handleStartAnalysis}
                  >
                    Start New Analysis
                  </button>
                </div>

                <div className="features-grid">
                  <div className="feature-card glass-card">
                    <div className="feature-icon">🔍</div>
                    <h3>Deep Analysis</h3>
                    <p>Comprehensive static and dynamic analysis to uncover hidden issues.</p>
                  </div>

                  <div className="feature-card glass-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Error Detection</h3>
                    <p>Instantly identify bugs, vulnerabilities, and potential security risks.</p>
                  </div>

                  <div className="feature-card glass-card">
                    <div className="feature-icon">✨</div>
                    <h3>Optimization Tips</h3>
                    <p>Receive actionable recommendations for performance and readability.</p>
                  </div>

                  <div className="feature-card glass-card">
                    <div className="feature-icon">🛠️</div>
                    <h3>Auto-Fix</h3>
                    <p>Apply AI-suggested fixes with a single click to save time and effort.</p>
                  </div>
                </div>
              </div>
            )}

            <div ref={fileUploaderRef}>
              <FileUploader
                onFilesAnalyzed={handleFilesAnalyzed}
                onAnalysisStart={handleAnalysisStart}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {analysisData && (
              <AnalysisResults
                data={analysisData}
                onReset={handleReset}
              />
            )}
          </>
        )}

        {currentPage === 'features' && (
          <FeaturesPage onStartAnalysis={handleStartAnalysis} />
        )}
        {currentPage === 'how-it-works' && <HowItWorksPage />}
        {currentPage === 'about' && <AboutPage />}
      </main>
    </div>
  );
}

export default App;
