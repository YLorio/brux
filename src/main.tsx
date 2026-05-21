import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { App } from '@app/App';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import { ToastProvider } from '@shared/components/feedback';
import { queryClient } from '@shared/lib/queryClient';
import 'flag-icons/css/flag-icons.min.css';
import '@app/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
