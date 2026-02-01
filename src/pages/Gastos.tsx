import { useEffect, useState } from 'react';
import { listarGastos, excluirGasto, atualizarGasto } from '../api/gastos';
import { GastoForm } from '../components/gastos/GastoForm';
import { GastoGrid } from '../components/gastos/GastoGrid';
import type { Gasto } from '../types/Gasto';
import { numeroParaMoeda, dataBRParaISO, moedaParaNumero } from '../utils/formatadores';
import { usePeriodo } from '../contexts/PeriodoContext';
import { useNavigate } from 'react-router-dom';

export function Gastos() {
   const { mes, ano } = usePeriodo(); // pega mês e ano do contexto da Home
   const [gastos, setGastos] = useState<Gasto[]>([]);
   const [editandoRow, setEditandoRow] = useState<number | null>(null);
   const [valorEditado, setValorEditado] = useState('');
   const [dataEditada, setDataEditada] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   // Busca gastos do mês/ano atual do contexto
   async function buscar() {
      setLoading(true);
      const res = await listarGastos(mes, String(ano));
      setGastos(res);
      setLoading(false);
   }

   // Excluir gasto
   async function handleExcluir(rowIndex: number) {
      if (!confirm('Deseja realmente excluir este gasto?')) return;

      await excluirGasto(rowIndex);

      setGastos(prev => prev.filter(g => g.rowIndex !== rowIndex));
   }

   // Iniciar edição inline
   function handleEditar(gasto: Gasto) {
      setEditandoRow(gasto.rowIndex);
      setValorEditado(numeroParaMoeda(gasto.valor));
      setDataEditada(dataBRParaISO(gasto.dataPagamento));
   }

   // Cancelar edição
   function cancelarEdicao() {
      setEditandoRow(null);
   }

   // Salvar edição
   async function handleSalvarEdicao() {
      if (editandoRow === null) return;

      await atualizarGasto({
         rowIndex: editandoRow,
         valor: moedaParaNumero(valorEditado),
         data: dataEditada
      });

      setEditandoRow(null);
      buscar(); // recarrega lista
   }

   // Sempre que o mês ou ano mudar no contexto, refaz a busca
   useEffect(() => {
      buscar();
   }, [mes, ano]);

   return (
      <>
         <button
            style={{ marginBottom: 16 }}
            onClick={() => navigate('/')}
         >
            ← Voltar para Home
         </button>
         
         <h2>Novo gasto</h2>
         <GastoForm onSalvar={buscar} />

         <hr />

         <h2>Consultar gastos</h2>

         {loading ? (
            <p>Carregando...</p>
         ) : (
            <GastoGrid
               gastos={gastos}
               onExcluir={handleExcluir}
               editandoRow={editandoRow}
               valorEditado={valorEditado}
               dataEditada={dataEditada}
               onEditar={handleEditar}
               onCancelarEdicao={cancelarEdicao}
               onSalvar={handleSalvarEdicao}
               onChangeValor={setValorEditado}
               onChangeData={setDataEditada}
            />
         )}
      </>
   );
}
