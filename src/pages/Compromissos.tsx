import { useEffect, useState } from 'react';
import {
   excluirCompromisso,
   listarCompromissos,
   atualizarCompromisso,
   criarCartao,
   criarCompromisso
} from '../api/compromissos';
import type { Compromisso } from '../types/Compromisso';
import { numeroParaMoeda, dataBRParaISO, moedaParaNumero } from '../utils/formatadores';
import { CompromissoGrid } from '../components/compromissos/CompromissoGrid';
import { CompromissoForm } from '../components/compromissos/CompromissoForm';
import { usePeriodo } from '../contexts/PeriodoContext';
import { useNavigate } from 'react-router-dom';

export function Compromissos() {
   const { mes, ano } = usePeriodo(); // usa o período da Home
   const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
   const [editandoRow, setEditandoRow] = useState<number | null>(null);
   const [valorEditado, setValorEditado] = useState('');
   const [dataEditada, setDataEditada] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   // Salvar novo compromisso ou cartão
   async function handleSalvar(payload: any) {
      if (payload.tipo === 'cartao') {
         await criarCartao(payload, mes, String(ano));
      } else {
         await criarCompromisso(payload);
      }
      await buscar();
   }

   // Buscar compromissos do período atual
   async function buscar() {
      setLoading(true);
      const res = await listarCompromissos(mes, String(ano));
      setCompromissos(res);
      setLoading(false);
   }

   // Excluir compromisso
   async function handleExcluir(rowIndex: number) {
      if (!confirm('Deseja realmente excluir este compromisso?')) return;

      await excluirCompromisso(rowIndex, mes, String(ano));
      setCompromissos(prev => prev.filter(c => c.rowIndex !== rowIndex));
   }

   // Iniciar edição inline
   function handleEditar(compromisso: Compromisso) {
      setEditandoRow(compromisso.rowIndex);
      setValorEditado(numeroParaMoeda(compromisso.valor));
      setDataEditada(compromisso.dataPagamento ? dataBRParaISO(compromisso.dataPagamento) : '');
   }

   // Cancelar edição
   function cancelarEdicao() {
      setEditandoRow(null);
   }

   // Salvar edição
   async function handleSalvarEdicao() {
      if (editandoRow === null) return;

      await atualizarCompromisso({
         rowIndex: editandoRow,
         valor: moedaParaNumero(valorEditado),
         dataPagamento: dataEditada
      }, mes, String(ano));

      setEditandoRow(null);
      buscar(); // recarrega lista
   }

   // Sempre que o mês ou ano do contexto mudar, refaz a busca
   useEffect(() => {
      buscar();
   }, [mes, ano]);

   return (
      <div>
         <button
            style={{ marginBottom: 16 }}
            onClick={() => navigate('/')}
         >
            ← Voltar para Home
         </button>
         
         <h2>Novo compromisso</h2>
         <CompromissoForm onSalvar={handleSalvar} />

         <hr />
         <h2>Compromissos</h2>

         {loading ? (
            <p>Carregando...</p>
         ) : (
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
         )}
      </div>
   );
}
