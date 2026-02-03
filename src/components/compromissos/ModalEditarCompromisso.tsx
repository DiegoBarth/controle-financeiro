import { useState, useEffect } from "react"
import { atualizarCompromisso } from "@/api/compromissos"
import { usePeriodo } from "@/contexts/PeriodoContext"
import { formatarMoeda, moedaParaNumero } from "@/utils/formatadores"
import { ModalBase } from "../ui/ModalBase"
import type { AlertaItem } from "@/types/AlertaItem"

interface ModalEditarCompromissoProps {
   aberto: boolean
   compromisso: AlertaItem | null
   onClose: () => void
   onConfirmar: (rowIndex: number) => void
}

export function ModalEditarCompromisso({
   aberto,
   compromisso,
   onClose,
   onConfirmar
}: ModalEditarCompromissoProps) {
   const { mes, ano } = usePeriodo()
   const [valor, setValor] = useState<string>("")
   const [dataPagamento, setDataPagamento] = useState<string>("")
   const [loading, setLoading] = useState(false)
   const [acao, setAcao] = useState<'confirmando' | null>(null)

   useEffect(() => {
      if (compromisso) {
         setValor(formatarMoeda(String(compromisso.valor)))
         setDataPagamento(new Date().toISOString().slice(0, 10))
      }
   }, [compromisso])

   if (!compromisso) return null

   async function handleConfirmar() {
      if (!compromisso) return;

      setLoading(true)
      setAcao('confirmando')
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

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo={compromisso.descricao}
         tipo="edicao"
         onSalvar={handleConfirmar}
         loading={loading}
         loadingTexto={acao === 'confirmando' ? 'Confirmando...' : 'Salvar'}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">Valor</label>
               <input
                  type="text"
                  className="mt-1 w-full border rounded-md p-2"
                  value={valor}
                  onChange={e => setValor(formatarMoeda(String(e.target.value)))}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">Data de pagamento</label>
               <input
                  type="date"
                  className="mt-1 w-full border rounded-md p-2"
                  value={dataPagamento}
                  onChange={e => setDataPagamento(e.target.value)}
               />
            </div>
         </div>
      </ModalBase>
   )
}