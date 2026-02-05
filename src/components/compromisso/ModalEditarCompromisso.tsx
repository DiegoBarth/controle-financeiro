import { useEffect, useState } from 'react'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Compromisso } from '@/types/Compromisso'
import {
   formatarMoeda,
   moedaParaNumero,
   numeroParaMoeda
} from '@/utils/formatadores'
import { ModalBase } from '@/components/ui/ModalBase'
import { useCompromisso } from '@/hooks/useCompromisso'

interface Props {
   aberto: boolean
   compromisso: Compromisso | null
   onClose: () => void
   onConfirmar: (rowIndex: number) => void
}

export function ModalEditarCompromisso({ aberto, compromisso, onClose, onConfirmar }: Props) {
   const { mes, ano } = usePeriodo()
   const { atualizar, excluir, isSalvando, isExcluindo } = useCompromisso(mes, String(ano))
   const [valor, setValor] = useState('')
   const [dataPagamento, setDataPagamento] = useState('')

   useEffect(() => {
      if (compromisso) {
         setValor(numeroParaMoeda(compromisso.valor))
         setDataPagamento(new Date().toISOString().slice(0, 10))
      }
   }, [compromisso])

   const handleAtualizar = async () => {
      await atualizar({
         rowIndex: compromisso!.rowIndex,
         valor: moedaParaNumero(valor),
         dataPagamento,
         scope: 'single'
      })
      setValor('')
      setDataPagamento('')

      if (compromisso) {
         onConfirmar(compromisso.rowIndex)
      }
      onClose()
   }

   const handleExcluir = async () => {
      await excluir(compromisso!.rowIndex)

      if (compromisso) {
         onConfirmar(compromisso.rowIndex)
      }
      onClose()
   }

   if (!compromisso) return null

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo={compromisso.descricao}
         tipo="edicao"
         loading={isSalvando || isExcluindo}
         loadingTexto={(isSalvando ? 'Salvando...' : 'Excluindo...')}
         onSalvar={() => handleAtualizar()}
         onExcluir={() => handleExcluir()}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">
                  Valor
               </label>
               <input
                  className="w-full border rounded-md p-2"
                  value={valor}
                  onChange={e => setValor(formatarMoeda(e.target.value))}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">
                  Data de pagamento
               </label>
               <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={dataPagamento}
                  onChange={e => setDataPagamento(e.target.value)}
               />
            </div>
         </div>
      </ModalBase>
   )
}
