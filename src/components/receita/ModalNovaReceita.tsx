import { useState } from 'react'
import { criarReceita } from '@/api/endpoints/receitas'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Receita } from '@/types/Receita'
import {
   formatarMoeda,
   moedaParaNumero
} from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
   aberto: boolean
   onClose: () => void
}

export function ModalNovaReceita({ aberto, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const queryClient = useQueryClient()

   const [descricao, setDescricao] = useState('')
   const [valor, setValor] = useState('')
   const [dataPrevista, setDataPrevista] = useState('')
   const [dataRecebimento, setDataRecebimento] = useState('')

   const criarMutation = useMutation({
      mutationFn: () =>
         criarReceita(
            {
               descricao,
               valor: moedaParaNumero(valor),
               dataPrevista,
               dataRecebimento
            }
         ),
      onSuccess: (novaReceita: Receita) => {
         queryClient.setQueryData<Receita[]>(
            ['receitas', mes, ano],
            old => old ? [...old, novaReceita] : [novaReceita]
         )

         // limpa formulário
         setDescricao('')
         setValor('')
         setDataPrevista('')
         setDataRecebimento('')

         onClose()
      }
   })

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo="Nova receita"
         tipo="inclusao"
         loading={criarMutation.isPending}
         loadingTexto="Salvando..."
         onSalvar={() => criarMutation.mutate()}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">
                  Descrição
               </label>
               <input
                  className="w-full border rounded-md p-2"
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
               />
            </div>

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
                  Data prevista
               </label>
               <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={dataPrevista}
                  onChange={e => setDataPrevista(e.target.value)}
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
