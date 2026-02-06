import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GastoLista } from '@/components/gasto/GastoLista'
import { ModalNovoGasto } from '@/components/gasto/ModalNovoGasto'
import { SkeletonLista } from '@/components/ui/SkeletonLista'
import { ModalEditarGasto } from '@/components/gasto/ModalEditarGasto'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Gasto } from '@/types/Gasto'
import { useGasto } from '@/hooks/useGasto'
import { Layout } from '@/components/layout/Layout'

export function Gasto() {
   const { mes, ano } = usePeriodo()
   const { gastos, isLoading } = useGasto(mes, String(ano))
   const navigate = useNavigate()
   const handleBack = () => navigate('/')

   const [gastoSelecionado, setGastoSelecionado] = useState<Gasto | null>(null)
   const [modalAberto, setModalAberto] = useState(false)

   if (isLoading) {
      return (
         <Layout title="Gastos" onBack={handleBack}>
            <SkeletonLista />
         </Layout>
      )
   }

   return (
      <Layout title="Gastos" onBack={handleBack}>
         <div className="flex justify-end mb-4">
            <button
               onClick={() => setModalAberto(true)}
               className="rounded-full px-5 py-2 text-white font-medium shadow-md hover:brightness-90 transition"
               style={{ backgroundColor: 'rgb(239, 68, 68)' }}
            >
               + Novo Gasto
            </button>
         </div>

         <GastoLista
            gastos={gastos}
            onSelect={setGastoSelecionado}
         />

         <ModalNovoGasto
            aberto={modalAberto}
            onClose={() => setModalAberto(false)}
         />

         <ModalEditarGasto
            aberto={!!gastoSelecionado}
            gasto={gastoSelecionado}
            onClose={() => setGastoSelecionado(null)}
         />
      </Layout>
   )
}
