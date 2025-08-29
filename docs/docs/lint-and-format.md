---
sidebar_position: 2
---
# Linting and formatting

## What is linting?
Linting is the process of analyzing code to find errors and potential issues or suspicious patterns.

The linter usually checks for:
- Syntax errors
- Style issues
- Security vulnerabilities
- Performance issues
- Code complexity
- Code duplication

## What is formatting?
Formatting is the process of organizing code to make it more readable and consistent.

The formatter usually checks for:
- Code style
- Code structure
- Code readability
- Code consistency

## Why is it important?
It is important to have a consistent way of writing code to make it more readable and maintainable.

It also reduces the nit picking and the time spent on code reviews and the reviews are only focused on the logic of the code.

## Chosen tool
For this project we use [biome](https://biomejs.dev/) to lint and format the code.

The decision was made because its a very fast tool and it has a lot of features.

## How to run the linting and formatting
To run the linting and formatting, you can use the following commands inside the frontend folder:

Lint only:
```bash
pnpm run lint:fix
```

Format only:
```bash
pnpm run format:fix
```

Lint and format:
```bash
pnpm run format-and-lint:fix
```

## How to run the linting and formatting automatically?
The project is configured to run linting and formatting on save when using VS Code or compatible editors. Install the Biome extension to enable automatic formatting and linting.

The official extension is [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

For CI/CD, linting and formatting checks are run automatically on pull requests to ensure code quality.

## Linting and formatting rules

:::info
**Why are we describing the rules here?**

Because if at some point we need to change the linter and formatter (Biome), we can look for an alternative(s) and match the same rules, this serves as an "in advance research" for future iterations to make it easier to know what to look for on the new tool.

This is not a 100% match, because the current linter and formatter could be running some default rules that are not being mapped, but this is a good starting point to know what to look for on the new tool.
:::

These settings are in the `biome.json` file at the root of the project.

The rule names are self describing, if in doubt please refer to biome's docs, they are pretty clear.


## Troubleshooting

### Biome not working at all
If Biome is not working, check that you don't have conflicting formatters (Prettier, VS Code native formatter) configured in your editor settings. Remove them from your global settings to allow the local Biome configuration to work.

For VS Code/Cursor users, you can create a clean profile:

```bash
/Applications/Cursor.app/Contents/MacOS/Cursor --user-data-dir="custom-cursor-profile"
```

This creates a directory with a clean editor configuration.

### Biome not working on specific file (changing spaces with tabs)

Sometimes biome doesn't work, you can try restarting biome (CTRL + SHIFT + P, then Biome: restart), if that doesn't work, close the file, open it again and save, it should automatically apply the right formatting.
