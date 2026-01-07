/**
 * Code Improver Utility
 * Automatically applies fixes to code based on analysis suggestions
 */

export const improveCode = (fileName, originalCode, suggestions, issues) => {
    let improvedCode = originalCode;
    const appliedFixes = [];
    const skippedFixes = [];

    // Apply auto-fixable suggestions
    suggestions.forEach((suggestion, index) => {
        if (suggestion.autoFix) {
            const result = applyFix(improvedCode, suggestion, fileName);
            if (result.success) {
                improvedCode = result.code;
                appliedFixes.push({
                    type: suggestion.type,
                    message: suggestion.message,
                    fixCode: suggestion.fixCode
                });
            } else {
                skippedFixes.push({
                    type: suggestion.type,
                    message: suggestion.message,
                    reason: result.reason
                });
            }
        }
    });

    // Calculate improvement metrics
    const metrics = calculateImprovementMetrics(originalCode, improvedCode);

    return {
        improvedCode,
        appliedFixes,
        skippedFixes,
        metrics,
        hasChanges: improvedCode !== originalCode
    };
};

const applyFix = (code, suggestion, fileName) => {
    try {
        let fixedCode = code;

        // Fix 1: Remove console.log statements
        if (suggestion.fixCode && suggestion.fixCode.includes('console.log')) {
            fixedCode = removeConsoleLogs(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 2: Replace var with const/let
        if (suggestion.fixCode && suggestion.fixCode.includes('var with const/let')) {
            fixedCode = replaceVarWithConstLet(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 3: Add missing semicolons
        if (suggestion.type === 'syntax' && suggestion.message.includes('semicolon')) {
            fixedCode = addMissingSemicolons(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 4: Remove trailing whitespace
        if (suggestion.type === 'formatting') {
            fixedCode = removeTrailingWhitespace(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 5: Fix indentation
        if (suggestion.message && suggestion.message.includes('indentation')) {
            fixedCode = fixIndentation(fixedCode, fileName);
            return { success: true, code: fixedCode };
        }

        // Fix 6: Remove unused imports
        if (suggestion.message && (suggestion.message.includes('unused import') || suggestion.message.includes('Unused import'))) {
            fixedCode = removeUnusedImports(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 7: Add missing key props in React lists
        if (suggestion.message && suggestion.message.includes('key')) {
            fixedCode = addMissingKeys(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 8: Add viewport meta tag for HTML
        if (suggestion.fixCode && suggestion.fixCode.includes('viewport meta tag')) {
            fixedCode = addViewportMetaTag(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 9: Remove commented out code
        if (suggestion.message && suggestion.message.includes('Commented out code')) {
            fixedCode = removeCommentedCode(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 10: Add alt attributes to images
        if ((suggestion.message && (suggestion.message.includes('alt') || suggestion.message.includes('Image missing'))) ||
            (suggestion.fixCode && suggestion.fixCode.includes('alt'))) {
            fixedCode = addAltAttributes(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 11: Replace deprecated HTML tags
        if ((suggestion.message && suggestion.message.includes('Deprecated')) ||
            (suggestion.fixCode && suggestion.fixCode.includes('deprecated'))) {
            fixedCode = replaceDeprecatedTags(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 12: Add DOCTYPE to HTML
        if ((suggestion.message && suggestion.message.includes('DOCTYPE')) ||
            (suggestion.fixCode && suggestion.fixCode.includes('DOCTYPE'))) {
            fixedCode = addDoctype(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 13: Fix inline styles (move to CSS)
        if ((suggestion.message && suggestion.message.includes('Inline styles')) ||
            (suggestion.fixCode && suggestion.fixCode.includes('inline styles'))) {
            fixedCode = extractInlineStyles(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 14: Simplify nested loops
        if ((suggestion.message && suggestion.message.includes('Nested loops')) ||
            (suggestion.fixCode && suggestion.fixCode.includes('nested loops'))) {
            fixedCode = optimizeNestedLoops(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 15: Extract magic numbers to constants
        if ((suggestion.message && suggestion.message.includes('Magic numbers')) ||
            (suggestion.fixCode && suggestion.fixCode.includes('magic numbers'))) {
            fixedCode = extractMagicNumbers(fixedCode);
            return { success: true, code: fixedCode };
        }

        // Fix 16: Add missing React import
        if ((suggestion.message && suggestion.message.includes('Missing React import')) ||
            (suggestion.fixCode && suggestion.fixCode.includes('React import'))) {
            fixedCode = addReactImport(fixedCode);
            return { success: true, code: fixedCode };
        }

        return { success: false, code, reason: 'No applicable fix found' };
    } catch (error) {
        return { success: false, code, reason: error.message };
    }
};

// Helper function to remove console.log statements
const removeConsoleLogs = (code) => {
    // Remove console.log, console.warn, console.error, etc.
    return code
        .replace(/console\.(log|warn|error|info|debug)\([^)]*\);?\s*/g, '')
        .replace(/^\s*[\r\n]/gm, ''); // Remove empty lines left behind
};

// Helper function to replace var with const/let
const replaceVarWithConstLet = (code) => {
    const lines = code.split('\n');
    const improvedLines = lines.map(line => {
        // Check if line contains var declaration
        if (line.includes('var ')) {
            // Check if variable is reassigned (simple heuristic)
            const varName = line.match(/var\s+(\w+)/)?.[1];
            if (varName) {
                // If it has assignment operator after declaration, use let, otherwise const
                if (line.includes('=')) {
                    // Simple heuristic: if it looks like it might be reassigned, use let
                    return line.replace(/\bvar\b/, 'let');
                }
            }
            return line.replace(/\bvar\b/, 'const');
        }
        return line;
    });
    return improvedLines.join('\n');
};

// Helper function to add missing semicolons
const addMissingSemicolons = (code) => {
    const lines = code.split('\n');
    const improvedLines = lines.map(line => {
        const trimmed = line.trim();
        // Add semicolon to lines that should have them
        if (trimmed &&
            !trimmed.endsWith(';') &&
            !trimmed.endsWith('{') &&
            !trimmed.endsWith('}') &&
            !trimmed.endsWith(',') &&
            !trimmed.startsWith('//') &&
            !trimmed.startsWith('/*') &&
            !trimmed.startsWith('*') &&
            !trimmed.includes('import ') &&
            !trimmed.includes('export ') &&
            (trimmed.includes('return ') ||
                trimmed.includes('const ') ||
                trimmed.includes('let ') ||
                trimmed.includes('var '))
        ) {
            return line + ';';
        }
        return line;
    });
    return improvedLines.join('\n');
};

// Helper function to remove trailing whitespace
const removeTrailingWhitespace = (code) => {
    return code.split('\n').map(line => line.trimEnd()).join('\n');
};

// Helper function to fix indentation
const fixIndentation = (code, fileName) => {
    const lines = code.split('\n');
    let indentLevel = 0;
    const indentSize = 2; // 2 spaces
    const improvedLines = [];

    lines.forEach(line => {
        const trimmed = line.trim();

        // Decrease indent for closing braces
        if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        // Apply indentation
        if (trimmed) {
            improvedLines.push(' '.repeat(indentLevel * indentSize) + trimmed);
        } else {
            improvedLines.push('');
        }

        // Increase indent for opening braces
        if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
            indentLevel++;
        }
    });

    return improvedLines.join('\n');
};

// Helper function to remove unused imports (basic)
const removeUnusedImports = (code) => {
    const lines = code.split('\n');
    const importLines = [];
    const codeLines = [];

    // Separate imports from code
    lines.forEach(line => {
        if (line.trim().startsWith('import ')) {
            importLines.push(line);
        } else {
            codeLines.push(line);
        }
    });

    const codeBody = codeLines.join('\n');
    const usedImports = importLines.filter(importLine => {
        // Extract imported names
        const match = importLine.match(/import\s+(?:{([^}]+)}|(\w+))/);
        if (match) {
            const imports = match[1] ? match[1].split(',').map(i => i.trim()) : [match[2]];
            // Check if any imported name is used in code
            return imports.some(imp => {
                const cleanImp = imp.split(' as ')[0].trim();
                return codeBody.includes(cleanImp);
            });
        }
        return true; // Keep import if we can't parse it
    });

    return [...usedImports, '', ...codeLines].join('\n');
};

// Helper function to add missing keys in React lists
const addMissingKeys = (code) => {
    // This is a simple implementation - in production, you'd want more sophisticated parsing
    return code.replace(
        /\.map\(\s*\(([^)]+)\)\s*=>\s*<(\w+)(?!\s+key=)/g,
        (match, params, tag) => {
            const paramName = params.split(',')[1]?.trim() || 'index';
            return match.replace(`<${tag}`, `<${tag} key={${paramName}}`);
        }
    );
};

// Helper function to add viewport meta tag
const addViewportMetaTag = (code) => {
    const viewportTag = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';

    // Try to add after charset meta or in head
    if (code.includes('<head>')) {
        return code.replace(
            /<head>/i,
            `<head>\n    ${viewportTag}`
        );
    } else if (code.includes('</head>')) {
        return code.replace(
            /<\/head>/i,
            `    ${viewportTag}\n</head>`
        );
    }
    return code;
};

// Helper function to remove commented out code
const removeCommentedCode = (code) => {
    const lines = code.split('\n');
    const cleanedLines = lines.filter(line => {
        const trimmed = line.trim();
        // Remove lines that are commented and contain code patterns
        if (trimmed.startsWith('//')) {
            return !(
                trimmed.includes('function') ||
                trimmed.includes('const ') ||
                trimmed.includes('let ') ||
                trimmed.includes('var ') ||
                trimmed.includes('=') ||
                trimmed.includes('return')
            );
        }
        return true;
    });
    return cleanedLines.join('\n');
};

// Helper function to add alt attributes to images
const addAltAttributes = (code) => {
    return code.replace(
        /<img\s+([^>]*?)(?<!alt=["'][^"']*["'])>/gi,
        (match, attrs) => {
            if (match.includes('alt=')) {
                return match;
            }
            // Extract src to create meaningful alt text
            const srcMatch = attrs.match(/src=["']([^"']+)["']/);
            const fileName = srcMatch ? srcMatch[1].split('/').pop().split('.')[0] : 'image';
            const altText = fileName.replace(/[-_]/g, ' ');
            return `<img ${attrs} alt="${altText}">`;
        }
    );
};

// Helper function to replace deprecated HTML tags
const replaceDeprecatedTags = (code) => {
    let fixedCode = code;

    // Replace <center> with div + CSS
    fixedCode = fixedCode.replace(
        /<center>([\s\S]*?)<\/center>/gi,
        '<div style="text-align: center;">$1</div>'
    );

    // Replace <font> with span + CSS
    fixedCode = fixedCode.replace(
        /<font\s+([^>]*)>([\s\S]*?)<\/font>/gi,
        (match, attrs, content) => {
            let style = '';
            const colorMatch = attrs.match(/color=["']([^"']+)["']/);
            const sizeMatch = attrs.match(/size=["']([^"']+)["']/);

            if (colorMatch) style += `color: ${colorMatch[1]};`;
            if (sizeMatch) style += ` font-size: ${sizeMatch[1]};`;

            return `<span style="${style}">${content}</span>`;
        }
    );

    // Remove <marquee>, <blink>
    fixedCode = fixedCode.replace(/<marquee[^>]*>([\s\S]*?)<\/marquee>/gi, '$1');
    fixedCode = fixedCode.replace(/<blink[^>]*>([\s\S]*?)<\/blink>/gi, '$1');

    return fixedCode;
};

// Helper function to add DOCTYPE
const addDoctype = (code) => {
    const trimmed = code.trim();
    if (!trimmed.toLowerCase().startsWith('<!doctype')) {
        return '<!DOCTYPE html>\n' + code;
    }
    return code;
};

// Helper function to extract inline styles (basic implementation)
const extractInlineStyles = (code) => {
    const styles = new Map();
    let counter = 0;

    // Extract inline styles and replace with class names
    const fixedCode = code.replace(
        /style=\{\{([^}]+)\}\}/g,
        (match, styleContent) => {
            const className = `extracted-style-${counter++}`;
            styles.set(className, styleContent);
            return `className="${className}"`;
        }
    );

    // If styles were extracted, add a comment with CSS
    if (styles.size > 0) {
        let cssComment = '\n/* Extracted styles - move to CSS file:\n';
        styles.forEach((style, className) => {
            cssComment += `.${className} { ${style} }\n`;
        });
        cssComment += '*/\n';
        return cssComment + fixedCode;
    }

    return fixedCode;
};

// Helper function to optimize nested loops (add comment suggestion)
const optimizeNestedLoops = (code) => {
    // Add a comment above nested loops suggesting optimization
    return code.replace(
        /(for\s*\([^)]*\)[^{]*\{[^}]*)(for\s*\([^)]*\))/g,
        '$1// TODO: Consider optimizing this nested loop with Map/Set or single-pass algorithm\n        $2'
    );
};

// Helper function to extract magic numbers
const extractMagicNumbers = (code) => {
    const magicNumbers = new Set();
    const numberPattern = /\b(\d{2,})\b/g;
    let match;

    // Find all magic numbers
    while ((match = numberPattern.exec(code)) !== null) {
        const num = match[1];
        // Skip common numbers like 0, 1, 2, 10, 100
        if (!['10', '100', '1000'].includes(num)) {
            magicNumbers.add(num);
        }
    }

    if (magicNumbers.size === 0) return code;

    // Add constants at the top
    let constants = '\n// Extracted constants (replace with meaningful names):\n';
    magicNumbers.forEach(num => {
        constants += `const CONSTANT_${num} = ${num};\n`;
    });
    constants += '\n';

    return constants + code;
};

// Helper function to add React import
const addReactImport = (code) => {
    const lines = code.split('\n');

    // Check if React import already exists
    if (code.includes('import React') || code.includes("import React")) {
        return code;
    }

    // Find the first import or add at the beginning
    const firstImportIndex = lines.findIndex(line => line.trim().startsWith('import '));

    if (firstImportIndex !== -1) {
        lines.splice(firstImportIndex, 0, "import React from 'react';");
    } else {
        lines.unshift("import React from 'react';");
    }

    return lines.join('\n');
};

// Calculate improvement metrics
const calculateImprovementMetrics = (originalCode, improvedCode) => {
    const originalLines = originalCode.split('\n');
    const improvedLines = improvedCode.split('\n');

    const originalSize = originalCode.length;
    const improvedSize = improvedCode.length;
    const sizeReduction = originalSize - improvedSize;
    const sizeReductionPercent = ((sizeReduction / originalSize) * 100).toFixed(2);

    // Count improvements
    const consolesRemoved = (originalCode.match(/console\./g) || []).length -
        (improvedCode.match(/console\./g) || []).length;
    const varsReplaced = (originalCode.match(/\bvar\b/g) || []).length -
        (improvedCode.match(/\bvar\b/g) || []).length;

    return {
        originalLines: originalLines.length,
        improvedLines: improvedLines.length,
        originalSize,
        improvedSize,
        sizeReduction,
        sizeReductionPercent,
        consolesRemoved,
        varsReplaced,
        linesChanged: originalLines.filter((line, i) => line !== improvedLines[i]).length
    };
};

// Generate a downloadable file
export const generateDownloadableFile = (fileName, code) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const improvedFileName = fileName.replace(/(\.[^.]+)$/, '.improved$1');

    return {
        url,
        fileName: improvedFileName,
        blob
    };
};

// Compare original and improved code side by side
export const generateCodeComparison = (originalCode, improvedCode) => {
    const originalLines = originalCode.split('\n');
    const improvedLines = improvedCode.split('\n');
    const maxLines = Math.max(originalLines.length, improvedLines.length);

    const comparison = [];
    for (let i = 0; i < maxLines; i++) {
        const original = originalLines[i] || '';
        const improved = improvedLines[i] || '';
        const isDifferent = original !== improved;

        comparison.push({
            lineNumber: i + 1,
            original,
            improved,
            isDifferent,
            changeType: !original ? 'added' : !improved ? 'removed' : isDifferent ? 'modified' : 'unchanged'
        });
    }

    return comparison;
};
