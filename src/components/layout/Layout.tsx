import { type ReactNode } from 'react'

import { FiltrosPeriodo } from '@/components/home/FiltrosPeriodo'
import { usePeriodo } from '@/contexts/PeriodoContext'

interface LayoutProps {
   title: string
   children: ReactNode
   onBack?: () => void
   onLogout?: () => void
   showPeriodoFilters?: boolean
   headerSlot?: ReactNode
   containerClassName?: string
   contentClassName?: string
}

export function Layout({
   title,
   children,
   onBack,
   onLogout,
   showPeriodoFilters = false,
   headerSlot,
   containerClassName = 'max-w-5xl',
   contentClassName = '',
}: LayoutProps) {
   const { mes, setMes, ano, setAno, isLoading } = usePeriodo()

   return (
      <div className="min-h-screen bg-background">
         <div className={`mx-auto ${containerClassName} px-4 py-6`}>
            <header className="mb-6 space-y-4">
               <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-2">
                     {onBack ? (
                        <button
                           className="w-fit rounded-md border px-3 py-1 text-sm transition hover:bg-gray-100"
                           onClick={onBack}
                        >
                           ← Voltar
                        </button>
                     ) : null}

                     <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                  </div>

                  <div className="flex items-center gap-3">
                     {headerSlot}
                     {onLogout ? (
                        <button
                           onClick={onLogout}
                           className="rounded-md border px-3 py-1 text-sm text-gray-600 transition-colors hover:text-red-800"
                        >
                           Logout
                        </button>
                     ) : null}
                  </div>
               </div>

               {showPeriodoFilters ? (
                  <FiltrosPeriodo
                     mes={mes}
                     ano={ano}
                     onMesChange={setMes}
                     onAnoChange={setAno}
                     isLoading={isLoading}
                  />
               ) : null}
            </header>

            <main className={contentClassName}>{children}</main>
         </div>
      </div>
   )
}