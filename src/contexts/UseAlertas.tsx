import { compromissosCache } from '../cache/compromissosCache';
import { usePeriodo } from './PeriodoContext';
import { useMemo, useState, useEffect } from 'react';

function zerarHora(d: Date) {
   const copy = new Date(d);
   copy.setHours(0, 0, 0, 0);
   return copy;
}

export function useAlertas() {
   const { mes, ano } = usePeriodo();
   const [tick, setTick] = useState(0);

   useEffect(() => {
      const oldAdd = compromissosCache.add;
      compromissosCache.add = (...args) => {
         oldAdd(...args);
         setTick(t => t + 1);
      };

      return () => {
         compromissosCache.add = oldAdd;
      };
   }, []);

   return useMemo(() => {
      const hoje = zerarHora(new Date());
      const compromissos = (compromissosCache.get(mes, ano) || [])
         .filter(c => !c.dataPagamento && !c.pago); // ✅ só não pagos

      const vencendoHoje = compromissos.filter(c => {
         const [d, m, a] = c.dataVencimento.split('/').map(Number);
         const data = zerarHora(new Date(a, m - 1, d));
         return data.getTime() === hoje.getTime();
      });

      const vencendoSemana = compromissos.filter(c => {
         const [d, m, a] = c.dataVencimento.split('/').map(Number);
         const data = zerarHora(new Date(a, m - 1, d));
         const diffDias = (data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
         return diffDias > 0 && diffDias <= 7;
      });

      return { hoje: vencendoHoje, semana: vencendoSemana };
   }, [mes, ano, tick]);
}
