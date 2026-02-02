import { useEffect, useState } from 'react';
import { listarReceitas, excluirReceita, atualizarReceita } from '../api/receitas';
import type { Receita } from '../types/Receita';
import { ReceitaForm } from '../components/receita/ReceitaForm';
import { ReceitaGrid } from '../components/receita/ReceitaGrid';
import { numeroParaMoeda, dataBRParaISO, moedaParaNumero } from '../utils/formatadores';
import { usePeriodo } from '../contexts/PeriodoContext';
import { useNavigate } from 'react-router-dom';
import { receitasCache } from '../cache/receitasCache';

export function Receitas() {
   const { mes, ano } = usePeriodo(); // pega do contexto
   const [receitas, setReceitas] = useState<Receita[]>([]);
   const [editandoRow, setEditandoRow] = useState<number | null>(null);
   const [valorEditado, setValorEditado] = useState('');
   const [dataEditada, setDataEditada] = useState('');
   const [loading, setLoading] = useState(false);
   const [persistindo, setPersistindo] = useState(false);

   const navigate = useNavigate();

   async function handleSalvarEdicao() {
      if (editandoRow === null || persistindo) return;

      setPersistindo(true);

      try {
         await atualizarReceita({
            rowIndex: editandoRow,
            valor: moedaParaNumero(valorEditado),
            dataRecebimento: dataEditada
         }, mes, String(ano));

         setEditandoRow(null);

         const atualizados = receitasCache.get(mes, ano) || [];
         setReceitas(atualizados);
      }
      finally {
         setPersistindo(false);
      }
   }

   async function buscar() {
      setLoading(true);
      const res = await listarReceitas(mes, String(ano));
      setReceitas(res);
      setLoading(false);
   }

   async function handleExcluir(rowIndex: number) {
      if (!confirm('Deseja realmente excluir esta receita?')) return;

      setPersistindo(true);

      try {
         await excluirReceita(rowIndex, mes, String(ano));

         const atualizados = receitasCache.get(mes, ano) || [];
         setReceitas(atualizados);
      }
      finally {
         setPersistindo(false);
      }
   }

   function handleEditar(receita: Receita) {
      setEditandoRow(receita.rowIndex);
      setValorEditado(numeroParaMoeda(receita.valor));
      setDataEditada(receita.dataRecebimento ? dataBRParaISO(receita.dataRecebimento) : '');
   }

   function cancelarEdicao() {
      setEditandoRow(null);
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

         <h2>Nova receita</h2>
         <ReceitaForm
            onSalvar={() => {
               const atualizados = receitasCache.get(mes, ano) || [];

               setReceitas([...atualizados]);
            }}
         />

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
               persistindo={persistindo}
            />
         )}
      </>
   );
}
