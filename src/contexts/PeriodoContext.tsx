import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
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

function getPeriodoInicial() {
   const salvo = sessionStorage.getItem('periodo');
   if (salvo) return JSON.parse(salvo);

   const hoje = new Date();
   return {
      mes: String(hoje.getMonth() + 1),
      ano: hoje.getFullYear()
   };
}

const resumoInicial: ResumoCompleto = {
   totalReceitas: 0,
   totalGastos: 0,
   totalCompromissos: 0,
   totalRecebido: 0,
   totalPago: 0,
   totalCompromissosPagos: 0,
   totalRecebidoMes: 0,
   totalPagoMes: 0,
   totalCompromissosPagosMes: 0,
   anosDisponiveis: []
};

export const PeriodoContext = createContext<PeriodoContextType>({
   mes: '',
   setMes: () => { },
   ano: 0,
   setAno: () => { },
   resumo: null,
   loadingResumo: false
});

export function PeriodoProvider({ children }: { children: ReactNode }) {
   const periodoInicial = getPeriodoInicial();

   const [mes, setMes] = useState<string>(periodoInicial.mes);
   const [ano, setAno] = useState<number>(periodoInicial.ano);

   const { data: resumo = resumoInicial, isLoading: loadingResumo } = useQuery({
      queryKey: ['resumo', mes, ano],
      queryFn: () => listarResumoCompleto(mes, String(ano)),
      placeholderData: previous => previous ?? resumoInicial
   });

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
            loadingResumo
         }}
      >
         {children}
      </PeriodoContext.Provider>
   );
}

export const usePeriodo = () => useContext(PeriodoContext);