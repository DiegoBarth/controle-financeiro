import type { Compromisso } from "@/types/Compromisso"
import { numeroParaMoeda } from "@/utils/formatadores"

interface Props {
   compromissos: Compromisso[]
   onSelect: (compromisso: Compromisso) => void
}

export function CompromissoLista({ compromissos, onSelect }: Props) {
   if (compromissos.length === 0) {
      return (
         <p className="text-sm text-muted-foreground">
            Nenhum compromisso cadastrado
         </p>
      )
   }

   return (
      <>
         {/* MOBILE */}
         <div className="space-y-2 sm:hidden">
            {compromissos.map(r => {
               const isPago = r.dataPagamento
               const isCartao = r.tipo === 'Cartão'

               return (
                  <div
                     key={r.rowIndex}
                     onClick={() => onSelect(r)}
                     className={`rounded-lg border p-3 cursor-pointer hover:bg-muted transition
                        ${isPago ? 'border-green-500/40 bg-green-50' : ''}`}
                  >
                     <div className="flex justify-between items-start">
                        <div className="font-medium">{r.descricao}</div>

                        <div className="font-semibold">
                           {numeroParaMoeda(r.valor)}
                        </div>
                     </div>

                     {isCartao && (
                        <div className="mt-1 text-xs text-muted-foreground">
                           {r.cartao} • Parcela {r.parcela}/{r.totalParcelas}
                        </div>
                     )}

                     <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                           {isPago
                              ? `Pago em ${r.dataPagamento}`
                              : `Vence em ${r.dataVencimento}`}
                        </span>

                        <span
                           className={`font-medium ${isPago ? 'text-green-600' : '!text-amber-500'
                              }`}
                        >
                           {isPago ? 'Pago' : 'Em aberto'}
                        </span>
                     </div>
                  </div>
               )
            })}
         </div>

         {/* DESKTOP MODERNO */}
         <div className="hidden sm:grid grid-cols-12 gap-3">
            {compromissos.map(r => {
               console.log(r)
               const isPago = r.dataPagamento

               return (
                  <div
                     key={r.rowIndex}
                     onClick={() => onSelect(r)}
                     className="col-span-12 grid grid-cols-12 items-center p-4
                   rounded-lg border hover:shadow-md cursor-pointer transition"
                  >
                     <div className="col-span-4 font-medium">
                        {r.descricao}
                     </div>

                     <div className="col-span-2 text-sm text-muted-foreground capitalize">
                        {r.tipo}
                     </div>

                     <div className="col-span-3 text-sm text-muted-foreground">
                        {isPago
                           ? `Pago em ${r.dataPagamento}`
                           : `Vence em ${r.dataVencimento}`}
                     </div>

                     <div className="col-span-2 text-right font-semibold">
                        {numeroParaMoeda(r.valor)}
                     </div>

                     <div
                        className={`col-span-1 text-sm font-medium text-right ${isPago ? 'text-green-600' : 'text-orange-500'
                           }`}
                     >
                        {isPago ? 'Pago' : 'Aberto'}
                     </div>
                  </div>
               )
            })}
         </div>

      </>
   )
}