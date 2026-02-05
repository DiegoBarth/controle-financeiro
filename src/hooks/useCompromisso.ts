import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
   listarCompromissos,
   criarCompromisso,
   criarCartao,
   atualizarCompromisso,
   excluirCompromisso
} from '@/api/endpoints/compromisso'
import type { Compromisso } from '@/types/Compromisso'
import { dataBRParaISO } from '@/utils/formatadores'
import { useLocation } from 'react-router-dom'

export function useCompromisso(mes: string, ano: string, chave?: string | null) {
   const queryClient = useQueryClient()
   const queryKey = ['compromissos', chave ?? mes, ano]
   const location = useLocation();
   const enabled = chave
      ? ['/compromissos', '/'].includes(location.pathname)
      : location.pathname === '/compromissos';

   const { data: compromissos = [], isLoading, isError } = useQuery({
      queryKey,
      queryFn: () => listarCompromissos(mes, String(ano)),
      staleTime: Infinity,
      enabled
   })

   const criarMutation = useMutation({
      mutationFn: (novoCompromisso: {
         tipo: 'Fixo' | 'Variável',
         descricao: string,
         categoria: string,
         valor: number,
         dataVencimento: string,
         meses?: number
      }) =>
         criarCompromisso(novoCompromisso),
      onSuccess: (novoCompromisso: Compromisso) => {
         queryClient.setQueryData<Compromisso[]>(
            queryKey,
            old => old ? [...old, novoCompromisso] : [novoCompromisso]
         )
      }
   })

   const criarCartaoMutation = useMutation({
      mutationFn: (novoCompromisso: Omit<Compromisso, 'rowIndex'>) =>
         criarCartao(novoCompromisso),
      onSuccess: (novoCompromisso: Compromisso) => {
         queryClient.setQueryData<Compromisso[]>(
            queryKey,
            old => old ? [...old, novoCompromisso] : [novoCompromisso]
         )
      }
   })

   const atualizarMutation = useMutation({
      mutationFn: (dados: {
         rowIndex: number
         valor: number
         dataPagamento: string
         scope?: 'single'
      }) =>
         atualizarCompromisso(dados),
      onSuccess: (_data, variables) => {
         queryClient.setQueryData<Compromisso[]>(
            queryKey,
            old =>
               old?.map(r =>
                  r.rowIndex === variables.rowIndex
                     ? {
                        ...r,
                        valor: variables.valor,
                        dataPagamento: variables.dataPagamento
                     }
                     : r
               ) ?? []
         )

         queryClient.setQueryData<Compromisso[]>(
            ['compromissos', 'alertas', ano],
            old =>
               old?.map(r =>
                  r.rowIndex === variables.rowIndex
                     ? {
                        ...r,
                        valor: variables.valor,
                        dataPagamento: dataBRParaISO(variables.dataPagamento)
                     }
                     : r
               ) ?? []
         )
      }
   })

   const excluirMutation = useMutation({
      mutationFn: (rowIndex: number) =>
         excluirCompromisso(rowIndex),
      onSuccess: (_data, rowIndex) => {
         queryClient.setQueryData<Compromisso[]>(
            queryKey,
            old => old?.filter(r => r.rowIndex !== rowIndex) ?? []
         )

         queryClient.setQueryData<Compromisso[]>(
            ['compromissos', 'alertas', ano],
            old => old?.filter(r => r.rowIndex !== rowIndex) ?? []
         )
      }
   })

   return {
      compromissos,
      isLoading,
      isError,
      criar: criarMutation.mutateAsync,
      criarCartao: criarCartaoMutation.mutateAsync,
      atualizar: atualizarMutation.mutateAsync,
      excluir: excluirMutation.mutateAsync,
      isSalvando:/* criarMutation.isPending || */atualizarMutation.isPending,
      isExcluindo: excluirMutation.isPending
   }
}
