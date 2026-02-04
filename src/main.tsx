import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { DashboardProvider } from './contexts/DashboardContext';
import { PeriodoProvider } from './contexts/PeriodoContext';
import './index.css';
import { ToastProvider } from '@/contexts/toast';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
         <BrowserRouter basename="/controle-financeiro/">
            <PeriodoProvider>
               <DashboardProvider>
                  <ToastProvider>
                  <App />
                  </ToastProvider>
               </DashboardProvider>
            </PeriodoProvider>
         </BrowserRouter>
      </GoogleOAuthProvider>
   </React.StrictMode>
);