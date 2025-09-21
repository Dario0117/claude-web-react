# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `pnpm dev` - Start development server
- `pnpm dev:debug` - Start development server with VSCode debugging support (disables code splitting)
- `pnpm build` - Build for production (runs TypeScript compilation + Vite build)
- `pnpm preview` - Preview production build

### Code Quality

- `pnpm format-and-lint:fix` - Format and lint code (auto-fix issues)
- `pnpm format-and-lint:check` - Check formatting and linting without fixing
- `pnpm check-ts` - TypeScript type checking without emitting files
- `pnpm open-api` - Generate OpenAPI schema for API

### Testing

- `pnpm test` - Run tests with Vitest
- `pnpm coverage` - Run tests with coverage report (outputs to `/coverage`)

### Storybook

- `pnpm storybook` - Start Storybook development server on port 6006
- `pnpm build-storybook` - Build Storybook for production

## Architecture Overview

This is a React frontend template using modern tooling and patterns:

### Tech Stack

- **React 19** with TypeScript
- **TanStack Router** for file-based routing with type-safe navigation
- **TanStack Query** for server state management
- **Zustand** with Immer for client-side state management
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible UI primitives
- **Vite** for build tooling
- **Vitest** for testing
- **Storybook** for component development
- **Biome** for linting and formatting

### Project Structure

- `/src/components/` - Reusable components organized by domain
  - `/ui/` - Base UI components from shadcn (Button, Input, Card, etc.)
  - `/org/` - Organization-specific components with subfolders:
    - `/forms/` - Form components with hooks and validation
    - `/pages/` - Page-level components
- `/src/routes/` - File-based routing with TanStack Router
  - `/app/` - Main application routes
    - `(authenticated)/` - Routes requiring authentication (includes `/d/` subdirectory)
    - `(unauthenticated)/` - Public routes (login, register, reset-password, etc.)
  - Root-level routes: `index.tsx`, `about.tsx`, `posts.index.tsx`
- `/src/stores/` - Zustand stores for global state
- `/src/hooks/` - Custom React hooks
- `/src/services/` - API service layers
- `/src/types/` - TypeScript type definitions
- `/src/lib/` - Utility functions and configurations (utils, http-client, version)
- `/src/assets/` - Static assets (images, icons, etc.)

### Key Patterns

**Authentication**: Uses Zustand store (`authentication.store.ts`) with router context for protected routes. Authentication state includes `isLoggedIn`, `wasProfileChecked`, and `user` data.

**Routing**: TanStack Router with file-based routing. Route groups use parentheses for organization without affecting URLs. Router context provides authentication state to all routes.

**Forms**: Uses TanStack Form with Zod validation. Form components are in `/src/components/org/forms/` with corresponding validation schemas.

**Testing**: Vitest with React Testing Library. Test files use `.test.ts` suffix and are co-located with source files. Storybook stories use `.stories.tsx` suffix.

**Styling**: Tailwind CSS v4 with CSS variables for theming. Components use `class-variance-authority` for variant management and `tailwind-merge` for conditional classes.

**State Management**: Zustand with Immer middleware for immutable updates. TanStack Query handles server state with React Query DevTools in development.

### Alias Configuration

- `@/` maps to `/src/` directory for clean imports

### Development Notes

- Auto-generated route tree at `/src/routeTree.gen.ts` (excluded from linting)
- TypeScript strict mode enabled with multiple tsconfig files for different contexts
- Biome configured with strict rules including no `console` statements (except `console.log`)
- Coverage reports generated to `/coverage` directory with HTML output

###  Development checklist

- Components follow Atomic Design principles
- TypeScript strict mode enabled
- Accessibility WCAG 2.1 AA compliant
- Responsive mobile-first approach
- Use Tailwind's responsive grid system for layout
- Don't write any custom CSS, use Tailwind's utility classes and components
- State management properly implemented: use useState for component state, Zustand only for global state that needs to be shared across components
- Performance optimized (lazy loading, code splitting)
- Cross-browser compatibility verified
- Storybook documentation for each react component, this file must be placed alongside the component file
- When finished with the code, run `pnpm format-and-lint:fix`, `pnpm check-ts` and `pnpm test` to ensure all tests pass and code is formatted correctly, execute this commands until no errors or issues are found.

### Component requirements

- Only a single component per file
- Component-first thinking - reusable, composable UI pieces
- Semantic HTML structure
- Proper ARIA attributes when needed
- Keyboard navigation support
- Error boundaries implemented
- Loading and error states handled
- Memoization where appropriate
- Accessible form validation
- Internationalization ready
- Optimistic updates for better UX

### Style methodologies

- Tailwind CSS for utility-first development
- Mobile-first breakpoint strategy
- Fluid typography with clamp()
- Flexible grid systems
- Touch-friendly interfaces
- Viewport meta configuration
- Responsive images with srcset
- Orientation change handling

### State management approach

- Zustand for global state
- Local state for component-specific data
- Proper state normalization
- For components like filters or search, prioritize URL query parameters over local state for better UX and shareability

### Testing approach

- Unit tests for all new code
- All test files follow the naming convention of `[file_tested_name].test.ts` or `[file_tested_name].test.tsx` and must be placed alongside the file being tested
- Comprehensive test coverage (>85%) on each component but aim for 100% if possible
- Don't write end to end tests, only unit and integration tests
- Don't use mocks, stubs, or fakes, always use the real implementation, only mock external http requests using MSW, no component or function should be mocked, only external dependencies and requests.
- Test components in isolation: each component should have its own test file. Focus on testing the component's behavior and user interactions, not implementation details. When testing composed components, verify the overall behavior rather than testing individual child components.
- Use `describe` blocks to group related tests logically
- Prefer `async/await` for handling asynchronous code
- All tests should be deterministic and stable
- Avoid testing implementation details; focus on behavior
- Regularly refactor tests to remove duplication
- Don't test existence of css classes or tailwind directives, only test the behavior of the component on user interactions
- Don't test types
- When asked to fix or add tests, don't change the tested code, accommodate the tests to comply with the code

### Storybook approach

- Storybook is used for component documentation and development
- Storybook should never be used for writing tests, only for component documentation and interactions
- All react components must have a story file

### Error handling strategy

- Error boundaries at strategic levels
- Graceful degradation for failures
- User-friendly error messages
- Retry mechanisms with backoff
- State recovery mechanisms
- Fallback UI components

### TypeScript approach

- Strongly-typed TypeScript with comprehensive interfaces
- Generic functions and classes with proper constraints
- Types must be placed on `d.ts` files alongside the code they are used in, if they are being used in multiple files, place them in a separate `*.d.ts` file placed on a global `types` folder
- Avoid adding unnecessary types if they can be inferred
- Use generics and utility types for maximum type safety
- Prefer type inference over explicit annotations when clear
- Type declaration files (.d.ts) for external libraries

##  STRICT RULES, DON'T BREAK THEM, ASK FIRST

- Don't install any new dependencies, respect the Tech Stack, ask first if you need to add a new library and explain why
- Only use pnpm scripts to run checks and tests, if you need to add a new script, ask first and explain why
- Always write unit tests for any piece of code, even if it's a simple function or class
- Always follow the project's architecture and conventions, if you need to change something, ask first
- Always follow SOLID principles
- If there's a design system, always use it, if not you can use Tailwind CSS to build new components that match the style pattern of the existing components
- Don't try to analyze code from the installed dependencies
- Don't add unsafe modifications from biome
- Never delete or update auto generated files (src/types/api.ts, src/routes/routeTree.gen.ts)
- Never re-export imports on the same file
