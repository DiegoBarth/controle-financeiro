import { compromissosCache } from '../cache/compromissosCache';
import { useMemo, useState, useEffect } from 'react';

function zerarHora(d: Date) {
   const copy = new Date(d);
   copy.setHours(0, 0, 0, 0);
   return copy;
}

export function useAlertas() {
   const [tick, setTick] = useState(0);

   useEffect(() => {
      const oldAdd = compromissosCache.add;
      const oldUpdate = compromissosCache.update;
      const oldRemove = compromissosCache.remove;

      const bump = () => setTick(t => t + 1);

      compromissosCache.add = (...args) => {
         oldAdd(...args);
         bump();
      };

      compromissosCache.update = (...args) => {
         oldUpdate(...args);
         bump();
      };

      compromissosCache.remove = (...args) => {
         oldRemove(...args);
         bump();
      };

      return () => {
         compromissosCache.add = oldAdd;
         compromissosCache.update = oldUpdate;
         compromissosCache.remove = oldRemove;
      };
   }, []);


   return useMemo(() => {
      const hoje = zerarHora(new Date());

      const compromissos = compromissosCache
         .getAll()
         .filter(c => !c.dataPagamento);

      const vencidos = compromissos.filter(c => {
         const [d, m, a] = c.dataVencimento.split('/').map(Number);
         const data = zerarHora(new Date(a, m - 1, d));

         const diffDias = Math.ceil(
            (data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
         );

         return diffDias < 0;
      });

      const vencendoHoje = compromissos.filter(c => {
         const [d, m, a] = c.dataVencimento.split('/').map(Number);
         const data = zerarHora(new Date(a, m - 1, d));
         return data.getTime() === hoje.getTime();
      });

      const vencendoSemana = compromissos.filter(c => {
         const [d, m, a] = c.dataVencimento.split('/').map(Number);
         const data = zerarHora(new Date(a, m - 1, d));

         const diffDias = Math.ceil(
            (data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
         );

         return diffDias > 0 && diffDias <= 7;
      });

      return {
         vencidos,
         hoje: vencendoHoje,
         semana: vencendoSemana
      };
   }, [tick]);
}
