import type { ResumoCompleto } from '../../types/ResumoCompleto';
import { numeroParaMoeda } from '../../utils/formatadores';

interface ProgressoProps {
   resumo: ResumoCompleto | null;
   loading: boolean;
}

export function ProgressoReceitasDespesas({ resumo, loading }: ProgressoProps) {
   if(!resumo) return;
   
   if (loading) return <p>Carregando progresso...</p>;

   const percRecebido = resumo.totalReceitas ? (resumo.totalRecebido / resumo.totalReceitas) * 100 : 0;
   const percPago = resumo.totalGastos ? (resumo.totalPago / resumo.totalGastos) * 100 : 0;

   return (
      <div>
         <h2>Progresso</h2>

         <div style={{ marginBottom: 16 }}>
            <strong>Receitas: {numeroParaMoeda(resumo.totalRecebidoMes)} de {numeroParaMoeda(resumo.totalReceitas)}</strong>
            <div style={{ background: '#eee', height: 16, borderRadius: 8 }}>
               <div style={{
                  width: `${percRecebido}%`,
                  height: '100%',
                  background: '#2ecc71',
                  borderRadius: 8
               }} />
            </div>
         </div>

         <div>
            <strong>Despesas: {numeroParaMoeda(resumo.totalPagoMes + resumo.totalCompromissosPagosMes)} de {numeroParaMoeda(resumo.totalGastos + resumo.totalCompromissos)}</strong>
            <div style={{ background: '#eee', height: 16, borderRadius: 8 }}>
               <div style={{
                  width: `${percPago}%`,
                  height: '100%',
                  background: '#e74c3c',
                  borderRadius: 8
               }} />
            </div>
         </div>
      </div>
   );
}
