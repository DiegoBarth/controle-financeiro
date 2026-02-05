import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { criarGasto } from '@/api/endpoints/gastos'
import { moedaParaNumero, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'
import { SelectCustomizado } from '../ui/SelectCustomizado'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Gasto } from '@/types/Gasto'

interface Props {
   aberto: boolean
   onClose: () => void
}

export function ModalNovoGasto({ aberto, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const queryClient = useQueryClient()

   const [descricao, setDescricao] = useState('')
   const [data, setData] = useState('')
   const [valor, setValor] = useState('')
   const [categoria, setCategoria] = useState('')

   const categorias = [
      'Alimentação', 'Banco', 'Beleza', 'Casa', 'Educação',
      'Empréstimos', 'Investimento', 'Lazer', 'Pets', 'Presentes',
      'Roupas', 'Saúde', 'Serviços', 'Streaming', 'Telefonia',
      'Transporte', 'Viagem'
   ]

   useEffect(() => {
      if (!aberto) {
         setDescricao('')
         setData('')
         setCategoria('')
         setValor('')
      }
   }, [aberto])

   const criarMutation = useMutation({
      mutationFn: () =>
         criarGasto({
            data,
            descricao,
            categoria,
            valor: moedaParaNumero(valor)
         }),
      onSuccess: (novoGasto) => {
         queryClient.setQueryData<Gasto[]>(
            ['gastos', mes, ano],
            old => old ? [...old, novoGasto] : [novoGasto]
         )
         onClose()
      }
   })

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo="Novo gasto"
         tipo="inclusao"
         loading={criarMutation.isPending}
         onSalvar={() => criarMutation.mutate()}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">Descrição *</label>
               <input
                  className="mt-1 w-full rounded-md border p-2"
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">Data de pagamento *</label>
               <input
                  type="date"
                  className="mt-1 w-full rounded-md border p-2"
                  value={data}
                  onChange={e => setData(e.target.value)}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground mb-1">Categoria *</label>
               <SelectCustomizado
                  value={categoria}
                  onChange={setCategoria}
                  options={categorias}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">Valor *</label>
               <input
                  className="mt-1 w-full rounded-md border p-2"
                  value={valor}
                  onChange={e => setValor(formatarMoeda(e.target.value))}
               />
            </div>
         </div>
      </ModalBase>
   )
}
