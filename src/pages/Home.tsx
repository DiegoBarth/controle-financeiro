import { FiltrosPeriodo } from "../components/home/FiltrosPeriodo"
import { Alertas } from "../components/home/Alertas"
import { ResumoMes } from "../components/home/ResumoMes"
import { AcoesRapidas } from "../components/home/AcoesRapidas"
import { useEffect } from 'react';
import { usePeriodo } from '../contexts/PeriodoContext';
import { listarDados } from '../api/home';

export function Home() {
   const { mes, setMes, ano, setAno } = usePeriodo();

   useEffect(() => {
      async function preload() {
         await listarDados(mes, String(ano));
      }
      preload();
   }, [mes, ano]);

   return (
      <div className="min-h-screen bg-background">
         <div className="mx-auto max-w-lg px-4 py-6 md:max-w-2xl lg:max-w-4xl">
            
            <header className="mb-6">
               <h1 className="mb-4 text-2xl font-bold text-foreground">Home</h1>
               <FiltrosPeriodo
                  mes={mes}
                  ano={ano}
                  onMesChange={setMes}
                  onAnoChange={setAno}
               />
            </header>

            <section className="mb-6">
               <Alertas />
            </section>

            <section className="mb-6">
               <ResumoMes />
            </section>

            <section>
               <AcoesRapidas />
            </section>
         </div>
      </div>
   )
}
