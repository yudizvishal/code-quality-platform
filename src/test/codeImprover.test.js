import { describe, it, expect } from 'vitest';
import { improveCode, generateDownloadableFile, generateCodeComparison } from '../utils/codeImprover';

describe('Code Improver Utility', () => {
    describe('improveCode', () => {
        it('should remove console.log statements', () => {
            const originalCode = `
function test() {
  console.log('debug');
  return true;
}`;
            const suggestions = [{
                type: 'best-practice',
                message: 'Remove console.log',
                fixCode: 'Remove console.log statements',
                autoFix: true
            }];

            const result = improveCode('test.js', originalCode, suggestions, []);

            expect(result.improvedCode).not.toContain('console.log');
            expect(result.hasChanges).toBe(true);
            expect(result.appliedFixes).toHaveLength(1);
        });

        it('should replace var with const/let', () => {
            const originalCode = `var x = 10;
var y = 20;`;
            const suggestions = [{
                type: 'best-practice',
                message: 'Replace var with const/let',
                fixCode: 'Replace var with const/let',
                autoFix: true
            }];

            const result = improveCode('test.js', originalCode, suggestions, []);

            expect(result.improvedCode).not.toContain('var ');
            expect(result.improvedCode).toContain('let ');
            expect(result.hasChanges).toBe(true);
        });

        it('should add missing semicolons', () => {
            const originalCode = `const x = 10
const y = 20`;
            const suggestions = [{
                type: 'syntax',
                message: 'Missing semicolon',
                autoFix: true
            }];

            const result = improveCode('test.js', originalCode, suggestions, []);

            expect(result.improvedCode).toContain('const x = 10;');
            expect(result.improvedCode).toContain('const y = 20;');
        });

        it('should remove trailing whitespace', () => {
            const originalCode = `const x = 10;   
const y = 20;  `;
            const suggestions = [{
                type: 'formatting',
                message: 'Remove trailing whitespace',
                autoFix: true
            }];

            const result = improveCode('test.js', originalCode, suggestions, []);

            expect(result.improvedCode).toBe('const x = 10;\nconst y = 20;');
        });

        it('should add viewport meta tag to HTML', () => {
            const originalCode = `<html>
<head>
</head>
<body></body>
</html>`;
            const suggestions = [{
                type: 'html',
                message: 'Add viewport meta tag',
                fixCode: 'Add viewport meta tag',
                autoFix: true
            }];

            const result = improveCode('test.html', originalCode, suggestions, []);

            expect(result.improvedCode).toContain('viewport');
            expect(result.improvedCode).toContain('width=device-width');
        });

        it('should add alt attributes to images', () => {
            const originalCode = '<img src="test.jpg">';
            const suggestions = [{
                type: 'accessibility',
                message: 'Image missing alt attribute',
                fixCode: 'Add alt attribute',
                autoFix: true
            }];

            const result = improveCode('test.html', originalCode, suggestions, []);

            expect(result.improvedCode).toContain('alt=');
        });

        it('should add DOCTYPE to HTML', () => {
            const originalCode = '<html><head></head><body></body></html>';
            const suggestions = [{
                type: 'html',
                message: 'Missing DOCTYPE',
                fixCode: 'Add DOCTYPE',
                autoFix: true
            }];

            const result = improveCode('test.html', originalCode, suggestions, []);

            expect(result.improvedCode).toContain('<!DOCTYPE html>');
        });

        it('should replace deprecated HTML tags', () => {
            const originalCode = '<center>Hello World</center>';
            const suggestions = [{
                type: 'html',
                message: 'Deprecated tag',
                fixCode: 'Replace deprecated tags',
                autoFix: true
            }];

            const result = improveCode('test.html', originalCode, suggestions, []);

            expect(result.improvedCode).not.toContain('<center>');
            expect(result.improvedCode).toContain('text-align: center');
        });

        it('should handle code with no applicable fixes', () => {
            const originalCode = 'const x = 10;';
            const suggestions = [{
                type: 'unknown',
                message: 'Some unknown issue',
                autoFix: true
            }];

            const result = improveCode('test.js', originalCode, suggestions, []);

            expect(result.hasChanges).toBe(false);
            expect(result.skippedFixes).toHaveLength(1);
        });

        it('should calculate improvement metrics correctly', () => {
            const originalCode = `console.log('test');
var x = 10;`;
            const suggestions = [
                {
                    type: 'best-practice',
                    message: 'Remove console.log',
                    fixCode: 'Remove console.log statements',
                    autoFix: true
                },
                {
                    type: 'best-practice',
                    message: 'Replace var',
                    fixCode: 'Replace var with const/let',
                    autoFix: true
                }
            ];

            const result = improveCode('test.js', originalCode, suggestions, []);

            expect(result.metrics).toBeDefined();
            expect(result.metrics.consolesRemoved).toBeGreaterThan(0);
            expect(result.metrics.varsReplaced).toBeGreaterThan(0);
        });
    });

    describe('generateDownloadableFile', () => {
        it('should generate downloadable file with correct name', () => {
            const fileName = 'test.js';
            const code = 'const x = 10;';

            const result = generateDownloadableFile(fileName, code);

            expect(result.fileName).toBe('test.improved.js');
            expect(result.url).toContain('blob:');
            expect(result.blob).toBeInstanceOf(Blob);
        });

        it('should handle files with multiple extensions', () => {
            const fileName = 'test.component.jsx';
            const code = 'const x = 10;';

            const result = generateDownloadableFile(fileName, code);

            expect(result.fileName).toBe('test.component.improved.jsx');
        });
    });

    describe('generateCodeComparison', () => {
        it('should generate comparison for identical code', () => {
            const code = 'const x = 10;';

            const result = generateCodeComparison(code, code);

            expect(result).toHaveLength(1);
            expect(result[0].isDifferent).toBe(false);
            expect(result[0].changeType).toBe('unchanged');
        });

        it('should detect modified lines', () => {
            const original = 'const x = 10;';
            const improved = 'const x = 20;';

            const result = generateCodeComparison(original, improved);

            expect(result).toHaveLength(1);
            expect(result[0].isDifferent).toBe(true);
            expect(result[0].changeType).toBe('modified');
        });

        it('should detect added lines', () => {
            const original = 'const x = 10;';
            const improved = 'const x = 10;\nconst y = 20;';

            const result = generateCodeComparison(original, improved);

            expect(result).toHaveLength(2);
            expect(result[1].changeType).toBe('added');
        });

        it('should detect removed lines', () => {
            const original = 'const x = 10;\nconst y = 20;';
            const improved = 'const x = 10;';

            const result = generateCodeComparison(original, improved);

            expect(result).toHaveLength(2);
            expect(result[1].changeType).toBe('removed');
        });

        it('should include line numbers', () => {
            const original = 'line1\nline2\nline3';
            const improved = 'line1\nline2\nline3';

            const result = generateCodeComparison(original, improved);

            expect(result[0].lineNumber).toBe(1);
            expect(result[1].lineNumber).toBe(2);
            expect(result[2].lineNumber).toBe(3);
        });
    });
});
