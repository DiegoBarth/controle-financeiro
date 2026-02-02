import { useDashboard } from '../contexts/DashboardContext';
import { SaldoAno } from '../components/dashboard/SaldoAno';
import { TopCategorias } from '../components/dashboard/TopCategorias';
import { Cartoes } from '../components/dashboard/Cartoes';
import { ProgressoReceitasDespesas } from '../components/dashboard/ProgressoReceitasDespesas';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
   const { saldoAno, topCategorias, cartoes, resumo, loading } =
      useDashboard();

   const navigate = useNavigate();

   return (
      <div style={{ padding: 16 }}>
         <button
            style={{ marginBottom: 16 }}
            onClick={() => navigate('/')}
         >
            ← Voltar para Home
         </button>
         <h1>Dashboard</h1>

         <SaldoAno data={saldoAno} loading={loading} />
         <TopCategorias categorias={topCategorias} loading={loading} />
         <Cartoes cartoes={cartoes} loading={loading} />
         <ProgressoReceitasDespesas resumo={resumo} loading={loading} />
      </div>
   );
}