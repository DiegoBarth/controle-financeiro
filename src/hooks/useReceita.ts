import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
   listarReceitas,
   criarReceita,
   atualizarReceita,
   excluirReceita
} from '@/api/endpoints/receita'
import type { Receita } from '@/types/Receita'
import { useApiError } from '@/hooks/useApiError'

export function useReceita(mes: string, ano: string) {
   const queryClient = useQueryClient()
   const { handleError } = useApiError()
   const queryKey = ['receitas', mes, ano]

   const { data: receitas = [], isLoading, isError } = useQuery({
      queryKey,
      queryFn: () => listarReceitas(mes, String(ano)),
      staleTime: Infinity,
      retry: 1
   })

   const criarMutation = useMutation({
      mutationFn: (novaReceita: Omit<Receita, 'rowIndex'>) =>
         criarReceita(novaReceita),
      onSuccess: (novaReceita: Receita) => {
         queryClient.setQueryData<Receita[]>(
            queryKey,
            old => old ? [...old, novaReceita] : [novaReceita]
         )
      },
      onError: (error) => {
         handleError(error)
      }
   })
   
   const atualizarMutation = useMutation({
      mutationFn: (dados: {
         rowIndex: number
         valor: number
         dataRecebimento?: string | null
      }) =>
         atualizarReceita(dados),
         onSuccess: (_data, variables) => {
         queryClient.setQueryData<Receita[]>(
            queryKey,
            old =>
               old?.map(r =>
                  r.rowIndex === variables.rowIndex
                     ? {
                        ...r,
                        valor: variables.valor,
                        dataRecebimento: variables.dataRecebimento
                     }
                     : r
               ) ?? []
         )
      },
      onError: (error) => {
         handleError(error)
      }
   })

   const excluirMutation = useMutation({
      mutationFn: (rowIndex: number) =>
         excluirReceita(rowIndex, mes, String(ano)),
      onSuccess: (_data, rowIndex) => {
         queryClient.setQueryData<Receita[]>(
            queryKey,
            old => old?.filter(r => r.rowIndex !== rowIndex) ?? []
         )
      },
      onError: (error) => {
         handleError(error)
      }
   })

   return {
      receitas,
      isLoading,
      isError,
      criar: criarMutation.mutateAsync,
      atualizar: atualizarMutation.mutateAsync,
      excluir: excluirMutation.mutateAsync,
      isSalvando: criarMutation.isPending || atualizarMutation.isPending,
      isExcluindo: excluirMutation.isPending
   }
}