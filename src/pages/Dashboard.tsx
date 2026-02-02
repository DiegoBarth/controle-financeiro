// pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { listarResumoCompleto } from '../api/home';
import { listarSaldoMensal, listarTopCategorias, listarCartoesResumo } from '../api/dashboard';
import { usePeriodo } from '../contexts/PeriodoContext';
import { SaldoAno } from '../components/dashboard/SaldoAno';
import { TopCategorias } from '../components/dashboard/TopCategorias';
import { Cartoes } from '../components/dashboard/Cartoes';
import { ProgressoReceitasDespesas } from '../components/dashboard/ProgressoReceitasDespesas';
import type { SaldoMensal, Categoria, Cartao } from '../types/Dashboard';
import type { ResumoCompleto } from '../types/ResumoCompleto';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
   const navigate = useNavigate();

   const { mes, ano } = usePeriodo();

   const [saldoAno, setSaldoAno] = useState<SaldoMensal[]>([]);
   const [topCategorias, setTopCategorias] = useState<Categoria[]>([]);
   const [cartoes, setCartoes] = useState<Cartao[]>([]);
   const [resumo, setResumo] = useState<ResumoCompleto>({
      totalReceitas: 0,
      totalGastos: 0,
      totalCompromissos: 0,
      totalRecebido: 0,
      totalPago: 0,
      totalCompromissosPagos: 0,
      totalRecebidoMes: 0,
      totalPagoMes: 0,
      totalCompromissosPagosMes: 0
   });

   const [loading, setLoading] = useState(true);

   async function buscarDados() {
      setLoading(true);
      try {
         const [saldo, categorias, cards, resumoCompleto] = await Promise.all([
            listarSaldoMensal(String(ano)),
            listarTopCategorias(mes, String(ano)),
            listarCartoesResumo(mes, String(ano)),
            listarResumoCompleto(mes, String(ano))
         ]);
         setSaldoAno(saldo);
         setTopCategorias(categorias);
         setCartoes(cards);
         setResumo(resumoCompleto);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      buscarDados();
   }, [mes, ano]);

   return (
      <div style={{ padding: 16 }}>
         <button
            style={{ marginBottom: 16 }}
            onClick={() => navigate('/')}
         >
            ← Voltar para Home
         </button>


         <h1>Dashboard</h1>

         <section style={{ marginBottom: 32 }}>
            <SaldoAno data={saldoAno} loading={loading} />
         </section>

         <section style={{ marginBottom: 32 }}>
            <TopCategorias categorias={topCategorias} loading={loading} />
         </section>

         <section style={{ marginBottom: 32 }}>
            <Cartoes cartoes={cartoes} loading={loading} />
         </section>

         <section style={{ marginBottom: 32 }}>
            <ProgressoReceitasDespesas resumo={resumo} loading={loading} />
         </section>
      </div>
   );
}
