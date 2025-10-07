import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from './app';
import { QueryProvider } from './context/query.provider';
import { ThemeProvider } from './context/theme.provider';

const rootElement = document.getElementById('root') as Element;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider
        defaultTheme="system"
        storageKey="core-ui-theme"
      >
        <QueryProvider>
          <App />
          <ReactQueryDevtools />
        </QueryProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
