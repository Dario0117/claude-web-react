import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from './app';
import { ThemeProvider } from './theme-provider';

const queryClient = new QueryClient();

const rootElement = document.getElementById('root') as Element;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider
        defaultTheme="system"
        storageKey="core-ui-theme"
      >
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
