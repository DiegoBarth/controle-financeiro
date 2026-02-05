import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useToast } from '@/contexts/toast';
import { verificarEmailPossuiAutorizacao } from "./api/endpoints/home";
import { Compromissos } from "./pages/Compromissos";
import { Dashboard } from "./pages/Dashboard";
import { Gastos } from "./pages/Gastos";
import { Home } from "./pages/Home";
import { Receitas } from "./pages/Receitas";
import { PeriodoProvider } from "./contexts/PeriodoContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const AUTH_TIMEOUT = 1000 * 60 * 60 * 24 * 7; // 7 dias

function App() {
   const toast = useToast();
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  staleTime: 1000 * 60 * 5,
                  refetchOnWindowFocus: false,
                  refetchOnReconnect: false
               }
            }
         })
   );

   const [userEmail, setUserEmail] = useState<string | null>(() => {
      const saved = localStorage.getItem("user_email");
      const savedTime = Number(localStorage.getItem("login_time") || 0);

      if (!saved || !savedTime) return null;

      if (Date.now() - savedTime > AUTH_TIMEOUT) {
         localStorage.removeItem("user_email");
         localStorage.removeItem("login_time");
         return null;
      }

      return saved;
   });

   async function handleLoginSuccess(credentialResponse: any) {
      try {
         const decoded = JSON.parse(
            atob(credentialResponse.credential.split(".")[1])
         );
         const email = decoded.email;

         const autorizado = await verificarEmailPossuiAutorizacao(email);
         if (!autorizado) {
            toast.error('E-mail não autorizado!');
            return;
         }

         localStorage.setItem("user_email", email);
         localStorage.setItem("login_time", Date.now().toString());
         setUserEmail(email);
      } catch (err) {
         console.error("Erro ao decodificar login:", err);
         toast.error('Erro ao fazer login');
      }
   }

   const handleLogout = () => {
      googleLogout();
      localStorage.removeItem("user_email");
      localStorage.removeItem("login_time");
      queryClient.clear();
      setUserEmail(null);
      toast.info('Você foi desconectado');
   };

   useEffect(() => {
      const interval = setInterval(() => {
         if (userEmail) {
            localStorage.setItem("login_time", Date.now().toString());
         }
      }, 5 * 60 * 1000); // 5 minutos

      return () => clearInterval(interval);
   }, [userEmail]);

   if (!userEmail) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="w-full max-w-sm bg-white shadow-lg rounded-xl border border-slate-200 p-6 sm:p-10 text-center">
               <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-800">
                  Controle Financeiro
               </h1>
               <p className="mb-6 sm:mb-8 text-sm sm:text-base text-slate-500">
                  Acesse com sua conta Google para gerenciar seus dados
               </p>

               <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => toast.error('Erro no login Google')}
                  useOneTap
               />

               <p className="mt-4 text-xs sm:text-sm text-slate-400">
                  Apenas e-mails autorizados terão acesso.
               </p>
            </div>
         </div>
      );
   }

   return (
      <>
         <QueryClientProvider client={queryClient}>
            <PeriodoProvider>
                  <Routes>
                     <Route path="/" element={<Home onLogout={() => handleLogout()} />} />
                     <Route path="/gastos" element={<Gastos />} />
                     <Route path="/compromissos" element={<Compromissos />} />
                     <Route path="/receitas" element={<Receitas />} />
                     <Route path="/dashboard" element={<Dashboard />} />
                     <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
            </PeriodoProvider>
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
      </>
   );
}

export default App;