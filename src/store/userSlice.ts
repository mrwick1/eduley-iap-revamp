import { create, StateCreator } from 'zustand';

export interface User {
    id: number;
    institute: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
    groups: number[];
    is_active: boolean;
    instructor_id: number;
}

export interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setAuthenticated: (isAuthenticated: boolean) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    login: () => void;
    logout: () => void;
    reset: () => void;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    setUser: () => {},
    setAuthenticated: () => {},
    setLoading: () => {},
    setError: () => {},
    login: () => {},
    logout: () => {},
    reset: () => {},
};

export const userSlice: StateCreator<UserState> = (set) => ({
    ...initialState,
    setUser: (user: User | null) => set({ user }),
    setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | null) => set({ error }),
    reset: () => set(initialState),
});

export const useUserStore = create<UserState>((...a) => ({
    ...userSlice(...a),
}));
