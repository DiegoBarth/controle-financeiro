import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { PeriodoContext } from '../contexts/PeriodoContext';
import { ResumoMes } from '../components/home/ResumoMes';

export function Home() {
   const navigate = useNavigate();
   const { mes, setMes, ano, setAno } = useContext(PeriodoContext);

   const meses = [
      { value: 'all', label: 'Ano inteiro' },
      { value: '1', label: 'Janeiro' },
      { value: '2', label: 'Fevereiro' },
      { value: '3', label: 'Março' },
      { value: '4', label: 'Abril' },
      { value: '5', label: 'Maio' },
      { value: '6', label: 'Junho' },
      { value: '7', label: 'Julho' },
      { value: '8', label: 'Agosto' },
      { value: '9', label: 'Setembro' },
      { value: '10', label: 'Outubro' },
      { value: '11', label: 'Novembro' },
      { value: '12', label: 'Dezembro' },
   ];

   return (
      <div style={{ padding: 16 }}>
         <h1>Dashboard</h1>

         {/* Filtros de período */}
         <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <select value={mes} onChange={e => setMes(e.target.value)}>
               {meses.map(m => (
                  <option key={m.value} value={m.value}>
                     {m.label}
                  </option>
               ))}
            </select>

            <input
               type="number"
               value={ano}
               onChange={e => setAno(Number(e.target.value))}
            />
         </div>

         {/* Cards do resumo do mês */}
         <ResumoMes />

         <hr style={{ margin: '24px 0' }} />

         {/* Ações rápidas */}
         <section style={{ display: 'grid', gap: 12 }}>
            <h2>Ações rápidas</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               <button onClick={() => navigate('/receitas')}>➕ Receitas</button>
               <button onClick={() => navigate('/gastos')}>➖ Gastos</button>
               <button onClick={() => navigate('/compromissos')}>📅 Compromissos</button>
               <button disabled>📊 Dashboard (em breve)</button>
            </div>
         </section>
      </div>
   );
}
