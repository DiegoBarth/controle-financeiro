import type { Categoria } from '../../types/Dashboard'
import { numeroParaMoeda } from '../../utils/formatadores'

interface TopCategoriasProps {
   categorias: Categoria[]
   loading: boolean
}

export function TopCategorias({ categorias, loading }: TopCategoriasProps) {
   if (loading) return <p className="text-sm text-muted-foreground">Carregando categorias...</p>

   if (!categorias.length) return null

   const maior = categorias[0].total

   return (
      <section className="rounded-xl border bg-card p-4">
         <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
            Top categorias
         </h2>

         <ul className="space-y-3">
            {categorias.map(c => (
               <li key={c.categoria}>
                  <div className="mb-1 flex justify-between text-sm">
                     <span>{c.categoria}</span>
                     <span className="text-muted-foreground">
                        {numeroParaMoeda(c.total)}
                     </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-muted">
                     <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${(c.total / maior) * 100}%` }}
                     />
                  </div>
               </li>
            ))}
         </ul>
      </section>
   )
}
