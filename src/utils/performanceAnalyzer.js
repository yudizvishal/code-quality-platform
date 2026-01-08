
/**
 * Analyzes code content for performance issues and functionality.
 * Simulates a Page Speed analysis (GTmetrix/Lighthouse style).
 */

export const analyzePerformance = (content, fileName) => {
    const issues = [];
    let mobileScore = 98; // Start high, penalize
    let desktopScore = 99; // Start high, penalize
    
    // Helper to add issue
    const addIssue = (impact, title, description) => {
        issues.push({ impact, title, description });
        // Impact: 'high', 'medium', 'low'
        if (impact === 'high') {
            mobileScore -= 10;
            desktopScore -= 5;
        } else if (impact === 'medium') {
            mobileScore -= 5;
            desktopScore -= 2;
        } else {
            mobileScore -= 2;
            desktopScore -= 1;
        }
    };

    // 1. Check for render-blocking resources (Scripts in head)
    if (content.match(/<head>[\s\S]*?<script/i) && !content.match(/defer|async/i)) {
        addIssue('high', 'Eliminate render-blocking resources', 'Scripts in <head> without `defer` or `async` block the first paint. Move them to the end of <body> or use `defer`.');
    }

    // 2. Check for large inline styles
    if (content.length > 5000 && content.match(/style="/g) && content.match(/style="/g).length > 20) {
        addIssue('medium', 'Reduce inline styles', 'Too many inline styles increase HTML size. Move styles to external CSS files.');
    }

    // 3. Image optimization (missing width/height)
    if (content.match(/<img/g) && !content.match(/width="|height="/g)) {
        addIssue('high', 'Image elements do not have explicit width and height', 'Set explicit width and height on image elements to reduce layout shifts (CLS).');
    }

    // 4. Check for viewport meta tag
    if (fileName.endsWith('.html') || fileName.endsWith('.jsx')) {
        if (!content.includes('<meta name="viewport"')) {
             addIssue('high', 'Missing viewport meta tag', 'The page is not optimized for mobile devices. Add a viewport meta tag.');
             mobileScore -= 20; // Heavy penalty for mobile
        }
    }

    // 5. Check for alt text on images
    if (content.match(/<img/g) && !content.match(/alt="/g)) {
        addIssue('medium', 'Image elements missing alt attributes', 'Missing alt attributes hurt accessibility and SEO.');
    }

     // 6. Check for too many DOM nodes (rough estimate based on tags)
     const tagCount = (content.match(/<[a-z]+/gi) || []).length;
     if (tagCount > 1500) {
         addIssue('medium', 'Avoid an excessive DOM size', `Found ~${tagCount} DOM elements. Large DOMs increase memory usage and style calculations.`);
     }

     // 7. Check for lazy loading images
     if (content.match(/<img/g) && !content.match(/loading="lazy"/g)) {
        addIssue('low', 'Defer offscreen images', 'Consider using loading="lazy" for offscreen images to improve initial load time.');
    }

    // Normalize scores
    mobileScore = Math.max(0, Math.min(100, Math.round(mobileScore)));
    desktopScore = Math.max(0, Math.min(100, Math.round(desktopScore)));

    // Generate web vitals (simulated based on score)
    const getMetric = (goodRange, badRange, score) => {
        const factor = (100 - score) / 100; // 0 (good) to 1 (bad)
        const val = goodRange + (badRange - goodRange) * factor;
        return val.toFixed(2);
    };

    const metrics = {
        lcp: getMetric(0.8, 4.5, desktopScore) + 's', // Largest Contentful Paint
        tbt: Math.round(getMetric(10, 600, desktopScore)) + 'ms', // Total Blocking Time
        cls: getMetric(0, 0.5, desktopScore), // Cumulative Layout Shift
        speedIndex: getMetric(0.5, 3.5, desktopScore) + 's',
    };

    return {
        mobileScore,
        desktopScore,
        metrics,
        issues,
        timestamp: new Date().toLocaleString()
    };
};
