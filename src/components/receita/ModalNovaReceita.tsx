import { useState } from 'react'
import { criarReceita } from '@/api/receitas'
import { moedaParaNumero, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'
import { useEffect } from 'react'

interface Props {
   aberto: boolean
   onClose: () => void
   onSalvar: () => void
}

export function ModalNovaReceita({ aberto, onClose, onSalvar }: Props) {
   const [descricao, setDescricao] = useState('')
   const [dataPrevista, setDataPrevista] = useState('')
   const [dataRecebimento, setDataRecebimento] = useState('')
   const [valor, setValor] = useState('')
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      if (!aberto) {
         setDescricao('')
         setDataPrevista('')
         setDataRecebimento('')
         setValor('')
         setLoading(false)
      }
   }, [aberto])

   async function salvar() {
      const valorNumero = moedaParaNumero(valor)

      if (!descricao || !dataPrevista || valorNumero <= 0) {
         alert('Preencha os campos obrigatórios')
         return
      }

      setLoading(true)
      try {
         await criarReceita({
            descricao,
            dataPrevista,
            dataRecebimento,
            valor: valorNumero
         })

         onSalvar()
         onClose()

         setDescricao('')
         setDataPrevista('')
         setDataRecebimento('')
         setValor('')
      } finally {
         setLoading(false)
      }
   }

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo="Nova receita"
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
               <label className="block text-xs text-muted-foreground">Data prevista *</label>
               <input
                  type="date"
                  className="mt-1 w-full rounded-md border p-2"
                  value={dataPrevista}
                  onChange={e => setDataPrevista(e.target.value)}
               />
            </div>

            <div>
               <label className="block text-xs text-muted-foreground">Data de recebimento (opcional)</label>
               <input
                  type="date"
                  className="mt-1 w-full rounded-md border p-2"
                  value={dataRecebimento}
                  onChange={e => setDataRecebimento(e.target.value)}
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