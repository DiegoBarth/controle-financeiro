import { useEffect, useState } from 'react';
import { listarResumoCompleto } from '../../api/home';
import type { ResumoCompleto } from '../../types/ResumoCompleto';
import { usePeriodo } from '../../contexts/PeriodoContext';
import { ResumoCard } from './ResumoCard'; // seu componente já existente

export function ResumoMes() {
   const { mes, ano } = usePeriodo();
   const [resumo, setResumo] = useState<ResumoCompleto>({
      totalReceitas: 0,
      totalGastos: 0,
      totalCompromissos: 0
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

   const saldo = resumo.totalReceitas - resumo.totalGastos - resumo.totalCompromissos;

   return (
      <div style={{ display: 'grid', gap: 12 }}>
         <ResumoCard titulo="Entradas" valor={resumo.totalReceitas} cor="#3498db" loading={loading} />
         <ResumoCard titulo="Gastos" valor={resumo.totalGastos} cor="#e74c3c" loading={loading} />
         <ResumoCard titulo="Compromissos" valor={resumo.totalCompromissos} cor="#f39c12" loading={loading} />
         <ResumoCard titulo="Saldo" valor={saldo} cor={saldo >= 0 ? '#2ecc71' : '#e74c3c'} loading={loading} />
      </div>
   );
}
