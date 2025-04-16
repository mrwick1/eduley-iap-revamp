import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from '../profile-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';

// Mock the Head component
vi.mock('@/components/seo', () => ({
    Head: ({ title }: { title: string }) => <title>{title}</title>,
}));

// Mock the toast functionality
vi.mock('sonner', () => ({
    toast: {
        promise: vi.fn().mockImplementation((promise, options) => {
            return promise.then(() => options.success).catch(() => options.error);
        }),
    },
    Toaster: () => null,
}));

// Mock the ContentSection component
vi.mock('@/components/content-section', () => ({
    default: ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
        <div>
            <h1>{title}</h1>
            <p>{desc}</p>
            {children}
        </div>
    ),
}));

// Mock the user store
vi.mock('@/store/userSlice', () => ({
    useUserStore: () => ({
        user: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
        },
    }),
}));

// Mock the API calls
const mockGetUser = vi.fn();
const mockGetRoles = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock('../api/api', () => ({
    getUser: () => mockGetUser(),
    getRoles: () => mockGetRoles(),
    updateUser: (id: number, data: any) => mockUpdateUser(id, data),
}));

describe('Profile Page', () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Setup default mock responses
        mockGetUser.mockResolvedValue({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            profile_photo: null,
            groups: [],
        });
        mockGetRoles.mockResolvedValue([]);
        mockUpdateUser.mockResolvedValue({});
    });

    const renderProfile = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <Profile />
                <Toaster />
            </QueryClientProvider>,
        );
    };

    it('renders the profile page with correct title and description', async () => {
        renderProfile();

        expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
        expect(screen.getByText('This is how others will see you on the site.')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByLabelText('First Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
        });
    });

    it('shows loading state while fetching data', async () => {
        renderProfile();

        // Should show loading skeletons
        expect(screen.getByTestId('skeleton')).toBeInTheDocument();

        // Wait for loading to complete
        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });
    });

    it('pre-fills form with user data', async () => {
        renderProfile();

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
            expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
        });
    });

    it('validates form fields and shows error messages', async () => {
        renderProfile();

        // Wait for form to be rendered
        await waitFor(() => {
            expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        });

        const firstNameInput = screen.getByLabelText('First Name');
        const lastNameInput = screen.getByLabelText('Last Name');
        const emailInput = screen.getByLabelText('Email');

        // Clear the fields
        fireEvent.change(firstNameInput, { target: { value: '' } });
        fireEvent.change(lastNameInput, { target: { value: '' } });
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /update/i }));

        // Check for error messages
        await waitFor(() => {
            expect(screen.getByText('First name must be at least 2 characters.')).toBeInTheDocument();
            expect(screen.getByText('Last name must be at least 2 characters.')).toBeInTheDocument();
            expect(screen.getByText('Please enter a valid email.')).toBeInTheDocument();
        });
    });

    it('successfully updates user profile', async () => {
        renderProfile();

        // Wait for form to be rendered and user data to be loaded
        await waitFor(() => {
            expect(screen.getByLabelText('First Name')).toBeInTheDocument();
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        const firstNameInput = screen.getByLabelText('First Name');
        const lastNameInput = screen.getByLabelText('Last Name');
        const emailInput = screen.getByLabelText('Email');

        // Update the fields
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
        fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
        fireEvent.change(emailInput, { target: { value: 'jane.smith@example.com' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /update/i }));

        // Check if updateUser was called with correct data
        await waitFor(() => {
            expect(mockUpdateUser).toHaveBeenCalledWith(1, {
                id: 1,
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'jane.smith@example.com',
                profile_photo: null,
                groups: [],
            });
        });

        // Check for success toast
        await waitFor(
            () => {
                expect(toast.promise).toHaveBeenCalled();
                const toastPromiseCall = (toast.promise as any).mock.calls[0];
                const successHandler = toastPromiseCall[1].success;
                expect(successHandler).toBe('Profile updated successfully');
            },
            { timeout: 5000 },
        );
    });

    it('shows error toast when profile update fails', async () => {
        const error = new Error('Update failed');
        mockUpdateUser.mockRejectedValueOnce(error);

        renderProfile();

        // Wait for form to be rendered and user data to be loaded
        await waitFor(() => {
            expect(screen.getByLabelText('First Name')).toBeInTheDocument();
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /update/i }));

        // Verify toast.promise was called with the correct error message
        await waitFor(
            () => {
                expect(toast.promise).toHaveBeenCalled();
                const toastPromiseCall = (toast.promise as any).mock.calls[0];
                const errorHandler = toastPromiseCall[1].error;
                expect(errorHandler).toBe('Failed to update profile');
            },
            { timeout: 5000 },
        );
    });
});
