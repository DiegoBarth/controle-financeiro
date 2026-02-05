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
            Nenhum gasto cadastrado
         </p>
      )
   }

   return (
      <>
         {/* MOBILE */}
         <div className="space-y-2 sm:hidden">
            {gastos.map(r => (
               <div
                  key={r.rowIndex}
                  onClick={() => onSelect(r)}
                  className="
        rounded-lg border p-3 cursor-pointer
        hover:bg-muted transition
      "
               >
                  <div className="flex justify-between items-start">
                     <div className="font-medium">
                        {r.descricao}
                     </div>

                     <div className="font-semibold text-red-600">
                        {numeroParaMoeda(r.valor)}
                     </div>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-xs">
                     <span className="text-muted-foreground">
                        Pago em {r.dataPagamento} • {r.categoria}
                     </span>

                     <span className="font-medium text-green-600">
                        Pago
                     </span>
                  </div>
               </div>
            ))}
         </div>

         {/* DESKTOP MODERNO */}
         <div className="hidden sm:grid grid-cols-12 gap-3">
            {gastos.map(r => (
               <div
                  key={r.rowIndex}
                  onClick={() => onSelect(r)}
                  className="
        col-span-12 grid grid-cols-12 items-center p-4
        rounded-lg border hover:shadow-md cursor-pointer transition
      "
               >
                  {/* Descrição */}
                  <div className="col-span-4 font-medium">
                     {r.descricao}
                  </div>

                  {/* Categoria (ou placeholder) */}
                  <div className="col-span-2 text-sm text-muted-foreground capitalize">
                     {r.categoria ?? '-'}
                  </div>

                  {/* Data */}
                  <div className="col-span-3 text-sm text-muted-foreground">
                     Pago em {r.dataPagamento}
                  </div>

                  {/* Valor */}
                  <div className="col-span-2 text-right font-semibold text-red-600">
                     {numeroParaMoeda(r.valor)}
                  </div>

                  {/* Status */}
                  <div className="col-span-1 text-sm font-medium text-right text-green-600">
                     Pago
                  </div>
               </div>
            ))}
         </div>

      </>
   )
}
