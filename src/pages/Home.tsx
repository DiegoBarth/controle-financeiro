import { AcoesRapidas } from "@/components/home/AcoesRapidas"
import { Alertas } from "@/components/home/Alertas"
import { FiltrosPeriodo } from "@/components/home/FiltrosPeriodo"
import { ResumoMes } from "@/components/home/ResumoMes"
import { usePeriodo } from '@/contexts/PeriodoContext';

interface Props {
   onLogout: () => void
}

export function Home({ onLogout }: Props) {
   const { mes, setMes, ano, setAno, isLoading } = usePeriodo();

   return (
      <div className="min-h-screen bg-background">
         <div className="mx-auto max-w-lg px-4 py-6 md:max-w-2xl lg:max-w-4xl">

            <header className="mb-4">
               <h1 className="mb-4 text-2xl font-bold text-foreground">Home</h1>

               <FiltrosPeriodo
                  mes={mes}
                  ano={ano}
                  onMesChange={setMes}
                  onAnoChange={setAno}
                  isLoading={isLoading}
               />

               <button
                  onClick={onLogout}
                  className=" fixed top-7 right-4 text-sm text-gray-600 hover:text-red-800 border px-2 py-1 rounded-md transition-colors">
                  Logout
               </button>
            </header>

            <section className="mb-4">
               <Alertas />
            </section>

            <section className="mb-6">
               <ResumoMes />
            </section>

            <section className="sticky bottom-0 bg-white">
               <AcoesRapidas />
            </section>
         </div>
      </div>
   )
}
