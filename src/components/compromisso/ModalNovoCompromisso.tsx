import { useEffect, useState } from 'react'
import { moedaParaNumero, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '@/components/ui/ModalBase'
import { SelectCustomizado } from '@/components/ui/SelectCustomizado'

import { usePeriodo } from '@/contexts/PeriodoContext'
import { useCompromisso } from '@/hooks/useCompromisso'
import { useValidation } from '@/hooks/useValidation'
import { CompromissoCreateSchema, CompromissoCartaoSchema } from '@/schemas/compromisso.schema'

interface Props {
   aberto: boolean
   onClose: () => void
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

export function ModalNovoCompromisso({ aberto, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const { criar, criarCartao, isSalvando } = useCompromisso(mes, String(ano))
   const { validar } = useValidation()

   const [descricao, setDescricao] = useState('')
   const [categoria, setCategoria] = useState('')
   const [tipo, setTipo] = useState<TipoCompromisso>('')

   const [valor, setValor] = useState('')
   const [dataVencimento, setDataVencimento] = useState('')
   const [meses, setMeses] = useState(1)

   const [cartao, setCartao] = useState('')
   const [valorTotal, setValorTotal] = useState('')
   const [totalParcelas, setTotalParcelas] = useState<number | ''>('')
   const [dataVencimentoCartao, setDataVencimentoCartao] = useState('')

   useEffect(() => {
      if (tipo === 'Fixo' && dataVencimento) {
         const data = new Date(dataVencimento)
         setMeses(12 - data.getMonth())
      }
   }, [tipo, dataVencimento])

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
      }
   }, [aberto])

   async function handleSalvar() {
      if (tipo === 'Cartão') {
         const dados = validar(CompromissoCartaoSchema, {
            descricao,
            categoria,
            tipo,
            cartao,
            valor: moedaParaNumero(valorTotal),
            totalParcelas: Number(totalParcelas),
            dataVencimento: dataVencimentoCartao
         })

         if (!dados) return

         await criarCartao(dados as any)
      } else {
         const dados = validar(CompromissoCreateSchema, {
            descricao,
            categoria,
            tipo,
            valor: moedaParaNumero(valor),
            dataVencimento,
            meses: tipo === 'Fixo' ? meses : 1
         })

         if (!dados) return

         await criar(dados as any)
      }

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

      onClose()
   }

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo="Novo compromisso"
         tipo="inclusao"
         loading={isSalvando}
         loadingTexto="Salvando..."
         onSalvar={() => handleSalvar()}
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
