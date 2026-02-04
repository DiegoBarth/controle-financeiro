import { useAlertas } from "@/contexts/UseAlertas"
import type { Compromisso } from "@/types/Compromisso"


interface AlertaCardProps {
   titulo: string
   gradientFrom: string
   gradientTo: string
   onClick?: () => void
}

function AlertaCard({ titulo, gradientFrom, gradientTo, onClick }: AlertaCardProps) {
   return (
      <button
         onClick={onClick}
         className="
        w-full text-left
        rounded-xl p-2 text-white
        flex items-center justify-between
        gap-2
        active:scale-[0.98] transition
      "
         style={{
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
         }}
      >
         <h3 className="text-sm font-medium text-white/90 truncate">
            {titulo}
         </h3>

         <span className="text-xs opacity-80 whitespace-nowrap">
            Ver detalhes
         </span>
      </button>
   )
}


import { useState } from "react"
import { ModalCompromissos } from "./ModalCompromissos"
import { ModalEditarCompromisso } from "../compromissos/ModalEditarCompromisso"

export function Alertas() {
   const { hoje, semana } = useAlertas()
   const [tipoAberto, setTipoAberto] = useState<"hoje" | "semana" | null>(null)
   const [compromissoSelecionado, setCompromissoSelecionado] = useState<Compromisso | null>(null)
   const [removidos, setRemovidos] = useState<number[]>([])
   const [tipoOrigem, setTipoOrigem] =
      useState<"hoje" | "semana" | null>(null)


   function voltarParaLista() {
      if (tipoOrigem === "hoje" && vencimentosHoje.length > 0) {
         setTipoAberto("hoje")
      }

      if (tipoOrigem === "semana" && vencimentosSemana.length > 0) {
         setTipoAberto("semana")
      }
   }

   function marcarComoResolvido(rowIndex: number) {
      setRemovidos(prev => [...prev, rowIndex])
      setCompromissoSelecionado(null)

      setTimeout(() => {
         voltarParaLista()
      }, 0)
   }

   const vencimentosSemana: Compromisso[] = semana.filter(c => !removidos.includes(c.rowIndex)).map(c => ({
      rowIndex: c.rowIndex,
      descricao: c.descricao,
      valor: c.valor,
      data: c.dataVencimento,
      categoria: c.categoria,
      tipo: c.tipo,
      dataVencimento: c.dataVencimento
   }))

   const vencimentosHoje: Compromisso[] = hoje.filter(c => !removidos.includes(c.rowIndex)).map(c => ({
      rowIndex: c.rowIndex,
      descricao: c.descricao,
      valor: c.valor,
      data: c.dataVencimento,
      categoria: c.categoria,
      tipo: c.tipo,
      dataVencimento: c.dataVencimento
   }))

   if (!vencimentosSemana.length && !vencimentosHoje.length) return null

   return (
      <>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vencimentosHoje.length > 0 && (
               <AlertaCard
                  titulo={`${vencimentosHoje.length} conta(s) vencendo hoje`}
                  gradientFrom="#db2777"
                  gradientTo="#f472b6"
                  onClick={() => setTipoAberto("hoje")}
               />
            )}

            {vencimentosSemana.length > 0 && (
               <AlertaCard
                  titulo={`${vencimentosSemana.length} conta(s) vencendo essa semana`}
                  gradientFrom="#7c3aed"
                  gradientTo="#a855f7"
                  onClick={() => setTipoAberto("semana")}
               />
            )}
         </div>

         {/* MODAIS */}
         <ModalCompromissos
            aberto={tipoAberto === "hoje"}
            titulo="Vencem hoje"
            itens={vencimentosHoje}
            onClose={() => setTipoAberto(null)}
            onSelect={item => {
               setTipoOrigem(tipoAberto)
               setTipoAberto(null)
               setCompromissoSelecionado(item)
            }}
         />

         <ModalCompromissos
            aberto={tipoAberto === "semana"}
            titulo="Vencem essa semana"
            itens={vencimentosSemana}
            onClose={() => setTipoAberto(null)}
            onSelect={item => {
               setTipoOrigem(tipoAberto)
               setTipoAberto(null)
               setCompromissoSelecionado(item)
            }}
         />

         <ModalEditarCompromisso
            aberto={!!compromissoSelecionado}
            compromisso={compromissoSelecionado}
            onClose={() => {
               setCompromissoSelecionado(null)
               voltarParaLista()
            }}
            onConfirmar={marcarComoResolvido}
         />

      </>
   )

}