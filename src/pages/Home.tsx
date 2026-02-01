import { useNavigate } from 'react-router-dom';

export function Home() {
   const navigate = useNavigate();

   // depois esses valores virão da API
   const totalEntradas = 4500;
   const totalGastos = 3120;
   const saldo = totalEntradas - totalGastos;

   return (
      <div style={{ padding: 16 }}>
         <h1>Dashboard</h1>

         {/* RESUMO */}
         <section style={{ display: 'grid', gap: 12 }}>
            <ResumoCard
               titulo="Entradas"
               valor={totalEntradas}
               cor="#2ecc71"
            />

            <ResumoCard
               titulo="Gastos"
               valor={totalGastos}
               cor="#e74c3c"
            />

            <ResumoCard
               titulo="Saldo"
               valor={saldo}
               cor={saldo >= 0 ? '#3498db' : '#e67e22'}
            />
         </section>

         <hr style={{ margin: '24px 0' }} />

         {/* AÇÕES RÁPIDAS */}
         <section style={{ display: 'grid', gap: 12 }}>
            <h2>Ações rápidas</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               <button onClick={() => navigate('/receitas')}>
                  ➕ Receitas
               </button>

               <button onClick={() => navigate('/gastos')}>
                  ➖ Gastos
               </button>

               <button onClick={() => navigate('/compromissos')}>
                  📅 Compromissos
               </button>

               <button disabled>
                  📊 Dashboard (em breve)
               </button>
            </div>
         </section>
      </div>
   );
}
function ResumoCard(props: {
   titulo: string;
   valor: number;
   cor: string;
}) {
   return (
      <div
         style={{
            padding: 16,
            borderRadius: 8,
            background: '#f5f5f5',
            borderLeft: `6px solid ${props.cor}`
         }}
      >
         <strong>{props.titulo}</strong>
         <h2 style={{ margin: '8px 0' }}>
            R$ {props.valor.toFixed(2)}
         </h2>
      </div>
   );
}
