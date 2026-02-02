import { useState } from 'react';
import { criarReceita } from '../../api/receitas';
import { moedaParaNumero, formatarMoeda } from '../../utils/formatadores';

interface Props {
   onSalvar: () => void;
}

export function ReceitaForm({ onSalvar }: Props) {
   const [dataPrevista, setDataPrevista] = useState('');
   const [dataRecebimento, setDataRecebimento] = useState('');
   const [descricao, setDescricao] = useState('');
   const [valor, setValor] = useState('');

   async function handleSalvar(e: React.FormEvent) {
      e.preventDefault();

      const valorNumero = moedaParaNumero(valor);
      if (valorNumero <= 0) {
         alert('Valor inválido');
         return;
      }

      await criarReceita({
         dataPrevista,
         dataRecebimento,
         descricao,
         valor: valorNumero
      }, "1", "2026");

      onSalvar();
      alert('Receita salva 💸');
      setDataPrevista('');
      setDataRecebimento('');
      setDescricao('');
      setValor('');
   }

   return (
      <form onSubmit={handleSalvar}>
         <input
            placeholder="Descrição"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            required
         />

         <input
            type="date"
            value={dataPrevista}
            onChange={e => setDataPrevista(e.target.value)}
            required
         />

         <input
            type="date"
            value={dataRecebimento}
            onChange={e => setDataRecebimento(e.target.value)}
         />

         <input
            placeholder="Valor"
            value={valor}
            onChange={e => setValor(formatarMoeda(e.target.value))}
            required
         />

         <button type="submit">Salvar receita</button>
      </form>
   );
}