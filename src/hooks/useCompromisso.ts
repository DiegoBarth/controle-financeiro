import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
   listarCompromissos,
   criarCompromisso,
   criarCartao,
   atualizarCompromisso,
   excluirCompromisso
} from '@/api/endpoints/compromisso'
import type { Compromisso } from '@/types/Compromisso'
import { dataBRParaISO, getMesAno } from '@/utils/formatadores'

export function useCompromisso(mes: string, ano: string, chave?: string | null) {
   const queryClient = useQueryClient()
   const queryKey = ['compromissos', chave ?? mes, ano]

   const { data: compromissos = [], isLoading, isError } = useQuery({
      queryKey,
      queryFn: () => listarCompromissos(mes, String(ano)),
      staleTime: Infinity
   })

   const { data: compromissosAlerta = [] } = useQuery({
      queryKey,
      queryFn: () => listarCompromissos(mes, String(ano)),
      staleTime: Infinity
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
      onSuccess: (registrosCriados: Compromisso[]) => {
         inserirNoCache(registrosCriados)
      }
   })

   const criarCartaoMutation = useMutation({
      mutationFn: (novoCompromisso: Omit<Compromisso, 'rowIndex'>) =>
         criarCartao(novoCompromisso),

      onSuccess: (registrosCriados: Compromisso[]) => {
         inserirNoCache(registrosCriados)
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

   function inserirNoCache(registros: Compromisso[]) {
      registros.forEach(registro => {
         const { mes, ano } = getMesAno(registro.dataVencimento)
         queryClient.setQueryData<Compromisso[]>(
            ['compromissos', mes, ano],
            old => old ? [...old, registro] : [registro]
         )

         queryClient.setQueryData<Compromisso[]>(
            ['compromissos', 'alertas', ano],
            old => old ? [...old, registro] : [registro]
         )
      })
   }

   return {
      compromissos,
      compromissosAlerta,
      isLoading,
      isError,
      criar: criarMutation.mutateAsync,
      criarCartao: criarCartaoMutation.mutateAsync,
      atualizar: atualizarMutation.mutateAsync,
      excluir: excluirMutation.mutateAsync,
      isSalvando: criarMutation.isPending || criarCartaoMutation.isPending || atualizarMutation.isPending,
      isExcluindo: excluirMutation.isPending
   }
}
