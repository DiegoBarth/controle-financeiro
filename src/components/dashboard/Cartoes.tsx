import type { Cartao } from '../../types/Dashboard';
import { numeroParaMoeda } from '../../utils/formatadores';

interface CartoesProps {
   cartoes: Cartao[];
   loading: boolean;
}

export function Cartoes({ cartoes, loading }: CartoesProps) {
   if (loading) return <p>Carregando cartões...</p>;

   return (
      <div>
         <h2>Cartões</h2>
         <div style={{ display: 'flex', gap: 16 }}>
            {cartoes.map(c => (
               <div key={c.cartao} style={{
                  width: 215,
                  borderRadius: 12,
                  padding: 16,
                  color: '#fff',
                  background: '#222',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
               }}>
                  <img src={`${import.meta.env.BASE_URL}cartoes/${c.imagem}.jpg`} alt={c.cartao} style={{ width: '100%', borderRadius: 8 }} />
                  <h3>{c.cartao}</h3>
                  <p>Fatura: {numeroParaMoeda(c.totalFatura)}</p>
                  <p>Limite disponível: {numeroParaMoeda(c.limiteDisponivel)}</p>
                  <p>Limite total: {numeroParaMoeda(c.limiteTotal)}</p>
               </div>
            ))}
         </div>
      </div>
   );
}
