import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarGastos } from '@/api/endpoints/gastos'
import { gastosCache } from '@/cache/gastosCache'
import { GastoLista } from '@/components/gastos/GastoLista'
import { ModalNovoGasto } from '@/components/gastos/ModalNovoGasto'
import { SkeletonLista } from '@/components/ui/SkeletonLista'
import { ModalEditarGasto } from '../components/gastos/ModalEditarGasto'
import { usePeriodo } from '../contexts/PeriodoContext'
import type { Gasto } from '../types/Gasto'

export function Gastos() {
   const { mes, ano } = usePeriodo()
   const [gastos, setGastos] = useState<Gasto[]>([])
   const [loading, setLoading] = useState(false)
   const [gastoSelecionado, setGastoSelecionado] =
      useState<Gasto | null>(null)
   const [modalAberto, setModalAberto] = useState(false)

   const navigate = useNavigate()

   async function buscar() {
      setLoading(true)
      const res = await listarGastos(mes, ano)
      setGastos(res)
      setLoading(false)
   }

   useEffect(() => {
      buscar()
   }, [mes, ano])

   if (loading) {
      return (
         <div className="mx-auto max-w-5xl p-4">
            <SkeletonLista />
         </div>
      )
   }


   return (
      <div className="p-4 max-w-3xl mx-auto">
         {/* Voltar */}
         <button
            className="mb-4 px-3 py-1 rounded-md border hover:bg-gray-100 transition"
            onClick={() => navigate('/')}
         >
            ← Voltar
         </button>

         {/* Botão Novo Gasto */}
         <div className="flex justify-end mb-4">
            <button
               onClick={() => setModalAberto(true)}
               className="
            rounded-full px-5 py-2 text-white font-medium
            shadow-md hover:brightness-90 transition
          "
               style={{ backgroundColor: 'rgb(239, 68, 68)' }}
            >
               + Novo Gasto
            </button>
         </div>

         {/* Lista de Gastos */}
         <h2 className="text-lg font-semibold mb-2">Gastos</h2>

         {loading ? (
            <p>Carregando...</p>
         ) : gastos.length === 0 ? (
            <p className="text-gray-500">Nenhum gasto encontrado</p>
         ) : (
            <GastoLista
               gastos={gastos}
               onSelect={setGastoSelecionado}
            />
         )}

         {/* Modal Novo Gasto */}
         <ModalNovoGasto
            aberto={modalAberto}
            onClose={() => setModalAberto(false)}
            onSalvar={() => {
               const atualizados = gastosCache.get(mes, ano) || []
               setGastos([...atualizados])
            }}
         />

         {/* Modal Editar Gasto */}
         <ModalEditarGasto
            aberto={!!gastoSelecionado}
            gasto={gastoSelecionado}
            onClose={() => setGastoSelecionado(null)}
            onConfirmar={() => {
               const atualizados = gastosCache.get(mes, ano) || []
               setGastos(atualizados)
               setGastoSelecionado(null)
            }}
         />
      </div>
   )
}
