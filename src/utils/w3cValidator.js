/**
 * W3C Validator Utility
 * Validates HTML code against W3C standards
 */

export const validateHTML = (htmlCode) => {
    const validationResults = {
        isValid: true,
        errors: [],
        warnings: [],
        suggestions: [],
        score: 100
    };

    // Check 1: DOCTYPE declaration
    if (!htmlCode.trim().toLowerCase().startsWith('<!doctype')) {
        validationResults.errors.push({
            line: 1,
            type: 'error',
            category: 'Document Type',
            message: 'Missing DOCTYPE declaration',
            suggestion: 'Add <!DOCTYPE html> at the beginning of the document',
            fixCode: '<!DOCTYPE html>',
            autoFix: true
        });
        validationResults.isValid = false;
        validationResults.score -= 10;
    }

    // Check 2: HTML tag
    if (!/<html[^>]*>/i.test(htmlCode)) {
        validationResults.errors.push({
            line: getLineNumber(htmlCode, '<html'),
            type: 'error',
            category: 'Structure',
            message: 'Missing <html> tag',
            suggestion: 'Wrap your content in <html> tags',
            fixCode: '<html lang="en">...</html>',
            autoFix: false
        });
        validationResults.isValid = false;
        validationResults.score -= 10;
    }

    // Check 3: Lang attribute
    if (/<html[^>]*>/i.test(htmlCode) && !/<html[^>]*lang=/i.test(htmlCode)) {
        validationResults.warnings.push({
            line: getLineNumber(htmlCode, '<html'),
            type: 'warning',
            category: 'Accessibility',
            message: 'Missing lang attribute in <html> tag',
            suggestion: 'Add lang attribute for accessibility',
            fixCode: '<html lang="en">',
            autoFix: true
        });
        validationResults.score -= 5;
    }

    // Check 4: Head tag
    if (!/<head[^>]*>/i.test(htmlCode)) {
        validationResults.errors.push({
            line: getLineNumber(htmlCode, '<head'),
            type: 'error',
            category: 'Structure',
            message: 'Missing <head> tag',
            suggestion: 'Add <head> section to your HTML',
            fixCode: '<head>...</head>',
            autoFix: false
        });
        validationResults.isValid = false;
        validationResults.score -= 10;
    }

    // Check 5: Meta charset
    if (!/<meta[^>]*charset=/i.test(htmlCode)) {
        validationResults.errors.push({
            line: getLineNumber(htmlCode, '<head'),
            type: 'error',
            category: 'Encoding',
            message: 'Missing character encoding declaration',
            suggestion: 'Add <meta charset="UTF-8"> in <head>',
            fixCode: '<meta charset="UTF-8">',
            autoFix: true
        });
        validationResults.isValid = false;
        validationResults.score -= 10;
    }

    // Check 6: Title tag
    if (!/<title[^>]*>.*<\/title>/i.test(htmlCode)) {
        validationResults.errors.push({
            line: getLineNumber(htmlCode, '<head'),
            type: 'error',
            category: 'SEO',
            message: 'Missing <title> tag',
            suggestion: 'Add <title> tag in <head> section',
            fixCode: '<title>Page Title</title>',
            autoFix: true
        });
        validationResults.isValid = false;
        validationResults.score -= 10;
    }

    // Check 7: Viewport meta tag
    if (!/<meta[^>]*name=["']viewport["']/i.test(htmlCode)) {
        validationResults.warnings.push({
            line: getLineNumber(htmlCode, '<head'),
            type: 'warning',
            category: 'Responsive',
            message: 'Missing viewport meta tag',
            suggestion: 'Add viewport meta tag for responsive design',
            fixCode: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            autoFix: true
        });
        validationResults.score -= 5;
    }

    // Check 8: Body tag
    if (!/<body[^>]*>/i.test(htmlCode)) {
        validationResults.errors.push({
            line: getLineNumber(htmlCode, '<body'),
            type: 'error',
            category: 'Structure',
            message: 'Missing <body> tag',
            suggestion: 'Add <body> section to your HTML',
            fixCode: '<body>...</body>',
            autoFix: false
        });
        validationResults.isValid = false;
        validationResults.score -= 10;
    }

    // Check 9: Images without alt attributes
    const imgMatches = htmlCode.match(/<img[^>]*>/gi) || [];
    imgMatches.forEach(img => {
        if (!/alt=/i.test(img)) {
            validationResults.warnings.push({
                line: getLineNumber(htmlCode, img),
                type: 'warning',
                category: 'Accessibility',
                message: 'Image missing alt attribute',
                suggestion: 'Add alt attribute to all images for accessibility',
                fixCode: 'alt="descriptive text"',
                autoFix: true
            });
            validationResults.score -= 2;
        }
    });

    // Check 10: Deprecated tags
    const deprecatedTags = ['<center', '<font', '<marquee', '<blink', '<big', '<strike', '<tt'];
    deprecatedTags.forEach(tag => {
        if (htmlCode.toLowerCase().includes(tag)) {
            validationResults.errors.push({
                line: getLineNumber(htmlCode, tag),
                type: 'error',
                category: 'Deprecated',
                message: `Deprecated tag ${tag.replace('<', '')} found`,
                suggestion: 'Replace with modern HTML5 and CSS',
                fixCode: 'Use CSS for styling instead',
                autoFix: true
            });
            validationResults.isValid = false;
            validationResults.score -= 8;
        }
    });

    // Check 11: Inline styles
    const inlineStyleMatches = htmlCode.match(/style=["'][^"']*["']/gi) || [];
    if (inlineStyleMatches.length > 5) {
        validationResults.suggestions.push({
            line: 0,
            type: 'suggestion',
            category: 'Best Practice',
            message: `Found ${inlineStyleMatches.length} inline styles`,
            suggestion: 'Consider moving styles to external CSS file',
            fixCode: 'Extract to CSS file',
            autoFix: false
        });
        validationResults.score -= 3;
    }

    // Check 12: Proper heading hierarchy
    const headings = htmlCode.match(/<h[1-6][^>]*>/gi) || [];
    if (headings.length > 0) {
        const h1Count = (htmlCode.match(/<h1[^>]*>/gi) || []).length;
        if (h1Count === 0) {
            validationResults.warnings.push({
                line: 0,
                type: 'warning',
                category: 'SEO',
                message: 'No <h1> heading found',
                suggestion: 'Add a main <h1> heading for better SEO',
                fixCode: '<h1>Main Heading</h1>',
                autoFix: false
            });
            validationResults.score -= 5;
        } else if (h1Count > 1) {
            validationResults.warnings.push({
                line: 0,
                type: 'warning',
                category: 'SEO',
                message: `Multiple <h1> headings found (${h1Count})`,
                suggestion: 'Use only one <h1> per page',
                fixCode: 'Change additional <h1> to <h2> or lower',
                autoFix: false
            });
            validationResults.score -= 5;
        }
    }

    // Check 13: Unclosed tags
    const openTags = htmlCode.match(/<(\w+)[^>]*>/g) || [];
    const closeTags = htmlCode.match(/<\/(\w+)>/g) || [];
    const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];

    openTags.forEach(tag => {
        const tagName = tag.match(/<(\w+)/)[1].toLowerCase();
        if (!selfClosingTags.includes(tagName)) {
            const closeTag = `</${tagName}>`;
            const openCount = (htmlCode.match(new RegExp(`<${tagName}[^>]*>`, 'gi')) || []).length;
            const closeCount = (htmlCode.match(new RegExp(`</${tagName}>`, 'gi')) || []).length;

            if (openCount !== closeCount) {
                validationResults.errors.push({
                    line: getLineNumber(htmlCode, tag),
                    type: 'error',
                    category: 'Structure',
                    message: `Unclosed or mismatched <${tagName}> tag`,
                    suggestion: `Ensure all <${tagName}> tags are properly closed`,
                    fixCode: closeTag,
                    autoFix: false
                });
                validationResults.isValid = false;
                validationResults.score -= 8;
            }
        }
    });

    // Check 14: Form inputs without labels
    const inputMatches = htmlCode.match(/<input[^>]*>/gi) || [];
    inputMatches.forEach(input => {
        if (!/type=["']?(submit|button|hidden)["']?/i.test(input)) {
            const inputId = input.match(/id=["']([^"']+)["']/i);
            if (inputId) {
                const labelPattern = new RegExp(`<label[^>]*for=["']${inputId[1]}["']`, 'i');
                if (!labelPattern.test(htmlCode)) {
                    validationResults.warnings.push({
                        line: getLineNumber(htmlCode, input),
                        type: 'warning',
                        category: 'Accessibility',
                        message: 'Form input without associated label',
                        suggestion: 'Add <label> for better accessibility',
                        fixCode: `<label for="${inputId[1]}">Label Text</label>`,
                        autoFix: false
                    });
                    validationResults.score -= 3;
                }
            }
        }
    });

    // Check 15: Links without href or with empty href
    const linkMatches = htmlCode.match(/<a[^>]*>/gi) || [];
    linkMatches.forEach(link => {
        if (!/href=/i.test(link) || /href=["']#?["']/i.test(link)) {
            validationResults.warnings.push({
                line: getLineNumber(htmlCode, link),
                type: 'warning',
                category: 'Best Practice',
                message: 'Link without valid href attribute',
                suggestion: 'Add meaningful href to all links',
                fixCode: 'href="valid-url"',
                autoFix: false
            });
            validationResults.score -= 2;
        }
    });

    // Check 16: Trailing slash on void elements (Info)
    const voidPattern = /<(br|hr|img|input|meta|link)[^>]*\s*\/>/gi;
    let voidMatch;
    while ((voidMatch = voidPattern.exec(htmlCode)) !== null) {
        validationResults.suggestions.push({
            line: getLineNumber(htmlCode, voidMatch[0]),
            type: 'info',
            category: 'Info',
            message: 'Trailing slash on void elements has no effect',
            suggestion: 'Remove the trailing slash (/) as it has no effect in HTML5 and interacts badly with unquoted attribute values.',
            fixCode: voidMatch[0].replace('/>', '>'),
            autoFix: true
        });
        // Info messages don't necessarily deduct score, or maybe just a tiny bit
        validationResults.score -= 0;
    }

    // Ensure score doesn't go below 0
    validationResults.score = Math.max(0, validationResults.score);

    return validationResults;
};

// Helper function to get line number of a pattern in code
const getLineNumber = (code, pattern) => {
    const index = code.toLowerCase().indexOf(pattern.toLowerCase());
    if (index === -1) return 0;

    const beforePattern = code.substring(0, index);
    const lineNumber = (beforePattern.match(/\n/g) || []).length + 1;
    return lineNumber;
};

// Generate W3C validation report
export const generateW3CReport = (htmlCode, fileName) => {
    const validationResults = validateHTML(htmlCode);

    return {
        fileName,
        validator: 'W3C HTML Validator',
        timestamp: new Date().toISOString(),
        isValid: validationResults.isValid,
        score: validationResults.score,
        totalIssues: validationResults.errors.length + validationResults.warnings.length,
        errors: validationResults.errors,
        warnings: validationResults.warnings,
        suggestions: validationResults.suggestions,
        summary: {
            errorCount: validationResults.errors.length,
            warningCount: validationResults.warnings.length,
            suggestionCount: validationResults.suggestions.length,
            status: validationResults.isValid ? 'Valid' : 'Invalid',
            message: validationResults.isValid
                ? '✅ Your HTML is valid according to W3C standards!'
                : '❌ Your HTML has validation errors that need to be fixed.'
        }
    };
};
