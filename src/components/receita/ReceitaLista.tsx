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

               return (
                  <div
                     key={r.rowIndex}
                     className={`
                rounded-lg border p-3 cursor-pointer
                hover:bg-muted transition
                ${recebida ? 'border-green-500/40 bg-green-50' : ''}
              `}
                     onClick={() => onSelect(r)}
                  >
                     <div className="flex items-center justify-between">
                        <div className="font-medium flex items-center gap-2">
                           {recebida ? '✔️' : '⏳'} {r.descricao}
                        </div>

                        <span className="text-sm font-semibold">
                           {numeroParaMoeda(r.valor)}
                        </span>
                     </div>

                     <div className="mt-1 text-xs text-muted-foreground">
                        Data prevista: {r.dataPrevista}
                     </div>

                     <div
                        className={`
                  text-xs mt-0.5
                  ${recebida ? 'text-green-600' : 'text-muted-foreground'}
                `}
                     >
                        {recebida
                           ? `Recebido em: ${r.dataRecebimento}`
                           : 'Não recebido'}
                     </div>
                  </div>
               )
            })}
         </div>

         {/* DESKTOP MODERNO */}
         <div className="hidden sm:grid sm:grid-cols-12 gap-3">
            {receitas.map(r => {
               const recebida = !!r.dataRecebimento
               const textoRecebido = r.dataRecebimento ? 'Recebido em: ' + r.dataRecebimento : '-';

               return (
                  <div
                     key={r.rowIndex}
                     className={`
                col-span-12 flex items-center justify-between p-4
                rounded-lg border shadow-sm cursor-pointer transition
                hover:shadow-md
                ${recebida ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}
              `}
                     onClick={() => onSelect(r)}
                  >
                     <div className="flex items-center w-16 justify-center text-lg">
                        {recebida ? '✔️' : '⏳'}
                     </div>

                     <div className="flex-1 font-medium">{r.descricao}</div>

                     <div className="w-32 text-sm text-muted-foreground text-center">
                        Data prevista: {r.dataPrevista}
                     </div>

                     <div className={`w-32 text-sm text-center ${recebida ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {textoRecebido}
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