import { Plus, Minus, Calendar, Wallet, TrendingUp } from "lucide-react"
import { ResumoCard } from "./ResumoCard"
import { usePeriodo } from '../../contexts/PeriodoContext';

export function ResumoMes() {
      const { resumo, loadingResumo } = usePeriodo();

   if (!resumo) return null;

   const saldoFinalMes =
      resumo.totalReceitas - resumo.totalGastos - resumo.totalCompromissos;

   const saldoAtual =
      resumo.totalRecebido - resumo.totalPago - resumo.totalCompromissosPagos;

   return (
      <div className="flex flex-col gap-3">
         <ResumoCard
            titulo="Entradas"
            valor={resumo.totalReceitas}
            cor="#3b82f6"
            loading={loadingResumo}
            icone={<Plus className="h-4 w-4" />}
         />
         <ResumoCard
            titulo="Gastos"
            valor={resumo.totalGastos}
            cor="#ef4444"
            loading={loadingResumo}
            icone={<Minus className="h-4 w-4" />}
         />
         <ResumoCard
            titulo="Compromissos"
            valor={resumo.totalCompromissos}
            cor="#f59e0b"
            loading={loadingResumo}
            icone={<Calendar className="h-4 w-4" />}
         />
         <ResumoCard
            titulo="Saldo Atual"
            valor={saldoAtual}
            cor="#6366f1"
            loading={loadingResumo}
            icone={<Wallet className="h-4 w-4" />}
         />
         <ResumoCard
            titulo="Saldo Final do Mês"
            valor={saldoFinalMes}
            cor="#8b5cf6"
            loading={loadingResumo}
            icone={<TrendingUp className="h-4 w-4" />}
         />
      </div>
   )
}