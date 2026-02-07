import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { moedaParaNumero, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '@/components/ui/ModalBase'
import { SelectCustomizado } from '@/components/ui/SelectCustomizado'
import { usePeriodo } from '@/contexts/PeriodoContext'
import { useGasto } from '@/hooks/useGasto'
import { useValidation } from '@/hooks/useValidation'
import { GastoCreateSchema } from '@/schemas/gasto.schema'
import { CATEGORIAS } from '@/config/constants'
import type { Gasto } from '@/types/Gasto'

interface Props {
   aberto: boolean
   onClose: () => void
}

const defaultValues: Partial<Gasto> = {
   descricao: '',
   dataPagamento: '',
   valor: '',
   categoria: ''
}

export function ModalNovoGasto({ aberto, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const { criar, isSalvando } = useGasto(mes, String(ano))
   const { validar } = useValidation()

   const { control, register, handleSubmit, reset } = useForm<Gasto>({
      defaultValues
   })

   useEffect(() => {
      if (!aberto) {
         reset(defaultValues)
      }
   }, [aberto, reset])

   const handleSalvar = async (values: Gasto) => {
      const dados = validar(GastoCreateSchema, {
         descricao: values.descricao,
         categoria: values.categoria,
         valor: moedaParaNumero(String(values.valor)),
         dataPagamento: values.dataPagamento
      })

      if (!dados) return

      await criar(dados as any)

      reset(defaultValues)
      onClose()
   }

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo="Novo gasto"
         tipo="inclusao"
         loading={isSalvando}
         onSalvar={handleSubmit(handleSalvar)}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">Descrição *</label>
               <input
                  className="mt-1 w-full rounded-md border p-2"
                  {...register('descricao')}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">Data de pagamento *</label>
               <input
                  type="date"
                  className="mt-1 w-full rounded-md border p-2"
                  {...register('dataPagamento')}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground mb-1">Categoria *</label>
               <Controller
                  name="categoria"
                  control={control}
                  render={({ field }) => (
                     <SelectCustomizado
                        value={field.value}
                        onChange={field.onChange}
                        options={CATEGORIAS}
                     />
                  )}

               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">Valor *</label>
               <Controller
                  name="valor"
                  control={control}
                  render={({ field }) => (
                     <input
                        className="mt-1 w-full rounded-md border p-2"
                        value={field.value}
                        onChange={e => field.onChange(formatarMoeda(e.target.value))}
                     />
                  )}

               />
            </div>
         </div>
      </ModalBase>
   )
}
