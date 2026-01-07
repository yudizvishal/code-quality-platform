import { describe, it, expect } from 'vitest';
import { validateHTML, generateW3CReport } from '../utils/w3cValidator';

describe('W3C Validator Utility', () => {
    describe('validateHTML', () => {
        it('should validate perfect HTML correctly', () => {
            const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a valid paragraph.</p>
</body>
</html>`;
            const result = validateHTML(html);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.score).toBe(100);
        });

        it('should detect missing DOCTYPE', () => {
            const html = `<html><body><h1>Hello</h1></body></html>`;
            const result = validateHTML(html);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.message.includes('Missing DOCTYPE'))).toBe(true);
        });

        it('should detect missing html tag', () => {
            const html = `<!DOCTYPE html><body><h1>Hello</h1></body>`;
            const result = validateHTML(html);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.message.includes('Missing <html> tag'))).toBe(true);
        });

        it('should detect missing lang attribute', () => {
            const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test</title>
</head>
<body></body>
</html>`;
            const result = validateHTML(html);
            expect(result.warnings.some(w => w.message.includes('Missing lang attribute'))).toBe(true);
        });

        it('should detect missing head tag', () => {
            const html = `<!DOCTYPE html><html lang="en"><body><h1>Hello</h1></body></html>`;
            const result = validateHTML(html);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.message.includes('Missing <head> tag'))).toBe(true);
        });

        it('should detect missing charset', () => {
            const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Test</title>
</head>
<body></body>
</html>`;
            const result = validateHTML(html);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.message.includes('Missing character encoding'))).toBe(true);
        });

        it('should detect missing title', () => {
            const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body></body>
</html>`;
            const result = validateHTML(html);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.message.includes('Missing <title> tag'))).toBe(true);
        });

        it('should detect missing viewport meta tag', () => {
            const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test</title>
</head>
<body></body>
</html>`;
            const result = validateHTML(html);
            expect(result.warnings.some(w => w.message.includes('Missing viewport meta tag'))).toBe(true);
        });

        it('should detect missing body tag', () => {
            const html = `<!DOCTYPE html><html lang="en"><head><title>Test</title></head></html>`;
            const result = validateHTML(html);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.message.includes('Missing <body> tag'))).toBe(true);
        });

        it('should detect images without alt attributes', () => {
            const html = `<img src="test.jpg">`;
            const result = validateHTML(html);
            expect(result.warnings.some(w => w.message.includes('Image missing alt attribute'))).toBe(true);
        });

        it('should detect deprecated tags', () => {
            const html = `<center>Hello</center>`;
            const result = validateHTML(html);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.message.includes('Deprecated tag center'))).toBe(true);
        });

        it('should detect inline styles', () => {
            const html = `
                <div style="color: red">1</div>
                <div style="color: blue">2</div>
                <div style="color: green">3</div>
                <div style="color: yellow">4</div>
                <div style="color: black">5</div>
                <div style="color: white">6</div>
            `;
            const result = validateHTML(html);
            expect(result.suggestions.some(s => s.message.includes('inline styles'))).toBe(true);
        });

        it('should detect missing h1', () => {
            const html = `<h2>Subheading</h2>`;
            const result = validateHTML(html);
            expect(result.warnings.some(w => w.message.includes('No <h1> heading found'))).toBe(true);
        });

        it('should detect multiple h1 headings', () => {
            const html = `<h1>Title 1</h1><h1>Title 2</h1>`;
            const result = validateHTML(html);
            expect(result.warnings.some(w => w.message.includes('Multiple <h1> headings'))).toBe(true);
        });

        it('should detect unclosed tags', () => {
            const html = `<div><p>Unclosed div`;
            const result = validateHTML(html);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.message.includes('Unclosed or mismatched'))).toBe(true);
        });

        it('should detect inputs without labels', () => {
            const html = `<input type="text" id="name">`;
            const result = validateHTML(html);
            expect(result.warnings.some(w => w.message.includes('Form input without associated label'))).toBe(true);
        });

        it('should detect empty href links', () => {
            const html = `<a href="#">Link</a>`;
            const result = validateHTML(html);
            expect(result.warnings.some(w => w.message.includes('Link without valid href'))).toBe(true);
        });
    });

    describe('generateW3CReport', () => {
        it('should generate full report', () => {
            const html = `<!DOCTYPE html><html lang="en"><head><title>Test</title></head><body></body></html>`;
            const report = generateW3CReport(html, 'test.html');

            expect(report.fileName).toBe('test.html');
            expect(report.validator).toBe('W3C HTML Validator');
            expect(report.timestamp).toBeDefined();
            expect(report.isValid).toBeDefined();
            expect(report.score).toBeDefined();
            expect(report.summary).toBeDefined();
        });
    });
});
