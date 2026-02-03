import { useState, useEffect } from "react"
import { atualizarCompromisso } from "@/api/compromissos"
import { usePeriodo } from "@/contexts/PeriodoContext"
import { formatarMoeda, moedaParaNumero } from "@/utils/formatadores"
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

   const [valor, setValor] = useState<string>('')
   const [dataPagamento, setDataPagamento] = useState<string>("")
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      if (compromisso) {
         setValor(formatarMoeda(String(compromisso.valor)))
         setDataPagamento(new Date().toISOString().slice(0, 10))
      }
   }, [compromisso])

   if (!aberto || !compromisso) return null

   async function confirmar() {
      if (!compromisso) return

      setLoading(true)

      await atualizarCompromisso(
         {
            rowIndex: compromisso.rowIndex,
            valor: moedaParaNumero(valor),
            dataPagamento,
         },
         mes,
         String(ano)
      )

      setLoading(false)
      onConfirmar(compromisso.rowIndex)
   }


   return (
      <div className="fixed inset-0 z-50">
         <div className="absolute inset-0 bg-black/40" onClick={onClose} />

         <div className="
        absolute bottom-0 left-0 right-0
        rounded-t-2xl bg-white
        p-4
      ">
            <h2 className="mb-4 text-lg font-semibold">
               {compromisso.descricao}
            </h2>

            <div className="space-y-3">
               <div>
                  <label className="block text-xs text-muted-foreground">
                     Valor
                  </label>
                  <input
                     type="string"
                     value={valor}
                     onChange={e => setValor(formatarMoeda(String(e.target.value)))}
                     className="mt-1 w-full rounded-md border p-2"
                  />
               </div>

               <div>
                  <label className="block text-xs text-muted-foreground">
                     Data de pagamento
                  </label>
                  <input
                     type="date"
                     value={dataPagamento}
                     onChange={e => setDataPagamento(e.target.value)}
                     className="mt-1 w-full rounded-md border p-2"
                  />
               </div>
            </div>

            <div className="mt-5 flex gap-2">
               <button
                  onClick={onClose}
                  className="flex-1 rounded-md border p-2 text-sm"
               >
                  Cancelar
               </button>

               <button
                  onClick={confirmar}
                  disabled={loading}
                  className="
              flex-1 rounded-md bg-primary p-2
              text-sm text-white disabled:opacity-60
            "
               >
                  Confirmar
               </button>
            </div>
         </div>
      </div>
   )
}