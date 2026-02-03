import type { Gasto } from "@/types/Gasto"
import { numeroParaMoeda } from "@/utils/formatadores"

interface Props {
   gastos: Gasto[]
   onSelect: (gasto: Gasto) => void
}

export function GastoLista({ gastos, onSelect }: Props) {
   if (gastos.length === 0) {
      return (
         <p className="text-sm text-muted-foreground">
            Nenhuma gasto cadastrado
         </p>
      )
   }

   return (
      <>
         {/* MOBILE */}
         <div className="space-y-2 sm:hidden">
            {gastos.map(r => {
               return (
                  <div
                     key={r.rowIndex}
                     className={`
                rounded-lg border p-3 cursor-pointer
                hover:bg-muted transition
              `}
                     onClick={() => onSelect(r)}
                  >
                     <div className="flex items-center justify-between">
                        <div className="font-medium flex items-center gap-2">
                           {r.descricao}
                        </div>

                        <span className="text-sm font-semibold">
                           {numeroParaMoeda(r.valor)}
                        </span>
                     </div>

                     <div className="mt-1 text-xs text-muted-foreground">
                        Pago em: {r.dataPagamento}
                     </div>

                     <div
                        className={`text-xs mt-0.5 text-muted-foreground`}
                     >
                     </div>
                  </div>
               )
            })}
         </div>

         {/* DESKTOP MODERNO */}
         <div className="hidden sm:grid sm:grid-cols-12 gap-3">
            {gastos.map(r => {
               return (
                  <div
                     key={r.rowIndex}
                     className={`
                col-span-12 flex items-center justify-between p-4
                rounded-lg border shadow-sm cursor-pointer transition
                hover:shadow-md
              `}
                     onClick={() => onSelect(r)}
                  >
                     <div className="flex-1 font-medium">{r.descricao}</div>

                     <div className="w-32 text-sm text-muted-foreground text-center">
                        Pago em: {r.dataPagamento}
                     </div>

                     <div className="w-32 text-right font-semibold">
                        {numeroParaMoeda(r.valor)}
                     </div>
                  </div>
               )
            })}
         </div>
      </>
   )
}