import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompromissoLista } from '@/components/compromisso/CompromissoLista'
import { ModalEditarCompromisso } from '@/components/compromisso/ModalEditarCompromisso'
import { ModalNovoCompromisso } from '@/components/compromisso/ModalNovoCompromisso'
import { SkeletonLista } from '@/components/ui/SkeletonLista'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Compromisso } from '@/types/Compromisso'
import { useCompromisso } from '@/hooks/useCompromisso'
import { Layout } from '@/components/layout/Layout'

export function Compromisso() {
   const { mes, ano } = usePeriodo()
   const { compromissos, isLoading } = useCompromisso(mes, String(ano))
   const [compromissoSelecionado, setCompromissoSelecionado] =
      useState<Compromisso | null>(null)
   const [modalAberto, setModalAberto] = useState(false)
   const navigate = useNavigate()

   const handleBack = () => navigate('/')

   if (isLoading) {
      return (
         <Layout title="Compromissos" onBack={handleBack}>
            <SkeletonLista />
         </Layout>
      )
   }

   return (
      <Layout title="Compromissos" onBack={handleBack}>
         <div className="flex justify-end mb-4">
            <button
               onClick={() => setModalAberto(true)}
               className="rounded-full px-5 py-2 text-white font-medium shadow-md hover:brightness-90 transition"
               style={{ backgroundColor: 'rgb(245, 158, 11)' }}
            >
               + Novo Compromisso
            </button>
         </div>

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
      </Layout>
   )
}
