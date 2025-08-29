---
sidebar_position: 2
---

# Frontend Authentication

This document covers the authentication implementation in the React frontend, including user flows, state management, and UI components.

## Overview

The frontend authentication system is designed to be framework-agnostic and can integrate with any backend API. It provides a complete user experience for registration, login, password management, and protected routing using modern React patterns.

## Architecture

### State Management
- **Store**: `src/stores/authentication.store.ts`
- **Hook**: `src/hooks/useAuth.tsx`
- **Technology**: Zustand with Immer middleware for lightweight, immutable state management

### Routing Integration
- **Protected Routes**: `/app/d/*` - Requires authentication
- **Public Routes**: `/app/*` - Available without authentication
- **Automatic Redirects**: Based on authentication state

## Authentication Components

### Forms
All forms are built with TanStack Form and Zod validation:

#### Login Form
- **Component**: `src/components/org/forms/login.form.tsx`
- **Hook**: `src/components/org/forms/hooks/use-login-form.ts`
- **Validation**: `src/components/org/forms/validation/login-form.schema.ts`
- **Features**:
  - Email/password authentication
  - Form validation with real-time feedback
  - Error handling and display
  - Loading states

#### Registration Form
- **Component**: `src/components/org/forms/register.form.tsx`
- **Features**:
  - User registration with validation
  - Password confirmation
  - Terms acceptance
  - Automatic login after registration

#### Password Reset Form
- **Component**: `src/components/org/forms/reset-password.form.tsx`
- **Features**:
  - Email-based password reset
  - Validation and error handling
  - Success confirmation

#### Password Update Form
- **Component**: `src/components/org/forms/update-password.form.tsx`
- **Features**:
  - Token-based password update
  - Password strength validation
  - Confirmation matching

### Pages
Authentication pages provide the UI containers for forms:

#### Login Page
- **Component**: `src/components/org/pages/login.page.tsx`
- **Route**: `/app/login`
- **Features**:
  - Login form integration
  - Navigation to registration
  - Password reset links

#### Registration Page
- **Component**: `src/components/org/pages/register.page.tsx`
- **Route**: `/app/register`
- **Features**:
  - Registration form integration
  - Navigation to login
  - Terms and conditions

#### Reset Password Page
- **Component**: `src/components/org/pages/reset-pw.page.tsx`
- **Route**: `/app/reset-password`
- **Features**:
  - Password reset form
  - Back to login navigation

#### Update Password Page
- **Component**: `src/components/org/pages/update-pw.page.tsx`
- **Route**: `/app/update-password/$token`
- **Features**:
  - Token parameter handling
  - Password update form
  - Success/error states

## Services

### User Service
- **Location**: `src/services/users.service.ts`
- **Purpose**: API communication with backend
- **Methods**:
  - `login(credentials)` - User authentication
  - `register(userData)` - User registration
  - `resetPassword(email)` - Password reset request
  - `updatePassword(token, newPassword)` - Password update
  - `logout()` - Session termination
  - `profile()` - User profile retrieval

## UI Components

### Reusable Components
Built with shadcn/ui and TailwindCSS:

#### Form Components
- **FormCard** (`src/components/ui/form-card.tsx`)
  - Consistent form container styling
  - Responsive design
- **FormField** (`src/components/ui/form-field.tsx`)
  - Form field wrapper with validation
- **FormErrorDisplay** (`src/components/ui/form-error-display.tsx`)
  - Error message display component

#### Input Components
- **Input** (`src/components/ui/input.tsx`)
  - Styled input field component
- **Button** (`src/components/ui/button.tsx`)
  - Consistent button styling and variants
- **Label** (`src/components/ui/label.tsx`)
  - Form label component

#### Feedback Components
- **Alert** (`src/components/ui/alert.tsx`)
  - Success/error message display
- **Card** (`src/components/ui/card.tsx`)
  - Content container component

## Routing

### Route Structure
```
/app/
├── (unauthenticated)/
│   ├── login
│   ├── register
│   ├── reset-password
│   └── update-password/$token
└── (authenticated)/
    └── d/
        └── [protected routes]
```

### Route Protection
- **Unauthenticated Routes**: Redirect to dashboard if logged in
- **Authenticated Routes**: Redirect to login if not logged in
- **Automatic Handling**: Based on authentication store state

### Route Components
#### Unauthenticated Layout
- **Component**: `src/routes/app/(unauthenticated)/route.tsx`
- **Purpose**: Layout for public authentication pages
- **Features**: Automatic redirect for authenticated users

#### Authenticated Layout
- **Component**: `src/routes/app/(authenticated)/d/route.tsx`
- **Purpose**: Layout for protected application pages
- **Features**: Authentication validation and redirect

## State Management

### Authentication Store
- **Technology**: Zustand with Immer middleware
- **State Shape**:
  ```typescript
  {
    isLoggedIn: boolean;
    wasProfileChecked: boolean;
    user: User | undefined;
  }
  ```

### Actions
- `logIn()` - Set user as logged in
- `logOut()` - Set user as logged out
- `checkProfile()` - Mark profile as checked
- `setUser(user)` - Update user information and set as logged in

## Type Definitions

### Authentication Types
- **Location**: `src/types/auth.d.ts`
- **Includes**:
  - User interface
  - Login credentials
  - Registration data
  - Token types

### API Types
- **Location**: `src/types/api.d.ts`
- **Includes**:
  - API response interfaces
  - Error response types
  - Request payload types

## Testing

### Component Testing
All authentication components include comprehensive tests:
- Form validation testing
- User interaction testing
- Error state testing
- Success flow testing

### Test Setup
- **Framework**: Vitest with React Testing Library
- **Configuration**: `testsSetup.ts`
- **Coverage**: All authentication flows covered

## Error Handling

### Form Validation
- **Real-time Validation**: Using Zod schemas
- **Error Display**: Consistent error messaging
- **Field-level Errors**: Individual field validation

### API Error Handling
- **Network Errors**: Connection failure handling
- **Validation Errors**: Backend validation display
- **Authentication Errors**: Token expiration handling

## Security Considerations

### Token Management
- **Storage**: Secure localStorage implementation
- **Expiration**: Automatic token cleanup
- **Refresh**: Cookie-based refresh flow

### Input Validation
- **Client-side**: Zod schema validation
- **Sanitization**: Input cleaning and validation
- **XSS Prevention**: Proper input handling

### Route Protection
- **Authentication Check**: Before route access
- **Automatic Redirect**: To appropriate pages
- **State Persistence**: Across browser sessions

This frontend authentication system provides a secure, user-friendly, and maintainable foundation for user authentication in the React application.