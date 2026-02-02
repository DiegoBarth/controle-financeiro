import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PeriodoProvider } from './contexts/PeriodoContext';
import { DashboardProvider } from './contexts/DashboardContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <BrowserRouter basename="/controle-financeiro/">
         <PeriodoProvider>
            <DashboardProvider>
            <App />
            </DashboardProvider>
         </PeriodoProvider>
      </BrowserRouter>
   </React.StrictMode>
);
