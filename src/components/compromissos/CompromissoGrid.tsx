import type { Compromisso } from '../../types/Compromisso';
import { numeroParaMoeda, formatarMoeda } from '../../utils/formatadores';

interface Props {
   compromissos: Compromisso[];
   onExcluir: (rowIndex: number, scope?: 'single' | 'future' | 'all') => void;

   editandoRow: number | null;
   valorEditado: string;
   dataEditada: string;

   persistindo: boolean;

   onEditar: (compromisso: Compromisso) => void;
   onCancelarEdicao: () => void;
   onSalvar: (scope?: 'single' | 'future') => void;
   onChangeValor: (valor: string) => void;
   onChangeData: (data: string) => void;
}

export function CompromissoGrid({
   compromissos,
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
               <th>Categoria</th>
               <th>Parcela</th>
               <th>Valor</th>
               <th>Vencimento</th>
               <th>Pagamento</th>
               <th>Pago</th>
               <th>Ações</th>
            </tr>
         </thead>

         <tbody>
            {compromissos.map(c => (
               <tr key={c.rowIndex}>
                  <td>{c.descricao}</td>
                  <td>{c.categoria}</td>
                  <td>{c.parcela ? `${c.parcela}/${c.totalParcelas}` : '-'}</td>
                  <td>
                     {editandoRow === c.rowIndex ? (
                        <input
                           type="text"
                           value={valorEditado}
                           onChange={e => onChangeValor(formatarMoeda(e.target.value))}
                        />
                     ) : (
                        numeroParaMoeda(c.valor)
                     )}
                  </td>
                  <td>{c.dataVencimento}</td>
                  <td>
                     {editandoRow === c.rowIndex ? (
                        <input
                           type="date"
                           value={dataEditada}
                           onChange={e => onChangeData(e.target.value)}
                        />
                     ) : (
                        c.dataPagamento
                     )}
                  </td>
                  <td>
                     <input type="checkbox" checked={c.pago} readOnly />
                  </td>
                  <td>
                     {editandoRow !== c.rowIndex && (
                        <>
                           <button
                              onClick={() => onEditar(c)}
                              disabled={persistindo}
                           >Editar</button>

                           <button
                              onClick={() => {
                                 let scope: 'single' | 'future' | 'all' = 'single';

                                 if (c.tipo === 'fixo') {
                                    const resposta = prompt(
                                       'Excluir apenas esta parcela (single), todas futuras (future) ou todas (all)?',
                                       'single'
                                    );
                                    if (!resposta || !['single', 'future', 'all'].includes(resposta)) return;
                                    scope = resposta as 'single' | 'future' | 'all';
                                 }
                                 onExcluir(c.rowIndex, scope);
                              }}
                              disabled={persistindo}
                           >
                              Excluir
                           </button>
                        </>
                     )}

                     {editandoRow === c.rowIndex && (
                        <>
                           <button
                              onClick={() => {
                                 let scope: 'single' | 'future' = 'single';

                                 if (c.tipo === 'fixo') {
                                    const resposta = prompt(
                                       'Salvar apenas esta parcela (single) ou todas futuras (future)?',
                                       'single'
                                    );
                                    if (!resposta || !['single', 'future'].includes(resposta)) return;
                                    scope = resposta as 'single' | 'future';
                                 }

                                 onSalvar(scope);
                              }}
                              disabled={persistindo}
                           >
                              {persistindo && editandoRow === c.rowIndex ? 'Salvando...' : 'Salvar'}
                           </button>

                           <button
                              onClick={onCancelarEdicao}
                              disabled={persistindo}
                           >Cancelar edição</button>
                        </>
                     )}
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   );
}
