---
sidebar_position: 3
---
# Debugging

## Why is it important?
Debugging is the process of finding and fixing errors in code. It is important to have a consistent way of debugging to make it more readable and maintainable.

## Chosen tool
For this project we've configured Vite for debugging support with VS Code and derivative editors such as Windsurf and Cursor. The `dev:debug` command disables code splitting to improve debugging experience.

## How to run the debugging
To run the debugging, you need to run the frontend with the debug command:

```bash
pnpm dev:debug
```

Then, go to VS Code and use the debugger with your browser's developer tools. The `dev:debug` command ensures that code splitting is disabled for better debugging experience.

You can add breakpoints directly in your source code and they will work as expected in the browser's developer tools.

## Common Issues

### TypeScript Route Tree Issues
Sometimes the `routeTree.gen.ts` file is open and needs to be closed/reopened for TypeScript to properly parse it. If you're experiencing TypeScript errors related to routing that seem inconsistent:

1. Close the `routeTree.gen.ts` file in your editor
2. Reopen the file or restart your TypeScript language server
3. The TypeScript errors should resolve once the file is properly parsed

This is a known issue with TanStack Router's auto-generated route tree file and editor TypeScript parsing.
