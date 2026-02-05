import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompromissoLista } from '@/components/compromissos/CompromissoLista'
import { ModalEditarCompromisso } from '@/components/compromissos/ModalEditarCompromisso'
import { ModalNovoCompromisso } from '@/components/compromissos/ModalNovoCompromisso'
import { SkeletonLista } from '@/components/ui/SkeletonLista'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Compromisso } from '@/types/Compromisso'
import { useCompromissos } from '@/hooks/useCompromissos'

export function Compromissos() {
   const { mes, ano } = usePeriodo()
   const { compromissos, isLoading } = useCompromissos(mes, String(ano))
   const [compromissoSelecionado, setCompromissoSelecionado] =
      useState<Compromisso | null>(null)
   const [modalAberto, setModalAberto] = useState(false)
   const navigate = useNavigate()

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
               style={{ backgroundColor: 'rgb(245, 158, 11)' }}
            >
               + Novo Compromisso
            </button>
         </div>

         <h2 className="text-lg font-semibold mb-2">Compromissos</h2>

         <CompromissoLista
            compromissos={compromissos}
            onSelect={setCompromissoSelecionado}
         />

         <ModalNovoCompromisso
            aberto={modalAberto}
            onClose={() => setModalAberto(false)}
         />

         <ModalEditarCompromisso
            aberto={!!compromissoSelecionado}
            compromisso={compromissoSelecionado}
            onClose={() => setCompromissoSelecionado(null)}
            onConfirmar={() => { }}
         />
      </div>
   )
}