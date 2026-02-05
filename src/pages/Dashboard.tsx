import { useNavigate } from 'react-router-dom'

import { Cartoes } from '../components/dashboard/Cartoes'
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton'
import { ProgressoReceitasDespesas } from '../components/dashboard/ProgressoReceitasDespesas'
import { SaldoAno } from '../components/dashboard/SaldoAno'
import { TopCategorias } from '../components/dashboard/TopCategorias'
import { useDashboard } from '@/hooks/useDashboard'
import { usePeriodo } from '@/contexts/PeriodoContext'

export function Dashboard() {
   const { mes, ano, resumo } = usePeriodo();
   const { dashboard, isLoading } = useDashboard(mes, String(ano))

   const navigate = useNavigate()

   if (isLoading) {
      return (
         <div className="mx-auto max-w-5xl p-4">
            <DashboardSkeleton />
         </div>
      )
   }

   return (
      <div className="mx-auto max-w-7xl space-y-6 p-4">
         <button
            className="mb-4 px-3 py-1 rounded-md border hover:bg-gray-100 transition"
            onClick={() => navigate('/')}
         >
            ← Voltar
         </button>

         <h1 className="text-xl font-semibold">Dashboard</h1>

         {/* Progresso é prioridade */}
         <ProgressoReceitasDespesas
            resumo={resumo}
         />

         {/* Cartões ficam por último */}
         <Cartoes
            cartoes={dashboard.resumoCartoes}
         />

         {/* Grid principal */}
         <div className="grid gap-6 md:grid-cols-2">
            <SaldoAno
               data={dashboard.saldoMensal}
            />

            <TopCategorias
               categorias={dashboard.topCategorias}
            />
         </div>

      </div>
   )
}
