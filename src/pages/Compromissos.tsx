import { useEffect, useState } from 'react';
import {
   excluirCompromisso,
   listarCompromissos,
   atualizarCompromisso
} from '../api/compromissos';
import type { Compromisso } from '../types/Compromisso';
import { numeroParaMoeda, dataBRParaISO, moedaParaNumero } from '../utils/formatadores';
import { CompromissoGrid } from '../components/compromissos/CompromissoGrid';
import { CompromissoForm } from '../components/compromissos/CompromissoForm';
import { usePeriodo } from '../contexts/PeriodoContext';
import { useNavigate } from 'react-router-dom';
import { compromissosCache } from '../cache/compromissosCache';

export function Compromissos() {
   const { mes, ano } = usePeriodo();
   const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
   const [editandoRow, setEditandoRow] = useState<number | null>(null);
   const [valorEditado, setValorEditado] = useState('');
   const [dataEditada, setDataEditada] = useState('');
   const [loading, setLoading] = useState(false);
   const [persistindo, setPersistindo] = useState(false);

   const navigate = useNavigate();

   async function buscar() {
      setLoading(true);
      const res = await listarCompromissos(mes, String(ano));
      setCompromissos(res);
      setLoading(false);
   }

   async function handleSalvarEdicao(scope: 'single' | 'future' = 'single') {
      if (editandoRow === null || persistindo) return;

      setPersistindo(true);

      try {
         await atualizarCompromisso({
            rowIndex: editandoRow,
            valor: moedaParaNumero(valorEditado),
            dataPagamento: dataEditada,
            scope
         }, mes, String(ano));

         setEditandoRow(null);
         const atualizados = compromissosCache.get(mes, ano) || [];
         setCompromissos(atualizados);
      }
      finally {
         setPersistindo(false);
      }
   }

   async function handleExcluir(rowIndex: number, scope: 'single' | 'future' | 'all' = 'single') {
      if (!confirm('Deseja realmente excluir?')) return;

      setPersistindo(true);

      try {
         await excluirCompromisso(rowIndex, mes, String(ano), scope);
         const atualizados = compromissosCache.get(mes, ano) || [];
         setCompromissos(atualizados);
      }
      finally {
         setPersistindo(false);
      }
   }

   function handleEditar(compromisso: Compromisso) {
      setEditandoRow(compromisso.rowIndex);
      setValorEditado(numeroParaMoeda(compromisso.valor));
      setDataEditada(compromisso.dataPagamento ? dataBRParaISO(compromisso.dataPagamento) : '');
   }

   function cancelarEdicao() {
      setEditandoRow(null);
   }

   useEffect(() => {
      buscar();
   }, [mes, ano]);

   return (
      <div>
         <button style={{ marginBottom: 16 }} onClick={() => navigate('/')}>
            ← Voltar para Home
         </button>

         <h2>Novo compromisso</h2>
         <CompromissoForm
            onSalvar={() => {
               const atualizados = compromissosCache.get(mes, ano) || [];

               setCompromissos([...atualizados]);
            }}
         />


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
               persistindo={persistindo}
            />
         )}
      </div>
   );
}
