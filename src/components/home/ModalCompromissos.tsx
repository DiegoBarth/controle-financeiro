import type { AlertaItem } from "@/types/AlertaItem"
import { useState, useEffect } from "react"

interface ModalCompromissosProps {
   aberto: boolean
   onClose: () => void
   titulo: string
   itens: AlertaItem[]
   onSelect: (item: AlertaItem) => void
}

export function ModalCompromissos({
   aberto,
   onClose,
   titulo,
   itens,
   onSelect,
}: ModalCompromissosProps) {
   const [lista, setLista] = useState<AlertaItem[]>([])

   useEffect(() => {
      if (aberto) {
         setLista(itens)
      }
   }, [aberto, itens])

   if (!aberto) return null

   return (
      <div className="fixed inset-0 z-50 flex justify-center items-end md:items-center">
         {/* Overlay */}
         <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
         />

         {/* Modal container */}
         <div className="
            relative w-full md:w-[400px] max-h-[90vh]
            bg-white rounded-t-2xl md:rounded-2xl
            flex flex-col
         ">
            {/* Header fixo */}
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
               <h2 className="text-lg font-semibold">{titulo}</h2>
               <button
                  onClick={onClose}
                  className="text-sm text-muted-foreground hover:text-gray-700 transition"
               >
                  Fechar
               </button>
            </div>

            {/* Conteúdo scrollável */}
            <ul className="overflow-y-auto p-4 space-y-2 flex-1">
               {lista.length > 0 ? (
                  lista.map(item => (
                     <li
                        key={item.rowIndex}
                        className="
                           rounded-lg border p-3 text-sm
                           cursor-pointer hover:bg-gray-100 transition
                        "
                        onClick={() => onSelect(item)}
                     >
                        <div className="font-medium">{item.descricao}</div>
                        <div className="text-xs text-muted-foreground">
                           Vence em {item.data}
                        </div>
                     </li>
                  ))
               ) : (
                  <div className="text-center text-sm text-muted-foreground py-6">
                     Nenhum compromisso pendente 🎉
                  </div>
               )}
            </ul>
         </div>
      </div>
   )
}
