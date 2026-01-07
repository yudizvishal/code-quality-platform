import { useState, useRef } from 'react';
import JSZip from 'jszip';
import './FileUploader.css';

const FileUploader = ({ onFilesAnalyzed, onAnalysisStart, isAnalyzing }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = [...e.dataTransfer.files];
        handleFiles(files);
    };

    const handleChange = (e) => {
        e.preventDefault();
        const files = [...e.target.files];
        handleFiles(files);
    };

    const handleFiles = async (files) => {
        setIsExtracting(true);
        const allFiles = [];
        const duplicates = [];

        for (const file of files) {
            const ext = file.name.split('.').pop().toLowerCase();

            // Check if it's a ZIP file
            if (ext === 'zip') {
                try {
                    const zip = new JSZip();
                    const zipContent = await zip.loadAsync(file);

                    // Extract all valid files from ZIP
                    for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
                        // Skip Mac system files and hidden files
                        const isSystemFile =
                            filename.includes('__MACOSX/') ||  // Mac metadata folder
                            filename.includes('.DS_Store') ||  // Mac system file
                            filename.startsWith('.') ||         // Hidden files
                            filename.split('/').some(part => part.startsWith('.')); // Hidden folders

                        if (!zipEntry.dir && !isSystemFile) {
                            const fileExt = filename.split('.').pop().toLowerCase();
                            if (['js', 'jsx', 'ts', 'tsx', 'css', 'html', 'json'].includes(fileExt)) {
                                const blob = await zipEntry.async('blob');
                                const extractedFile = new File([blob], filename, { type: 'text/plain' });

                                // Check for duplicates
                                const isDuplicate = uploadedFiles.some(
                                    existing => existing.name === extractedFile.name && existing.size === extractedFile.size
                                );

                                if (!isDuplicate && !allFiles.some(f => f.name === extractedFile.name && f.size === extractedFile.size)) {
                                    allFiles.push(extractedFile);
                                } else {
                                    duplicates.push(filename);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error extracting ZIP:', error);
                    alert('આ ZIP file extract કરવામાં error આવી. કૃપા કરીને valid ZIP file upload કરો.');
                }
            }
            // Regular files
            else if (['js', 'jsx', 'ts', 'tsx', 'css', 'html', 'json'].includes(ext)) {
                // Check for duplicates
                const isDuplicate = uploadedFiles.some(
                    existing => existing.name === file.name && existing.size === file.size
                );

                if (!isDuplicate && !allFiles.some(f => f.name === file.name && f.size === file.size)) {
                    allFiles.push(file);
                } else {
                    duplicates.push(file.name);
                }
            }
        }

        // Show alert if duplicates found
        if (duplicates.length > 0) {
            alert(`આ files પહેલાથી upload છે, skip કરી:\n${duplicates.join('\n')}`);
        }

        setUploadedFiles(prev => [...prev, ...allFiles]);
        setIsExtracting(false);
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const analyzeFiles = async () => {
        if (uploadedFiles.length === 0) return;

        onAnalysisStart();

        // Simulate analysis process
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Read and analyze files
        const analyzedFiles = await Promise.all(
            uploadedFiles.map(async (file) => {
                const content = await file.text();
                return analyzeFileContent(file.name, content, file.type);
            })
        );

        const analysis = {
            totalFiles: analyzedFiles.length,
            files: analyzedFiles,
            summary: generateSummary(analyzedFiles),
            timestamp: new Date().toISOString()
        };

        onFilesAnalyzed(analysis);
    };

    const analyzeFileContent = (fileName, content, fileType) => {
        const issues = [];
        const suggestions = [];
        let errorCount = 0;
        let warningCount = 0;
        const lines = content.split('\n');

        // HTML Validation (W3C Standard Simulation)
        if (fileName.endsWith('.html')) {
            const htmlIssues = validateHtml(content, lines);
            issues.push(...htmlIssues.issues);
            suggestions.push(...htmlIssues.suggestions);
            errorCount += htmlIssues.errorCount;
            warningCount += htmlIssues.warningCount;
        }

        // Check for common issues
        if (content.includes('console.log')) {
            issues.push({
                type: 'warning',
                line: findLineNumber(content, 'console.log'),
                message: 'console.log() found - should be removed in production',
                code: 'CONSOLE_LOG'
            });
            warningCount++;
            suggestions.push({
                type: 'optimization',
                message: 'Remove console.log statements or use a proper logging library',
                autoFix: true,
                fixCode: 'Remove all console.log statements'
            });
        }

        if (content.includes('var ')) {
            issues.push({
                type: 'warning',
                line: findLineNumber(content, 'var '),
                message: 'Using "var" instead of "let" or "const"',
                code: 'USE_VAR'
            });
            warningCount++;
            suggestions.push({
                type: 'modernization',
                message: 'Replace "var" with "const" or "let" for better scoping',
                autoFix: true,
                fixCode: 'Replace var with const/let'
            });
        }

        if (fileName.endsWith('.jsx') || fileName.endsWith('.tsx')) {
            if (!content.includes('import React') && !content.includes('import { ')) {
                issues.push({
                    type: 'error',
                    line: 1,
                    message: 'Missing React import',
                    code: 'MISSING_IMPORT'
                });
                errorCount++;
                suggestions.push({
                    type: 'fix',
                    message: 'Add missing React import',
                    autoFix: true,
                    fixCode: 'Add React import',
                    impact: 'high'
                });
            }

            if (content.includes('class ') && content.includes('extends Component')) {
                suggestions.push({
                    type: 'modernization',
                    message: 'Consider converting class components to functional components with hooks',
                    autoFix: false,
                    impact: 'high'
                });
            }

            // Check for inline styles
            if (content.includes('style={{')) {
                suggestions.push({
                    type: 'performance',
                    message: 'Inline styles detected. Consider moving to CSS modules or styled-components',
                    autoFix: true,
                    fixCode: 'Extract inline styles to CSS',
                    impact: 'medium'
                });
            }

            // Check for missing key in maps
            if (content.includes('.map(') && !content.includes('key=')) {
                issues.push({
                    type: 'warning',
                    line: findLineNumber(content, '.map('),
                    message: 'Missing "key" prop in list items',
                    code: 'MISSING_KEY'
                });
                warningCount++;
            }
        }

        // Check for TODO comments
        if (content.includes('TODO') || content.includes('FIXME')) {
            issues.push({
                type: 'info',
                line: findLineNumber(content, 'TODO'),
                message: 'TODO/FIXME comment found',
                code: 'TODO_COMMENT'
            });
        }

        // ENHANCED OPTIMIZATION CHECKS

        // Check for long functions (more than 50 lines)
        const functionBlocks = content.match(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g) || [];
        const arrowFunctions = content.match(/const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\n\}/g) || [];
        const allFunctions = [...functionBlocks, ...arrowFunctions];

        allFunctions.forEach(func => {
            const funcLines = func.split('\n').length;
            if (funcLines > 50) {
                suggestions.push({
                    type: 'maintainability',
                    message: `Long function detected (${funcLines} lines). Consider breaking into smaller functions for better readability`,
                    autoFix: false,
                    impact: 'high'
                });
            }
        });

        // Check for nested loops (performance issue)
        const nestedLoopPattern = /for\s*\([^)]*\)[^{]*\{[^}]*for\s*\([^)]*\)/g;
        if (nestedLoopPattern.test(content)) {
            suggestions.push({
                type: 'performance',
                message: 'Nested loops detected. Consider optimizing with Map, Set, or single-pass algorithms',
                autoFix: true,
                fixCode: 'Add optimization comment for nested loops',
                impact: 'high'
            });
        }

        // Check for duplicate code blocks
        const codeBlocks = lines.filter(line => line.trim().length > 20);
        const duplicateLines = codeBlocks.filter((line, index) =>
            codeBlocks.indexOf(line) !== index && line.trim() !== ''
        );
        if (duplicateLines.length > 5) {
            suggestions.push({
                type: 'maintainability',
                message: 'Duplicate code detected. Consider extracting into reusable functions or components',
                autoFix: false,
                impact: 'medium'
            });
        }

        // Check for magic numbers
        const magicNumberPattern = /\b\d{2,}\b/g;
        const magicNumbers = content.match(magicNumberPattern);
        if (magicNumbers && magicNumbers.length > 5) {
            suggestions.push({
                type: 'readability',
                message: 'Magic numbers found. Consider using named constants for better code clarity',
                autoFix: true,
                fixCode: 'Extract magic numbers to constants',
                impact: 'medium'
            });
        }

        // Check for deep nesting
        const maxNestingLevel = Math.max(...lines.map(line => {
            const match = line.match(/^(\s*)/);
            return match ? Math.floor(match[1].length / 2) : 0;
        }));
        if (maxNestingLevel > 4) {
            suggestions.push({
                type: 'complexity',
                message: 'Deep nesting detected (level ' + maxNestingLevel + '). Consider early returns or extracting functions',
                autoFix: false,
                impact: 'medium'
            });
        }

        // Check for unused imports (simple check)
        const imports = content.match(/import\s+{([^}]+)}\s+from/g) || [];
        imports.forEach(imp => {
            const imported = imp.match(/import\s+{([^}]+)}/)[1].split(',');
            imported.forEach(item => {
                const itemName = item.trim();
                const usageCount = (content.match(new RegExp(itemName, 'g')) || []).length;
                if (usageCount === 1) { // Only appears in import
                    suggestions.push({
                        type: 'optimization',
                        message: `Unused import detected: ${itemName}. Remove to reduce bundle size`,
                        autoFix: true,
                        fixCode: 'Remove unused imports',
                        impact: 'low'
                    });
                }
            });
        });

        // Check for large file size
        if (lines.length > 300) {
            suggestions.push({
                type: 'maintainability',
                message: `Large file (${lines.length} lines). Consider splitting into smaller, focused modules`,
                autoFix: false,
                impact: 'medium'
            });
        }

        // Check for excessive complexity
        const complexityIndicators = [
            content.match(/if\s*\(/g)?.length || 0,
            content.match(/else/g)?.length || 0,
            content.match(/for\s*\(/g)?.length || 0,
            content.match(/while\s*\(/g)?.length || 0,
            content.match(/switch\s*\(/g)?.length || 0
        ];
        const totalComplexity = complexityIndicators.reduce((a, b) => a + b, 0);
        if (totalComplexity > 20) {
            suggestions.push({
                type: 'complexity',
                message: 'High cyclomatic complexity. Consider simplifying logic or using pattern matching',
                autoFix: false,
                impact: 'high'
            });
        }

        // Check for commented out code
        const commentedCodeLines = lines.filter(line =>
            line.trim().startsWith('//') &&
            (line.includes('function') || line.includes('const') || line.includes('='))
        ).length;
        if (commentedCodeLines > 3) {
            suggestions.push({
                type: 'cleanliness',
                message: 'Commented out code found. Remove dead code to keep codebase clean',
                autoFix: true,
                fixCode: 'Remove commented out code',
                impact: 'low'
            });
        }

        // Check for long parameter lists
        const longParamPattern = /function\s+\w+\s*\(([^)]{50,})\)/g;
        if (longParamPattern.test(content)) {
            suggestions.push({
                type: 'maintainability',
                message: 'Long parameter list detected. Consider using object destructuring or parameter objects',
                autoFix: false,
                impact: 'medium'
            });
        }

        // Check for function length (simple check)
        const functionMatches = content.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g);
        if (functionMatches && functionMatches.length > 10) {
            suggestions.push({
                type: 'maintainability',
                message: 'Consider breaking down large functions into smaller ones',
                autoFix: false,
                impact: 'medium'
            });
        }

        // Code quality score
        const score = Math.max(0, 100 - (errorCount * 20 + warningCount * 5));

        return {
            fileName,
            fileType,
            lines: lines.length,
            size: content.length,
            issues,
            suggestions,
            errorCount,
            warningCount,
            qualityScore: score,
            content: content.substring(0, 500) // Preview
        };
    };

    const validateHtml = (content, lines) => {
        const issues = [];
        const suggestions = [];
        let errorCount = 0;
        let warningCount = 0;

        // 1. DOCTYPE Check
        if (!content.trim().toLowerCase().startsWith('<!doctype html>')) {
            issues.push({
                type: 'error',
                line: 1,
                message: 'Missing or invalid DOCTYPE declaration. Should be <!DOCTYPE html>',
                code: 'W3C_DOCTYPE'
            });
            errorCount++;
            suggestions.push({
                type: 'fix',
                message: 'Add <!DOCTYPE html> declaration at the beginning',
                autoFix: true,
                fixCode: 'Add DOCTYPE to HTML',
                impact: 'high'
            });
        }

        // 2. Required Tags Check
        const requiredTags = ['<html', '<head', '<title', '<body'];
        requiredTags.forEach(tag => {
            if (!content.includes(tag)) {
                issues.push({
                    type: 'error',
                    line: 1,
                    message: `Missing required tag: ${tag.replace('<', '')}`,
                    code: 'W3C_STRUCTURE'
                });
                errorCount++;
            }
        });

        // 3. Accessibility Checks (Alt attributes)
        const imgRegex = /<img\s+[^>]*>/g;
        let match;
        while ((match = imgRegex.exec(content)) !== null) {
            if (!match[0].includes('alt=')) {
                const lineNum = findLineNumber(content, match[0]);
                issues.push({
                    type: 'warning',
                    line: lineNum,
                    message: 'Image missing "alt" attribute (Accessibility/W3C)',
                    code: 'W3C_A11Y'
                });
                warningCount++;
                suggestions.push({
                    type: 'accessibility',
                    message: 'Add alt attributes to images for better accessibility',
                    autoFix: true,
                    fixCode: 'Add alt attributes to images',
                    impact: 'high'
                });
            }
        }

        // 4. Deprecated Tags Check
        const deprecatedTags = ['<center>', '<font>', '<marquee>', '<blink>', '<frame>', '<frameset>'];
        deprecatedTags.forEach(tag => {
            if (content.includes(tag)) {
                const lineNum = findLineNumber(content, tag);
                issues.push({
                    type: 'warning',
                    line: lineNum,
                    message: `Deprecated HTML tag detected: ${tag}`,
                    code: 'W3C_DEPRECATED'
                });
                warningCount++;
                suggestions.push({
                    type: 'modernization',
                    message: `Replace ${tag} with CSS styling`,
                    autoFix: true,
                    fixCode: 'Replace deprecated HTML tags',
                    impact: 'low'
                });
            }
        });

        // 5. Structure & Nesting (Simple Regex Checks for common errors)
        if (/<p>[\s\S]*?<div[\s\S]*?<\/p>/.test(content)) {
            issues.push({
                type: 'error',
                line: findLineNumber(content, '<div>'),
                message: 'Invalid nesting: <div> cannot be strictly inside <p> (W3C Spec)',
                code: 'W3C_NESTING'
            });
            errorCount++;
        }

        // 6. Viewport Meta Check
        if (!content.includes('name="viewport"')) {
            issues.push({
                type: 'warning',
                line: 1,
                message: 'Missing viewport meta tag for mobile responsiveness',
                code: 'W3C_MOBILE'
            });
            warningCount++;
            suggestions.push({
                type: 'modernization',
                message: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                autoFix: true,
                fixCode: 'Add viewport meta tag'
            });
        }

        return { issues, suggestions, errorCount, warningCount };
    };

    const findLineNumber = (content, searchString) => {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(searchString)) {
                return i + 1;
            }
        }
        return 1;
    };

    const generateSummary = (analyzedFiles) => {
        const totalErrors = analyzedFiles.reduce((sum, file) => sum + file.errorCount, 0);
        const totalWarnings = analyzedFiles.reduce((sum, file) => sum + file.warningCount, 0);
        const avgScore = analyzedFiles.reduce((sum, file) => sum + file.qualityScore, 0) / analyzedFiles.length;
        const totalLines = analyzedFiles.reduce((sum, file) => sum + file.lines, 0);

        return {
            totalErrors,
            totalWarnings,
            averageQualityScore: Math.round(avgScore),
            totalLines,
            status: totalErrors === 0 ? 'passed' : 'failed'
        };
    };

    const onButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="file-uploader-container">
            {isExtracting && (
                <div className="extracting-notice glass-card animate-fade-in">
                    <div className="loader-small"></div>
                    <p>ZIP file extract કરી રહ્યા છીએ... કૃપા કરીને રાહ જુઓ</p>
                </div>
            )}

            {!isAnalyzing && uploadedFiles.length === 0 && !isExtracting && (
                <div
                    className={`upload-area glass-card ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleChange}
                        accept=".js,.jsx,.ts,.tsx,.css,.html,.json,.zip"
                        style={{ display: 'none' }}
                    />

                    <div className="upload-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 18C4.23858 18 2 15.7614 2 13C2 10.2386 4.23858 8 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C19.7614 8 22 10.2386 22 13C22 15.7614 19.7614 18 17 18M12 11V17M12 11L9 14M12 11L15 14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                    </div>

                    <h3>Drag and Drop Your Code or ZIP File Here</h3>
                    <p>Upload individual files or a ZIP containing your entire project. We'll automatically extract and analyze all code files!</p>

                    <button className="btn btn-primary mt-md" onClick={onButtonClick}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4V20M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Upload File
                    </button>

                    <div className="supported-formats mt-md">
                        <span className="badge badge-info">.js</span>
                        <span className="badge badge-info">.jsx</span>
                        <span className="badge badge-info">.ts</span>
                        <span className="badge badge-info">.tsx</span>
                        <span className="badge badge-info">.css</span>
                        <span className="badge badge-info">.html</span>
                        <span className="badge badge-success">.zip</span>
                    </div>
                </div>
            )}

            {uploadedFiles.length > 0 && !isAnalyzing && (
                <div className="files-list-container glass-card animate-fade-in">
                    <div className="files-header">
                        <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round" />
                            </svg>
                            Uploaded Files ({uploadedFiles.length})
                        </h3>
                        <button className="btn btn-secondary" onClick={onButtonClick}>
                            Add More Files
                        </button>
                    </div>

                    <div className="files-list">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="file-item">
                                <div className="file-info">
                                    <div className="file-icon">📄</div>
                                    <div className="file-details">
                                        <div className="file-name">{file.name}</div>
                                        <div className="file-size">{(file.size / 1024).toFixed(2)} KB</div>
                                    </div>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFile(index)}
                                    aria-label="Remove file"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn btn-success analyze-btn"
                        onClick={analyzeFiles}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                        Analyze Code Quality
                    </button>
                </div>
            )}

            {isAnalyzing && (
                <div className="analyzing-container glass-card animate-fade-in">
                    <div className="analyzing-content">
                        <div className="loader">
                            <div className="loader-ring"></div>
                            <div className="loader-ring"></div>
                            <div className="loader-ring"></div>
                        </div>
                        <h3>Analyzing Your Code...</h3>
                        <p>Please wait while we perform deep analysis on your files</p>
                        <div className="analyzing-steps">
                            <div className="step active">
                                <span className="step-icon">✓</span>
                                Reading files
                            </div>
                            <div className="step active">
                                <span className="step-icon">⟳</span>
                                Detecting errors
                            </div>
                            <div className="step">
                                <span className="step-icon">○</span>
                                Generating suggestions
                            </div>
                            <div className="step">
                                <span className="step-icon">○</span>
                                Preparing report
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
