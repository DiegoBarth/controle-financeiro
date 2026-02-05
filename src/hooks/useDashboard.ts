import { listarDadosDashboard } from '@/api/endpoints/dashboard';
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom';
import type { SaldoMensal, Categoria, Cartao } from '@/types/Dashboard';


export function useDashboard(mes: string, ano: string) {
   const location = useLocation();
   const enabled = ['/dashboard', '/'].includes(location.pathname)

   const { data: dashboard, isLoading, isError } = useQuery<{
      saldoMensal: SaldoMensal[];
      topCategorias: Categoria[];
      resumoCartoes: Cartao[];
   }>({
      queryKey: ['dashboard', mes, ano],
      queryFn: () => listarDadosDashboard(mes, String(ano)),
      staleTime: Infinity,
      enabled
   });

   return {
      dashboard: dashboard ?? { saldoMensal: [], topCategorias: [], resumoCartoes: [] },
      isLoading,
      isError
   }
}