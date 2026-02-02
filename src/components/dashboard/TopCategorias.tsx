// components/dashboard/TopCategorias.tsx
import type { Categoria } from '../../types/Dashboard';

interface TopCategoriasProps {
   categorias: Categoria[];
   loading: boolean;
}

export function TopCategorias({ categorias, loading }: TopCategoriasProps) {
   if (loading) return <p>Carregando categorias...</p>;

   return (
      <div>
         <h2>Top 10 categorias</h2>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {categorias.map(c => (
               <div key={c.categoria} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ width: 120 }}>{c.categoria}</span>
                  <div style={{ flex: 1, height: 16, background: '#eee', borderRadius: 8, margin: '0 8px' }}>
                     <div style={{
                        width: `${Math.min(100, (c.total / categorias[0].total) * 100)}%`,
                        height: '100%',
                        background: '#e74c3c',
                        borderRadius: 8
                     }} />
                  </div>
                  <span>R$ {c.total.toFixed(2)}</span>
               </div>
            ))}
         </div>
      </div>
   );
}
