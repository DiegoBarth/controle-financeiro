import { useEffect, useState } from 'react'
import { atualizarCompromisso, excluirCompromisso } from '@/api/endpoints/compromissos'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Compromisso } from '@/types/Compromisso'
import {
   formatarMoeda,
   moedaParaNumero,
   numeroParaMoeda
} from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
   aberto: boolean
   compromisso: Compromisso | null
   onClose: () => void
   onConfirmar: (rowIndex: number) => void
}

export function ModalEditarCompromisso({
   aberto,
   compromisso,
   onClose,
   onConfirmar
}: Props) {
   const { mes, ano } = usePeriodo()
   const queryClient = useQueryClient()

   const [valor, setValor] = useState('')
   const [dataPagamento, setDataPagamento] = useState('')

   useEffect(() => {
      if (compromisso) {
         setValor(numeroParaMoeda(compromisso.valor))
         setDataPagamento(new Date().toISOString().slice(0, 10))
      }
   }, [compromisso])

   const atualizarMutation = useMutation({
      mutationFn: () =>
         atualizarCompromisso(
            {
               rowIndex: compromisso!.rowIndex,
               valor: moedaParaNumero(valor),
               dataPagamento
            },
            mes,
            String(ano)
         ),
      onSuccess: () => {
         queryClient.setQueryData<Compromisso[]>(
            ['compromissos', mes, ano],
            old =>
               old?.map(c =>
                  c.rowIndex === compromisso!.rowIndex
                     ? { ...c, valor: moedaParaNumero(valor) }
                     : c
               ) ?? []
         )
         if (compromisso) {
            onConfirmar(compromisso.rowIndex)
         }
         onClose()
      }
   })

   const excluirMutation = useMutation({
      mutationFn: () =>
         excluirCompromisso(compromisso!.rowIndex, mes, String(ano)),
      onSuccess: () => {
         queryClient.setQueryData<Compromisso[]>(
            ['compromissos', mes, ano],
            old =>
               old?.filter(c => c.rowIndex !== compromisso!.rowIndex) ?? []
         )

         if (compromisso) {
            onConfirmar(compromisso.rowIndex)
         }
         onClose()
      }
   })

   if (!compromisso) return null

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo={compromisso.descricao}
         tipo="edicao"
         loading={atualizarMutation.isPending || excluirMutation.isPending}
         onSalvar={() => atualizarMutation.mutate()}
         onExcluir={() => excluirMutation.mutate()}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">
                  Valor
               </label>
               <input
                  className="w-full border rounded-md p-2"
                  value={valor}
                  onChange={e => setValor(formatarMoeda(e.target.value))}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">
                  Data de pagamento
               </label>
               <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={dataPagamento}
                  onChange={e => setDataPagamento(e.target.value)}
               />
            </div>
         </div>
      </ModalBase>
   )
}
