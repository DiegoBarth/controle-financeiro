import { useEffect, useState } from 'react'
import { criarCompromisso, criarCartao } from '@/api/compromissos'
import { moedaParaNumero, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'
import { SelectCustomizado } from '../ui/SelectCustomizado'

interface Props {
   aberto: boolean
   onClose: () => void
   onSalvar: () => void
}

type TipoCompromisso = 'Fixo' | 'Variável' | 'Cartão' | ''

const categorias = [
   'Alimentação', 'Banco', 'Beleza', 'Casa', 'Educação',
   'Empréstimos', 'Investimento', 'Lazer', 'Pets', 'Presentes',
   'Roupas', 'Saúde', 'Serviços', 'Streaming', 'Telefonia',
   'Transporte', 'Viagem'
]

const tipos = ['Fixo', 'Variável', 'Cartão']
const cartoes = ['Bradesco', 'Itaú', 'Mercado Pago']

export function ModalNovoCompromisso({ aberto, onClose, onSalvar }: Props) {
   const [descricao, setDescricao] = useState('')
   const [categoria, setCategoria] = useState('')
   const [tipo, setTipo] = useState<TipoCompromisso>('')
   const [valor, setValor] = useState('')
   const [dataVencimento, setDataVencimento] = useState('')
   const [meses, setMeses] = useState(1)

   // Cartão
   const [cartao, setCartao] = useState('')
   const [valorTotal, setValorTotal] = useState('')
   const [totalParcelas, setTotalParcelas] = useState<number | ''>('')
   const [dataVencimentoCartao, setDataVencimentoCartao] = useState('')

   const [loading, setLoading] = useState(false)

   // Regras do fixo (auto-calcular meses)
   useEffect(() => {
      if (tipo === 'Fixo' && dataVencimento) {
         const data = new Date(dataVencimento)
         setMeses(12 - data.getMonth())
      }
   }, [tipo, dataVencimento])

   // Reset ao fechar
   useEffect(() => {
      if (!aberto) {
         setDescricao('')
         setCategoria('')
         setTipo('')
         setValor('')
         setDataVencimento('')
         setMeses(1)
         setCartao('')
         setValorTotal('')
         setTotalParcelas('')
         setDataVencimentoCartao('')
         setLoading(false)
      }
   }, [aberto])

   async function salvar() {
      if (!descricao || !categoria || !tipo) {
         alert('Preencha os campos obrigatórios')
         return
      }

      setLoading(true)

      try {
         if (tipo === 'Cartão') {
            if (!cartao || !valorTotal || !totalParcelas || !dataVencimentoCartao) {
               alert('Preencha os campos do cartão')
               return
            }

            await criarCartao({
               tipo: 'Cartão',
               descricao,
               categoria,
               cartao,
               valorTotal: moedaParaNumero(valorTotal),
               parcelas: Number(totalParcelas),
               dataVencimento: dataVencimentoCartao
            })
         } else {
            if (!valor || !dataVencimento) {
               alert('Preencha valor e data de vencimento')
               return
            }

            await criarCompromisso({
               tipo,
               descricao,
               categoria,
               valor: moedaParaNumero(valor),
               dataVencimento,
               meses: tipo === 'Fixo' ? meses : 1
            })
         }

         onSalvar()
         onClose()
      } finally {
         setLoading(false)
      }
   }

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo="Novo compromisso"
         tipo="inclusao"
         onSalvar={salvar}
         loading={loading}
      >
         <div className="space-y-3">
            {/* Descrição */}
            <div>
               <label className="block text-xs text-muted-foreground">Descrição *</label>
               <input
                  className="mt-1 w-full rounded-md border p-2"
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
               />
            </div>

            {/* Categoria */}
            <div>
               <label className="block text-xs text-muted-foreground mb-1">Categoria *</label>
               <SelectCustomizado
                  value={categoria}
                  onChange={setCategoria}
                  options={categorias}
               />
            </div>

            {/* Tipo */}
            <div>
               <label className="block text-xs text-muted-foreground mb-1">Tipo *</label>
               <SelectCustomizado
                  value={tipo}
                  onChange={value => setTipo(value as TipoCompromisso)}
                  options={tipos}
               />

            </div>

            {/* Fixo / Variável */}
            {(tipo === 'Fixo' || tipo === 'Variável') && (
               <>
                  <div>
                     <label className="block text-xs text-muted-foreground">Valor *</label>
                     <input
                        className="mt-1 w-full rounded-md border p-2"
                        value={valor}
                        onChange={e => setValor(formatarMoeda(e.target.value))}
                     />
                  </div>

                  <div>
                     <label className="block text-xs text-muted-foreground">Data de vencimento *</label>
                     <input
                        type="date"
                        className="mt-1 w-full rounded-md border p-2"
                        value={dataVencimento}
                        onChange={e => setDataVencimento(e.target.value)}
                     />
                  </div>

                  {tipo === 'Fixo' && (
                     <div>
                        <label className="block text-xs text-muted-foreground">
                           Repetir por (meses)
                        </label>
                        <input
                           type="number"
                           min={1}
                           max={12}
                           className="mt-1 w-full rounded-md border p-2"
                           value={meses}
                           onChange={e => setMeses(Number(e.target.value))}
                        />
                     </div>
                  )}
               </>
            )}

            {/* Cartão */}
            {tipo === 'Cartão' && (
               <>
                  <div>
                     <label className="block text-xs text-muted-foreground mb-1">
                        Cartão *
                     </label>
                     <SelectCustomizado
                        value={cartao}
                        onChange={setCartao}
                        options={cartoes}
                     />
                  </div>

                  <div>
                     <label className="block text-xs text-muted-foreground">Valor total *</label>
                     <input
                        className="mt-1 w-full rounded-md border p-2"
                        value={valorTotal}
                        onChange={e => setValorTotal(formatarMoeda(e.target.value))}
                     />
                  </div>

                  <div>
                     <label className="block text-xs text-muted-foreground">
                        Total de parcelas *
                     </label>
                     <input
                        type="number"
                        min={1}
                        max={60}
                        className="mt-1 w-full rounded-md border p-2"
                        value={totalParcelas}
                        onChange={e => setTotalParcelas(Number(e.target.value))}
                     />
                  </div>

                  <div>
                     <label className="block text-xs text-muted-foreground">
                        Data de vencimento *
                     </label>
                     <input
                        type="date"
                        className="mt-1 w-full rounded-md border p-2"
                        value={dataVencimentoCartao}
                        onChange={e => setDataVencimentoCartao(e.target.value)}
                     />
                  </div>
               </>
            )}
         </div>
      </ModalBase>
   )
}
