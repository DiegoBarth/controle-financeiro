import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
   listarSaldoMensal,
   listarTopCategorias,
   listarCartoesResumo
} from '@/api/endpoints/dashboard';
import type {
   SaldoMensal,
   Categoria,
   Cartao
} from '../types/Dashboard';
import type { ResumoCompleto } from '../types/ResumoCompleto';
import { usePeriodo } from './PeriodoContext';
import { listarReceitas } from '@/api/endpoints/receitas';
import { Receita } from '@/types/Receita';
import { listarCompromissos } from '@/api/endpoints/compromissos';
import { Compromisso } from '@/types/Compromisso';
import { listarGastos } from '@/api/endpoints/gastos';
import { Gasto } from '@/types/Gasto';

interface DashboardContextType {
   saldoAno: SaldoMensal[];
   topCategorias: Categoria[];
   cartoes: Cartao[];
   resumo: ResumoCompleto | null;
   loading: boolean;
   receitas: Receita[];
   compromissos: Compromisso[];
   gastos: Gasto[];
}

const DashboardContext = createContext<DashboardContextType>(
   {} as DashboardContextType
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
   const { mes, ano, resumo } = usePeriodo();
   const { data: saldoAno = [], isLoading: loadingSaldo } = useQuery({
      queryKey: ['dashboard', 'saldo', ano],
      queryFn: () => listarSaldoMensal(String(ano)),
      placeholderData: previous => previous ?? []
   });

   const { data: topCategorias = [], isLoading: loadingTop } = useQuery({
      queryKey: ['dashboard', 'topCategorias', mes, ano],
      queryFn: () => listarTopCategorias(mes, String(ano)),
      placeholderData: previous => previous ?? []
   });

   const { data: cartoes = [], isLoading: loadingCartoes } = useQuery({
      queryKey: ['dashboard', 'cartoes', mes, ano],
      queryFn: () => listarCartoesResumo(mes, String(ano)),
      placeholderData: previous => previous ?? []
   });

   const { data: receitas = [], isLoading: loadingReceitas } = useQuery({
      queryKey: ['receitas', mes, ano],
      queryFn: () => listarReceitas(mes, String(ano)),
      placeholderData: previous => previous ?? []
   })

   const { data: compromissos = [], isLoading: loadingCompromissos } = useQuery({
      queryKey: ['compromissos', mes, ano],
      queryFn: () => listarCompromissos(mes, String(ano)),
      placeholderData: previous => previous ?? []
   })

   const { data: gastos = [], isLoading: loadingGastos } = useQuery({
      queryKey: ['gastos', mes, ano],
      queryFn: () => listarGastos(mes, ano),
      placeholderData: previous => previous ?? []
   })


   return (
      <DashboardContext.Provider
         value={{
            saldoAno,
            topCategorias,
            cartoes,
            resumo,
            receitas,
            gastos,
            compromissos,
            loading: loadingSaldo || loadingTop || loadingCartoes || loadingReceitas || loadingGastos || loadingCompromissos
         }}
      >
         {children}
      </DashboardContext.Provider>
   );
}

export function useDashboard() {
   return useContext(DashboardContext);
}