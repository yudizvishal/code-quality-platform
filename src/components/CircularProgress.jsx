import { useEffect, useState } from 'react';
import './CircularProgress.css';

const CircularProgress = ({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    label = '',
    color = 'primary'
}) => {
    const [progress, setProgress] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / max) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(value);
        }, 100);
        return () => clearTimeout(timer);
    }, [value]);

    const getColor = () => {
        if (color === 'primary') return 'var(--neon-blue)';
        if (color === 'success') return 'var(--success)';
        if (color === 'warning') return 'var(--warning)';
        if (color === 'error') return 'var(--error)';
        if (color === 'purple') return 'var(--neon-purple)';
        if (color === 'cyan') return 'var(--neon-cyan)';
        if (color === 'green') return 'var(--neon-green)';
        return color;
    };

    const getGradientId = () => {
        return `gradient-${color}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const gradientId = getGradientId();

    return (
        <div className="circular-progress" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="circular-progress-svg">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={getColor()} stopOpacity="1" />
                        <stop offset="100%" stopColor={getColor()} stopOpacity="0.6" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background Circle */}
                <circle
                    className="circular-progress-bg"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                />

                {/* Progress Circle */}
                <circle
                    className="circular-progress-bar"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    filter="url(#glow)"
                    style={{
                        transition: 'stroke-dashoffset 1s ease-in-out'
                    }}
                />
            </svg>

            <div className="circular-progress-content">
                <div className="circular-progress-value" style={{ color: getColor() }}>
                    {Math.round(value)}
                </div>
                {label && (
                    <div className="circular-progress-label">{label}</div>
                )}
            </div>
        </div>
    );
};

export default CircularProgress;
