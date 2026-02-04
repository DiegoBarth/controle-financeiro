import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../contexts/DashboardContext'

import { SaldoAno } from '../components/dashboard/SaldoAno'
import { TopCategorias } from '../components/dashboard/TopCategorias'
import { Cartoes } from '../components/dashboard/Cartoes'
import { ProgressoReceitasDespesas } from '../components/dashboard/ProgressoReceitasDespesas'
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton'

export function Dashboard() {
   const {
      saldoAno,
      topCategorias,
      cartoes,
      resumo,
      loading,
   } = useDashboard()

   const navigate = useNavigate()

   if (loading) {
      return (
         <div className="mx-auto max-w-5xl p-4">
            <DashboardSkeleton />
         </div>
      )
   }

   return (
      <div className="mx-auto max-w-5xl space-y-6 p-4">
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
            loading={loading}
         />

         {/* Cartões ficam por último */}
         <Cartoes
            cartoes={cartoes}
            loading={loading}
         />

         {/* Grid principal */}
         <div className="grid gap-6 md:grid-cols-2">
            <SaldoAno
               data={saldoAno}
               loading={loading}
            />

            <TopCategorias
               categorias={topCategorias}
               loading={loading}
            />
         </div>

      </div>
   )
}
