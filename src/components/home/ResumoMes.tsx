import { useEffect, useState } from 'react';
import { listarResumoCompleto } from '../../api/home';
import type { ResumoCompleto } from '../../types/ResumoCompleto';
import { usePeriodo } from '../../contexts/PeriodoContext';
import { ResumoCard } from './ResumoCard';

export function ResumoMes() {
   const { mes, ano } = usePeriodo();
   const [resumo, setResumo] = useState<ResumoCompleto>({
      totalReceitas: 0,
      totalGastos: 0,
      totalCompromissos: 0,
      totalRecebido: 0,
      totalPago: 0,
      totalCompromissosPagos: 0
   });

   const [loading, setLoading] = useState(false);

   async function buscarResumo() {
      setLoading(true);
      try {
         const res = await listarResumoCompleto(mes, String(ano));
         setResumo(res);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      buscarResumo();
   }, [mes, ano]);

   const saldoFinalMes = resumo.totalReceitas - resumo.totalGastos - resumo.totalCompromissos;
   const saldoAtual = resumo.totalRecebido - resumo.totalPago - resumo.totalCompromissosPagos;

   return (
      <div style={{ display: 'grid', gap: 12 }}>
         <ResumoCard titulo="Entradas" valor={resumo.totalReceitas} cor="#3498db" loading={loading} />
         <ResumoCard titulo="Gastos" valor={resumo.totalGastos} cor="#e74c3c" loading={loading} />
         <ResumoCard titulo="Compromissos" valor={resumo.totalCompromissos} cor="#f39c12" loading={loading} />
         <ResumoCard titulo="Saldo Atual" valor={saldoAtual} cor={saldoAtual >= 0 ? '#2ecc71' : '#e74c3c'} loading={loading} />
         <ResumoCard titulo="Saldo Final do Mês" valor={saldoFinalMes} cor={saldoFinalMes >= 0 ? '#3498db' : '#e67e22'} loading={loading} />
      </div>
   );
}
