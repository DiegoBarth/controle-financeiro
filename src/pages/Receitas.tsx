import { useEffect, useState } from 'react';
import { listarReceitas, excluirReceita, atualizarReceita } from '../api/receitas';
import type { Receita } from '../types/Receita';
import { ReceitaForm } from '../components/receita/ReceitaForm';
import { ReceitaGrid } from '../components/receita/ReceitaGrid';
import { numeroParaMoeda, dataBRParaISO, moedaParaNumero } from '../utils/formatadores';
import { usePeriodo } from '../contexts/PeriodoContext';
import { useNavigate } from 'react-router-dom';

export function Receitas() {
   const { mes, ano } = usePeriodo(); // pega do contexto
   const [receitas, setReceitas] = useState<Receita[]>([]);
   const [editandoRow, setEditandoRow] = useState<number | null>(null);
   const [valorEditado, setValorEditado] = useState('');
   const [dataEditada, setDataEditada] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   // Salvar edição
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

   // Buscar receitas do período
   async function buscar() {
      setLoading(true);
      const res = await listarReceitas(mes, String(ano));
      setReceitas(res);
      setLoading(false);
   }

   // Excluir receita
   async function handleExcluir(rowIndex: number) {
      if (!confirm('Deseja realmente excluir esta receita?')) return;

      await excluirReceita(rowIndex);
      setReceitas(prev => prev.filter(r => r.rowIndex !== rowIndex));
   }

   // Iniciar edição inline
   function handleEditar(receita: Receita) {
      setEditandoRow(receita.rowIndex);
      setValorEditado(numeroParaMoeda(receita.valor));
      setDataEditada(receita.dataRecebimento ? dataBRParaISO(receita.dataRecebimento) : '');
   }

   // Cancelar edição
   function cancelarEdicao() {
      setEditandoRow(null);
   }

   // Sempre que mes ou ano mudar no contexto, recarrega
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
         
         <h2>Nova receita</h2>
         <ReceitaForm onSalvar={buscar} />

         <hr />
         <h2>Consultar receitas</h2>

         {loading ? (
            <p>Carregando...</p>
         ) : (
            <ReceitaGrid
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
            />
         )}
      </>
   );
}
