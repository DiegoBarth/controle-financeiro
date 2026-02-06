import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
   listarGastos,
   criarGasto,
   atualizarGasto,
   excluirGasto
} from '@/api/endpoints/gasto'
import type { Gasto } from '@/types/Gasto'

export function useGasto(mes: string, ano: string) {
   const queryClient = useQueryClient()
   const queryKey = ['gastos', mes, ano]

   const { data: gastos = [], isLoading, isError } = useQuery({
      queryKey,
      queryFn: () => listarGastos(mes, String(ano)),
      staleTime: Infinity
   })

   const criarMutation = useMutation({
      mutationFn: (novoGasto: Omit<Gasto, 'rowIndex'>) =>
         criarGasto(novoGasto),
      onSuccess: (novoGasto: Gasto) => {
         queryClient.setQueryData<Gasto[]>(
            queryKey,
            old => old ? [...old, novoGasto] : [novoGasto]
         )
      }
   })

   const atualizarMutation = useMutation({
      mutationFn: (dados: {
         rowIndex: number
         valor: number
      }) =>
         atualizarGasto(dados),
      onSuccess: (_data, variables) => {
         queryClient.setQueryData<Gasto[]>(
            queryKey,
            old =>
               old?.map(r =>
                  r.rowIndex === variables.rowIndex
                     ? {
                        ...r,
                        valor: variables.valor
                     }
                     : r
               ) ?? []
         )

         queryClient.invalidateQueries({
            queryKey: ['resumo', mes, ano],
         })
      }
   })

   const excluirMutation = useMutation({
      mutationFn: (rowIndex: number) =>
         excluirGasto(rowIndex, mes, String(ano)),
      onSuccess: (_data, rowIndex) => {
         queryClient.setQueryData<Gasto[]>(
            queryKey,
            old => old?.filter(r => r.rowIndex !== rowIndex) ?? []
         )
      }
   })

   return {
      gastos,
      isLoading,
      isError,
      criar: criarMutation.mutateAsync,
      atualizar: atualizarMutation.mutateAsync,
      excluir: excluirMutation.mutateAsync,
      isSalvando: criarMutation.isPending || atualizarMutation.isPending,
      isExcluindo: excluirMutation.isPending
   }
}
