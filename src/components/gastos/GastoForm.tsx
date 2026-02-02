import { useState } from 'react';
import { criarGasto } from '../../api/gastos';
import { moedaParaNumero, formatarMoeda } from '../../utils/formatadores';

interface Props {
   onSalvar: () => void;
}

export function GastoForm({ onSalvar }: Props) {
   const [data, setData] = useState('');
   const [descricao, setDescricao] = useState('');
   const [categoria, setCategoria] = useState('');
   const [valor, setValor] = useState('');

   async function salvar(e: React.FormEvent) {
      e.preventDefault();

      const valorNumero = moedaParaNumero(valor);
      if (valorNumero <= 0) {
         alert('Valor inválido');
         return;
      }

      await criarGasto({
         data,
         descricao,
         categoria,
         valor: valorNumero
      });

      onSalvar();

      alert('Gasto salvo 💸');

      setData('');
      setDescricao('');
      setCategoria('');
      setValor('');
   }

   return (
      <form onSubmit={salvar}>
         <input type="date" value={data} onChange={e => setData(e.target.value)} />
         <input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição" />

         <select value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="">Selecione</option>
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

         <input
            value={valor}
            onChange={(e) => setValor(formatarMoeda(e.target.value))}
            placeholder="R$ 0,00"
         />

         <button>Salvar</button>
      </form>
   );
}