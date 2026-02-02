import { useAlertas } from '../contexts/UseAlertas';

export function Alertas() {
   const alertas = useAlertas();

   if (!alertas.hoje.length && !alertas.semana.length) return null;

   return (
      <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
         {alertas.hoje.length > 0 && (
            <div style={{ padding: 12, background: '#fceabb', borderRadius: 8 }}>
               <strong>⚠️ Compromissos vencendo hoje:</strong>
               <ul>
                  {alertas.hoje.map(c => (
                     <li key={c.rowIndex}>{c.descricao} ({c.dataVencimento})</li>
                  ))}
               </ul>
            </div>
         )}

         {alertas.semana.length > 0 && (
            <div style={{ padding: 12, background: '#fff3cd', borderRadius: 8 }}>
               <strong>⏳ Compromissos vencendo esta semana:</strong>
               <ul>
                  {alertas.semana.map(c => (
                     <li key={c.rowIndex}>{c.descricao} ({c.dataVencimento})</li>
                  ))}
               </ul>
            </div>
         )}
      </div>
   );
}
