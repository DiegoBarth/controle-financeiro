import { useEffect, useState } from 'react'
import { atualizarReceita, excluirReceita } from '@/api/endpoints/receitas'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Receita } from '@/types/Receita'
import {
   numeroParaMoeda,
   moedaParaNumero,
   dataBRParaISO,
   formatarMoeda,
   formatarDataBR
} from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
   aberto: boolean
   receita: Receita | null
   onClose: () => void
}

export function ModalEditarReceita({ aberto, receita, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const queryClient = useQueryClient()

   const [valor, setValor] = useState('')
   const [dataRecebimento, setDataRecebimento] = useState('')

   useEffect(() => {
      if (receita) {
         console.log(receita)
         setValor(numeroParaMoeda(receita.valor))
         setDataRecebimento(
            receita.dataRecebimento
               ? dataBRParaISO(receita.dataRecebimento)
               : new Date().toISOString().slice(0, 10)
         )
      }
   }, [receita])

   const atualizarMutation = useMutation({
      mutationFn: () =>
         atualizarReceita(
            {
               rowIndex: receita!.rowIndex,
               valor: moedaParaNumero(valor),
               dataRecebimento
            },
            mes,
            String(ano)
         ),
      onSuccess: () => {
         queryClient.setQueryData<Receita[]>(
            ['receitas', mes, ano],
            old =>
               old?.map(r =>
                  r.rowIndex === receita!.rowIndex
                     ? { ...r, valor: moedaParaNumero(valor), dataRecebimento: formatarDataBR(String(dataRecebimento)) }
                     : r
               ) ?? []
         )
         onClose()
      }
   })

   const excluirMutation = useMutation({
      mutationFn: () =>
         excluirReceita(receita!.rowIndex, mes, String(ano)),
      onSuccess: () => {
         queryClient.setQueryData<Receita[]>(
            ['receitas', mes, ano],
            old => old?.filter(r => r.rowIndex !== receita!.rowIndex) ?? []
         )
         onClose()
      }
   })

   if (!receita) return null

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo={receita.descricao}
         tipo="edicao"
         loading={atualizarMutation.isPending || excluirMutation.isPending}
         onSalvar={() => atualizarMutation.mutate()}
         onExcluir={() => excluirMutation.mutate()}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">Valor</label>
               <input
                  className="w-full border rounded-md p-2"
                  value={valor}
                  onChange={e => setValor(formatarMoeda(e.target.value))}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">
                  Data de recebimento
               </label>
               <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={dataRecebimento}
                  onChange={e => setDataRecebimento(e.target.value)}
               />
            </div>
         </div>
      </ModalBase>
   )
}
