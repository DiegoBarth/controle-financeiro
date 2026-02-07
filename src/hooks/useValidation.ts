import { z } from 'zod';
import { useToast } from '@/contexts/toast';

/**
 * Hook para validação de dados usando schemas Zod
 * 
 * Responsabilidades:
 * - Valida dados contra um schema Zod
 * - Exibe erros de validação como toast warnings
 * - Retorna dados tipados ou null em caso de erro
 * 
 * @example
 * const { validar } = useValidation();
 * const dados = validar(GastoSchema, { descricao: '', valor: 100 });
 * if (!dados) return; // Erro já foi exibido
 */
export function useValidation() {
   const toast = useToast();

   /**
    * Valida dados contra um schema Zod
    * 
    * Comportamento:
    * - Em caso de sucesso: retorna dados tipados como <T>
    * - Em caso de erro: exibe cada erro como toast warning e retorna null
    * - Cada erro é exibido individualmente para melhor UX
    * 
    * @template T - Tipo esperado após validação bem-sucedida
    * @param schema - Schema Zod para validação
    * @param dados - Dados a serem validados (qualquer tipo)
    * @returns Dados validados tipados ou null se houver erro
    */
   const validar = <T,>(
      schema: z.ZodSchema,
      dados: unknown
   ): T | null => {
      try {
         // Tenta fazer parse dos dados contra o schema
         return schema.parse(dados) as T;
      } catch (erro) {
         // Se erro é do Zod, exibe todos os erros encontrados
         if (erro instanceof z.ZodError) {
            // Itera sobre cada issue (erro) e exibe como warning
            // Cada erro é mostrado separadamente em um toast
            erro.issues.forEach(issue => {
               toast.warning(issue.message);
            })
         }
         return null;
      }
   };

   return { validar };
}