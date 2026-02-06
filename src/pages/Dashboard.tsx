import { useNavigate } from 'react-router-dom'

import { Cartoes } from '@/components/dashboard/Cartoes'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { ProgressoReceitasDespesas } from '@/components/dashboard/ProgressoReceitasDespesas'
import { SaldoAno } from '@/components/dashboard/SaldoAno'
import { TopCategorias } from '@/components/dashboard/TopCategorias'
import { useDashboard } from '@/hooks/useDashboard'
import { usePeriodo } from '@/contexts/PeriodoContext'
import { Layout } from '@/components/layout/Layout'

export function Dashboard() {
   const { mes, ano, resumo } = usePeriodo();
   const { dashboard, isLoading } = useDashboard(mes, String(ano))

   const navigate = useNavigate()
   const handleBack = () => navigate('/')

   if (isLoading) {
      return (
         <Layout title="Dashboard" onBack={handleBack} containerClassName="max-w-7xl">
            <DashboardSkeleton />
         </Layout>
      )
   }

   return (
      <Layout title="Dashboard" onBack={handleBack} containerClassName="max-w-7xl">
         <div className="space-y-6">
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
      </Layout>
   )
}
