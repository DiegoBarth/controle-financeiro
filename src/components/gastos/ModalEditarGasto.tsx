import { useEffect, useState } from 'react'
import { atualizarGasto, excluirGasto } from '@/api/endpoints/gastos'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Gasto } from '@/types/Gasto'
import { numeroParaMoeda, moedaParaNumero, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'

interface Props {
   aberto: boolean
   gasto: Gasto | null
   onClose: () => void
   onConfirmar: () => void
}

export function ModalEditarGasto({ aberto, gasto, onClose, onConfirmar }: Props) {
   const { mes, ano } = usePeriodo()
   const [valor, setValor] = useState('')
   const [loading, setLoading] = useState(false)
   const [acao, setAcao] = useState<'salvando' | 'excluindo' | null>(null)

   useEffect(() => {
      if (gasto) {
         setValor(numeroParaMoeda(gasto.valor))
      }
   }, [gasto])

   if (!gasto) return null

   async function handleSalvar() {
      if (!gasto) return;

      setLoading(true)
      setAcao('salvando')
      try {
         await atualizarGasto(
            { rowIndex: gasto.rowIndex, valor: moedaParaNumero(valor) },
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
      if (!gasto) return

      setLoading(true)
      setAcao('excluindo')
      try {
         await excluirGasto(gasto.rowIndex, mes, String(ano))
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
         titulo={gasto.descricao}
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
         </div>
      </ModalBase>
   )
}