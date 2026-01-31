import { useEffect, useState } from 'react';
import { listarGastos, excluirGasto, atualizarGasto } from '../api/gastos';
import { GastoForm } from '../components/gastos/GastoForm';
import { GastoGrid } from '../components/gastos/GastoGrid';
import type { Gasto } from '../types/Gasto';
import { numeroParaMoeda, dataBRParaISO, moedaParaNumero } from '../utils/formatadores';

export function Gastos() {
   const hoje = new Date();

   const [mes, setMes] = useState(String(hoje.getMonth() + 1));
   const [ano, setAno] = useState(String(hoje.getFullYear()));
   const [gastos, setGastos] = useState<Gasto[]>([]);
   const [editandoRow, setEditandoRow] = useState<number | null>(null);
   const [valorEditado, setValorEditado] = useState('');
   const [dataEditada, setDataEditada] = useState('');

   async function buscar() {
      const res = await listarGastos(mes, ano);
      setGastos(res);
   }

   async function handleExcluir(rowIndex: number) {
      if (!confirm('Deseja realmente excluir este gasto?')) return;

      await excluirGasto(rowIndex);

      setGastos(prev =>
         prev.filter(g => g.rowIndex !== rowIndex)
      );
   }

   function handleEditar(gasto: Gasto) {
      setEditandoRow(gasto.rowIndex);
      setValorEditado(numeroParaMoeda(gasto.valor));
      setDataEditada(dataBRParaISO(gasto.dataPagamento));
   }

   function cancelarEdicao() {
      setEditandoRow(null);
   }

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


   useEffect(() => {
      buscar();
   }, []);

   return (
      <>
         <h2>Novo gasto</h2>
         <GastoForm onSalvar={buscar} />

         <hr />

         <h2>Consultar gastos</h2>

         <select value={mes} onChange={e => setMes(e.target.value)}>
            <option value="all">Ano todo</option>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
         </select>

         <input value={ano} onChange={e => setAno(e.target.value)} />
         <button onClick={buscar}>Buscar</button>

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


      </>
   );
}