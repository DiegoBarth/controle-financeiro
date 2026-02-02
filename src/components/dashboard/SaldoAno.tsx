import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { SaldoMensal } from '../../types/Dashboard';

interface SaldoAnoProps {
   data: SaldoMensal[];
   loading: boolean;
}

export function SaldoAno({ data, loading }: SaldoAnoProps) {
   if (loading) return <p>Carregando saldo anual...</p>;

   return (
      <div style={{ width: '100%', height: 200 }}>
         <h2>Saldo ao longo do ano</h2>
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
               <XAxis dataKey="mes" />
               <YAxis />
               <Tooltip />
               <Line type="monotone" dataKey="saldo" stroke="#3498db" strokeWidth={2} />
            </LineChart>
         </ResponsiveContainer>
      </div>
   );
}