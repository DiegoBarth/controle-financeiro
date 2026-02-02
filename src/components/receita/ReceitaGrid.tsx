import type { Receita } from '../../types/Receita';
import { numeroParaMoeda, formatarMoeda } from '../../utils/formatadores';

interface Props {
   receitas: Receita[];
   onExcluir: (rowIndex: number) => void;

   editandoRow: number | null;
   valorEditado: string;
   dataEditada: string;

   persistindo: boolean;

   onEditar: (receita: Receita) => void;
   onCancelarEdicao: () => void;
   onSalvar: () => void;
   onChangeValor: (valor: string) => void;
   onChangeData: (data: string) => void;
}

export function ReceitaGrid({
   receitas,
   onExcluir,
   editandoRow,
   valorEditado,
   dataEditada,
   onEditar,
   onCancelarEdicao,
   onSalvar,
   onChangeValor,
   onChangeData,
   persistindo
}: Props) {

   return (
      <table border={1} width="100%">
         <thead>
            <tr>
               <th>Descrição</th>
               <th>Data prevista</th>
               <th>Data recebimento</th>
               <th>Valor</th>
               <th>Ações</th>
            </tr>
         </thead>

         <tbody>
            {receitas.map(g => (

               <tr key={g.rowIndex}>
                  <td>{g.descricao}</td>
                  <td>{g.dataPrevista}</td>
                  <td>
                     {editandoRow === g.rowIndex ? (
                        <input
                           type="date"
                           value={dataEditada}
                           onChange={e => onChangeData(e.target.value)}
                        />
                     ) : (
                        g.dataRecebimento
                     )}
                  </td>

                  <td>
                     {editandoRow === g.rowIndex ? (
                        <input
                           type="text"
                           value={valorEditado}
                           onChange={e => onChangeValor(formatarMoeda(e.target.value))}
                        />
                     ) : (
                        numeroParaMoeda(g.valor)
                     )}
                  </td>
                  <td>
                     {editandoRow !== g.rowIndex && (
                        <>
                           <button
                              onClick={() => onEditar(g)}
                              disabled={persistindo}
                           >
                              Editar
                           </button>

                           <button
                              onClick={() => onExcluir(g.rowIndex)}
                              disabled={persistindo}
                           >
                              Excluir
                           </button>
                        </>
                     )}

                     {editandoRow === g.rowIndex && (
                        <>
                           <button
                              onClick={onSalvar}
                              disabled={persistindo}
                           >
                              {persistindo && editandoRow === g.rowIndex ? 'Salvando...' : 'Salvar'}
                           </button>

                           <button
                              onClick={onCancelarEdicao}
                              disabled={persistindo}
                           >
                              Cancelar edição
                           </button>
                        </>
                     )}

                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   );
}