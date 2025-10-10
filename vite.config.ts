import { execSync } from 'node:child_process';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Get git SHA for version tracking
  let gitSha = 'unknown';
  try {
    gitSha = execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
    }).trim();
  } catch (_error) {
    // Silently fail if git is not available - gitSha will remain 'unknown'
  }

  /**
   * If autoCodeSplitting is true
   * it causes an issue with vs code debugger
   * this is only false if we run dev:debug command
   * for anything else this must be true
   */
  const isVSCodeDebug = env.VITE_IS_VSCODE_DEBUG === 'true';
  return {
    define: {
      // Inject git SHA as environment variable for production builds
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(gitSha),
    },
    test: {
      globals: true,
      parallel: true,
      environment: 'jsdom',
      setupFiles: './testsSetup.ts',
      coverage: {
        provider: 'v8',
        reporter: ['html', 'json'],
        exclude: [
          '**/storybook-static/**',
          '**/src/types/**',
          'docs/**',
          '.storybook/**',
          '**/routeTree.gen.ts',
          '**/vite-env.d.ts',
          '**/vite.config.ts',
          '**/http-service-setup.ts',
          '**/*.stories.tsx',
        ],
      },
    },
    plugins: [
      tailwindcss() as PluginOption,
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: !isVSCodeDebug,
      }) as PluginOption,
      react() as PluginOption,
      checker({
        typescript: true,
      }),
    ] as PluginOption[],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
