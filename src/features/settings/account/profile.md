# Profile Page Component

A comprehensive interface for managing user profile information, including personal details, profile photo, and role management.

## Key Features

### Profile Photo Management

- Image cropping with aspect ratio 1:1
- Supports JPG, PNG, and WEBP formats
- Fallback avatar with user initials
- Real-time preview during cropping

### Role Management

- Management role users can assign/remove roles
- Management role cannot be removed
- Maximum limit of 10 roles per user
- Role changes are restricted based on user permissions

### Form Validation

- First Name: 2-30 characters
- Last Name: 1-30 characters
- Email: Read-only field (cannot be modified)

## Important Notes

- Email field is intentionally read-only for security
- Role management is only available to users with Management role
- Profile photo changes are processed through an image cropper

## Security Restrictions

- Email modification is disabled
- Role management requires Management privileges
- Management role cannot be removed once assigned
