import { usePeriodo } from '../../contexts/PeriodoContext';
import { ResumoCard } from './ResumoCard';

export function ResumoMes() {
   const { resumo, loadingResumo } = usePeriodo();

   if (!resumo) return null;

   const saldoFinalMes =
      resumo.totalReceitas - resumo.totalGastos - resumo.totalCompromissos;

   const saldoAtual =
      resumo.totalRecebido - resumo.totalPago - resumo.totalCompromissosPagos;

   return (
      <div style={{ display: 'grid', gap: 12 }}>
         <ResumoCard titulo="Entradas" valor={resumo.totalReceitas} cor="#3498db" loading={loadingResumo} />
         <ResumoCard titulo="Gastos" valor={resumo.totalGastos} cor="#e74c3c" loading={loadingResumo} />
         <ResumoCard titulo="Compromissos" valor={resumo.totalCompromissos} cor="#f39c12" loading={loadingResumo} />
         <ResumoCard titulo="Saldo Atual" valor={saldoAtual} cor={saldoAtual >= 0 ? '#2ecc71' : '#e74c3c'} loading={loadingResumo} />
         <ResumoCard titulo="Saldo Final do Mês" valor={saldoFinalMes} cor={saldoFinalMes >= 0 ? '#3498db' : '#e67e22'} loading={loadingResumo} />
      </div>
   );
}
