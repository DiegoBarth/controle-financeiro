import type { ResumoCompleto } from '../../types/ResumoCompleto'
import { numeroParaMoeda } from '../../utils/formatadores'

interface Props {
   resumo: ResumoCompleto | null
}

export function ProgressoReceitasDespesas({ resumo }: Props) {
   if (!resumo) return null

   const percRecebido = resumo.totalReceitas
      ? (resumo.totalRecebidoMes / resumo.totalReceitas) * 100
      : 0

   const percPago = resumo.totalGastos
      ? ((resumo.totalPagoMes + resumo.totalCompromissosPagosMes) /
         (resumo.totalGastos + resumo.totalCompromissos)) *
      100
      : 0

   return (
      <section className="rounded-xl border bg-card p-4">
         <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
            Progresso do mês
         </h2>

         <div className="space-y-4">
            {/* Receitas */}
            <div>
               <div className="mb-1 flex justify-between text-sm">
                  <span>Receitas</span>
                  <span className="text-muted-foreground">
                     {numeroParaMoeda(resumo.totalRecebidoMes)} /{' '}
                     {numeroParaMoeda(resumo.totalReceitas)}
                  </span>
               </div>
               <div className="h-2 rounded-full bg-muted">
                  <div
                     className="h-2 rounded-full bg-emerald-500"
                     style={{ width: `${percRecebido}%` }}
                  />
               </div>
            </div>

            {/* Despesas */}
            <div>
               <div className="mb-1 flex justify-between text-sm">
                  <span>Despesas</span>
                  <span className="text-muted-foreground">
                     {numeroParaMoeda(
                        resumo.totalPagoMes + resumo.totalCompromissosPagosMes
                     )}{' '}
                     /{' '}
                     {numeroParaMoeda(
                        resumo.totalGastos + resumo.totalCompromissos
                     )}
                  </span>
               </div>
               <div className="h-2 rounded-full bg-muted">
                  <div
                     className="h-2 rounded-full bg-red-500"
                     style={{ width: `${percPago}%` }}
                  />
               </div>
            </div>
         </div>
      </section>
   )
}
