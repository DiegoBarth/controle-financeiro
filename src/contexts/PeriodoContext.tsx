import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { listarResumoCompleto } from '../api/home';
import type { ResumoCompleto } from '../types/ResumoCompleto';

interface PeriodoContextType {
   mes: string;
   setMes: (mes: string) => void;
   ano: number;
   setAno: (ano: number) => void;

   resumo: ResumoCompleto | null;
   loadingResumo: boolean;
}

const hoje = new Date();
const mesAtual = String(hoje.getMonth() + 1);
const anoAtual = hoje.getFullYear();

const defaultValue: PeriodoContextType = {
   mes: mesAtual,
   setMes: () => { },
   ano: anoAtual,
   setAno: () => { },
   resumo: null,
   loadingResumo: false
};

export const PeriodoContext = createContext<PeriodoContextType>(defaultValue);

export function PeriodoProvider({ children }: { children: ReactNode }) {
   const periodoSalvo = localStorage.getItem('periodo');

   const periodoInicial = periodoSalvo
      ? JSON.parse(periodoSalvo)
      : { mes: mesAtual, ano: anoAtual };

   const [mes, setMes] = useState(periodoInicial.mes);
   const [ano, setAno] = useState(periodoInicial.ano);

   const resumoInicial: ResumoCompleto = {
      totalReceitas: 0,
      totalGastos: 0,
      totalCompromissos: 0,
      totalRecebido: 0,
      totalPago: 0,
      totalCompromissosPagos: 0,
      totalRecebidoMes: 0,
      totalPagoMes: 0,
      totalCompromissosPagosMes: 0
   };

   const [resumo, setResumo] = useState<ResumoCompleto>(resumoInicial);
   const [loadingResumo, setLoadingResumo] = useState(false);

   async function carregarResumo(mes: string, ano: number) {
      setLoadingResumo(true);
      try {
         const res = await listarResumoCompleto(mes, String(ano));
         setResumo(res);
      } catch (err) {
         console.error('Erro ao carregar resumo', err);
      } finally {
         setLoadingResumo(false);
      }
   }

   useEffect(() => {
      carregarResumo(mes, ano);
      localStorage.setItem(
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
            loadingResumo
         }}
      >
         {children}
      </PeriodoContext.Provider>
   );
}

// Hook helper
export const usePeriodo = () => useContext(PeriodoContext);
