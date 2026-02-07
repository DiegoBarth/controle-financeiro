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
import { useApiError } from '@/hooks/useApiError'

/**
 * Hook para gerenciar compromissos/obrigações financeiras
 * 
 * Responsabilidades:
 * - Buscar compromissos do período
 * - Buscar compromissos de alerta (vencendo)
 * - Criar, atualizar e excluir compromissos
 * - Sincronizar multiple query caches após mutations
 * - Centralizar errors via useApiError
 * 
 * Conceito de "Alertas":
 * - Busca compromissos de todos os meses do ano
 * - Filtra apenas os próximos a vencer
 * - Aparece em toast notifications
 * 
 * @param mes - Mês em formato "1"-"12" ou "all" para alertas
 * @param ano - Ano como string (ex: "2025")
 * @param chave - Chave customizada para cache (ex: "alertas")
 * 
 * @returns Objeto com dados, mutations, e estados
 * 
 * @example
 * const { compromissos, criar, atualizar } = useCompromisso('2', '2025');
 */
export function useCompromisso(mes: string, ano: string, chave?: string | null) {
   // ===== Setup =====
   const queryClient = useQueryClient()
   const { handleError } = useApiError()

   // Query key: ['compromissos', '2', '2025'] ou ['compromissos', 'alertas', '2025']
   const queryKey = ['compromissos', chave ?? mes, ano]

   // ===== Query: Listar Compromissos do Mês =====
   /**
    * Query que busca compromissos APENAS do mês/ano selecionado
    * 
    * Uso: Exibir na página atual (Home, lista de compromissos)
    * 
    * Estratégia:
    * - staleTime: Infinity = dados nunca expiram, apenas invalidados por mutations
    * - retry: 1 = tenta reconectar 1x em caso de erro de rede
    * - queryKey muda quando mes/ano mudam = novo fetch automático
    */
   const { data: compromissos = [], isLoading, isError } = useQuery({
      queryKey: ['compromissos', mes, ano],
      queryFn: () => listarCompromissos(mes, String(ano)),
      staleTime: Infinity,
      retry: 1
   })

   // ===== Query: Compromissos de Alerta (TODO O ANO) =====
   /**
    * Query SEPARADA que busca compromissos de TODOS os meses do ano
    * 
    * Uso: Exibir alertas regardless qual mês está selecionado
    * 
    * Comportamento:
    * - Busca com mes='all' = retorna todos os compromissos do ano
    * - Filtra apenas compromissos vencendo (próximos 7 dias ou vencidos)
    * - Não pago (dataPagamento é null)
    * 
    * Exemplo:
    * - Usuário em Janeiro visualizando dados de Janeiro
    * - Mas tem alerta de compromisso que vence em Fevereiro
    * - Este alerta aparece na tela de Home (Alertas.tsx)
    * 
    * QueryKey separada: 'compromissos-alerta' nunca conflita com query do mês
    * Permite que ambas queries rodem independentemente
    */
   const { data: compromissosAlerta = [] } = useQuery({
      queryKey: ['compromissos-alerta', ano], // Key diferente! Não conflita
      queryFn: () => listarCompromissos('all', String(ano)), // Busca TODO ano
      staleTime: Infinity,
      retry: 1,
      enabled: chave === 'alertas' // Só executa quando requisitado
   })

   // ===== Mutation: Criar Compromisso =====
   /**
    * Suporta criar compromissos fixos (mensal) ou variáveis (pontuais)
    * 
    * Fixo: Se meses=12, cria entrada para cada mês do ano
    * Variável: Cria apenas para o mês especificado
    * 
    * Cache sync strategy:
    * - onSuccess: Chama inserirNoCache() que atualiza TODOS os caches relevantes
    * - Garante que novo item aparece em dashboard, lista, alertas, etc
    */
   const criarMutation = useMutation({
      mutationFn: (novoCompromisso: {
         tipo: 'Fixo' | 'Variável',
         descricao: string,
         categoria: string,
         valor: number,
         dataVencimento: string,
         meses?: number  // Número de meses a criar (só para Fixo)
      }) =>
         criarCompromisso(novoCompromisso),
      onSuccess: (registrosCriados: Compromisso[]) => {
         // Insere novos registros em TODOS os caches relevantes
         inserirNoCache(registrosCriados)
      },
      onError: (error) => {
         // Centr alizaerro - exibe toast + logging
         handleError(error)
      }
   })

   // ===== Mutation: Criar Cartão =====
   /**
    * Cria compromisso de cartão de crédito
    * Similar a criarMutation mas com tipos específicos
    */
   const criarCartaoMutation = useMutation({
      mutationFn: (novoCompromisso: Omit<Compromisso, 'rowIndex'>) =>
         criarCartao(novoCompromisso),

      onSuccess: (registrosCriados: Compromisso[]) => {
         inserirNoCache(registrosCriados)
      },
      onError: (error) => {
         handleError(error)
      }
   })

   // ===== Mutation: Atualizar Compromisso =====
   /**
    * Atualiza compromisso existente (marcar como pago)
    * 
    * Parâmetros:
    * - rowIndex: ID único do compromisso
    * - valor: Novo valor (pode pagar parcial)
    * - dataPagamento: Data que foi pago
    * - scope: 'single' para atualizar apenas este, omitir para série
    * 
    * Cache sync strategy:
    * - DOIS setQueryData: um para período, outro para alertas
    * - Ambos precisam ser atualizados pois alertas buscam todos meses
    */
   const atualizarMutation = useMutation({
      mutationFn: (dados: {
         rowIndex: number
         valor: number
         dataPagamento: string
         scope?: 'single'
      }) =>
         atualizarCompromisso(dados),
      onSuccess: (_data, variables) => {
         // ===== Update: Cache do Período =====
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

         // ===== Update: Cache de Alertas =====
         // Alertas buscam todos meses, então query key é diferente
         // Precisa manter dados em sincronismo
         queryClient.setQueryData<Compromisso[]>(
            ['compromissos-alerta', ano],
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
      },
      onError: (error) => {
         handleError(error)
      }
   })

   // ===== Mutation: Excluir Compromisso =====
   /**
    * Remove compromisso do sistema
    * 
    * Cache sync strategy:
    * - Remove de DOIS caches: período atual e alertas
    * - Usa filter para remover item com rowIndex específico
    */
   const excluirMutation = useMutation({
      mutationFn: (rowIndex: number) =>
         excluirCompromisso(rowIndex),
      onSuccess: (_data, rowIndex) => {
         // ===== Remove: Cache do Período =====
         queryClient.setQueryData<Compromisso[]>(
            queryKey,
            old => old?.filter(r => r.rowIndex !== rowIndex) ?? []
         )

         // ===== Remove: Cache de Alertas =====
         queryClient.setQueryData<Compromisso[]>(
            ['compromissos-alerta', ano],
            old => old?.filter(r => r.rowIndex !== rowIndex) ?? []
         )
      },
      onError: (error) => {
         handleError(error)
      }
   })

   /**
    * FUNÇÃO INTERNA: Insere novo compromisso em múltiplos caches
    * 
    * Problema: Criar compromisso pode gerar múltiplas linhas:
    * - Tipo Fixo: 12 linhas (uma por mês)
    * - Tipo Variável: 1 linha
    * 
    * Solução: Para cada registro retornado:
    * 1. Extrai mes/ano do dataVencimento
    * 2. Atualiza cache do período (ex: ['compromissos', '2', '2025'])
    * 3. Atualiza cache de alertas (ex: ['compromissos-alerta', '2025'])
    * 
    * Isso garante que novo item aparece:
    * - Na lista do mês donde foi criado
    * - Nos alertas se applicable
    * - Em qualquer outro lugar que tenha subscrito a esses dados
    * 
    * @param registros - Array de registros retornados da API
    */
   function inserirNoCache(registros: Compromisso[]) {
      registros.forEach(registro => {
         // Extrai mês/ano da data de vencimento
         const { mes: regisMes, ano: regisAno } = getMesAno(registro.dataVencimento)
         
         // Atualiza cache do período específico
         queryClient.setQueryData<Compromisso[]>(
            ['compromissos', regisMes, regisAno],
            old => old ? [...old, registro] : [registro]
         )

         // Atualiza cache de alertas
         // Nota: ano pode ser diferente (incluindo múltiplos anos)
         queryClient.setQueryData<Compromisso[]>(
            ['compromissos-alerta', ano],
            old => old ? [...old, registro] : [registro]
         )
      })
   }

   // ===== Retorno =====
   return {
      compromissos,         // Array de compromissos do período
      compromissosAlerta,   // Array de compromissos próximos a vencer
      isLoading,           // True enquanto buscando dados
      isError,             // True se requisição falhou
      criar: criarMutation.mutateAsync,
      criarCartao: criarCartaoMutation.mutateAsync,
      atualizar: atualizarMutation.mutateAsync,
      excluir: excluirMutation.mutateAsync,
      isSalvando: criarMutation.isPending || criarCartaoMutation.isPending || atualizarMutation.isPending,
      isExcluindo: excluirMutation.isPending
   }
}
