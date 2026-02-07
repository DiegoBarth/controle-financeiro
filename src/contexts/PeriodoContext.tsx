import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ResumoCompleto } from '@/types/ResumoCompleto';
import type { Receita } from '@/types/Receita';
import type { Gasto } from '@/types/Gasto';
import type { Compromisso } from '@/types/Compromisso';
import type { Dashboard } from '@/types/Dashboard';
import { useResumo } from '@/hooks/useResumo';
import { useReceita } from '@/hooks/useReceita';
import { useGasto } from '@/hooks/useGasto';
import { useCompromisso } from '@/hooks/useCompromisso';
import { useDashboard } from '@/hooks/useDashboard';

interface PeriodoContextType {
   mes: string;
   setMes: (mes: string) => void;
   ano: number;
   setAno: (ano: number) => void;

   resumo: ResumoCompleto | null;
   receitas: Receita[] | null;
   gastos: Gasto[] | null;
   compromissos: Compromisso[] | null;
   compromissosAlerta: Compromisso[] | null;
   dashboard: Dashboard | null
   isLoading: boolean;
}

export const PeriodoContext = createContext<PeriodoContextType>({
   mes: String(new Date().getMonth() + 1),
   setMes: () => { },
   ano: new Date().getFullYear(),
   setAno: () => { },
   resumo: null,
   receitas: null,
   gastos: null,
   compromissos: null,
   compromissosAlerta: null,
   dashboard: { saldoMensal: [], topCategorias: [], resumoCartoes: [] },
   isLoading: false
});

function getPeriodoInicial() {
   const salvo = sessionStorage.getItem('periodo');
   if (salvo) return JSON.parse(salvo);

   const hoje = new Date();
   return {
      mes: String(hoje.getMonth() + 1),
      ano: hoje.getFullYear()
   };
}

export function PeriodoProvider({ children }: { children: ReactNode }) {
   const periodoInicial = getPeriodoInicial();

   const [mes, setMes] = useState<string>(periodoInicial.mes);
   const [ano, setAno] = useState<number>(periodoInicial.ano);

   const { resumo, isLoading } = useResumo(mes, String(ano))
   const { receitas } = useReceita(mes, String(ano))
   const { gastos } = useGasto(mes, String(ano))
   const { compromissos } = useCompromisso(mes, String(ano))
   const { compromissosAlerta } = useCompromisso('all', String(ano), 'alertas')
   const { dashboard } = useDashboard(mes, String(ano))

   useEffect(() => {
      sessionStorage.setItem(
         'periodo',
         JSON.stringify({ mes, ano })
      );
   }, [mes, ano]);

   return (
      <PeriodoContext.Provider
         value={{
            mes,
            setMes,
            ano,
            setAno,
            resumo,
            receitas,
            gastos,
            compromissos,
            compromissosAlerta,
            dashboard,
            isLoading
         }}
      >
         {children}
      </PeriodoContext.Provider>
   );
}

export const usePeriodo = () => useContext(PeriodoContext);