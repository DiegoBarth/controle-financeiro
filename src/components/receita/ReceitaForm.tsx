import { useState } from 'react';
import { criarReceita } from '@/api/endpoints/receita';
import { moedaParaNumero, formatarMoeda } from '@/utils/formatadores';
import { useToast } from '@/contexts/toast';

interface Props {
   onSalvar: () => void;
}

export function ReceitaForm({ onSalvar }: Props) {
   const [dataPrevista, setDataPrevista] = useState('');
   const [dataRecebimento, setDataRecebimento] = useState('');
   const [descricao, setDescricao] = useState('');
   const [valor, setValor] = useState('');
   const [persistindo, setPersistindo] = useState(false);
   const toast = useToast();

   async function handleSalvar(e: React.FormEvent) {
      e.preventDefault();

      const valorNumero = moedaParaNumero(valor);
      if (valorNumero <= 0) {
         toast.warning('Valor inválido');
         return;
      }

      setPersistindo(true);

      try {
         await criarReceita({
            dataPrevista,
            dataRecebimento,
            descricao,
            valor: valorNumero
         });

         onSalvar();
         toast.success('Receita salva 💸');
         setDataPrevista('');
         setDataRecebimento('');
         setDescricao('');
         setValor('');
      }
      finally {
         setPersistindo(false);
      }
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

         <button type="submit" disabled={persistindo}>{persistindo ? 'Salvando...' : 'Salvar'}</button>
      </form>
   );
}