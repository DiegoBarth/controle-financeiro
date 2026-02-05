import { useEffect, useState } from 'react'
import { usePeriodo } from '@/contexts/PeriodoContext'
import type { Gasto } from '@/types/Gasto'
import { numeroParaMoeda, moedaParaNumero, formatarMoeda } from '@/utils/formatadores'
import { ModalBase } from '../ui/ModalBase'
import { useGastos } from '@/hooks/useGastos'

interface Props {
   aberto: boolean
   gasto: Gasto | null
   onClose: () => void
}

export function ModalEditarGasto({ aberto, gasto, onClose }: Props) {
   const { mes, ano } = usePeriodo()
   const { atualizar, excluir, isSalvando, isExcluindo } = useGastos(mes, String(ano))

   const [valor, setValor] = useState('')

   useEffect(() => {
      if (gasto) {
         setValor(numeroParaMoeda(gasto.valor))
      }
   }, [gasto])

   const handleAtualizar = async () => {
      await atualizar({
         rowIndex: gasto!.rowIndex,
         valor: moedaParaNumero(valor)
      })
      setValor('')

      onClose()
   }

   const handleExcluir = async () => {
      await excluir(gasto!.rowIndex)
      setValor('')

      onClose()
   }

   if (!gasto) return null

   return (
      <ModalBase
         aberto={aberto}
         onClose={onClose}
         titulo={gasto.descricao}
         tipo="edicao"
         loading={isSalvando || isExcluindo}
         loadingTexto={(isSalvando ? 'Salvando...' : 'Excluindo...')}
         onSalvar={() => handleAtualizar()}
         onExcluir={() => handleExcluir()}
      >
         <div className="space-y-3">
            <div>
               <label className="block text-xs text-muted-foreground">Valor</label>
               <input
                  className="w-full border rounded-md p-2"
                  value={valor}
                  onChange={e => setValor(formatarMoeda(e.target.value))}
               />
            </div>
         </div>
      </ModalBase>
   )
}
