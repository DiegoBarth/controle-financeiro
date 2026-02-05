import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { atualizarGasto, excluirGasto } from '@/api/endpoints/gastos'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Gasto } from '@/types/Gasto'
import { numeroParaMoeda, moedaParaNumero, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'

interface Props {
   aberto: boolean
   gasto: Gasto | null
   onClose: () => void
}

export function ModalEditarGasto({ aberto, gasto, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const queryClient = useQueryClient()

   const [valor, setValor] = useState('')

   useEffect(() => {
      if (gasto) {
         setValor(numeroParaMoeda(gasto.valor))
      }
   }, [gasto])

   const atualizarMutation = useMutation({
      mutationFn: () =>
         atualizarGasto(
            { rowIndex: gasto!.rowIndex, valor: moedaParaNumero(valor) },
            mes,
            String(ano)
         ),
      onSuccess: () => {
         queryClient.setQueryData<Gasto[]>(
            ['gastos', mes, ano],
            old =>
               old?.map(g =>
                  g.rowIndex === gasto!.rowIndex
                     ? { ...g, valor: moedaParaNumero(valor) }
                     : g
               ) ?? []
         )
         onClose()
      }
   })

   const excluirMutation = useMutation({
      mutationFn: () =>
         excluirGasto(gasto!.rowIndex, mes, String(ano)),
      onSuccess: () => {
         queryClient.setQueryData<Gasto[]>(
            ['gastos', mes, ano],
            old => old?.filter(g => g.rowIndex !== gasto!.rowIndex) ?? []
         )
         onClose()
      }
   })

   if (!gasto) return null

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo={gasto.descricao}
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
         </div>
      </ModalBase>
   )
}
