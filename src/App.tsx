import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { Home } from "./pages/Home";
import { Gastos } from "./pages/Gastos";
import { Compromissos } from "./pages/Compromissos";
import { Receitas } from "./pages/Receitas";
import { Dashboard } from "./pages/Dashboard";
import { verificarEmailPossuiAutorizacao } from "./api/home";

const AUTH_TIMEOUT = 1000 * 60 * 60 * 24 * 7; // 7 dias

function App() {
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

   const handleLoginSuccess = async (credentialResponse: any) => {
      try {
         const decoded = JSON.parse(
            atob(credentialResponse.credential.split(".")[1])
         );
         const email = decoded.email;

         const autorizado = await verificarEmailPossuiAutorizacao(email);
         if (!autorizado) {
            alert("E-mail não autorizado!");
            return;
         }

         localStorage.setItem("user_email", email);
         localStorage.setItem("login_time", Date.now().toString());
         setUserEmail(email);
      } catch (err) {
         console.error("Erro ao decodificar login:", err);
      }
   };

   const handleLogout = () => {
      googleLogout();
      localStorage.removeItem("user_email");
      localStorage.removeItem("login_time");
      setUserEmail(null);
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
                  onError={() => alert("Erro no login")}
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
         <Routes>
            <Route path="/" element={<Home onLogout={() => handleLogout()} />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/compromissos" element={<Compromissos />} />
            <Route path="/receitas" element={<Receitas />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
         </Routes>
      </>
   );
}

export default App;
