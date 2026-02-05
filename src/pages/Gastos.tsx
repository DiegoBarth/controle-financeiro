import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { listarGastos } from '@/api/endpoints/gastos'
import { GastoLista } from '@/components/gastos/GastoLista'
import { ModalNovoGasto } from '@/components/gastos/ModalNovoGasto'
import { SkeletonLista } from '@/components/ui/SkeletonLista'
import { ModalEditarGasto } from '@/components/gastos/ModalEditarGasto'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Gasto } from '@/types/Gasto'

export function Gastos() {
   const { mes, ano } = usePeriodo()
   const navigate = useNavigate()

   const [gastoSelecionado, setGastoSelecionado] = useState<Gasto | null>(null)
   const [modalAberto, setModalAberto] = useState(false)

   const { data: gastos = [], isLoading, isFetching } = useQuery({
      queryKey: ['gastos', mes, ano],
      queryFn: () => listarGastos(mes, ano),
      placeholderData: previous => previous ?? []
   })

   if (isLoading) {
      return (
         <div className="mx-auto max-w-5xl p-4">
            <SkeletonLista />
         </div>
      )
   }

   return (
      <div className="p-4 max-w-3xl mx-auto">
         <button
            className="mb-4 px-3 py-1 rounded-md border hover:bg-gray-100 transition"
            onClick={() => navigate('/')}
         >
            ← Voltar
         </button>

         <div className="flex justify-end mb-4">
            <button
               onClick={() => setModalAberto(true)}
               className="rounded-full px-5 py-2 text-white font-medium shadow-md hover:brightness-90 transition"
               style={{ backgroundColor: 'rgb(239, 68, 68)' }}
            >
               + Novo Gasto
            </button>
         </div>

         <h2 className="text-lg font-semibold mb-2">Gastos</h2>

         {isFetching && gastos.length === 0 && <SkeletonLista />}

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
      </div>
   )
}
