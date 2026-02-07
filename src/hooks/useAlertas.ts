import { useMemo } from 'react';
import { ALERTA_SEMANA_DIAS, MS_PER_DAY } from '@/config/constants';
import { usePeriodo } from '@/contexts/PeriodoContext';
import { useCompromisso } from '@/hooks/useCompromisso';

function zerarHora(d: Date) {
   const copy = new Date(d);
   copy.setHours(0, 0, 0, 0);
   return copy;
}

export function useAlertas() {
   const { ano } = usePeriodo();
   const { compromissosAlerta } = useCompromisso('all', String(ano), 'alertas')

   return useMemo(() => {
      const hoje = zerarHora(new Date());

      const compromissosPendentes = compromissosAlerta.filter(c => !c.dataPagamento);

      const vencidos = compromissosPendentes.filter(c => {
         const [d, m, a] = c.dataVencimento.split('/').map(Number);
         const data = zerarHora(new Date(a, m - 1, d));

         const diffDias = Math.ceil(
            (data.getTime() - hoje.getTime()) / MS_PER_DAY
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
            (data.getTime() - hoje.getTime()) / MS_PER_DAY
         );

         return diffDias > 0 && diffDias <= ALERTA_SEMANA_DIAS;
      });

      return {
         vencidos,
         hoje: vencendoHoje,
         semana: vencendoSemana
      };
   }, [compromissosAlerta]);
}
