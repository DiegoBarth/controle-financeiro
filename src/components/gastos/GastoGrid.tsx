import type { Gasto } from '../../types/Gasto';
import { numeroParaMoeda, formatarMoeda } from '../../utils/formatadores';

interface Props {
   gastos: Gasto[];
   onExcluir: (rowIndex: number) => void;

   editandoRow: number | null;
   valorEditado: string;
   dataEditada: string;

   onEditar: (gasto: Gasto) => void;
   onCancelarEdicao: () => void;
   onSalvar: () => void;
   onChangeValor: (valor: string) => void;
   onChangeData: (data: string) => void;
}

export function GastoGrid({
   gastos,
   onExcluir,
   editandoRow,
   valorEditado,
   dataEditada,
   onEditar,
   onCancelarEdicao,
   onSalvar,
   onChangeValor,
   onChangeData
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

                  <td>
                     {editandoRow === g.rowIndex ? (
                        <input
                           type="date"
                           value={dataEditada}
                           onChange={e => onChangeData(e.target.value)}
                        />
                     ) : (
                        g.dataPagamento
                     )}
                  </td>


                  <td>
                     {editandoRow !== g.rowIndex && (
                        <>
                           <button onClick={() => onEditar(g)}>
                              Editar
                           </button>

                           <button onClick={() => onExcluir(g.rowIndex)}>
                              Excluir
                           </button>
                        </>
                     )}

                     {editandoRow === g.rowIndex && (
                        <>
                           <button onClick={onSalvar}>
                              Salvar
                           </button>

                           <button onClick={onCancelarEdicao}>
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