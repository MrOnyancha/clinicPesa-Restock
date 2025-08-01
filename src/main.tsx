import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60,
//       refetchInterval: 1000 * 60,
//     },
//   },
// });

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     {/* <QueryClientProvider client={queryClient}>
//       <ReactQueryDevtools initialIsOpen={false} /> */}
//     <BrowserRouter>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </BrowserRouter>
//     {/* </QueryClientProvider> */}
//   </React.StrictMode>,
// );

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   // <React.StrictMode>
//     <BrowserRouter>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </BrowserRouter>
//   // </React.StrictMode>
// );

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(

    <QueryClientProvider client={queryClient}>
      <Provider store={store}> {/* ✅ Add this */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
 
);


