import { useToast } from '@/contexts/toast';

/**
 * Interface para erros de API retornados pelo backend
 */
interface ApiError {
   statusCode?: number;
   message: string;
   details?: unknown;
}

/**
 * Hook para centralizar o tratamento de erros de API
 * 
 * Benefícios:
 * - Consistência nas mensagens de erro em toda a aplicação
 * - Mapeamento de códigos HTTP para mensagens em português
 * - Tratamento de diferentes tipos de erro (Network, HTTP, JSON)
 * 
 * @example
 * const { handleError } = useApiError();
 * 
 * const mutation = useMutation({
 *   mutationFn: criarGasto,
 *   onError: (error) => handleError(error)
 * });
 */
export function useApiError() {
   const toast = useToast();

   /**
    * Processa erros de diferentes tipos e exibe mensagem apropriada
    * 
    * Fluxo de processamento:
    * 1. Verifica se é erro de rede/conexão (TypeError com 'fetch')
    * 2. Tenta parsear mensagem como JSON para ApiError estruturado
    * 3. Se não for JSON, verifica códigos HTTP na mensagem de string
    * 4. Retorna erro genérico se nenhuma condição anterior bater
    * 
    * Códigos HTTP tratados:
    * - 401: Sessão expirada
    * - 403: Sem permissão
    * - 404: Recurso não encontrado
    * - 500: Erro no servidor
    * 
    * @param error - Erro de qualquer tipo vindo do fetch ou mutation
    */
   const handleError = (error: unknown) => {
      try {
         // ===== Erro de Rede/Conexão =====
         // Tipo: TypeError (erro de conexão, timeout, etc)
         if (error instanceof TypeError) {
            if (error.message.includes('fetch')) {
               toast.error('Erro de conexão com o servidor');
               return;
            }
         }

         // ===== Erro HTTP/JSON de API =====
         // Tipo: Error (pode ser estruturado como JSON ou string)
         if (error instanceof Error) {
            const message = error.message;

            // Tenta interpretar mensagem como JSON de erro estruturado
            try {
               const errorObj = JSON.parse(message) as ApiError;
               toast.error(errorObj.message || 'Erro ao processar requisição');
               return;
            } catch {
               // Mensagem não é JSON, processa como string com código HTTP

               // ===== Autenticação (401) =====
               if (message.includes('401') || message.includes('Unauthorized')) {
                  toast.error('Sessão expirada. Faça login novamente');
                  return;
               }

               // ===== Autorização (403) =====
               if (message.includes('403') || message.includes('Forbidden')) {
                  toast.error('Você não tem permissão para realizar esta ação');
                  return;
               }

               // ===== Não Encontrado (404) =====
               if (message.includes('404') || message.includes('Not Found')) {
                  toast.error('Recurso não encontrado');
                  return;
               }

               // ===== Erro no Servidor (500) =====
               if (message.includes('500') || message.includes('Internal')) {
                  toast.error('Erro no servidor. Tente novamente mais tarde');
                  return;
               }

               // Mensagem de erro genérica se nenhuma condição bater
               toast.error(message || 'Erro desconhecido');
               return;
            }
         }

         // ===== Fallback =====
         // Se chegou aqui, é um erro não-standard, converte para string
         const errorMessage = String(error);
         toast.error(
            errorMessage || 'Erro ao processar a requisição. Tente novamente'
         );
      } catch (err) {
         // Erro ao processar o erro - evita loop infinito
         console.error('Erro ao processar erro:', err);
         toast.error('Erro desconhecido');
      }
   };

   return { handleError };
}
