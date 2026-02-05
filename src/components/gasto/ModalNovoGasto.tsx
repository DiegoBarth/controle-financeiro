import { useEffect, useState } from 'react'
import { moedaParaNumero, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '@/components/ui/ModalBase'
import { SelectCustomizado } from '@/components/ui/SelectCustomizado'
import { usePeriodo } from '@/contexts/PeriodoContext'
import { useGasto } from '@/hooks/useGasto'

interface Props {
   aberto: boolean
   onClose: () => void
}

export function ModalNovoGasto({ aberto, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const { criar, isSalvando } = useGasto(mes, String(ano))

   const [descricao, setDescricao] = useState('')
   const [dataPagamento, setDataPagamento] = useState('')
   const [valor, setValor] = useState('')
   const [categoria, setCategoria] = useState('')

   const categorias = [
      'Alimentação', 'Banco', 'Beleza', 'Casa', 'Educação',
      'Empréstimos', 'Investimento', 'Lazer', 'Pets', 'Presentes',
      'Roupas', 'Saúde', 'Serviços', 'Streaming', 'Telefonia',
      'Transporte', 'Viagem'
   ]

   useEffect(() => {
      if (!aberto) {
         setDescricao('')
         setDataPagamento('')
         setCategoria('')
         setValor('')
      }
   }, [aberto])

   const handleSalvar = async () => {
      await criar({
         descricao,
         categoria,
         valor: moedaParaNumero(valor),
         dataPagamento
      })
      setDescricao('')
      setDataPagamento('')
      setCategoria('')
      setValor('')

      onClose()
   }

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo="Novo gasto"
         tipo="inclusao"
         loading={isSalvando}
         onSalvar={() => handleSalvar()}
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
                  value={dataPagamento}
                  onChange={e => setDataPagamento(e.target.value)}
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
