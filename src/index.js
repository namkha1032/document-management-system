import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient()

root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>
  // </React.StrictMode>
);

