import { Plus, Minus, Calendar, Wallet, TrendingUp } from "lucide-react"
import { usePeriodo } from '../../contexts/PeriodoContext';
import { ResumoCard } from "./ResumoCard"

export function ResumoMes() {
      const { resumo, isLoading } = usePeriodo();

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
            loading={isLoading}
            icone={<Plus className="h-4 w-4" />}
         />
         <ResumoCard
            titulo="Gastos"
            valor={resumo.totalGastos}
            cor="#ef4444"
            loading={isLoading}
            icone={<Minus className="h-4 w-4" />}
         />
         <ResumoCard
            titulo="Compromissos"
            valor={resumo.totalCompromissos}
            cor="#f59e0b"
            loading={isLoading}
            icone={<Calendar className="h-4 w-4" />}
         />
         <ResumoCard
            titulo="Saldo Atual"
            valor={saldoAtual}
            cor="#6366f1"
            loading={isLoading}
            icone={<Wallet className="h-4 w-4" />}
         />
         <ResumoCard
            titulo="Saldo Final do Mês"
            valor={saldoFinalMes}
            cor="#8b5cf6"
            loading={isLoading}
            icone={<TrendingUp className="h-4 w-4" />}
         />
      </div>
   )
}