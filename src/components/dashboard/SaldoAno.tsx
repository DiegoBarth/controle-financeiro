import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
} from 'recharts'
import type { SaldoMensal } from '../../types/Dashboard'

interface SaldoAnoProps {
   data: SaldoMensal[]
   loading: boolean
}

export function SaldoAno({ data, loading }: SaldoAnoProps) {
   if (loading) {
      return <p className="text-sm text-muted-foreground">Carregando saldo anual...</p>
   }

   return (
      <section className="rounded-xl border bg-card p-4">
         <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
            Saldo ao longo do ano
         </h2>

         <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data}>
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Line
                     type="monotone"
                     dataKey="saldo"
                     strokeWidth={2}
                     stroke="hsl(var(--primary))"
                  />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </section>
   )
}
