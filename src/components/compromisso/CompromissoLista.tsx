import type { Compromisso } from "@/types/Compromisso"
import { numeroParaMoeda } from "@/utils/formatadores"

interface Props {
   compromissos: Compromisso[]
   onSelect: (compromisso: Compromisso) => void
}

function estaVencido(dataVencimento: string) {
   const [d, m, a] = dataVencimento.split('/').map(Number)

   const vencimento = new Date(a, m - 1, d)
   vencimento.setHours(0, 0, 0, 0)

   const hoje = new Date()
   hoje.setHours(0, 0, 0, 0)

   return vencimento < hoje
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
               const isPago = !!r.dataPagamento
               const isCartao = r.tipo === 'Cartão'
               const isVencido = !isPago && estaVencido(r.dataVencimento)

               return (
                  <div
                     key={r.rowIndex}
                     onClick={() => onSelect(r)}
                     className={`
                        rounded-lg border p-3 cursor-pointer transition
                        hover:bg-muted
                        ${isPago && 'border-green-500/40 bg-green-50'}
                        ${isVencido && 'border-red-500/40 bg-red-50'}
                     `}
                  >
                     <div className="flex justify-between items-start">
                        <div className="font-medium">{r.descricao}</div>

                        <div className="font-semibold">
                           {numeroParaMoeda(r.valor)}
                        </div>
                     </div>

                     {isCartao && (
                        <div className="mt-1 text-xs text-muted-foreground">
                           {r.cartao}
                           {(r.totalParcelas ?? 1) > 1 && (
                              <> • Parcela {r.parcelas}/{r.totalParcelas}</>
                           )}
                        </div>
                     )}

                     <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                           {isPago
                              ? `Pago em ${r.dataPagamento}`
                              : `Vence em ${r.dataVencimento}`}
                        </span>

                        <span
                           className={`
                              font-medium
                              ${isPago && 'text-green-600'}
                              ${isVencido && 'text-red-600'}
                              ${!isPago && !isVencido && 'text-amber-500'}
                           `}
                        >
                           {isPago
                              ? 'Pago'
                              : isVencido
                                 ? 'Vencido'
                                 : 'Em aberto'}
                        </span>
                     </div>
                  </div>
               )
            })}
         </div>

         {/* DESKTOP */}
         <div className="hidden sm:grid grid-cols-12 gap-3">
            {compromissos.map(r => {
               const isPago = !!r.dataPagamento
               const isVencido = !isPago && estaVencido(r.dataVencimento)

               return (
                  <div
                     key={r.rowIndex}
                     onClick={() => onSelect(r)}
                     className={`
                        col-span-12 grid grid-cols-12 items-center p-4
                        rounded-lg border cursor-pointer transition
                        hover:shadow-md
                        ${isPago && 'bg-green-50 border-green-200'}
                        ${isVencido && 'bg-red-50 border-red-200'}
                     `}
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
                        className={`
                           col-span-1 text-sm font-medium text-right
                           ${isPago && 'text-green-600'}
                           ${isVencido && 'text-red-600'}
                           ${!isPago && !isVencido && 'text-orange-500'}
                        `}
                     >
                        {isPago
                           ? 'Pago'
                           : isVencido
                              ? 'Vencido'
                              : 'Aberto'}
                     </div>
                  </div>
               )
            })}
         </div>
      </>
   )
}
