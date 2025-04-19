import { VisibilityState } from '@tanstack/react-table';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface TablePreferences {
    activePage: number;
    visibleColumns: VisibilityState; // Array of column IDs that are visible
    search: {
        [key: string]: string; // Key-value pairs for search terms
    };
    filters: {
        [key: string]: any; // Key-value pairs for filters
    };
    rowsPerPage: number;
}

interface PreferencesState {
    // Global preferences
    font: {
        family: string;
    };
    theme: ThemeMode;

    // Table-specific preferences
    tables: {
        [tableId: string]: TablePreferences;
    };
}

interface PreferencesActions {
    // Font actions
    setFontFamily: (family: string) => void;

    // Theme actions
    setTheme: (theme: ThemeMode) => void;

    // Table actions
    setTablePreferences: (tableId: string, preferences: Partial<TablePreferences>) => void;
    resetTablePreferences: (tableId: string) => void;
}

const initialState: PreferencesState = {
    font: {
        family: 'system-ui',
    },
    theme: 'system',
    tables: {},
};

export const usePreferencesStore = create<PreferencesState & PreferencesActions>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,

                // Font actions
                setFontFamily: (family) =>
                    set((state) => ({
                        font: { ...state.font, family },
                    })),

                // Theme actions
                setTheme: (theme) => set({ theme }),

                // Table actions
                setTablePreferences: (tableId, preferences) =>
                    set((state) => ({
                        tables: {
                            ...state.tables,
                            [tableId]: {
                                ...state.tables[tableId],
                                ...preferences,
                            },
                        },
                    })),

                resetTablePreferences: (tableId) =>
                    set((state) => {
                        const { [tableId]: _, ...rest } = state.tables;
                        return { tables: rest };
                    }),
            }),
            {
                name: 'preferences-storage',
            },
        ),
        {
            name: 'preferences-store',
        },
    ),
);
