import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ResumoCompleto } from '@/types/ResumoCompleto';
import { useResumo } from '@/hooks/useResumo';

interface PeriodoContextType {
   mes: string;
   setMes: (mes: string) => void;
   ano: number;
   setAno: (ano: number) => void;

   resumo: ResumoCompleto | null;
   isLoading: boolean;
}

export const PeriodoContext = createContext<PeriodoContextType>({
   mes: '',
   setMes: () => { },
   ano: 0,
   setAno: () => { },
   resumo: null,
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
            isLoading
         }}
      >
         {children}
      </PeriodoContext.Provider>
   );
}

export const usePeriodo = () => useContext(PeriodoContext);