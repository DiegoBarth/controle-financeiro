import { numeroParaMoeda } from '../../utils/formatadores';

interface ResumoCardProps {
   titulo: string;
   valor: number;
   cor?: string;
   loading: boolean;
}

export function ResumoCard({ titulo, valor, cor, loading }: ResumoCardProps) {
   const corPadrao =
      cor ?? (valor >= 0 ? '#2ecc71' : '#e74c3c');

   return (
      <div
         style={{
            padding: 16,
            borderRadius: 8,
            background: '#f5f5f5',
            borderLeft: `6px solid ${corPadrao}`,
         }}
      >
         <strong>{titulo}</strong>
         {loading ? (
            <p>Carregando...</p>
         ) : (
            <h2 style={{ margin: '8px 0' }}>
               {numeroParaMoeda(valor)}
            </h2>
         )}
      </div>
   );
}
