import { ListLayout } from '@/components/layout/ListLayout'
import { ListItemLayout } from '@/components/layout/ListItemLayout'
import type { Gasto } from '@/types/Gasto'
import { numeroParaMoeda } from '@/utils/formatadores'
import { ListItemHeaderMobile } from '@/components/layout/ListItemHeaderMobile'
import { ListItemFooterMobile } from '@/components/layout/ListItemFooterMobile'
import { ListItemRowDesktop } from '@/components/layout/ListItemRowDesktop'
import { ListColDescription } from '@/components/layout/ListColDescription'
import { ListColMuted } from '@/components/layout/ListColMuted'
import { ListColStatus } from '@/components/layout/ListColStatus'
import { ListColValue } from '@/components/layout/ListColValue'

interface Props {
   gastos: Gasto[]
   onSelect: (gasto: Gasto) => void
}

export function GastoLista({ gastos, onSelect }: Props) {
   return (
      <ListLayout
         itens={gastos}
         vazioTexto="Nenhum gasto cadastrado"
         keyExtractor={(gasto) => gasto.rowIndex}

         renderMobileItem={(gasto) => (
            <ListItemLayout
               onClick={() => onSelect(gasto)}
               className="p-3"
            >
               <ListItemHeaderMobile
                  title={gasto.descricao}
                  right={
                     <span className="text-red-600">
                        {numeroParaMoeda(gasto.valor)}
                     </span>
                  }
               />

               <ListItemFooterMobile
                  left={`Pago em ${gasto.dataPagamento} • ${gasto.categoria}`}
                  right={
                     <span className="text-green-600">
                        Pago
                     </span>
                  }
               />
            </ListItemLayout>
         )}

         renderDesktopItem={(gasto) => (
            <ListItemRowDesktop
               onClick={() => onSelect(gasto)}
            >
               <ListColDescription>
                  {gasto.descricao}
               </ListColDescription>

               <ListColMuted span={2}>
                  {gasto.categoria ?? '-'}
               </ListColMuted>

               <ListColMuted span={3}>
                  Pago em {gasto.dataPagamento}
               </ListColMuted>

               <ListColValue>
                  <span className="text-red-600">
                     {numeroParaMoeda(gasto.valor)}
                  </span>
               </ListColValue>

               <ListColStatus>
                  <span className="text-green-600">
                     Pago
                  </span>
               </ListColStatus>
            </ListItemRowDesktop>
         )}
      />
   )
}