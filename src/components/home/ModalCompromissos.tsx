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
      <div className="fixed inset-0 z-50">
         <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
         />

         <div className="
        absolute bottom-0 left-0 right-0
        rounded-t-2xl bg-white
        p-4 max-h-[80vh] overflow-y-auto
      ">
            <div className="mb-3 flex items-center justify-between">
               <h2 className="text-lg font-semibold">{titulo}</h2>
               <button onClick={onClose} className="text-sm text-muted-foreground">
                  Fechar
               </button>
            </div>

            <ul className="space-y-2">
               {lista.map(item => (
                  <li
                     key={item.rowIndex}
                     className="rounded-lg border p-3 text-sm cursor-pointer hover:bg-muted"
                     onClick={() => onSelect(item)}
                  >
                     <div className="font-medium">{item.descricao}</div>
                     <div className="text-xs text-muted-foreground">
                        Vence em {item.data}
                     </div>
                  </li>
               ))}

               {lista.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-6">
                     Nenhum compromisso pendente 🎉
                  </div>
               )}
            </ul>
         </div>
      </div>
   )
}
