import { Plus, Minus, Calendar, Wallet, TrendingUp } from "lucide-react"
import { usePeriodo } from '@/contexts/PeriodoContext';
import { ResumoCard } from "@/components/home/ResumoCard"

export function ResumoMes() {
   const { resumo, isLoading } = usePeriodo();

   const totalReceitas = resumo?.totalReceitas ?? 0;
   const totalGastos = resumo?.totalGastos ?? 0;
   const totalCompromissos = resumo?.totalCompromissos ?? 0;
   const totalRecebido = resumo?.totalRecebido ?? 0;
   const totalPago = resumo?.totalPago ?? 0;
   const totalCompromissosPagos = resumo?.totalCompromissosPagos ?? 0;

   const saldoFinalMes = totalReceitas - totalGastos - totalCompromissos;
   const saldoAtual = totalRecebido - totalPago - totalCompromissosPagos;

   return (
      <div className="flex flex-col gap-3">
         <ResumoCard
            titulo="Entradas"
            valor={totalReceitas}
            cor="#3b82f6"
            loading={isLoading}
            icone={<Plus className="h-4 w-4" />}
         />
         <ResumoCard
            titulo="Gastos"
            valor={totalGastos}
            cor="#ef4444"
            loading={isLoading}
            icone={<Minus className="h-4 w-4" />}
         />
         <ResumoCard
            titulo="Compromissos"
            valor={totalCompromissos}
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