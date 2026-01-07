import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
    it('should render the application', () => {
        render(<App />);

        expect(screen.getByText('CodeGuard')).toBeInTheDocument();
        expect(screen.getByText('Code Quality Platform')).toBeInTheDocument();
    });

    it('should render hero section on home page', () => {
        render(<App />);

        expect(screen.getByText('Code Quality Platform')).toBeInTheDocument();
        expect(screen.getByText(/Elevate your code/i)).toBeInTheDocument();
    });

    it('should render feature cards', () => {
        render(<App />);

        expect(screen.getByText('Deep Analysis')).toBeInTheDocument();
        expect(screen.getByText('Error Detection')).toBeInTheDocument();
        expect(screen.getByText('Optimization Tips')).toBeInTheDocument();
        expect(screen.getByText('Auto-Fix')).toBeInTheDocument();
    });

    it('should render FileUploader component', () => {
        const { container } = render(<App />);

        // FileUploader should be present in the DOM
        expect(container.querySelector('.file-uploader-container')).toBeInTheDocument();
    });

    it('should navigate to features page', () => {
        render(<App />);

        const featuresLinks = screen.getAllByText('Features');
        fireEvent.click(featuresLinks[0]);

        // Should no longer show home page content
        expect(screen.queryByText('Code Quality Platform')).not.toBeInTheDocument();
    });

    it('should navigate to how it works page', () => {
        render(<App />);

        const howItWorksLinks = screen.getAllByText('How it Works');
        fireEvent.click(howItWorksLinks[0]);

        // Should no longer show home page content
        expect(screen.queryByText('Code Quality Platform')).not.toBeInTheDocument();
    });

    it('should navigate to about page', () => {
        render(<App />);

        const aboutLinks = screen.getAllByText('About');
        fireEvent.click(aboutLinks[0]);

        // Should no longer show home page content
        expect(screen.queryByText('Code Quality Platform')).not.toBeInTheDocument();
    });

    it('should navigate back to home when clicking logo', () => {
        render(<App />);

        // Navigate away from home
        const featuresLinks = screen.getAllByText('Features');
        fireEvent.click(featuresLinks[0]);

        // Navigate back to home
        const logo = screen.getByText('CodeGuard');
        fireEvent.click(logo);

        // Should show home page content again
        expect(screen.getByText('Code Quality Platform')).toBeInTheDocument();
    });

    it('should scroll to top when navigating', () => {
        const scrollToSpy = vi.spyOn(window, 'scrollTo');
        render(<App />);

        const featuresLinks = screen.getAllByText('Features');
        fireEvent.click(featuresLinks[0]);

        expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
});
