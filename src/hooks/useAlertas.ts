import { useMemo } from 'react';
import { usePeriodo } from '@/contexts/PeriodoContext';
import { useCompromisso } from '@/hooks/useCompromisso';

function zerarHora(d: Date) {
   const copy = new Date(d);
   copy.setHours(0, 0, 0, 0);
   return copy;
}

export function useAlertas() {
   const { ano } = usePeriodo();
   const { compromissos } = useCompromisso('all', String(ano), 'alertas')

   return useMemo(() => {
      const hoje = zerarHora(new Date());

      const compromissosPendentes = compromissos.filter(c => !c.dataPagamento);

      const vencidos = compromissosPendentes.filter(c => {
         const [d, m, a] = c.dataVencimento.split('/').map(Number);
         const data = zerarHora(new Date(a, m - 1, d));

         const diffDias = Math.ceil(
            (data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
         );

         return diffDias < 0;
      });

      const vencendoHoje = compromissosPendentes.filter(c => {
         const [d, m, a] = c.dataVencimento.split('/').map(Number);
         const data = zerarHora(new Date(a, m - 1, d));
         return data.getTime() === hoje.getTime();
      });

      const vencendoSemana = compromissosPendentes.filter(c => {
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
   }, [compromissos]);
}
