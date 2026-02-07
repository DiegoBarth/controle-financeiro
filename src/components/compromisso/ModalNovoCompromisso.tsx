import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { moedaParaNumero, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '@/components/ui/ModalBase'
import { SelectCustomizado } from '@/components/ui/SelectCustomizado'

import { usePeriodo } from '@/contexts/PeriodoContext'
import { useCompromisso } from '@/hooks/useCompromisso'
import { useValidation } from '@/hooks/useValidation'
import { CompromissoCreateSchema, CompromissoCartaoSchema } from '@/schemas/compromisso.schema'
import { CATEGORIAS, TIPOS, CARTOES } from '@/config/constants'
import type { Compromisso } from '@/types/Compromisso'
interface Props {
   aberto: boolean
   onClose: () => void
}

type TipoCompromisso = 'Fixo' | 'Variável' | 'Cartão' | ''

const defaultValues: Partial<Compromisso> = {
   descricao: '',
   categoria: '',
   tipo: '',
   dataVencimento: '',
   meses: 1,
   cartao: '',
   valor: '',
   totalParcelas: 1
}

export function ModalNovoCompromisso({ aberto, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const { criar, criarCartao, isSalvando } = useCompromisso(mes, String(ano))
   const { validar } = useValidation()

   const { control, register, handleSubmit, watch, setValue, reset } = useForm<Compromisso>({
      defaultValues
   })

   const tipo = watch('tipo')
   const dataVencimento = watch('dataVencimento')

   useEffect(() => {
      if (tipo === 'Fixo' && dataVencimento) {
         const data = new Date(dataVencimento)
         setValue('meses', 12 - data.getMonth())
      }
   }, [tipo, dataVencimento, setValue])

   useEffect(() => {
      if (!aberto) {
         reset(defaultValues)
      }
   }, [aberto, reset])

   async function handleSalvar(values: Compromisso) {
      if (tipo === 'Cartão') {
         const dados = validar(CompromissoCartaoSchema, {
            descricao: values.descricao,
            categoria: values.categoria,
            tipo,
            cartao: values.cartao,
            valor: moedaParaNumero(String(values.valor)),
            totalParcelas: Number(values.totalParcelas),
            dataVencimento: values.dataVencimento
         })

         if (!dados) return

         await criarCartao(dados as any)
      } else {
         const dados = validar(CompromissoCreateSchema, {
            descricao: values.descricao,
            categoria: values.categoria,
            tipo,
            valor: moedaParaNumero(String(values.valor)),
            dataVencimento: values.dataVencimento,
            meses: tipo === 'Fixo' ? values.meses : 1
         })

         if (!dados) return

         await criar(dados as any)
      }

      reset(defaultValues)
      onClose()
   }

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo="Novo compromisso"
         tipo="inclusao"
         loading={isSalvando}
         loadingTexto="Salvando..."
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
               <label className="block text-xs text-muted-foreground mb-1">Tipo *</label>
               <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                     <SelectCustomizado
                        value={field.value}
                        onChange={value => field.onChange(value as TipoCompromisso)}
                        options={TIPOS}
                     />
                  )}

               />
            </div>

            {(tipo === 'Fixo' || tipo === 'Variável') && (
               <>
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

                  <div>
                     <label className="block text-xs text-muted-foreground">Data de vencimento *</label>
                     <input
                        type="date"
                        className="mt-1 w-full rounded-md border p-2"
                        {...register('dataVencimento')}
                     />
                  </div>

                  {tipo === 'Fixo' && (
                     <div>
                        <label className="block text-xs text-muted-foreground">
                           Repetir por (meses)
                        </label>
                        <input
                           type="number"
                           min={1}
                           max={12}
                           className="mt-1 w-full rounded-md border p-2"
                           {...register('meses', { valueAsNumber: true })}
                        />
                     </div>
                  )}
               </>
            )}

            {tipo === 'Cartão' && (
               <>
                  <div>
                     <label className="block text-xs text-muted-foreground mb-1">
                        Cartão *
                     </label>
                     <Controller
                        name="cartao"
                        control={control}
                        render={({ field }) => (
                           <SelectCustomizado
                              value={field.value ?? ''}
                              onChange={field.onChange}
                              options={CARTOES}
                           />
                        )}

                     />
                  </div>

                  <div>
                     <label className="block text-xs text-muted-foreground">Valor total *</label>
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

                  <div>
                     <label className="block text-xs text-muted-foreground">
                        Total de parcelas *
                     </label>
                     <input
                        type="number"
                        min={1}
                        max={60}
                        className="mt-1 w-full rounded-md border p-2"
                        {...register('totalParcelas')}
                     />
                  </div>

                  <div>
                     <label className="block text-xs text-muted-foreground">
                        Data de vencimento *
                     </label>
                     <input
                        type="date"
                        className="mt-1 w-full rounded-md border p-2"
                        {...register('dataVencimento')}
                     />
                  </div>
               </>
            )}
         </div>
      </ModalBase>
   )
}
