import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listarResumoCompleto } from '@/api/endpoints/home';

import { useLocation } from 'react-router-dom';

export function useResumo(mes: string, ano: string) {
   const queryKey = ['resumo', mes, ano]
   const location = useLocation();
   const enabled = location.pathname === '/'

   const { data: resumo = null, isLoading, isError } = useQuery({
      queryKey,
      queryFn: () => listarResumoCompleto(mes, String(ano)),
      enabled
   })

   return {
      resumo,
      isLoading,
      isError
   }
}