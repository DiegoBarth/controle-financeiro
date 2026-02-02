import { useState, useEffect } from 'react';
import { moedaParaNumero, formatarMoeda } from '../../utils/formatadores';
import { criarCartao, criarCompromisso } from '../../api/compromissos';

interface Props {
   onSalvar: () => void;
}

export function CompromissoForm({ onSalvar }: Props) {
   const [descricao, setDescricao] = useState('');
   const [categoria, setCategoria] = useState('');
   const [tipo, setTipo] = useState<'fixo' | 'variavel' | 'cartao' | ''>('');
   const [valor, setValor] = useState('');
   const [dataVencimento, setDataVencimento] = useState('');
   const [meses, setMeses] = useState(1);
   const [cartao, setCartao] = useState('');
   const [valorTotal, setValorTotal] = useState('');
   const [totalParcelas, setTotalParcelas] = useState<number | ''>('');
   const [dataVencimentoCartao, setDataVencimentoCartao] = useState('');

   useEffect(() => {
      if (tipo === 'fixo' && dataVencimento) {
         const data = new Date(dataVencimento);
         const mesesRestantes = 12 - data.getMonth();
         setMeses(mesesRestantes);
      }
   }, [tipo, dataVencimento]);

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!tipo) return;

      if (tipo === 'cartao') {
         await criarCartao({
            tipo: 'cartao',
            descricao,
            categoria,
            cartao,
            valorTotal: moedaParaNumero(valorTotal),
            parcelas: Number(totalParcelas),
            dataVencimento: dataVencimentoCartao
         });
      } else {
         await criarCompromisso({
            tipo,
            descricao,
            categoria,
            valor: moedaParaNumero(valor),
            dataVencimento,
            meses: tipo === 'fixo' ? meses : 1
         });
      }

      onSalvar();

      setDescricao('');
      setCategoria('');
      setTipo('');
      setValor('');
      setDataVencimento('');
      setMeses(1);
      setCartao('');
      setValorTotal('');
      setTotalParcelas('');
      setDataVencimentoCartao('');
   }

   return (
      <form onSubmit={handleSubmit}>
         <input
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            placeholder="Descrição"
            required
         />

         <br /><br />

         <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            required
         >
            <option value="">Categoria</option>
            <option>Alimentação</option>
            <option>Banco</option>
            <option>Beleza</option>
            <option>Casa</option>
            <option>Educação</option>
            <option>Empréstimos</option>
            <option>Investimento</option>
            <option>Lazer</option>
            <option>Pets</option>
            <option>Presentes</option>
            <option>Roupas</option>
            <option>Saúde</option>
            <option>Serviços</option>
            <option>Streaming</option>
            <option>Telefonia</option>
            <option>Transporte</option>
            <option>Viagem</option>
         </select>

         <br /><br />

         <select
            value={tipo}
            onChange={e => setTipo(e.target.value as any)}
            required
         >
            <option value="">Tipo</option>
            <option value="fixo">Fixo</option>
            <option value="variavel">Variável</option>
            <option value="cartao">Cartão</option>
         </select>

         <br /><br />

         {(tipo === 'fixo' || tipo === 'variavel') && (
            <>
               <input
                  value={valor}
                  onChange={e => setValor(formatarMoeda(e.target.value))}
                  placeholder="R$ 0,00"
               />

               <br /><br />

               <input
                  type="date"
                  value={dataVencimento}
                  onChange={e => setDataVencimento(e.target.value)}
               />

               <br /><br />

               {tipo === 'fixo' && (
                  <>
                     <label>Repetir por (meses):</label>
                     <input
                        type="number"
                        min={1}
                        max={12}
                        value={meses}
                        onChange={e => setMeses(Number(e.target.value))}
                     />
                     <br /><br />
                  </>
               )}
            </>
         )}

         {tipo === 'cartao' && (
            <>
               <select value={cartao} onChange={e => setCartao(e.target.value)}>
                  <option value="">Selecione o cartão</option>
                  <option>Bradesco</option>
                  <option>Itaú</option>
                  <option>Mercado Pago</option>
               </select>

               <br /><br />

               <input
                  value={valorTotal}
                  onChange={e => setValorTotal(formatarMoeda(e.target.value))}
                  placeholder="Valor total"
               />

               <br /><br />

               <input
                  type="number"
                  min={1}
                  max={60}
                  value={totalParcelas}
                  onChange={e => setTotalParcelas(Number(e.target.value))}
                  placeholder="Total de parcelas"
               />

               <br /><br />

               <input
                  type="date"
                  value={dataVencimentoCartao}
                  onChange={e => setDataVencimentoCartao(e.target.value)}
               />

               <br /><br />
            </>
         )}

         <button>Salvar</button>
      </form>
   );
}
