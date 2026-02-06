import { AcoesRapidas } from "@/components/home/AcoesRapidas"
import { Alertas } from "@/components/home/Alertas"
import { ResumoMes } from "@/components/home/ResumoMes"
import { Layout } from '@/components/layout/Layout'

interface Props {
   onLogout: () => void
}

export function Home({ onLogout }: Props) {
   return (
      <Layout
         title="Home"
         onLogout={onLogout}
         showPeriodoFilters
         containerClassName="max-w-4xl"
      >
         <section className="mb-4">
            <Alertas />
         </section>

         <section className="mb-6">
            <ResumoMes />
         </section>

         <section className="sticky bottom-0 bg-white">
            <AcoesRapidas />
         </section>
      </Layout>
   )
}