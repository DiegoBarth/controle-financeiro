import { useEffect, useState } from 'react'
import { listarCompromissos } from '@/api/compromissos'
import type { Compromisso } from '@/types/Compromisso'
import { CompromissoLista } from '@/components/compromissos/CompromissoLista'
import { ModalNovoCompromisso } from '@/components/compromissos/ModalNovoCompromisso'
import { ModalEditarCompromisso } from '@/components/compromissos/ModalEditarCompromisso'
import { usePeriodo } from '@/contexts/PeriodoContext'
import { useNavigate } from 'react-router-dom'
import { compromissosCache } from '@/cache/compromissosCache'
import { SkeletonLista } from '@/components/ui/SkeletonLista'

export function Compromissos() {
   const { mes, ano } = usePeriodo()
   const [compromissos, setCompromissos] = useState<Compromisso[]>([])
   const [loading, setLoading] = useState(false)
   const [compromissoSelecionado, setCompromissoSelecionado] =
      useState<Compromisso | null>(null)
   const [modalAberto, setModalAberto] = useState(false)

   const navigate = useNavigate()

   async function buscar() {
      setLoading(true)
      const res = await listarCompromissos(mes, String(ano))
      setCompromissos(res)
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

         {/* Botão Novo Compromisso */}
         <div className="flex justify-end mb-4">
            <button
               onClick={() => setModalAberto(true)}
               className="
                  rounded-full px-5 py-2 text-white font-medium
                  shadow-md hover:brightness-90 transition
               "
               style={{ backgroundColor: 'rgb(245, 158, 11)' }}
            >
               + Novo Compromisso
            </button>
         </div>

         {/* Lista de Compromissos */}
         <h2 className="text-lg font-semibold mb-2">Compromissos</h2>

         {loading ? (
            <p>Carregando...</p>
         ) : compromissos.length === 0 ? (
            <p className="text-gray-500">Nenhum compromisso encontrado</p>
         ) : (
            <CompromissoLista
               compromissos={compromissos}
               onSelect={setCompromissoSelecionado}
            />
         )}

         {/* Modal Novo Compromisso */}
         <ModalNovoCompromisso
            aberto={modalAberto}
            onClose={() => setModalAberto(false)}
            onSalvar={() => {
               const atualizados = compromissosCache.get(mes, ano) || []
               setCompromissos([...atualizados])
            }}
         />

         {/* Modal Editar Compromisso */}
         <ModalEditarCompromisso
            aberto={!!compromissoSelecionado}
            compromisso={compromissoSelecionado}
            onClose={() => setCompromissoSelecionado(null)}
            onConfirmar={() => {
               const atualizados = compromissosCache.get(mes, ano) || []
               setCompromissos(atualizados)
               setCompromissoSelecionado(null)
            }}
         />
      </div>
   )
}
