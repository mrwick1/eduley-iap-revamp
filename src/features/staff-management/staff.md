# Staff Management Feature

This feature module encapsulates all functionalities related to staff management within the application, including viewing, adding, editing, activating/deactivating, and deleting staff members. It leverages React Query for data fetching and state management, React Hook Form for form handling, Zod for validation, and Zustand for persistent table preferences.

## Directory Structure & Key Components

- **`index.tsx`**:

    - The main entry point and page component for staff management.
    - Wraps the content with `StaffProvider` to provide context.
    - Renders the `Header`, `Search` component, page title/description, primary action buttons (`StaffManagementPrimaryButtons`), and the main `DataTable`.
    - Manages the `Drawer` (for adding/editing staff via `StaffForm`) and the `ConfirmDialog` (for delete/activate/deactivate actions).

- **`api/`**:

    - **`api.ts`**: Contains asynchronous functions for interacting with the backend staff API (`/api/staff/`).
        - `getAllStaff`: Fetches a paginated, searchable, and filterable list of staff. Supports searching by name, filtering by active status (`is_active`) and role (`groups__name`), and ordering.
        - `createStaff`: Creates a new staff member. Handles `FormData` for potential profile photo uploads.
        - `updateStaff`: Updates an existing staff member. Handles `FormData` and optional password updates.
        - `deleteStaff`: Deletes a staff member by ID.
        - `updateStaffStatusAndGroups`: Updates the `is_active` status and assigned `groups` for a staff member. (Used for activate/deactivate actions).

- **`components/`**:

    - **`data-table.tsx`**: Generic data table component (likely using `@tanstack/react-table`) configured for staff data via `useStaffTable` hook and `columns`. Includes `table-toolbar.tsx`.
    - **`columns.tsx`**: Defines the column configuration for the staff data table, including header titles, cell rendering (e.g., displaying status badges, user info), and sorting configuration. Includes `table-row-actions.tsx` for actions like edit, delete, activate/deactivate.
    - **`staff-form.tsx`**: The form used within the drawer for adding and editing staff members. Utilizes `react-hook-form` and context (`useStaff`) for state and submission logic.
    - **`table-row-actions.tsx`**: Component rendering the dropdown menu with actions (Edit, Delete, Activate/Deactivate) for each row in the data table. Uses context (`useStaff`) to trigger drawer or confirmation dialogs.
    - **`table-toolbar.tsx`**: Component providing toolbar functionality for the data table, likely including filtering controls (status, role), column visibility toggles, and potentially the search input (delegated to `Header`).
    - **`primary-button.tsx`**: Renders the primary action buttons above the table, specifically the "Add New Staff" button which triggers the add staff drawer.

- **`context/`**:

    - **`staff-context.tsx`**:
        - Provides a `StaffContext` using `React.Context`.
        - Manages state related to:
            - The currently selected staff member (`currentRow`).
            - The add/edit drawer (`isDrawerOpen`, `actionType`).
            - The confirmation dialog (`isConfirmOpen`, `confirmActionType`, `targetStaffId`, etc.).
            - Form state via `useForm<StaffFormValues>`.
        - Contains `react-query` mutations (`useMutation`) for `createStaff`, `updateStaff`, `deleteStaff`, `updateStatusMutate`, handling loading states (`isSubmitting`, `isConfirmLoading`), success/error notifications (`sonner`), and query invalidation.
        - Provides handler functions (`handleFormSubmit`, `openDrawerForAction`, `handleOpenDeleteConfirm`, `handleConfirmAction`, etc.) used by components.
        - Exports `useStaff` hook for easy context consumption.

- **`hooks/`**:

    - **`use-staff-table.ts`**:
        - Custom hook abstracting `@tanstack/react-table` setup and state management for the staff table.
        - Integrates with `usePreferencesStore` (Zustand) to persist table state (pagination, filters, column visibility) using `TABLE_ID = 'staff-management'`.
        - Uses `useQuery` (React Query) to fetch staff data via `getAllStaff`, passing pagination, search, filter, and sorting parameters. Implements `keepPreviousData` for a smoother pagination experience.
        - Manages table state like `pagination`, `sorting`, `columnVisibility`, and `columnFilters`.
        - Returns the `table` instance and `isLoading` state to the `DataTable` component.

- **`schema/`**:

    - **`schema.ts`**: Defines Zod validation schemas.
        - `staffFormSchema`: Schema for the overall form structure (`StaffFormValues`).
        - `addStaffValidationSchema`: Stricter schema used during _creation_, requiring a valid password.
        - `updateStaffValidationSchema`: Schema used during _update_, making the password optional but validating it if provided. Includes `is_active`.
        - Exports `StaffFormValues` type and `defaultStaffFormValues`.

- **`types/`**:
    - **`types.ts`**: Contains TypeScript interfaces.
        - `Staff`: Defines the shape of a single staff member object (matching API response).
        - `StaffResponse`: Defines the shape of the API response for fetching multiple staff members (includes `count`, `next`, `previous`, `results`).

## Core Functionality

- **Display Staff:** Fetches and displays staff members in a paginated, sortable, and filterable table.
- **Persistence:** Table view preferences (page, page size, filters, column visibility) are persisted using Zustand (`usePreferencesStore`).
- **CRUD Operations:**
    - **Create:** Add new staff via a drawer form (`StaffForm`).
    - **Read:** View staff details in the table.
    - **Update:** Edit existing staff details via the same drawer form.
    - **Delete:** Remove staff members after confirmation.
- **Status Management:** Activate or deactivate staff members via row actions and confirmation dialogs.
- **Validation:** Uses Zod schemas (`addStaffValidationSchema`, `updateStaffValidationSchema`) for robust form validation during create and update operations.
- **State Management:** Centralizes feature state, API interactions, and logic within `StaffContext` and leverages React Query for server state caching and mutations.
- **UI Feedback:** Uses `sonner` for toast notifications on success or failure of operations. Implements loading indicators for asynchronous actions.
