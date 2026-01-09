import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { performDeepAnalysis } from '../utils/deepCodeAnalyzer';
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
                            if (['js', 'jsx', 'ts', 'tsx', 'css', 'html', 'json', 'py', 'php', 'sol', 'vy', 'vue'].includes(fileExt)) {
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
            else if (['js', 'jsx', 'ts', 'tsx', 'css', 'html', 'json', 'py', 'php', 'sol', 'vy', 'vue'].includes(ext)) {
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

        // Read all files first for cross-file analysis
        const filesWithContent = await Promise.all(
            uploadedFiles.map(async (file) => ({
                fileName: file.name,
                content: await file.text(),
                type: file.type
            }))
        );

        // Perform analysis on each file
        const analyzedFiles = filesWithContent.map(file => {
            // Basic analysis
            const basicAnalysis = analyzeFileContent(file.fileName, file.content, file.type);

            // Deep analysis (new advanced features)
            const deepAnalysis = performDeepAnalysis(file.content, file.fileName, filesWithContent);

            return {
                ...basicAnalysis,
                deepAnalysis: {
                    patterns: deepAnalysis.patterns,
                    antiPatterns: deepAnalysis.antiPatterns,
                    syntaxErrors: deepAnalysis.syntaxErrors,
                    semanticWarnings: deepAnalysis.semanticWarnings,
                    runtimeErrors: deepAnalysis.runtimeErrors,
                    performanceWarnings: deepAnalysis.performanceWarnings,
                    securityVulnerabilities: deepAnalysis.securityVulnerabilities,
                    dependencies: deepAnalysis.dependencies,
                    deepScore: deepAnalysis.overallScore
                }
            };
        });

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

        // Helper to find actual usage (excluding declarations and strings/comments)
        const findActualUsage = (name) => {
            const usagePattern = new RegExp(`\\b${name}\\b`, 'g');
            const declarationPattern = new RegExp(`(const|let|var|function|class)\\s+${name}\\b`, 'g');

            const totalMatches = (content.match(usagePattern) || []).length;
            const declarationMatches = (content.match(declarationPattern) || []).length;

            // This is still a heuristic, but better
            return totalMatches - declarationMatches;
        };

        // 1. TECHNOLOGY-SPECIFIC ANALYSIS

        // HTML Validation
        if (fileName.endsWith('.html')) {
            const htmlIssues = validateHtml(content, lines);
            issues.push(...htmlIssues.issues);
            suggestions.push(...htmlIssues.suggestions);
            errorCount += htmlIssues.errorCount;
            warningCount += htmlIssues.warningCount;
        }

        // Python Analysis
        if (fileName.endsWith('.py')) {
            // Check for print statements (Production best practice)
            if (content.includes('print(')) {
                issues.push({
                    type: 'warning',
                    line: findLineNumber(content, 'print('),
                    message: 'Avoid using print() in production. Use a logging library instead.',
                    code: 'PYTHON_LOGGING'
                });
                warningCount++;
            }
            // range(len()) anti-pattern
            if (content.includes('range(len(')) {
                suggestions.push({
                    type: 'optimization',
                    message: 'Use enumerate() instead of range(len()) for cleaner iteration.',
                    autoFix: true,
                    fixCode: 'for i, item in enumerate(my_list):',
                    impact: 'medium'
                });
            }
            if (content.includes('== None')) {
                suggestions.push({
                    type: 'optimization',
                    message: 'Use "is None" instead of "== None" for comparing with None.',
                    autoFix: true,
                    fixCode: 'if value is None:',
                    impact: 'low'
                });
            }
        }

        // PHP Analysis
        if (fileName.endsWith('.php')) {
            if (content.includes('mysql_query')) {
                issues.push({
                    type: 'error',
                    line: findLineNumber(content, 'mysql_query'),
                    message: 'Deprecated mysql_query detected. Highly vulnerable to SQL injection.',
                    code: 'PHP_SECURITY'
                });
                errorCount++;
            }
            if (content.includes('die(') || content.includes('exit(')) {
                issues.push({
                    type: 'warning',
                    line: findLineNumber(content, 'die('),
                    message: 'Using die() or exit() is not recommended in modern PHP applications. Use exceptions or proper error handling.',
                    code: 'PHP_ERROR_HANDLING'
                });
                warningCount++;
            }
            if (!content.includes('<?php')) {
                issues.push({
                    type: 'error',
                    line: 1,
                    message: 'Missing opening <?php tag.',
                    code: 'PHP_STRUCTURE'
                });
                errorCount++;
            }
        }

        // Blockchain (Solidity) Analysis
        if (fileName.endsWith('.sol')) {
            if (!content.includes('pragma solidity')) {
                issues.push({
                    type: 'error',
                    line: 1,
                    message: 'Missing or invalid pragma solidity statement. Contract will not compile.',
                    code: 'SOL_PRAGMA'
                });
                errorCount++;
            }
            // Missing visibility on functions
            const funcRegex = /function\s+\w+\s*\([^)]*\)\s*(?!public|private|internal|external)/g;
            if (funcRegex.test(content)) {
                issues.push({
                    type: 'error',
                    line: findLineNumber(content, 'function'),
                    message: 'Function visibility missing. Explicitly define as public, private, internal, or external.',
                    code: 'SOL_VISIBILITY'
                });
                errorCount++;
            }
        }

        // Vue.js Analysis
        if (fileName.endsWith('.vue')) {
            if (content.includes('v-for') && !content.includes(':key=')) {
                issues.push({
                    type: 'error',
                    line: findLineNumber(content, 'v-for'),
                    message: 'v-for directive missing required :key attribute.',
                    code: 'VUE_KEY'
                });
                errorCount++;
            }
            if (content.includes('v-if') && content.includes('v-for')) {
                suggestions.push({
                    type: 'performance',
                    message: 'v-if and v-for used on the same element. This is inefficient. Use a computed property to filter the list instead.',
                    autoFix: false,
                    impact: 'high'
                });
            }
        }

        // JS/TS Library Specific Checks
        if (fileName.endsWith('.js') || fileName.endsWith('.jsx') || fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
            // JQuery Detection
            if (content.includes('$(') || content.includes('jQuery(')) {
                suggestions.push({
                    type: 'modernization',
                    message: 'JQuery detected. Modern frameworks recommend native Web APIs or state-driven DOM updates.',
                    autoFix: false,
                    impact: 'medium'
                });
            }

            // Three.js Detection
            if (content.includes('THREE.') || content.includes('from "three"')) {
                if (!content.includes('.dispose()')) {
                    issues.push({
                        type: 'warning',
                        line: 1,
                        message: 'Three.js: No .dispose() found. Potential memory leak in 3D scene.',
                        code: 'THREE_MEMORY'
                    });
                    warningCount++;
                }
            }

            // Next.js Detection
            if (content.includes('next/router') || content.includes('next/link')) {
                if (content.includes('<a ') && !content.includes('href="#') && !content.includes('target="_blank"')) {
                    suggestions.push({
                        type: 'optimization',
                        message: 'Use Next.js <Link> component instead of <a> for client-side navigation.',
                        autoFix: true,
                        fixCode: '<Link href="...">...</Link>',
                        impact: 'high'
                    });
                }
            }
        }

        // React/JSX/TSX Specific
        if (fileName.endsWith('.jsx') || fileName.endsWith('.tsx')) {
            // Missing Dependency in useEffect
            if (content.includes('useEffect') && content.includes('[') && content.includes(']')) {
                const effectMatch = content.match(/useEffect\s*\(\s*\(\s*\)\s*=>\s*{([\s\S]*?)}\s*,\s*\[([^\]]*)\]\s*\)/);
                if (effectMatch) {
                    const body = effectMatch[1];
                    const deps = effectMatch[2].split(',').map(d => d.trim()).filter(Boolean);

                    // Simple check: see if variables used in body are in deps
                    const usedVars = body.match(/\b([a-z]\w*)\b/g) || [];
                    const missingDeps = usedVars.filter(v =>
                        !deps.includes(v) &&
                        content.includes(`const [${v}`) && // is a state
                        !['null', 'undefined', 'true', 'false'].includes(v)
                    );

                    if (missingDeps.length > 0) {
                        issues.push({
                            type: 'warning',
                            line: findLineNumber(content, 'useEffect'),
                            message: `useEffect has missing dependencies: ${[...new Set(missingDeps)].join(', ')}`,
                            code: 'REACT_HOOK_DEPS'
                        });
                        warningCount++;
                    }
                }
            }

            // Inline Style Objects
            if (content.includes('style={{')) {
                suggestions.push({
                    type: 'performance',
                    message: 'Inline style object detected. This causes re-renders on every update.',
                    autoFix: true,
                    fixCode: 'Extract styles to a constant outside the component',
                    impact: 'medium'
                });
            }

            // Missing React Import (legacy React)
            if (content.includes('import React') === false && content.includes('JSX')) {
                // Actually modern React doesn't need it, but some environments do
            }
        }

        // JavaScript/TypeScript Logic

        // Unused variables (Improved check)
        const variableDecls = content.match(/(?:const|let|var)\s+([a-z]\w*)\s*=/gi) || [];
        variableDecls.forEach(decl => {
            const varName = decl.match(/(?:const|let|var)\s+([a-z]\w*)/i)[1];
            if (!['props', 'state', 'index', 'item', 'key'].includes(varName)) {
                const usage = findActualUsage(varName);
                if (usage === 0) {
                    issues.push({
                        type: 'info',
                        line: findLineNumber(content, decl),
                        message: `Unused variable "${varName}" detected.`,
                        code: 'UNUSED_VAR'
                    });
                    suggestions.push({
                        type: 'optimization',
                        message: `Remove unused variable: ${varName}`,
                        autoFix: true,
                        fixCode: `Delete declaration of ${varName}`,
                        impact: 'low'
                    });
                }
            }
        });

        // 2. GENERAL CLEAN CODE CHECKS

        // console.log
        if (content.includes('console.log')) {
            issues.push({
                type: 'warning',
                line: findLineNumber(content, 'console.log'),
                message: 'Production code should not contain console.log()',
                code: 'PRODUCTION_LOG'
            });
            warningCount++;
            suggestions.push({
                type: 'cleanup',
                message: 'Remove all debug logs',
                autoFix: true,
                fixCode: 'Remove console.logs',
                impact: 'low'
            });
        }

        // Long Functions
        const totalLines = lines.length;
        if (totalLines > 300) {
            suggestions.push({
                type: 'maintainability',
                message: `File is too large (${totalLines} lines). Component should be refactored into smaller sub-modules.`,
                autoFix: false,
                impact: 'high'
            });
        }

        // Deep Nesting (Improved)
        let maxDepth = 0;
        lines.forEach(line => {
            const indent = line.match(/^\s*/)[0].length;
            maxDepth = Math.max(maxDepth, Math.floor(indent / 2));
        });
        if (maxDepth > 5) {
            suggestions.push({
                type: 'complexity',
                message: `Deep indentation level detected (${maxDepth}). Consider early exit patterns or extracting logic into helper functions.`,
                autoFix: false,
                impact: 'medium'
            });
        }

        // Magic Numbers
        const magicNumbers = content.match(/\b(?!0|1|2|10|100|1000)\d{2,}\b/g) || [];
        if (magicNumbers.length > 3) {
            suggestions.push({
                type: 'readability',
                message: 'Magic numbers detected. Use named constants for better intent expression.',
                autoFix: true,
                fixCode: 'const MAX_RETRY_COUNT = 5;',
                impact: 'medium'
            });
        }

        // Copy-Paste / Duplication
        const uniqueLines = new Set();
        let duplicates = 0;
        lines.forEach(l => {
            const t = l.trim();
            if (t.length > 30) {
                if (uniqueLines.has(t)) duplicates++;
                else uniqueLines.add(t);
            }
        });
        if (duplicates > 2) {
            suggestions.push({
                type: 'refactor',
                message: 'Duplicate logic detected. Abstract repetitive code into shared utility functions.',
                autoFix: false,
                impact: 'high'
            });
        }

        // Calculate Quality Score
        const score = Math.max(0, 100 - (errorCount * 15 + warningCount * 5 + (issues.length - errorCount - warningCount) * 2));

        return {
            fileName,
            fileType,
            lines: lines.length,
            size: content.length,
            issues,
            suggestions: [...new Set(suggestions.map(s => JSON.stringify(s)))].map(s => JSON.parse(s)), // Deduplicate
            errorCount,
            warningCount,
            qualityScore: Math.round(score),
            content: content.substring(0, 1000)
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
                        accept=".js,.jsx,.ts,.tsx,.css,.html,.json,.zip,.py,.php,.sol,.vy,.vue"
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

                    <h3>Comprehensive Multi-Technology Analysis</h3>
                    <p>Upload individual files or a ZIP project. We support Python, Blockchain (Solidity), PHP, React, Vue, Three.js, JQuery, and more!</p>
                    <div className="supported-formats mt-md">
                        <div className="format-group">
                            <span className="badge badge-info">.js</span>
                            <span className="badge badge-info">.jsx</span>
                            <span className="badge badge-info">.ts</span>
                            <span className="badge badge-info">.tsx</span>
                            <span className="badge badge-warning">Next.js</span>
                            <span className="badge badge-warning">React</span>
                        </div>
                        <div className="format-group mt-sm">
                            <span className="badge badge-success">.py</span>
                            <span className="badge badge-success">Python</span>
                            <span className="badge badge-info">.php</span>
                            <span className="badge badge-info">PHP</span>
                            <span className="badge badge-error">.sol</span>
                            <span className="badge badge-error">Blockchain</span>
                        </div>
                        <div className="format-group mt-sm">
                            <span className="badge badge-warning">.vue</span>
                            <span className="badge badge-warning">Vue.js</span>
                            <span className="badge badge-info">Three.js</span>
                            <span className="badge badge-info">JQuery</span>
                        </div>
                        <div className="format-group mt-sm">
                            <span className="badge badge-info">.css</span>
                            <span className="badge badge-info">.html</span>
                            <span className="badge badge-success">.zip</span>
                        </div>
                    </div>

                    <button className="btn btn-primary mt-md" onClick={onButtonClick}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4V20M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Upload File
                    </button>

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
                                    <div className="file-icon">
                                        {file.name.endsWith('.py') ? '🐍' :
                                            file.name.endsWith('.php') ? '🐘' :
                                                file.name.endsWith('.sol') ? '⛓️' :
                                                    file.name.endsWith('.vue') ? '🖖' :
                                                        file.name.endsWith('.css') ? '🎨' :
                                                            file.name.endsWith('.html') ? '🌐' : '📄'}
                                    </div>
                                    <div className="file-item-details">
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
                        <p>We are performing deep code analysis on your files</p>
                        <div className="analyzing-steps">
                            <div className="step active">
                                <span className="step-icon">✓</span>
                                Reading files
                            </div>
                            <div className="step active">
                                <span className="step-icon">⟳</span>
                                Deep Analysis
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
