import { useEffect, useState } from 'react';
import { listarGastos, excluirGasto, atualizarGasto } from '../api/gastos';
import { GastoForm } from '../components/gastos/GastoForm';
import { GastoGrid } from '../components/gastos/GastoGrid';
import type { Gasto } from '../types/Gasto';
import { numeroParaMoeda, moedaParaNumero } from '../utils/formatadores';
import { usePeriodo } from '../contexts/PeriodoContext';
import { useNavigate } from 'react-router-dom';
import { gastosCache } from '../cache/gastosCache';

export function Gastos() {
   const { mes, ano } = usePeriodo();
   const [gastos, setGastos] = useState<Gasto[]>([]);
   const [editandoRow, setEditandoRow] = useState<number | null>(null);
   const [valorEditado, setValorEditado] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   async function buscar() {
      setLoading(true);
      const res = await listarGastos(mes, ano);
      setGastos(res);
      setLoading(false);
   }

   async function handleExcluir(rowIndex: number) {
      if (!confirm('Deseja realmente excluir este gasto?')) return;

      await excluirGasto(rowIndex, mes, String(ano));

      const atualizados = gastosCache.get(mes, ano) || [];
      setGastos(atualizados);
   }

   function handleEditar(gasto: Gasto) {
      setEditandoRow(gasto.rowIndex);
      setValorEditado(numeroParaMoeda(gasto.valor));
   }

   function cancelarEdicao() {
      setEditandoRow(null);
   }

   async function handleSalvarEdicao() {
      if (editandoRow === null) return;

      await atualizarGasto({
         rowIndex: editandoRow,
         valor: moedaParaNumero(valorEditado)
      }, mes, String(ano));

      setEditandoRow(null);

      const atualizados = gastosCache.get(mes, ano) || [];
      setGastos(atualizados);
   }

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
         <GastoForm
            onSalvar={() => {
               const atualizados = gastosCache.get(mes, ano) || [];

               setGastos([...atualizados]);
            }}
         />

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
               onEditar={handleEditar}
               onCancelarEdicao={cancelarEdicao}
               onSalvar={handleSalvarEdicao}
               onChangeValor={setValorEditado}
            />
         )}
      </>
   );
}
