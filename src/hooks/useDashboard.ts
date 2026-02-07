import { listarDadosDashboard } from '@/api/endpoints/dashboard';
import { useQuery } from '@tanstack/react-query'
import type { SaldoMensal, Categoria, Cartao } from '@/types/Dashboard';

export function useDashboard(mes: string, ano: string) {
   const { data: dashboard, isLoading, isError } = useQuery<{
      saldoMensal: SaldoMensal[];
      topCategorias: Categoria[];
      resumoCartoes: Cartao[];
   }>({
      queryKey: ['dashboard', mes, ano],
      queryFn: () => listarDadosDashboard(mes, String(ano)),
      staleTime: Infinity
   });

   return {
      dashboard: dashboard ?? { saldoMensal: [], topCategorias: [], resumoCartoes: [] },
      isLoading,
      isError
   }
}