// pages/Compromissos.tsx
import { useEffect, useState } from 'react';
import { excluirCompromisso, listarCompromissos, atualizarCompromisso, criarCartao, criarCompromisso } from '../api/compromissos';
import type { Compromisso } from '../types/Compromisso';
import { numeroParaMoeda, dataBRParaISO, moedaParaNumero } from '../utils/formatadores';
import { CompromissoGrid } from '../components/compromissos/CompromissoGrid';
import { CompromissoForm } from '../components/compromissos/CompromissoForm';

export function Compromissos() {
   const hoje = new Date();

   const [mes, setMes] = useState(String(hoje.getMonth() + 1));
   const [ano, setAno] = useState(String(hoje.getFullYear()));
   const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
   const [editandoRow, setEditandoRow] = useState<number | null>(null);
   const [valorEditado, setValorEditado] = useState('');
   const [dataEditada, setDataEditada] = useState('');

   async function handleSalvar(payload: any) {
      if (payload.tipo === 'cartao') {
         await criarCartao(payload);
      } else {
         await criarCompromisso(payload);
      }

      await buscar();
   }

   async function buscar() {
      const res = await listarCompromissos(mes, ano);
      setCompromissos(res);
   }

   async function handleExcluir(rowIndex: number) {
      if (!confirm('Deseja realmente excluir este gasto?')) return;

      await excluirCompromisso(rowIndex);

      setCompromissos(prev =>
         prev.filter(g => g.rowIndex !== rowIndex)
      );
   }

   function handleEditar(compromisso: Compromisso) {
      setEditandoRow(compromisso.rowIndex);
      setValorEditado(numeroParaMoeda(compromisso.valor));
      setDataEditada(compromisso.dataPagamento
         ? dataBRParaISO(compromisso.dataPagamento)
         : '');
   }

   function cancelarEdicao() {
      setEditandoRow(null);
   }

   async function handleSalvarEdicao() {
      if (editandoRow === null) return;

      await atualizarCompromisso({
         rowIndex: editandoRow,
         valor: moedaParaNumero(valorEditado),
         dataPagamento: dataEditada
      });

      setEditandoRow(null);
      buscar();
   }

   useEffect(() => {
      buscar();
   }, []);

   return (
      <div>
         <h2>Novo compromisso</h2>
         <CompromissoForm onSalvar={handleSalvar} />

         <hr />
         <h2>Compromissos</h2>

         {/* filtros */}
         <div style={{ marginBottom: 16 }}>
            <select value={mes} onChange={e => setMes(e.target.value)}>
               <option value="all">Ano inteiro</option>
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

            <input
               type="number"
               value={ano}
               onChange={e => setAno(e.target.value)}
               style={{ marginLeft: 8 }}
            />

            <button onClick={buscar} style={{ marginLeft: 8 }}>
               Buscar
            </button>
         </div>

         <CompromissoGrid
            compromissos={compromissos}
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

      </div>
   );
}