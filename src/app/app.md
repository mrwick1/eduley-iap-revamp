# App Directory Structure Documentation

## Overview

The `src/app` directory serves as the core of the application's routing and provider setup. It uses `@tanstack/react-router` for routing and includes various providers for application-wide functionality.

## Directory Structure

```
src/app/
├── index.tsx           # Main routing configuration
├── Provider.tsx        # Application providers setup
└── routes/            # Route definitions
    ├── [route-name]-route.tsx
    └── [feature-name]/      # For feature-specific routes
        └── [sub-route]-route.tsx
```

## Routing System

### Core Routing Configuration (`index.tsx`)

- Uses `@tanstack/react-router` for routing
- Defines a root route with a layout component
- Implements route hierarchy and navigation
- Key components:
    - `rootRoute`: Base route with layout and error handling
    - `indexRoute`: Handles root path (`/`) with redirect to dashboard
    - Route tree combining all application routes

### Route Structure

1. **Root Route (`/`)**

    - Default redirect to main application route
    - Uses `Layout` component as wrapper

2. **Route Types**

    - **Public Routes** (e.g., `/login`, `/register`)
        - Accessible without authentication
        - Example: `login-route.tsx`
    - **Protected Routes** (e.g., `/dashboard`, `/profile`)
        - Require authentication
        - Example: `dashboard-route.tsx`
    - **Feature Routes** (e.g., `/settings/*`)
        - Grouped by feature
        - Can have nested routes
        - Example: `settings/profile-route.tsx`

3. **Nested Routes**

    - Parent route defines the layout
    - Child routes render within parent layout
    - Example:

        ```tsx
        // settings-route.tsx
        export const settingsRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: '/settings',
            component: SettingsLayout,
        });

        // profile-route.tsx
        export const profileRoute = createRoute({
            getParentRoute: () => settingsRoute,
            path: '/profile',
            component: ProfilePage,
        });
        ```

### Error Handling

- `NotFoundError`: Handles 404 scenarios
- `GeneralError`: Handles general application errors
- Custom error components for specific routes

## Application Providers (`Provider.tsx`)

The `AppProvider` component sets up essential application-wide providers:

1. **State Management**

    - `QueryClientProvider`: Manages React Query state
    - Development tools for React Query and Router

2. **UI/UX Features**

    - `HelmetProvider`: Manages document head
    - `TooltipProvider`: Handles tooltips
    - `Toaster`: Toast notifications
    - `NavigationProgress`: Loading indicators

3. **Authentication**

    - `AuthLoader`: Handles authentication state
    - Loading states with `Spinner` component

4. **Error Boundaries**
    - `CatchBoundary`: Catches and handles errors
    - Path-based error reset

## Adding New Routes

### Basic Route Structure

```tsx
// routes/[feature-name]-route.tsx
import { createRoute } from '@tanstack/react-router';

export const [featureName]Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/[path-name]',
    component: [ComponentName],
});
```

### Nested Route Structure

```tsx
// routes/[feature-name]/[sub-route]-route.tsx
import { createRoute } from '@tanstack/react-router';

export const [subRouteName]Route = createRoute({
    getParentRoute: () => [parentRoute],
    path: '/[sub-path]',
    component: [SubComponent],
});
```

### Route Registration

1. Create the route file in the appropriate location
2. Import the route in `index.tsx`
3. Add it to the route tree:
    ```tsx
    const routeTree = rootRoute.addChildren([indexRoute, [newRoute], [parentRoute].addChildren([childRoute])]);
    ```

## Development Tools

- React Query DevTools (development only)
- TanStack Router DevTools (development only)
- Error boundary for debugging

## Best Practices

1. **Route Organization**

    - Group related routes in feature folders
    - Use consistent naming: `[feature-name]-route.tsx`
    - Keep route files focused and small

2. **Error Handling**

    - Global error boundaries
    - Specific error components for different scenarios
    - Development tools for debugging

3. **Loading States**

    - Suspense boundaries for loading states
    - Consistent loading UI with `Spinner` component

4. **Provider Management**
    - All providers are centralized in `Provider.tsx`
    - Development tools are only included in development mode

This structure provides a scalable and maintainable foundation for the application, with clear separation of concerns and robust error handling. The modular approach allows for easy addition of new routes and features while maintaining consistency across the application.
