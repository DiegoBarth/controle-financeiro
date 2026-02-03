import { useState } from 'react'
import { criarGasto } from '@/api/gastos'
import { moedaParaNumero, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'
import { SelectCustomizado } from '../ui/SelectCustomizado'

interface Props {
   aberto: boolean
   onClose: () => void
   onSalvar: () => void
}

export function ModalNovoGasto({ aberto, onClose, onSalvar }: Props) {
   const [descricao, setDescricao] = useState('')
   const [data, setData] = useState('')
   const [valor, setValor] = useState('')
   const [categoria, setCategoria] = useState('');
   const [loading, setLoading] = useState(false)

   const categorias = [
      "Alimentação", "Banco", "Beleza", "Casa", "Educação",
      "Empréstimos", "Investimento", "Lazer", "Pets", "Presentes",
      "Roupas", "Saúde", "Serviços", "Streaming", "Telefonia",
      "Transporte", "Viagem"
   ];

   async function salvar() {
      const valorNumero = moedaParaNumero(valor)

      if (!descricao || !data || !categoria || valorNumero <= 0) {
         alert('Preencha os campos obrigatórios')
         return
      }

      setLoading(true)
      try {
         await criarGasto({
            data,
            descricao,
            categoria,
            valor: valorNumero
         })

         onSalvar()
         onClose()

         setDescricao('')
         setData('')
         setCategoria('')
         setValor('')
      } finally {
         setLoading(false)
      }
   }

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo="Novo gasto"
         tipo="inclusao"
         onSalvar={salvar}
         loading={loading}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">Descrição *</label>
               <input
                  className="mt-1 w-full rounded-md border p-2"
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">Data de pagamento *</label>
               <input
                  type="date"
                  className="mt-1 w-full rounded-md border p-2"
                  value={data}
                  onChange={e => setData(e.target.value)}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground mb-1">Categoria *</label>
               <SelectCustomizado
                  value={categoria}
                  onChange={setCategoria}
                  options={categorias}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">Valor *</label>
               <input
                  className="mt-1 w-full rounded-md border p-2"
                  value={valor}
                  onChange={e => setValor(formatarMoeda(e.target.value))}
               />
            </div>
         </div>
      </ModalBase>
   )
}