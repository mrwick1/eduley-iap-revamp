import { create } from 'zustand';
import { userSlice, UserState } from './userSlice';
import { instituteSlice, InstituteState } from './instituteSlice';
import { devtools } from 'zustand/middleware';

// Combine all slices
type RootState = UserState & InstituteState;

// Create the root store with reset functionality
export const useStore = create<RootState>()(
    devtools((...a) => ({
        ...userSlice(...a),
        ...instituteSlice(...a),

        // Reset the store to its initial state
        reset: () => {
            userSlice(...a).setUser(null);
            userSlice(...a).setAuthenticated(false);
            userSlice(...a).setLoading(false);
            userSlice(...a).setError(null);
            instituteSlice(...a).setInstitute(null);
        },
    })),
);
