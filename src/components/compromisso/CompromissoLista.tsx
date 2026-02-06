import { ListLayout } from '@/components/layout/ListLayout'
import { ListItemLayout } from '@/components/layout/ListItemLayout'
import type { Compromisso } from '@/types/Compromisso'
import { formatarDataBR, numeroParaMoeda } from '@/utils/formatadores'
import { ListItemHeaderMobile } from '@/components/layout/ListItemHeaderMobile'
import { ListItemFooterMobile } from '@/components/layout/ListItemFooterMobile'
import { ListItemRowDesktop } from '@/components/layout/ListItemRowDesktop'
import { ListColDescription } from '@/components/layout/ListColDescription'
import { ListColMuted } from '@/components/layout/ListColMuted'
import { ListColValue } from '@/components/layout/ListColValue'
import { ListColStatus } from '@/components/layout/ListColStatus'

interface Props {
   compromissos: Compromisso[]
   onSelect: (compromisso: Compromisso) => void
}

function estaVencido(dataVencimento: string) {
   dataVencimento = formatarDataBR(dataVencimento);
   const [d, m, a] = dataVencimento.split('/').map(Number)

   const vencimento = new Date(a, m - 1, d)
   vencimento.setHours(0, 0, 0, 0)

   const hoje = new Date()
   hoje.setHours(0, 0, 0, 0)

   return vencimento < hoje
}

export function CompromissoLista({ compromissos, onSelect }: Props) {
   return (
      <ListLayout
         itens={compromissos}
         vazioTexto="Nenhum compromisso cadastrado"
         keyExtractor={(compromisso) => compromisso.rowIndex}

         renderMobileItem={(compromisso) => {
            const isPago = !!compromisso.dataPagamento
            const isCartao = compromisso.tipo === 'Cartão'
            const isVencido = !isPago && estaVencido(compromisso.dataVencimento)

            const variant =
               isPago ? 'success' :
                  isVencido ? 'danger' :
                     'warning'

            return (
               <ListItemLayout
                  onClick={() => onSelect(compromisso)}
                  variant={variant}
                  className="p-3"
               >
                  <ListItemHeaderMobile
                     title={compromisso.descricao}
                     right={numeroParaMoeda(compromisso.valor)}
                  />

                  {isCartao && (
                     <div className="mt-1 text-xs text-muted-foreground">
                        {compromisso.cartao}
                        {(compromisso.totalParcelas ?? 1) > 1 && (
                           <> • Parcela {compromisso.parcelas}/{compromisso.totalParcelas}</>
                        )}
                     </div>
                  )}

                  <ListItemFooterMobile
                     left={
                        isPago ? `Pago em ${compromisso.dataPagamento}` : `Vence em ${compromisso.dataVencimento}`
                     }
                     right={
                        <span
                           className={`
                              ${isPago && 'text-green-600'}
                              ${isVencido && 'text-red-600'}
                              ${!isPago && !isVencido && 'text-amber-500'}
                           `}
                        >
                           {isPago ? 'Pago' : isVencido ? 'Vencido' : 'Em aberto'}
                        </span>
                     }
                  />
               </ListItemLayout>
            )
         }}

         renderDesktopItem={(compromisso) => {
            const isPago = !!compromisso.dataPagamento
            const isVencido = !isPago && estaVencido(compromisso.dataVencimento)

            const variant = isPago ? 'success' : isVencido ? 'danger' : 'default'

            return (
               <ListItemRowDesktop
                  onClick={() => onSelect(compromisso)}
                  variant={variant}
               >
                  <ListColDescription>
                     {compromisso.descricao}
                  </ListColDescription>

                  <ListColMuted span={2}>
                     {compromisso.tipo}
                  </ListColMuted>

                  <ListColMuted span={3}>
                     {isPago
                        ? `Pago em ${compromisso.dataPagamento}`
                        : `Vence em ${compromisso.dataVencimento}`}
                  </ListColMuted>

                  <ListColValue>
                     {numeroParaMoeda(compromisso.valor)}
                  </ListColValue>

                  <ListColStatus>
                     <span
                        className={`
                           ${isPago && 'text-green-600'}
                           ${isVencido && 'text-red-600'}
                           ${!isPago && !isVencido && 'text-orange-500'}
                        `}
                     >
                        {isPago ? 'Pago' : isVencido ? 'Vencido' : 'Aberto'}
                     </span>
                  </ListColStatus>
               </ListItemRowDesktop>
            )
         }}
      />
   )
}