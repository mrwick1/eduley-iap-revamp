# Authentication System

## Key Features

### Login System

- Form validation with Zod schema
- Automatic redirection after successful login

### Session Management

- JWT-based authentication
- Access token and refresh token support
- Automatic token refresh when access token expires

### Role-Based Access Control

- Role-based authorization system
- Custom hook for checking user permissions
- Support for multiple roles per user
- Protected routes based on authentication status

## API Endpoints

- Login: `/admin/login/`
- Token Refresh: `/api/token/refresh/`
- Logout: `/logout/`
- User Info: `/iap/admin/`
- Roles: `/iap/group/`
- Institute Info: `/institute/admin/institute/`
