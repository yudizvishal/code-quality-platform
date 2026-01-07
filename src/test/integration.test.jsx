import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('Integration Tests', () => {
    describe('Navigation Flow', () => {
        it('should navigate through all pages', async () => {
            render(<App />);

            // Start on home page
            expect(screen.getByText('Code Quality Platform')).toBeInTheDocument();

            // Navigate to Features
            const featuresLinks = screen.getAllByText('Features');
            fireEvent.click(featuresLinks[0]);
            await waitFor(() => {
                expect(screen.queryByText('Code Quality Platform')).not.toBeInTheDocument();
            });

            // Navigate to How it Works
            const howItWorksLinks = screen.getAllByText('How it Works');
            fireEvent.click(howItWorksLinks[0]);
            await waitFor(() => {
                expect(screen.queryByText('Code Quality Platform')).not.toBeInTheDocument();
            });

            // Navigate to About
            const aboutLinks = screen.getAllByText('About');
            fireEvent.click(aboutLinks[0]);
            await waitFor(() => {
                expect(screen.queryByText('Code Quality Platform')).not.toBeInTheDocument();
            });

            // Navigate back to Home
            const codeGuardLinks = screen.getAllByText('CodeGuard');
            fireEvent.click(codeGuardLinks[0]);
            await waitFor(() => {
                expect(screen.getByText('Code Quality Platform')).toBeInTheDocument();
            });
        });
    });

    describe('User Journey', () => {
        it('should show complete user flow from landing to analysis', () => {
            render(<App />);

            // User sees landing page
            expect(screen.getByText('Code Quality Platform')).toBeInTheDocument();
            expect(screen.getByText('Deep Analysis')).toBeInTheDocument();
            expect(screen.getByText('Error Detection')).toBeInTheDocument();

            // User sees file uploader
            expect(screen.getByText(/Drag and Drop/i)).toBeInTheDocument();
        });
    });

    describe('Responsive Behavior', () => {
        it('should render all essential elements', () => {
            render(<App />);

            // Header
            expect(screen.getByText('CodeGuard')).toBeInTheDocument();

            // Navigation
            expect(screen.getByText('Features')).toBeInTheDocument();
            expect(screen.getByText('How it Works')).toBeInTheDocument();
            expect(screen.getByText('About')).toBeInTheDocument();

            // Hero section
            expect(screen.getByText('Code Quality Platform')).toBeInTheDocument();

            // Feature cards
            expect(screen.getByText('Deep Analysis')).toBeInTheDocument();
            expect(screen.getByText('Error Detection')).toBeInTheDocument();
            expect(screen.getByText('Optimization Tips')).toBeInTheDocument();
            expect(screen.getByText('Auto-Fix')).toBeInTheDocument();
        });
    });

    describe('State Management', () => {
        it('should maintain state across navigation', () => {
            render(<App />);

            // Navigate away and back
            const featuresLinks = screen.getAllByText('Features');
            fireEvent.click(featuresLinks[0]);
            fireEvent.click(screen.getByText('CodeGuard'));

            // State should be preserved
            expect(screen.getByText('Code Quality Platform')).toBeInTheDocument();
        });
    });
});
