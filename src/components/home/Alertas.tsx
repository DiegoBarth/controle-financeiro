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
   const { vencidos, hoje, semana } = useAlertas()
   const [tipoAberto, setTipoAberto] = useState<"vencido" | "hoje" | "semana" | null>(null)
   const [compromissoSelecionado, setCompromissoSelecionado] = useState<Compromisso | null>(null)
   const [removidos, setRemovidos] = useState<number[]>([])
   const [tipoOrigem, setTipoOrigem] =
      useState<"vencido" | "hoje" | "semana" | null>(null)


   function voltarParaLista() {
      if (tipoOrigem === "vencido" && jaVencidos.length > 0) {
         setTipoAberto("vencido")
      }

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

   function pluralizar(qtd: number, singular: string, plural: string) {
      return qtd === 1 ? singular : plural
   }

   const jaVencidos: Compromisso[] = vencidos.filter(c => !removidos.includes(c.rowIndex)).map(c => ({
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

   const vencimentosSemana: Compromisso[] = semana.filter(c => !removidos.includes(c.rowIndex)).map(c => ({
      rowIndex: c.rowIndex,
      descricao: c.descricao,
      valor: c.valor,
      data: c.dataVencimento,
      categoria: c.categoria,
      tipo: c.tipo,
      dataVencimento: c.dataVencimento
   }))

   if (!jaVencidos.length && !vencimentosSemana.length && !vencimentosHoje.length) return null

   return (
      <>
         <div className=" grid gap-3 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] justify-center">
            {jaVencidos.length > 0 && (
               <AlertaCard
                  titulo={`${jaVencidos.length} ${pluralizar(
                     jaVencidos.length,
                     'conta vencida',
                     'contas vencidas'
                  )}`}
                  gradientFrom="#dc2626"
                  gradientTo="#f87171"
                  onClick={() => setTipoAberto("vencido")}
               />
            )}

            {vencimentosHoje.length > 0 && (
               <AlertaCard
                  titulo={`${vencimentosHoje.length} ${pluralizar(
                     vencimentosHoje.length,
                     'conta vencendo hoje',
                     'contas vencendo hoje'
                  )}`}
                  gradientFrom="#f59e0b"
                  gradientTo="#fbbf24"
                  onClick={() => setTipoAberto("hoje")}
               />
            )}

            {vencimentosSemana.length > 0 && (
               <AlertaCard
                  titulo={`${vencimentosSemana.length} ${pluralizar(
                     vencimentosSemana.length,
                     'conta vencendo essa semana',
                     'contas vencendo essa semana'
                  )}`}
                  gradientFrom="#2563eb"
                  gradientTo="#60a5fa"
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