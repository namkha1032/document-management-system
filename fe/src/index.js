import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import myTheme from './myTheme';
import "./index.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient()

root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={myTheme}>
      <App />
    </ConfigProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  // </React.StrictMode>
);

