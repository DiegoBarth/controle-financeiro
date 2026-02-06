import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ModalNovaReceita } from '@/components/receita/ModalNovaReceita'
import { ReceitaLista } from '@/components/receita/ReceitaLista'
import { SkeletonLista } from '@/components/ui/SkeletonLista'
import { ModalEditarReceita } from '@/components/receita/ModalEditarReceita'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Receita } from '@/types/Receita'
import { useReceita } from '@/hooks/useReceita'
import { Layout } from '@/components/layout/Layout'

export function Receita() {
   const { mes, ano } = usePeriodo()
   const { receitas, isLoading } = useReceita(mes, String(ano))
   const navigate = useNavigate()
   const handleBack = () => navigate('/')

   const [receitaSelecionada, setReceitaSelecionada] = useState<Receita | null>(null)
   const [modalAberto, setModalAberto] = useState(false)

   if (isLoading) {
      return (
         <Layout title="Receitas" onBack={handleBack}>
            <SkeletonLista />
         </Layout>
      )
   }

   return (
      <Layout title="Receitas" onBack={handleBack}>
         <div className="flex justify-end mb-4">
            <button
               onClick={() => setModalAberto(true)}
               className="rounded-full px-5 py-2 text-white font-medium shadow"
               style={{ backgroundColor: 'rgb(59, 130, 246)' }}
            >
               + Nova receita
            </button>
         </div>

         <ReceitaLista
            receitas={receitas}
            onSelect={setReceitaSelecionada}
         />

         <ModalNovaReceita
            aberto={modalAberto}
            onClose={() => setModalAberto(false)}
         />

         <ModalEditarReceita
            aberto={!!receitaSelecionada}
            receita={receitaSelecionada}
            onClose={() => setReceitaSelecionada(null)}
         />
      </Layout>
   )
}