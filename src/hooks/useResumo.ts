import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listarResumoCompleto } from '@/api/endpoints/home';

import { useLocation } from 'react-router-dom';

/**
 * Hook para obter dados resumidos do período selecionado
 * 
 * Responsabilidades:
 * - Buscar dados consolidados (resumo financeiro completo)
 * - Apenas executar query quando estiver na página Home (/)
 * - Fornecer estados de loading e erro
 * 
 * Otimizações:
 * - Query key inclui mês e ano para cache granular
 * - enabled: false quando fora da página Home (economiza requisições)
 * - Dados padrão: null para evitar erros de undefined
 * 
 * @param mes - Mês como string (ex: "2")
 * @param ano - Ano como string (ex: "2025")
 * @returns Objeto com resumo, estados de loading e erro
 * 
 * @example
 * const { resumo, isLoading, isError } = useResumo('2', '2025');
 * 
 * if (isLoading) return <SkeletonLoader />;
 * if (isError) return <ErrorMessage />;
 * 
 * return <ResumoCard resumo={resumo} />;
 */
export function useResumo(mes: string, ano: string) {
   // ===== Configuração Query =====
   // Key para cache: necessário incluir parâmetros dinâmicos
   const queryKey = ['resumo', mes, ano]
   
   // ===== Otimização: Desabilitar quando fora da página =====
   // useLocation permite detectar rota atual sem prop drilling
   const location = useLocation();
   // Só executa query se estiver na página Home (rota raiz)
   // Isso evita requisições desnecessárias quando usuário está em outras páginas
   const enabled = location.pathname === '/'

   // ===== TanStack React Query =====
   // Responsabilidades da query:
   // 1. Fetch automático de dados
   // 2. Cache automático
   // 3. Deduplicação de requisições
   // 4. Estados de loading/error gerenciados
   const { data: resumo = null, isLoading, isError } = useQuery({
      queryKey,
      queryFn: () => listarResumoCompleto(mes, String(ano)),
      // enabled: false mantém query inativa até pathname mudar
      // Útil para economizar requisições e requisições não-essenciais
      enabled
   })

   return {
      resumo,      // Dados resumidos do período (null se não carregou)
      isLoading,   // True enquanto fazendo fetch
      isError      // True se falhou a requisição
   }
}