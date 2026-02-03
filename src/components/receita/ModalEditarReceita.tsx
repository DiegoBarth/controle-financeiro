import { useEffect, useState } from 'react'
import { atualizarReceita, excluirReceita } from '@/api/receitas'
import { usePeriodo } from '@/contexts/PeriodoContext'
import { numeroParaMoeda, moedaParaNumero, dataBRParaISO, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'
import type { Receita } from '@/types/Receita'

interface Props {
   aberto: boolean
   receita: Receita | null
   onClose: () => void
   onConfirmar: () => void
}

export function ModalEditarReceita({ aberto, receita, onClose, onConfirmar }: Props) {
   const { mes, ano } = usePeriodo()
   const [valor, setValor] = useState('')
   const [dataRecebimento, setDataRecebimento] = useState('')
   const [loading, setLoading] = useState(false)
   const [acao, setAcao] = useState<'salvando' | 'excluindo' | null>(null)

   useEffect(() => {
      if (receita) {
         setValor(numeroParaMoeda(receita.valor))
         setDataRecebimento(
            receita.dataRecebimento ? dataBRParaISO(receita.dataRecebimento) : new Date().toISOString().slice(0, 10)
         )
      }
   }, [receita])

   if (!receita) return null

   async function handleSalvar() {
      if (!receita) return;

      setLoading(true)
      setAcao('salvando')
      try {
         await atualizarReceita(
            { rowIndex: receita.rowIndex, valor: moedaParaNumero(valor), dataRecebimento },
            mes,
            String(ano)
         )
         onConfirmar()
         onClose()
      } finally {
         setLoading(false)
         setAcao(null)
      }
   }

   async function handleExcluir() {
      if (!receita) return

      setLoading(true)
      setAcao('excluindo')
      try {
         await excluirReceita(receita.rowIndex, mes, String(ano))
         onConfirmar()
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
         titulo={receita.descricao}
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
               <label className="block text-xs text-muted-foreground">Data de recebimento</label>
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