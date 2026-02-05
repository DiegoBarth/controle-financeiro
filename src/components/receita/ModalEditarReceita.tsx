import { useEffect, useState } from 'react'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Receita } from '@/types/Receita'
import {
   numeroParaMoeda,
   moedaParaNumero,
   dataBRParaISO,
   formatarMoeda
} from '@/utils/formatadores'
import { ModalBase } from '@/components/ui/ModalBase'
import { useReceita } from '@/hooks/useReceita'

interface Props {
   aberto: boolean
   receita: Receita | null
   onClose: () => void
}

export function ModalEditarReceita({ aberto, receita, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const { atualizar, excluir, isSalvando, isExcluindo } = useReceita(mes, String(ano))

   const [valor, setValor] = useState('')
   const [dataRecebimento, setDataRecebimento] = useState('')

   useEffect(() => {
      if (receita) {
         setValor(numeroParaMoeda(receita.valor))
         setDataRecebimento(
            receita.dataRecebimento
               ? dataBRParaISO(receita.dataRecebimento)
               : new Date().toISOString().slice(0, 10)
         )
      }
   }, [receita])

   const handleAtualizar = async () => {
      await atualizar({
         rowIndex: receita!.rowIndex,
         valor: moedaParaNumero(valor),
         dataRecebimento
      })
      setValor('')
      setDataRecebimento('')

      onClose()
   }

   const handleExcluir = async () => {
      await excluir(receita!.rowIndex)

      onClose()
   }

   if (!receita) return null

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo={receita.descricao}
         tipo="edicao"
         loading={isSalvando || isExcluindo}
         loadingTexto={(isSalvando ? 'Salvando...' : 'Excluindo...')}
         onSalvar={() => handleAtualizar()}
         onExcluir={() => handleExcluir()}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">Valor</label>
               <input
                  className="w-full border rounded-md p-2"
                  value={valor}
                  onChange={e => setValor(formatarMoeda(e.target.value))}
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
