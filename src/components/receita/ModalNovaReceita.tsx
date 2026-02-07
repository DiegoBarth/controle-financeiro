import { useState, useEffect } from 'react'
import { usePeriodo } from '@/contexts/PeriodoContext'
import {
   formatarMoeda,
   moedaParaNumero
} from '@/utils/formatadores'
import { ModalBase } from '@/components/ui/ModalBase'
import { useReceita } from '@/hooks/useReceita'
import { useValidation } from '@/hooks/useValidation'
import { ReceitaCreateSchema } from '@/schemas/receita.schema'

interface Props {
   aberto: boolean
   onClose: () => void
}

export function ModalNovaReceita({ aberto, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const { criar, isSalvando } = useReceita(mes, String(ano))
   const { validar } = useValidation()
   const [descricao, setDescricao] = useState('')
   const [valor, setValor] = useState('')
   const [dataPrevista, setDataPrevista] = useState('')
   const [dataRecebimento, setDataRecebimento] = useState('')

   useEffect(() => {
      if (!aberto) {
         setDescricao('')
         setValor('')
         setDataPrevista('')
         setDataRecebimento('')
      }
   }, [aberto])

   const handleSalvar = async () => {
      const dados = validar(ReceitaCreateSchema, {
         descricao,
         valor: moedaParaNumero(valor),
         dataPrevista,
         dataRecebimento
      })

      if (!dados) return

      await criar(dados as any)
      setDescricao('')
      setValor('')
      setDataPrevista('')
      setDataRecebimento('')

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
         onSalvar={() => handleSalvar()}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">
                  Descrição *
               </label>
               <input
                  className="w-full border rounded-md p-2"
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">
                  Valor *
               </label>
               <input
                  className="w-full border rounded-md p-2"
                  value={valor}
                  onChange={e => setValor(formatarMoeda(e.target.value))}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">
                  Data prevista *
               </label>
               <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={dataPrevista}
                  onChange={e => setDataPrevista(e.target.value)}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">
                  Data de recebimento
               </label>
               <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={dataRecebimento}
                  onChange={e => setDataRecebimento(e.target.value)}
               />
            </div>
         </div>
      </ModalBase>
   )
}