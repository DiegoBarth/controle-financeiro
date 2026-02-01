import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

interface PeriodoContextType {
   mes: string;           // "1" a "12" ou "all"
   setMes: (mes: string) => void;
   ano: number;
   setAno: (ano: number) => void;
}

// Pega mês e ano atuais
const hoje = new Date();
const mesAtual = String(hoje.getMonth() + 1); // 0-based
const anoAtual = hoje.getFullYear();

const defaultValue: PeriodoContextType = {
   mes: mesAtual,
   setMes: () => { },
   ano: anoAtual,
   setAno: () => { }
};

export const PeriodoContext = createContext<PeriodoContextType>(defaultValue);

export function PeriodoProvider({ children }: { children: ReactNode }) {
   const [mes, setMes] = useState(mesAtual);
   const [ano, setAno] = useState(anoAtual);

   return (
      <PeriodoContext.Provider value={{ mes, setMes, ano, setAno }}>
         {children}
      </PeriodoContext.Provider>
   );
}

// Hook customizado para evitar checagem de undefined
export const usePeriodo = () => useContext(PeriodoContext);
