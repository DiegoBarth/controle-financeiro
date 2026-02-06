import { ListLayout } from '@/components/layout/ListLayout'
import { ListItemLayout } from '@/components/layout/ListItemLayout'
import type { Receita } from '@/types/Receita'
import { numeroParaMoeda } from '@/utils/formatadores'
import { ListItemHeaderMobile } from '@/components/layout/ListItemHeaderMobile'
import { ListItemFooterMobile } from '@/components/layout/ListItemFooterMobile'
import { ListColDescription } from '@/components/layout/ListColDescription'
import { ListColMuted } from '@/components/layout/ListColMuted'
import { ListColValue } from '@/components/layout/ListColValue'
import { ListItemRowDesktop } from '@/components/layout/ListItemRowDesktop'

interface Props {
   receitas: Receita[]
   onSelect: (receita: Receita) => void
}

export function ReceitaLista({ receitas, onSelect }: Props) {
   return (
      <ListLayout
         itens={receitas}
         vazioTexto="Nenhuma receita cadastrada"
         keyExtractor={(receita) => receita.rowIndex}

         renderMobileItem={(receita) => {
            const recebida = !!receita.dataRecebimento

            const textoData = recebida
               ? `Recebido em ${receita.dataRecebimento}`
               : `Previsto para ${receita.dataPrevista}`

            return (
               <ListItemLayout
                  onClick={() => onSelect(receita)}
                  variant={recebida ? 'success' : 'default'}
                  className="p-3"
               >
                  <ListItemHeaderMobile
                     title={receita.descricao}
                     right={numeroParaMoeda(receita.valor)}
                  />

                  <ListItemFooterMobile
                     left={textoData}
                     right={
                        <span className={recebida ? 'text-green-600' : 'text-blue-500'}>
                           {recebida ? 'Recebido' : 'Em aberto'}
                        </span>
                     }
                  />
               </ListItemLayout>
            )
         }}

         renderDesktopItem={(receita) => {
            const recebida = !!receita.dataRecebimento

            const textoData = recebida
               ? `Recebido em ${receita.dataRecebimento}`
               : `Previsto para ${receita.dataPrevista}`

            return (
               <ListItemRowDesktop
                  onClick={() => onSelect(receita)}
                  variant={recebida ? 'success' : 'default'}
               >
                  <ListColDescription>
                     {receita.descricao}
                  </ListColDescription>

                  <ListColMuted span={4}>
                     {textoData}
                  </ListColMuted>

                  <ListColValue>
                     {numeroParaMoeda(receita.valor)}
                  </ListColValue>

                  <div className="col-span-2 text-right font-medium">
                     <span className={recebida ? 'text-green-600' : 'text-blue-500'}>
                        {recebida ? 'Recebido' : 'Em aberto'}
                     </span>
                  </div>
               </ListItemRowDesktop>
            )
         }}
      />
   )
}