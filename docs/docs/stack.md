---
sidebar_position: 1
---
# Stack

## Language
### TypeScript
Why? Since the intention is to build a easy to maintain and scale application, TypeScript is a good (and only) choice to work with frontend frameworks. Typing will help us catch errors early and make the code more maintainable. We are going to strictly enforce typing in the codebase and avoid as much any as possible, even if it means writing more code.

## Framework/Library
### React 19
Why? This is merely personal preference, but I find React to be the most intuitive and easiest to work with. We're using React 19 for the latest features and performance improvements.

## Router
### TanStack Router
Why? TanStack Router is a good choice for routing in React applications. It is a lightweight and performant router that is easy to use and understand. Also, this is typesafe and provides a better developer experience.

## State Management
### Zustand
Why? Zustand is a good choice for state management in React applications. It is a lightweight and performant state management library that is easy to use and understand. This tool doesn't require any additional configuration and provides a better developer experience.

## Query Management
### TanStack Query
Why? TanStack Query is a good choice for query management in React applications. It is a lightweight and performant query management library that is easy to use and understand.

## Form Management
### TanStack Form (with Zod)
Why? TanStack Form is a good choice for form management in React applications. We are using a library for this because it will provide a standard way to handle forms and provide a better developer experience. This is going to be paired with Zod for validation.

## Styling
### TailwindCSS v4
Why? TailwindCSS is a good choice for styling in React applications. It is a lightweight and performant styling library that is easy to use and understand. We're using TailwindCSS v4 for the latest features and performance improvements. It also provides a better developer experience since it resembles a lot of the CSS properties we are used to. This allows us to leverage the multiple component libraries out there such as Shadcn UI and Radix UI and also leverage LLMs output to generate pages and styles for us.

## UI Components
### Radix UI + shadcn/ui
Why? We use Radix UI as the foundation for accessible, unstyled UI primitives, combined with shadcn/ui for pre-styled components that follow design system best practices. This provides a solid foundation for building consistent, accessible user interfaces.

## Development Tools
### Vite
Why? Vite provides fast development server with hot module replacement and optimized builds. It has excellent TypeScript support and integrates well with our React setup.

### Vitest
Why? Vitest is the testing framework that integrates seamlessly with Vite, providing fast test execution and excellent developer experience for unit and integration testing.

### Storybook
Why? Storybook enables component-driven development by providing an isolated environment to develop and test UI components. It helps with documentation and visual testing.

### Biome
Why? Biome is a fast, all-in-one toolchain for linting and formatting. It replaces ESLint and Prettier with better performance and zero configuration.
