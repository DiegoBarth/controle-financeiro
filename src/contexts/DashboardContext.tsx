import { createContext, useContext, useEffect, useState } from 'react';
import {
   listarSaldoMensal,
   listarTopCategorias,
   listarCartoesResumo
} from '../api/dashboard';
import { usePeriodo } from './PeriodoContext';
import type {
   SaldoMensal,
   Categoria,
   Cartao
} from '../types/Dashboard';
import type { ResumoCompleto } from '../types/ResumoCompleto';

interface DashboardContextType {
   saldoAno: SaldoMensal[];
   topCategorias: Categoria[];
   cartoes: Cartao[];
   resumo: ResumoCompleto | null;
   loading: boolean;
}

const DashboardContext = createContext<DashboardContextType>(
   {} as DashboardContextType
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
   const { mes, ano, resumo } = usePeriodo();
   const [saldoAno, setSaldoAno] = useState<SaldoMensal[]>([]);
   const [topCategorias, setTopCategorias] = useState<Categoria[]>([]);
   const [cartoes, setCartoes] = useState<Cartao[]>([]);

   const [loading, setLoading] = useState(true);

   useEffect(() => {
      let cancelado = false;

      async function carregar() {
         setLoading(true);
         try {
            const [saldo, categorias, cards] =
               await Promise.all([
                  listarSaldoMensal(String(ano)),
                  listarTopCategorias(mes, String(ano)),
                  listarCartoesResumo(mes, String(ano)),
               ]);

            if (cancelado) return;

            setSaldoAno(saldo);
            setTopCategorias(categorias);
            setCartoes(cards);
         } finally {
            if (!cancelado) setLoading(false);
         }
      }

      carregar();

      return () => {
         cancelado = true;
      };
   }, [mes, ano]);

   return (
      <DashboardContext.Provider
         value={{
            saldoAno,
            topCategorias,
            cartoes,
            resumo,
            loading
         }}
      >
         {children}
      </DashboardContext.Provider>
   );
}

export function useDashboard() {
   return useContext(DashboardContext);
}