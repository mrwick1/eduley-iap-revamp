import { AxiosError } from 'axios';

interface TryCatchResult<T> {
    data: T | null;
    error: Error | AxiosError | null;
}

/**
 * A utility function to handle try-catch blocks for async operations
 * @param fn - The async function to execute
 * @returns A promise that resolves to an object containing either the data or error
 */
export async function tryCatch<T>(fn: () => Promise<T>): Promise<TryCatchResult<T>> {
    try {
        const data = await fn();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as Error | AxiosError };
    }
}

/**
 * A utility function to handle try-catch blocks for sync operations
 * @param fn - The function to execute
 * @returns An object containing either the data or error
 */
export function tryCatchSync<T>(fn: () => T): TryCatchResult<T> {
    try {
        const data = fn();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as Error };
    }
}
