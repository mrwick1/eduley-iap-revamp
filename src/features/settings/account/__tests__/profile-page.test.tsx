import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import Profile from '../profile-page';
import { getUser, getRoles, updateUser } from '../api/api';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock the user store
vi.mock('@/store/userSlice', () => ({
    useUserStore: vi.fn(() => ({
        user: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            profile_photo: '',
            groups: [1],
            institute: 1,
            password: '',
            is_active: true,
            instructor_id: 1,
        },
    })),
}));

// Mock the toast function
vi.mock('sonner', () => ({
    toast: {
        promise: vi.fn().mockImplementation((promise, options) => {
            promise.then(() => {
                // The success message is a string in the options
                if (typeof options.success === 'string') {
                    // Do nothing, the toast will handle displaying the message
                }
            });
            return promise;
        }),
    },
}));

// Create a mock query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: 0,
            gcTime: 0,
        },
    },
});

// Mock the API functions
vi.mock('../api/api', () => ({
    getUser: vi.fn(),
    getRoles: vi.fn(),
    updateUser: vi.fn(),
}));

describe('Profile Page', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();
        queryClient.clear();

        // Mock API responses
        vi.mocked(getUser).mockResolvedValue({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            profile_photo: '',
            groups: [1],
            institute: 1,
            password: '',
            is_active: true,
            instructor_id: 1,
        });

        vi.mocked(getRoles).mockResolvedValue([
            { id: 1, name: 'Admin', permissions: [] },
            { id: 2, name: 'User', permissions: [] },
            { id: 3, name: 'Management', permissions: [] },
        ]);

        vi.mocked(updateUser).mockResolvedValue({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            profile_photo: '',
            groups: [1],
            institute: 1,
            password: '',
            is_active: true,
            instructor_id: 1,
        });
    });

    it('renders the profile page with correct title and description', () => {
        render(
            <TooltipPrimitive.Provider>
                <QueryClientProvider client={queryClient}>
                    <Profile />
                </QueryClientProvider>
            </TooltipPrimitive.Provider>,
        );

        // Check if the title is rendered
        expect(screen.getByText('Profile')).toBeInTheDocument();

        // Check if the description is rendered
        expect(screen.getByText('This is how others will see you on the site.')).toBeInTheDocument();
    });

    it('shows loading state while fetching data', async () => {
        // Create a promise that we can resolve later
        let resolveUser: (value: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            profile_photo: string;
            groups: number[];
            institute: number;
            password: string;
            is_active: boolean;
            instructor_id: number;
        }) => void;
        let resolveRoles: (value: Array<{ id: number; name: string; permissions: any[] }>) => void;

        const userPromise = new Promise<{
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            profile_photo: string;
            groups: number[];
            institute: number;
            password: string;
            is_active: boolean;
            instructor_id: number;
        }>((resolve) => {
            resolveUser = resolve;
        });
        const rolesPromise = new Promise<Array<{ id: number; name: string; permissions: any[] }>>((resolve) => {
            resolveRoles = resolve;
        });

        // Mock the API calls to return our promises
        vi.mocked(getUser).mockReturnValue(userPromise);
        vi.mocked(getRoles).mockReturnValue(rolesPromise);

        render(
            <TooltipPrimitive.Provider>
                <QueryClientProvider client={queryClient}>
                    <Profile />
                </QueryClientProvider>
            </TooltipPrimitive.Provider>,
        );

        // Check if the promises are being called
        expect(vi.mocked(getUser)).toHaveBeenCalled();
        expect(vi.mocked(getRoles)).toHaveBeenCalled();

        // Wait for loading state to appear
        await waitFor(
            () => {
                expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
            },
            { timeout: 5000 },
        );

        // Resolve the promises
        resolveUser!({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            profile_photo: '',
            groups: [1],
            institute: 1,
            password: '',
            is_active: true,
            instructor_id: 1,
        });
        resolveRoles!([
            { id: 1, name: 'Admin', permissions: [] },
            { id: 2, name: 'User', permissions: [] },
        ]);

        // Wait for loading to complete
        await waitFor(() => {
            expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
        });
    });

    it('renders the form after loading', async () => {
        render(
            <TooltipPrimitive.Provider>
                <QueryClientProvider client={queryClient}>
                    <Profile />
                </QueryClientProvider>
            </TooltipPrimitive.Provider>,
        );

        // Wait for loading state to disappear
        await waitFor(() => {
            expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
        });

        // Then check for form fields
        await waitFor(() => {
            expect(screen.getByLabelText('First Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
        });
    });

    describe('Form Interactions', () => {
        it('updates first name and last name fields', async () => {
            render(
                <TooltipPrimitive.Provider>
                    <QueryClientProvider client={queryClient}>
                        <Profile />
                    </QueryClientProvider>
                </TooltipPrimitive.Provider>,
            );

            // Wait for form to load
            await waitFor(() => {
                expect(screen.getByLabelText('First Name')).toBeInTheDocument();
            });

            // Update first name
            const firstNameInput = screen.getByLabelText('First Name');
            await userEvent.clear(firstNameInput);
            await userEvent.type(firstNameInput, 'Jane');

            // Update last name
            const lastNameInput = screen.getByLabelText('Last Name');
            await userEvent.clear(lastNameInput);
            await userEvent.type(lastNameInput, 'Smith');

            // Verify values
            expect(firstNameInput).toHaveValue('Jane');
            expect(lastNameInput).toHaveValue('Smith');
        });

        it('shows validation errors for invalid input', async () => {
            render(
                <TooltipPrimitive.Provider>
                    <QueryClientProvider client={queryClient}>
                        <Profile />
                    </QueryClientProvider>
                </TooltipPrimitive.Provider>,
            );

            // Wait for form to load
            await waitFor(() => {
                expect(screen.getByLabelText('First Name')).toBeInTheDocument();
            });

            // Enter invalid first name (too short)
            const firstNameInput = screen.getByLabelText('First Name');
            await userEvent.clear(firstNameInput);
            await userEvent.type(firstNameInput, 'J');

            // Enter invalid last name (empty)
            const lastNameInput = screen.getByLabelText('Last Name');
            await userEvent.clear(lastNameInput);

            // Submit form
            const submitButton = screen.getByRole('button', { name: /update profile/i });
            await userEvent.click(submitButton);

            // Check for validation messages
            await waitFor(() => {
                expect(screen.getByText('First name must be at least 2 characters.')).toBeInTheDocument();
                expect(screen.getByText('Last name must be at least 1 characters.')).toBeInTheDocument();
            });
        });

        it('submits the form successfully', async () => {
            render(
                <TooltipPrimitive.Provider>
                    <QueryClientProvider client={queryClient}>
                        <Profile />
                    </QueryClientProvider>
                </TooltipPrimitive.Provider>,
            );

            // Wait for form to load
            await waitFor(() => {
                expect(screen.getByLabelText('First Name')).toBeInTheDocument();
            });

            // Update first name
            const firstNameInput = screen.getByLabelText('First Name');
            await userEvent.clear(firstNameInput);
            await userEvent.type(firstNameInput, 'Jane');

            // Submit form
            const submitButton = screen.getByRole('button', { name: /update profile/i });
            await userEvent.click(submitButton);

            // Verify update was called
            await waitFor(() => {
                expect(vi.mocked(updateUser)).toHaveBeenCalledWith(
                    1,
                    expect.objectContaining({
                        first_name: 'Jane',
                    }),
                );
            });

            // Verify toast was called with success message
            await waitFor(() => {
                expect(vi.mocked(toast.promise)).toHaveBeenCalledWith(
                    expect.any(Promise),
                    expect.objectContaining({
                        success: 'Profile updated successfully',
                    }),
                );
            });
        });
    });
});
