import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';

describe('Header Component', () => {
    it('should render the logo and brand name', () => {
        render(<Header />);

        expect(screen.getByText('Quali Code')).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
        render(<Header />);

        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('How it Works')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should highlight the current page', () => {
        render(<Header currentPage="features" />);

        const featuresLink = screen.getByText('Features');
        expect(featuresLink).toHaveClass('active');
    });

    it('should call onNavigate when clicking navigation links', () => {
        const mockNavigate = vi.fn();
        render(<Header onNavigate={mockNavigate} />);

        const featuresLink = screen.getByText('Features');
        fireEvent.click(featuresLink);

        expect(mockNavigate).toHaveBeenCalledWith('features');
    });

    it('should call onNavigate when clicking logo', () => {
        const mockNavigate = vi.fn();
        render(<Header onNavigate={mockNavigate} />);

        const logo = screen.getByText('Quali Code');
        fireEvent.click(logo);

        expect(mockNavigate).toHaveBeenCalledWith('home');
    });



    it('should prevent default link behavior', () => {
        const mockNavigate = vi.fn();
        render(<Header onNavigate={mockNavigate} />);

        const featuresLink = screen.getByText('Features');
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

        fireEvent(featuresLink, event);

        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should render without onNavigate prop', () => {
        const { container } = render(<Header />);

        expect(container.querySelector('.header')).toBeInTheDocument();
    });
});
