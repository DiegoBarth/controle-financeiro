import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { usePeriodo } from '@/contexts/PeriodoContext'
import {
   formatarMoeda,
   moedaParaNumero
} from '@/utils/formatadores'
import { ModalBase } from '@/components/ui/ModalBase'
import { useReceita } from '@/hooks/useReceita'
import { useValidation } from '@/hooks/useValidation'
import { ReceitaCreateSchema } from '@/schemas/receita.schema'
import type { Receita } from '@/types/Receita'

interface Props {
   aberto: boolean
   onClose: () => void
}

const defaultValues: Partial<Receita> = {
   descricao: '',
   valor: '',
   dataPrevista: '',
   dataRecebimento: ''
}

export function ModalNovaReceita({ aberto, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const { criar, isSalvando } = useReceita(mes, String(ano))
   const { validar } = useValidation()

   const { control, register, handleSubmit, reset } = useForm<Receita>({
      defaultValues
   })

   useEffect(() => {
      if (!aberto) {
         reset(defaultValues)
      }
   }, [aberto, reset])

   const handleSalvar = async (values: Receita) => {
      const dados = validar(ReceitaCreateSchema, {
         descricao: values.descricao,
         valor: moedaParaNumero(String(values.valor)),
         dataPrevista: values.dataPrevista,
         dataRecebimento: values.dataRecebimento
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
         titulo="Nova receita"
         tipo="inclusao"
         loading={isSalvando}
         loadingTexto="Salvando..."
         onSalvar={handleSubmit(handleSalvar)}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">
                  Descrição *
               </label>
               <input
                  className="w-full border rounded-md p-2"
                  {...register('descricao')}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">
                  Valor *
               </label>
               <Controller
                  name="valor"
                  control={control}
                  render={({ field }) => (
                     <input
                        className="w-full border rounded-md p-2"
                        value={field.value}
                        onChange={e => field.onChange(formatarMoeda(e.target.value))}
                     />
                  )}

               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">
                  Data prevista *
               </label>
               <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  {...register('dataPrevista')}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">
                  Data de recebimento
               </label>
               <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  {...register('dataRecebimento')}
               />
            </div>
         </div>
      </ModalBase>
   )
}