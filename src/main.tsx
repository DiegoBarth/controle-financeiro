import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PeriodoProvider } from './contexts/PeriodoContext'; // 🔹 importe o contexto

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <BrowserRouter basename="/controle-financeiro">
         <PeriodoProvider> {/* 🔹 envolver App */}
            <App />
         </PeriodoProvider>
      </BrowserRouter>
   </React.StrictMode>
);
