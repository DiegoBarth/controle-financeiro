import type { Gasto } from '../../types/Gasto';
import { numeroParaMoeda, formatarMoeda } from '../../utils/formatadores';

interface Props {
   gastos: Gasto[];
   onExcluir: (rowIndex: number) => void;

   editandoRow: number | null;
   valorEditado: string;

   persistindo: boolean;

   onEditar: (gasto: Gasto) => void;
   onCancelarEdicao: () => void;
   onSalvar: () => void;
   onChangeValor: (valor: string) => void;
}

export function GastoGrid({
   gastos,
   onExcluir,
   editandoRow,
   valorEditado,
   persistindo,
   onEditar,
   onCancelarEdicao,
   onSalvar,
   onChangeValor
}: Props) {

   return (
      <table border={1} width="100%">
         <thead>
            <tr>
               <th>Descrição</th>
               <th>Categoria</th>
               <th>Valor</th>
               <th>Data</th>
               <th>Ações</th>
            </tr>
         </thead>

         <tbody>
            {gastos.map(g => (

               <tr key={g.rowIndex}>
                  <td>{g.descricao}</td>
                  <td>{g.categoria}</td>
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

                  <td>{g.dataPagamento}</td>

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