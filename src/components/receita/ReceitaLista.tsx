import type { Receita } from '../../types/Receita'
import { numeroParaMoeda } from '../../utils/formatadores'

interface Props {
   receitas: Receita[]
   onSelect: (receita: Receita) => void
}

export function ReceitaLista({ receitas, onSelect }: Props) {
   if (receitas.length === 0) {
      return (
         <p className="text-sm text-muted-foreground">
            Nenhuma receita cadastrada
         </p>
      )
   }

   return (
      <>
         {/* MOBILE */}
         <div className="space-y-2 sm:hidden">
            {receitas.map(r => {
               const recebida = !!r.dataRecebimento

               const textoData = recebida
                  ? `Recebido em ${r.dataRecebimento}`
                  : `Previsto para ${r.dataPrevista}`

               return (
                  <div
                     key={r.rowIndex}
                     onClick={() => onSelect(r)}
                     className={`
          rounded-lg border p-3 cursor-pointer transition
          hover:bg-muted
          ${recebida ? 'border-green-500/40 bg-green-50' : ''}
        `}
                  >
                     <div className="flex justify-between items-start">
                        <div className="font-medium">{r.descricao}</div>
                        <div className="font-semibold">
                           {numeroParaMoeda(r.valor)}
                        </div>
                     </div>

                     <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{textoData}</span>
                        <span
                           className={`font-medium ${recebida ? 'text-green-600' : 'text-blue-500'
                              }`}
                        >
                           {recebida ? 'Recebido' : 'Em aberto'}
                        </span>
                     </div>
                  </div>
               )
            })}
         </div>


         {/* DESKTOP MODERNO */}
         <div className="hidden sm:grid grid-cols-12 gap-3">
            {receitas.map(r => {
               const recebida = !!r.dataRecebimento

               const textoData = recebida
                  ? `Recebido em ${r.dataRecebimento}`
                  : `Previsto para ${r.dataPrevista}`

               return (
                  <div
                     key={r.rowIndex}
                     onClick={() => onSelect(r)}
                     className={`
          col-span-12 grid grid-cols-12 items-center p-4
          rounded-lg border cursor-pointer transition
          hover:shadow-md
        `}
                  >
                     <div className="col-span-4 font-medium">
                        {r.descricao}
                     </div>

                     <div className="col-span-4 text-sm text-muted-foreground">
                        {textoData}
                     </div>

                     <div className="col-span-2 text-right font-semibold">
                        {numeroParaMoeda(r.valor)}
                     </div>

                     <div
                        className={`col-span-2 text-right font-medium ${recebida ? 'text-green-600' : 'text-amber-500'
                           }`}
                     >
                        {recebida ? 'Recebido' : 'Em aberto'}
                     </div>
                  </div>
               )
            })}
         </div>

      </>
   )
}