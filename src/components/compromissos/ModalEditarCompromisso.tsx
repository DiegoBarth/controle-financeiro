import { useEffect, useState } from 'react'
import { atualizarCompromisso, excluirCompromisso } from '@/api/endpoints/compromissos'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Compromisso } from '@/types/Compromisso'
import { formatarMoeda, moedaParaNumero, numeroParaMoeda } from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'

interface Props {
   aberto: boolean
   compromisso: Compromisso | null
   onClose: () => void
   onConfirmar: (rowIndex: number) => void
}

export function ModalEditarCompromisso({ aberto, compromisso, onClose, onConfirmar }: Props) {
   const { mes, ano } = usePeriodo()
   const [valor, setValor] = useState('')
   const [dataPagamento, setDataPagamento] = useState('')
   const [loading, setLoading] = useState(false)
   const [acao, setAcao] = useState<'salvando' | 'excluindo' | null>(null)

   useEffect(() => {
      if (compromisso) {
         setValor(numeroParaMoeda(compromisso.valor))
         setDataPagamento(new Date().toISOString().slice(0, 10))
      }
   }, [compromisso])

   if (!compromisso) return null

   async function handleSalvar() {
      if (!compromisso) return;

      setLoading(true)
      setAcao('salvando')
      try {
         await atualizarCompromisso(
            {
               rowIndex: compromisso.rowIndex,
               valor: moedaParaNumero(valor),
               dataPagamento
            },
            mes,
            String(ano)
         )

         onConfirmar(compromisso.rowIndex)
         onClose()
      } finally {
         setLoading(false)
         setAcao(null)
      }
   }

   async function handleExcluir() {
      if (!compromisso) return

      setLoading(true)
      setAcao('excluindo')
      try {
         await excluirCompromisso(compromisso.rowIndex, mes, String(ano))
         onConfirmar(compromisso.rowIndex)
         onClose()
      } finally {
         setLoading(false)
         setAcao(null)
      }
   }

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo={compromisso.descricao}
         tipo="edicao"
         loading={loading}
         loadingTexto={acao === 'excluindo' ? 'Excluindo...' : 'Salvando...'}
         onSalvar={handleSalvar}
         onExcluir={handleExcluir}
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
