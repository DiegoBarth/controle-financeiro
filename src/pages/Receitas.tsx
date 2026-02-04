import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarReceitas } from '@/api/endpoints/receitas'
import { ModalNovaReceita } from '@/components/receita/ModalNovaReceita'
import { ReceitaLista } from '@/components/receita/ReceitaLista'
import { SkeletonLista } from '@/components/ui/SkeletonLista'
import { receitasCache } from '../cache/receitasCache'
import { ModalEditarReceita } from '../components/receita/ModalEditarReceita'
import { usePeriodo } from '../contexts/PeriodoContext'
import type { Receita } from '../types/Receita'

export function Receitas() {
   const { mes, ano } = usePeriodo()
   const [receitas, setReceitas] = useState<Receita[]>([])
   const [loading, setLoading] = useState(false)
   const [receitaSelecionada, setReceitaSelecionada] =
      useState<Receita | null>(null)
   const [modalAberto, setModalAberto] = useState(false)

   const navigate = useNavigate()

   async function buscar() {
      setLoading(true)
      const res = await listarReceitas(mes, String(ano))
      setReceitas(res)
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

         {/* Botão Nova Receita */}
         <div className="flex justify-end mb-4">
            <button
               onClick={() => setModalAberto(true)}
               className="
            rounded-full px-5 py-2 text-white font-medium
            shadow-md hover:brightness-90 transition
          "
               style={{ backgroundColor: 'rgb(59, 130, 246)' }}
            >
               + Nova receita
            </button>
         </div>

         {/* Lista de Receitas */}
         <h2 className="text-lg font-semibold mb-2">Receitas</h2>

         {loading ? (
            <p>Carregando...</p>
         ) : receitas.length === 0 ? (
            <p className="text-gray-500">Nenhuma receita encontrada</p>
         ) : (
            <ReceitaLista
               receitas={receitas}
               onSelect={setReceitaSelecionada}
            />
         )}

         {/* Modal Nova Receita */}
         <ModalNovaReceita
            aberto={modalAberto}
            onClose={() => setModalAberto(false)}
            onSalvar={() => {
               const atualizados = receitasCache.get(mes, ano) || []
               setReceitas([...atualizados])
            }}
         />

         {/* Modal Editar Receita */}
         <ModalEditarReceita
            aberto={!!receitaSelecionada}
            receita={receitaSelecionada}
            onClose={() => setReceitaSelecionada(null)}
            onConfirmar={() => {
               const atualizados = receitasCache.get(mes, ano) || []
               setReceitas(atualizados)
               setReceitaSelecionada(null)
            }}
         />
      </div>
   )
}
