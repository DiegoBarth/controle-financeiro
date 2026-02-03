import { useAlertas } from "@/contexts/UseAlertas"

interface AlertaItem {
   id: string
   descricao: string
   data: string
}

interface AlertaCardProps {
   titulo: string
   itens: AlertaItem[]
   gradientFrom: string
   gradientTo: string
}

function AlertaCard({ titulo, itens, gradientFrom, gradientTo }: AlertaCardProps) {
   return (
      <div
         className="rounded-xl p-4 text-white shadow-md"
         style={{
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
         }}
      >
         <h3 className="mb-2 text-sm font-semibold">{titulo}</h3>
         <ul className="space-y-1 text-sm">
            {itens.map(item => (
               <li key={item.id} className="flex items-center gap-1">
                  <span className="text-white/80">•</span>
                  <span>
                     {item.descricao} ({item.data})
                  </span>
               </li>
            ))}
         </ul>
      </div>
   )
}

export function Alertas() {
   const { hoje, semana } = useAlertas()

   const vencimentosSemana: AlertaItem[] = semana.map(c => ({
      id: String(c.rowIndex),
      descricao: c.descricao,
      data: c.dataVencimento,
   }))

   const vencimentosHoje: AlertaItem[] = hoje.map(c => ({
      id: String(c.rowIndex),
      descricao: c.descricao,
      data: c.dataVencimento,
   }))

   if (!vencimentosSemana.length && !vencimentosHoje.length) return null

   return (
      <div className="grid grid-cols-2 gap-3">
         {vencimentosHoje.length > 0 && (
            <AlertaCard
               titulo={`${vencimentosHoje.length} ${vencimentosHoje.length == 1 ? 'conta' : 'contas'} vencendo hoje`}
               itens={vencimentosHoje}
               gradientFrom="#db2777"
               gradientTo="#f472b6"
            />
         )}

         {vencimentosSemana.length > 0 && (
            <AlertaCard
               titulo="Vencimentos Semana"
               itens={vencimentosSemana}
               gradientFrom="#7c3aed"
               gradientTo="#a855f7"
            />
         )}
      </div>
   )
}