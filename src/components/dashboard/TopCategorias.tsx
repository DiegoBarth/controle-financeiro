import type { Categoria } from '../../types/Dashboard'
import { numeroParaMoeda } from '../../utils/formatadores'

interface TopCategoriasProps {
   categorias: Categoria[]
}

export function TopCategorias({ categorias }: TopCategoriasProps) {
   if (!categorias.length) return null

   const maior = categorias[0].total

   return (
      <section className="rounded-xl border bg-card p-4 shadow-sm">
         <h2 className="mb-6 text-sm font-semibold text-muted-foreground">
            Top categorias
         </h2>
         <div className="h-56 sm:h-64 lg:h-60 w-full">
            <ul className="space-y-2">
               {categorias.map(c => (
                  <li
                     key={c.categoria}
                     className="flex items-center gap-2"
                  >
                     <span className="w-24 truncate text-xs">
                        {c.categoria}
                     </span>

                     <div className="flex-1 h-1.5 rounded-full bg-muted">
                        <div
                           className="h-1.5 rounded-full bg-red-500"
                           style={{ width: `${(c.total / maior) * 100}%` }}
                        />
                     </div>

                     <span className="w-20 text-right text-xs text-muted-foreground">
                        {numeroParaMoeda(c.total)}
                     </span>
                  </li>
               ))}
            </ul>
         </div>
      </section>
   )
}