import { useQuery } from '@tanstack/react-query'
import { listarResumoCompleto } from '@/api/endpoints/home';

export function useResumo(mes: string, ano: string) {
   const queryKey = ['resumo', mes, ano]

   const { data: resumo = null, isLoading, isError } = useQuery({
      queryKey,
      queryFn: () => listarResumoCompleto(mes, String(ano))
   })

   return {
      resumo,
      isLoading,
      isError
   }
}