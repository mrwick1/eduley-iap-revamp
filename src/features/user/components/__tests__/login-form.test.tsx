import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../login-form';
import { useLogin } from '@/lib/auth';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

// Mock the dependencies
vi.mock('@/lib/auth', () => ({
    useLogin: vi.fn(),
}));

vi.mock('sonner', () => ({
    toast: {
        promise: vi.fn(),
    },
}));

vi.mock('@tanstack/react-router', () => ({
    useNavigate: vi.fn(),
}));

describe('LoginForm', () => {
    const mockLogin = vi.fn();
    const mockNavigate = vi.fn();
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        (useLogin as any).mockReturnValue({
            isPending: false,
            mutateAsync: mockLogin,
        });
        (useNavigate as any).mockImplementation(() => mockNavigate);
    });

    it('renders the login form correctly', () => {
        render(<LoginForm />);

        expect(screen.getByText('Login to your account')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('shows validation errors for empty form submission', async () => {
        render(<LoginForm />);

        const submitButton = screen.getByRole('button', { name: 'Login' });
        await user.click(submitButton);

        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Please enter your password')).toBeInTheDocument();
    });

    it('shows validation error for invalid email', async () => {
        render(<LoginForm />);

        const emailInput = screen.getByLabelText('Email');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(emailInput, 'invalid-email');
        await user.click(submitButton);

        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('submits the form with valid data', async () => {
        const mockUser = { id: 1, email: 'test@example.com' };
        mockLogin.mockResolvedValueOnce(mockUser);

        render(<LoginForm />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        expect(mockLogin).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123',
        });
        expect(toast.promise).toHaveBeenCalled();
    });

    it('shows loading state during submission', async () => {
        (useLogin as any).mockReturnValue({
            isPending: true,
            mutateAsync: mockLogin,
        });

        render(<LoginForm />);

        const submitButton = screen.getByRole('button', { name: 'Login' });
        expect(submitButton).toBeDisabled();
        expect(submitButton).toContainElement(screen.getByTestId('loader'));
    });

    it('navigates to home page after successful login', async () => {
        const mockUser = { id: 1, email: 'test@example.com' };
        mockLogin.mockResolvedValueOnce(mockUser);

        render(<LoginForm />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
    });

    it('handles login failure and shows error toast', async () => {
        const errorMessage = 'Invalid credentials';
        const error = {
            response: {
                data: {
                    non_field_errors: [errorMessage],
                },
            },
        };
        mockLogin.mockRejectedValueOnce(error);

        render(<LoginForm />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        // Wait for the promise to resolve
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(toast.promise).toHaveBeenCalledWith(
            expect.any(Promise),
            expect.objectContaining({
                loading: 'Logging in...',
                success: 'Successfully logged in!',
                error: expect.any(Function),
            }),
        );

        // Verify the error message is passed to the toast
        const toastPromiseCall = (toast.promise as any).mock.calls[0];
        const errorHandler = toastPromiseCall[1].error;
        expect(errorHandler(error)).toBe(errorMessage);
    });

    it('disables form inputs during submission', async () => {
        (useLogin as any).mockReturnValue({
            isPending: true,
            mutateAsync: mockLogin,
        });

        render(<LoginForm />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
    });

    it('has working "Forgot password" link', async () => {
        render(<LoginForm />);
        const forgotPasswordLink = screen.getByText('Forgot your password?');
        expect(forgotPasswordLink).toBeInTheDocument();
        expect(forgotPasswordLink).toHaveAttribute('href', '#');
    });

    it('shows appropriate loading state during API call', async () => {
        (useLogin as any).mockReturnValue({
            isPending: true,
            mutateAsync: mockLogin,
        });

        render(<LoginForm />);

        const submitButton = screen.getByRole('button', { name: 'Login' });
        expect(submitButton).toBeDisabled();
        expect(submitButton).toContainElement(screen.getByTestId('loader'));
    });

    it('maintains form state after failed submission', async () => {
        const errorMessage = 'No user exists with this email';
        const error = {
            response: {
                data: {
                    non_field_errors: [errorMessage],
                },
            },
        };
        mockLogin.mockRejectedValueOnce(error);

        render(<LoginForm />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        // Wait for the promise to resolve
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Form should maintain its values after failed submission
        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('wrongpassword');

        // Verify the error message is passed to the toast
        const toastPromiseCall = (toast.promise as any).mock.calls[0];
        const errorHandler = toastPromiseCall[1].error;
        expect(errorHandler(error)).toBe(errorMessage);
    });

    it('shows fallback error message when no specific error is provided', async () => {
        const error = new Error('Some error');
        mockLogin.mockRejectedValueOnce(error);

        render(<LoginForm />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        // Wait for the promise to resolve
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Verify the fallback error message is used
        const toastPromiseCall = (toast.promise as any).mock.calls[0];
        const errorHandler = toastPromiseCall[1].error;
        expect(errorHandler(error)).toBe('Failed to login');
    });
});
