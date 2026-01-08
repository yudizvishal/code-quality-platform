/**
 * Deep Code Analyzer
 * Advanced pattern recognition, syntax analysis, and semantic checking
 */

// 1. ADVANCED PATTERN RECOGNITION
export const advancedPatternRecognition = (content, fileName) => {
    const patterns = [];
    const antiPatterns = [];

    // Detect Design Patterns
    const designPatterns = detectDesignPatterns(content);
    patterns.push(...designPatterns);

    // Detect Anti-Patterns
    const detectedAntiPatterns = detectAntiPatterns(content);
    antiPatterns.push(...detectedAntiPatterns);

    return { patterns, antiPatterns };
};

// Design Pattern Detection
const detectDesignPatterns = (content) => {
    const patterns = [];

    // Singleton Pattern
    if (/class\s+\w+\s*{[\s\S]*?static\s+instance[\s\S]*?constructor\s*\(\s*\)\s*{[\s\S]*?if\s*\([\s\S]*?instance[\s\S]*?\)/i.test(content)) {
        patterns.push({
            type: 'design-pattern',
            name: 'Singleton Pattern',
            confidence: 'high',
            message: 'Singleton pattern detected - ensures only one instance exists'
        });
    }

    // Factory Pattern
    if (/function\s+create\w+|class\s+\w*Factory/i.test(content)) {
        patterns.push({
            type: 'design-pattern',
            name: 'Factory Pattern',
            confidence: 'medium',
            message: 'Factory pattern detected - centralizes object creation'
        });
    }

    // Observer Pattern (React hooks, event listeners)
    if (/useEffect|addEventListener|subscribe/i.test(content)) {
        patterns.push({
            type: 'design-pattern',
            name: 'Observer Pattern',
            confidence: 'medium',
            message: 'Observer pattern detected - reactive programming approach'
        });
    }

    // Module Pattern
    if (/export\s+(default\s+)?{|export\s+(const|function|class)/i.test(content)) {
        patterns.push({
            type: 'design-pattern',
            name: 'Module Pattern',
            confidence: 'high',
            message: 'Module pattern detected - proper encapsulation'
        });
    }

    return patterns;
};

// Anti-Pattern Detection
const detectAntiPatterns = (content) => {
    const antiPatterns = [];

    // God Object (too many responsibilities)
    const methodCount = (content.match(/\b(function|const\s+\w+\s*=\s*\()/g) || []).length;
    const classMatch = content.match(/class\s+(\w+)/);
    if (classMatch && methodCount > 15) {
        antiPatterns.push({
            type: 'anti-pattern',
            name: 'God Object',
            severity: 'high',
            message: `Class "${classMatch[1]}" has ${methodCount} methods. Consider splitting responsibilities`,
            line: findLineNumber(content, classMatch[0])
        });
    }

    // Callback Hell
    const callbackDepth = detectCallbackDepth(content);
    if (callbackDepth > 3) {
        antiPatterns.push({
            type: 'anti-pattern',
            name: 'Callback Hell',
            severity: 'high',
            message: `Deeply nested callbacks detected (depth: ${callbackDepth}). Use async/await or Promises`,
            line: 1
        });
    }

    // Spaghetti Code (excessive complexity)
    const cyclomaticComplexity = calculateCyclomaticComplexity(content);
    if (cyclomaticComplexity > 20) {
        antiPatterns.push({
            type: 'anti-pattern',
            name: 'Spaghetti Code',
            severity: 'high',
            message: `High cyclomatic complexity (${cyclomaticComplexity}). Refactor into smaller functions`,
            line: 1
        });
    }

    // Magic Strings
    const stringLiterals = content.match(/"[^"]{10,}"|'[^']{10,}'/g) || [];
    if (stringLiterals.length > 10) {
        antiPatterns.push({
            type: 'anti-pattern',
            name: 'Magic Strings',
            severity: 'medium',
            message: `${stringLiterals.length} magic strings found. Consider using constants`,
            line: 1
        });
    }

    // Copy-Paste Programming
    const duplicateBlocks = findDuplicateCodeBlocks(content);
    if (duplicateBlocks.length > 3) {
        antiPatterns.push({
            type: 'anti-pattern',
            name: 'Copy-Paste Programming',
            severity: 'medium',
            message: `${duplicateBlocks.length} duplicate code blocks found. Extract to reusable functions`,
            line: 1
        });
    }

    return antiPatterns;
};

// 2. SYNTAX AND SEMANTIC ANALYSIS
export const syntaxAndSemanticAnalysis = (content, fileName) => {
    const issues = [];
    const warnings = [];

    // Syntax Errors (basic checks - would use AST parser in production)
    const syntaxErrors = detectSyntaxErrors(content);
    issues.push(...syntaxErrors);

    // Semantic Analysis
    const semanticIssues = detectSemanticIssues(content);
    warnings.push(...semanticIssues);

    // Type Safety (for TypeScript/JSDoc)
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
        const typeIssues = analyzeTypeUsage(content);
        warnings.push(...typeIssues);
    }

    return { syntaxErrors: issues, semanticWarnings: warnings };
};

const detectSyntaxErrors = (content) => {
    const errors = [];

    // Unclosed brackets
    const openBrackets = (content.match(/{/g) || []).length;
    const closeBrackets = (content.match(/}/g) || []).length;
    if (openBrackets !== closeBrackets) {
        errors.push({
            type: 'syntax-error',
            severity: 'critical',
            message: `Mismatched curly braces: ${openBrackets} opening, ${closeBrackets} closing`,
            line: 1
        });
    }

    // Unclosed parentheses
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
        errors.push({
            type: 'syntax-error',
            severity: 'critical',
            message: `Mismatched parentheses: ${openParens} opening, ${closeParens} closing`,
            line: 1
        });
    }

    // Missing semicolons (for non-semicolon-free style)
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed &&
            !trimmed.endsWith(';') &&
            !trimmed.endsWith('{') &&
            !trimmed.endsWith('}') &&
            !trimmed.endsWith(',') &&
            !trimmed.startsWith('//') &&
            !trimmed.startsWith('/*') &&
            !trimmed.startsWith('*') &&
            /^(const|let|var|return|import|export)\s/.test(trimmed)) {
            // This is a soft warning, not a critical error
        }
    });

    return errors;
};

const detectSemanticIssues = (content) => {
    const issues = [];

    // Unused variables
    const variableDeclarations = content.match(/(?:const|let|var)\s+(\w+)/g) || [];
    variableDeclarations.forEach(decl => {
        const varName = decl.split(/\s+/)[1];
        const usageCount = (content.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length;
        if (usageCount === 1) { // Only declared, never used
            issues.push({
                type: 'semantic-warning',
                severity: 'low',
                message: `Variable "${varName}" is declared but never used`,
                line: findLineNumber(content, decl)
            });
        }
    });

    // Reassigning const
    const constReassignments = content.match(/const\s+(\w+)\s*=[\s\S]*?\1\s*=/g);
    if (constReassignments) {
        issues.push({
            type: 'semantic-error',
            severity: 'high',
            message: 'Attempting to reassign const variable',
            line: 1
        });
    }

    // Comparing with undefined/null using ==
    if (/==\s*(null|undefined)|(?:null|undefined)\s*==/g.test(content)) {
        issues.push({
            type: 'semantic-warning',
            severity: 'medium',
            message: 'Use === instead of == for null/undefined checks',
            line: findLineNumber(content, '==')
        });
    }

    return issues;
};

const analyzeTypeUsage = (content) => {
    const issues = [];

    // Missing type annotations
    const functionParams = content.match(/function\s+\w+\s*\(([^)]+)\)/g) || [];
    functionParams.forEach(func => {
        if (!func.includes(':')) {
            issues.push({
                type: 'type-safety',
                severity: 'medium',
                message: 'Function parameters missing type annotations',
                line: findLineNumber(content, func)
            });
        }
    });

    // Using 'any' type
    if (content.includes(': any')) {
        issues.push({
            type: 'type-safety',
            severity: 'low',
            message: 'Avoid using "any" type. Use specific types for better type safety',
            line: findLineNumber(content, ': any')
        });
    }

    return issues;
};

// 3. CROSS-FILE DEPENDENCY TRACKING
export const analyzeDependencies = (files) => {
    const dependencyGraph = {};
    const circularDependencies = [];
    const unusedImports = [];

    files.forEach(file => {
        const imports = extractImports(file.content);
        const exports = extractExports(file.content);

        dependencyGraph[file.fileName] = {
            imports,
            exports,
            dependencies: imports.map(imp => imp.from)
        };
    });

    // Detect circular dependencies
    Object.keys(dependencyGraph).forEach(fileName => {
        const circular = detectCircularDependency(fileName, dependencyGraph, []);
        if (circular.length > 0) {
            circularDependencies.push({
                type: 'circular-dependency',
                severity: 'high',
                files: circular,
                message: `Circular dependency detected: ${circular.join(' → ')}`
            });
        }
    });

    return {
        dependencyGraph,
        circularDependencies,
        unusedImports
    };
};

const extractImports = (content) => {
    const imports = [];
    const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
        imports.push({
            named: match[1] ? match[1].split(',').map(s => s.trim()) : [],
            default: match[2] || null,
            from: match[3]
        });
    }

    return imports;
};

const extractExports = (content) => {
    const exports = [];
    const exportRegex = /export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)/g;
    let match;

    while ((match = exportRegex.exec(content)) !== null) {
        exports.push(match[1]);
    }

    return exports;
};

const detectCircularDependency = (fileName, graph, visited) => {
    if (visited.includes(fileName)) {
        return [...visited, fileName];
    }

    const node = graph[fileName];
    if (!node) return [];

    const newVisited = [...visited, fileName];

    for (const dep of node.dependencies) {
        const circular = detectCircularDependency(dep, graph, newVisited);
        if (circular.length > 0) {
            return circular;
        }
    }

    return [];
};

// 4. REAL-TIME ERROR DETECTION
export const realTimeErrorDetection = (content, fileName) => {
    const errors = [];
    const warnings = [];

    // Runtime errors that can be detected statically
    const runtimeErrors = detectPotentialRuntimeErrors(content);
    errors.push(...runtimeErrors);

    // Performance issues
    const performanceIssues = detectPerformanceIssues(content);
    warnings.push(...performanceIssues);

    // Security vulnerabilities
    const securityIssues = detectSecurityVulnerabilities(content);
    errors.push(...securityIssues);

    return { errors, warnings };
};

const detectPotentialRuntimeErrors = (content) => {
    const errors = [];

    // Accessing properties of potentially undefined
    const unsafeAccess = content.match(/\w+\.\w+\.\w+/g) || [];
    if (unsafeAccess.length > 0) {
        errors.push({
            type: 'runtime-error',
            severity: 'medium',
            message: 'Potential "Cannot read property of undefined" error. Use optional chaining (?.)',
            line: findLineNumber(content, unsafeAccess[0])
        });
    }

    // Division by zero potential
    if (/\/\s*0\b/.test(content)) {
        errors.push({
            type: 'runtime-error',
            severity: 'high',
            message: 'Potential division by zero',
            line: findLineNumber(content, '/ 0')
        });
    }

    // Infinite loops
    if (/while\s*\(\s*true\s*\)(?![\s\S]*break)/.test(content)) {
        errors.push({
            type: 'runtime-error',
            severity: 'critical',
            message: 'Potential infinite loop detected (while(true) without break)',
            line: findLineNumber(content, 'while')
        });
    }

    return errors;
};

const detectPerformanceIssues = (content) => {
    const issues = [];

    // Inefficient array operations
    if (/\.forEach\([\s\S]*?\.push\(/.test(content)) {
        issues.push({
            type: 'performance',
            severity: 'medium',
            message: 'Use .map() instead of .forEach() with .push() for better performance',
            line: 1
        });
    }

    // Multiple DOM queries
    const domQueries = (content.match(/document\.querySelector|document\.getElementById/g) || []).length;
    if (domQueries > 5) {
        issues.push({
            type: 'performance',
            severity: 'medium',
            message: `${domQueries} DOM queries detected. Consider caching selectors`,
            line: 1
        });
    }

    // Synchronous operations in loops
    if (/for\s*\([^)]*\)[^{]*{[\s\S]*?(await|\.then\()/.test(content)) {
        issues.push({
            type: 'performance',
            severity: 'high',
            message: 'Async operations in loop. Use Promise.all() for parallel execution',
            line: 1
        });
    }

    return issues;
};

const detectSecurityVulnerabilities = (content) => {
    const vulnerabilities = [];

    // eval() usage
    if (/\beval\s*\(/.test(content)) {
        vulnerabilities.push({
            type: 'security',
            severity: 'critical',
            message: 'eval() usage detected - major security risk. Avoid at all costs',
            line: findLineNumber(content, 'eval(')
        });
    }

    // innerHTML usage
    if (/\.innerHTML\s*=/.test(content)) {
        vulnerabilities.push({
            type: 'security',
            severity: 'high',
            message: 'innerHTML assignment can lead to XSS attacks. Use textContent or sanitize input',
            line: findLineNumber(content, '.innerHTML')
        });
    }

    // Hardcoded credentials
    const credentialPatterns = [
        /password\s*=\s*['"][^'"]+['"]/i,
        /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
        /secret\s*=\s*['"][^'"]+['"]/i
    ];

    credentialPatterns.forEach(pattern => {
        if (pattern.test(content)) {
            vulnerabilities.push({
                type: 'security',
                severity: 'critical',
                message: 'Hardcoded credentials detected. Use environment variables',
                line: 1
            });
        }
    });

    // SQL injection potential
    if (/SELECT|INSERT|UPDATE|DELETE/.test(content) && /\+\s*['"]/.test(content)) {
        vulnerabilities.push({
            type: 'security',
            severity: 'critical',
            message: 'Potential SQL injection vulnerability. Use parameterized queries',
            line: 1
        });
    }

    return vulnerabilities;
};

// Helper Functions
const findLineNumber = (content, searchString) => {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(searchString)) {
            return i + 1;
        }
    }
    return 1;
};

const detectCallbackDepth = (content) => {
    let maxDepth = 0;
    let currentDepth = 0;

    for (let i = 0; i < content.length; i++) {
        if (content[i] === '(' && content.substring(i, i + 20).includes('=>')) {
            currentDepth++;
            maxDepth = Math.max(maxDepth, currentDepth);
        } else if (content[i] === ')') {
            currentDepth = Math.max(0, currentDepth - 1);
        }
    }

    return maxDepth;
};

const calculateCyclomaticComplexity = (content) => {
    const decisions = [
        /\bif\s*\(/g,
        /\belse\s+if\s*\(/g,
        /\bfor\s*\(/g,
        /\bwhile\s*\(/g,
        /\bcase\s+/g,
        /\?\s*[^:]+:/g, // ternary
        /&&/g,
        /\|\|/g
    ];

    let complexity = 1; // Base complexity

    decisions.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
            complexity += matches.length;
        }
    });

    return complexity;
};

const findDuplicateCodeBlocks = (content) => {
    const lines = content.split('\n').filter(line => line.trim().length > 20);
    const seen = new Map();
    const duplicates = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (seen.has(trimmed)) {
            duplicates.push({ line: trimmed, indices: [seen.get(trimmed), index] });
        } else {
            seen.set(trimmed, index);
        }
    });

    return duplicates;
};

// Main Deep Analysis Function
export const performDeepAnalysis = (content, fileName, allFiles = []) => {
    const results = {
        fileName,
        timestamp: new Date().toISOString(),
        patterns: [],
        antiPatterns: [],
        syntaxErrors: [],
        semanticWarnings: [],
        runtimeErrors: [],
        performanceWarnings: [],
        securityVulnerabilities: [],
        dependencies: null,
        overallScore: 100
    };

    // 1. Pattern Recognition
    const { patterns, antiPatterns } = advancedPatternRecognition(content, fileName);
    results.patterns = patterns;
    results.antiPatterns = antiPatterns;

    // 2. Syntax and Semantic Analysis
    const { syntaxErrors, semanticWarnings } = syntaxAndSemanticAnalysis(content, fileName);
    results.syntaxErrors = syntaxErrors;
    results.semanticWarnings = semanticWarnings;

    // 3. Real-time Error Detection
    const { errors, warnings } = realTimeErrorDetection(content, fileName);
    results.runtimeErrors = errors.filter(e => e.type === 'runtime-error');
    results.performanceWarnings = errors.filter(e => e.type === 'performance');
    results.securityVulnerabilities = errors.filter(e => e.type === 'security');

    // 4. Cross-file Dependencies (if multiple files provided)
    if (allFiles.length > 1) {
        const globalDependencies = analyzeDependencies(allFiles);

        // Filter circular dependencies specific to this file
        const relevantCircular = globalDependencies.circularDependencies.filter(
            item => item.files.includes(fileName)
        );

        results.dependencies = {
            ...globalDependencies,
            circularDependencies: relevantCircular
        };
    }

    // Calculate overall score
    results.overallScore = calculateOverallScore(results);

    return results;
};

const calculateOverallScore = (results) => {
    let score = 100;

    // Deduct for issues
    score -= results.syntaxErrors.length * 20;
    score -= results.antiPatterns.filter(ap => ap.severity === 'high').length * 15;
    score -= results.antiPatterns.filter(ap => ap.severity === 'medium').length * 10;
    score -= results.securityVulnerabilities.length * 25;
    score -= results.runtimeErrors.length * 15;
    score -= results.semanticWarnings.length * 5;
    score -= results.performanceWarnings.length * 10;

    // Add for good patterns
    score += results.patterns.length * 5;

    return Math.max(0, Math.min(100, score));
};
