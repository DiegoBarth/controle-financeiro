import { Routes, Route, Navigate } from 'react-router-dom';
import { SwipeLayout } from '@/components/layout/SwipeLayout';
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
         <Route element={<SwipeLayout />}>
            <Route path="/" element={<Home onLogout={onLogout} />} />
            <Route path="/receitas" element={<Receita />} />
            <Route path="/gastos" element={<Gasto />} />
            <Route path="/compromissos" element={<Compromisso />} />
            <Route path="/dashboard" element={<Dashboard />} />
         </Route>

         <Route path="*" element={<Navigate to="/" />} />
      </Routes>
   );
}
