import { useEffect, useState } from 'react';
import { listarReceitas, excluirReceita, atualizarReceita } from '../api/receitas';
import { ReceitaForm } from '../components/receita/ReceitaForm'
import type { Receita } from '../types/Receita';
import { ReceitaGrid } from '../components/receita/ReceitaGrid';
import { numeroParaMoeda, dataBRParaISO, moedaParaNumero } from '../utils/formatadores';

export function Receitas() {
   const hoje = new Date();

   const [mes, setMes] = useState(String(hoje.getMonth() + 1));
   const [ano, setAno] = useState(String(hoje.getFullYear()));
   const [receitas, setReceitas] = useState<Receita[]>([]);
   const [editandoRow, setEditandoRow] = useState<number | null>(null);
   const [valorEditado, setValorEditado] = useState('');
   const [dataEditada, setDataEditada] = useState('');

   async function handleExcluir(rowIndex: number) {
      if (!confirm('Deseja realmente excluir este gasto?')) return;

      await excluirReceita(rowIndex);

      setReceitas(prev =>
         prev.filter(g => g.rowIndex !== rowIndex)
      );
   }

   function handleEditar(receita: Receita) {
      setEditandoRow(receita.rowIndex);
      setValorEditado(numeroParaMoeda(receita.valor));
      setDataEditada(receita.dataRecebimento
         ? dataBRParaISO(receita.dataRecebimento)
         : '');
   }

   function cancelarEdicao() {
      setEditandoRow(null);
   }

   async function handleSalvarEdicao() {
      if (editandoRow === null) return;

      await atualizarReceita({
         rowIndex: editandoRow,
         valor: moedaParaNumero(valorEditado),
         dataRecebimento: dataEditada
      });

      setEditandoRow(null);
      buscar(); // recarrega lista
   }

   async function buscar() {
      const res = await listarReceitas(mes, ano);
      setReceitas(res);
   }

   useEffect(() => {
      buscar();
   }, []);

   return (
      <>
         <h2>Nova receita</h2>
         <ReceitaForm onSalvar={buscar} />

         <hr />

         <h2>Consultar receitas</h2>

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

         {<ReceitaGrid
            receitas={receitas}
            onExcluir={handleExcluir}
            editandoRow={editandoRow}
            valorEditado={valorEditado}
            dataEditada={dataEditada}
            onEditar={handleEditar}
            onCancelarEdicao={cancelarEdicao}
            onSalvar={handleSalvarEdicao}
            onChangeValor={setValorEditado}
            onChangeData={setDataEditada}
         />}


      </>
   );
}