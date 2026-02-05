import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Gasto } from '@/pages/Gasto';
import { Compromisso } from '@/pages/Compromisso';
import { Receita } from '@/pages/Receita';
import { Dashboard } from '@/pages/Dashboard';

interface AppRouterProps {
   onLogout: () => void;
}

export function AppRouter({ onLogout }: AppRouterProps) {
   return (
      <Routes>
         <Route path="/" element={<Home onLogout={onLogout} />} />
         <Route path="/gastos" element={<Gasto />} />
         <Route path="/compromissos" element={<Compromisso />} />
         <Route path="/receitas" element={<Receita />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="*" element={<Navigate to="/" />} />
      </Routes>
   );
}
