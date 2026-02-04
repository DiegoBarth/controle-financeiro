import { Minus, Plus, Calendar, BarChart3 } from "lucide-react"
import React from "react"

import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"

interface AcaoRapida {
   id: string
   label: string
   icone: React.ReactNode
   onClick?: () => void
}

export function AcoesRapidas() {
   const navigate = useNavigate();

   const acoes: AcaoRapida[] = [
      {
         id: "nova-receita",
         label: "Receitas",
         icone: <Plus className="h-5 w-5" />,
         onClick: () => navigate('/receitas'),
      },
      {
         id: "novo-gasto",
         label: "Gastos",
         icone: <Minus className="h-5 w-5" />,
         onClick: () => navigate('/gastos'),
      },
      {
         id: "compromissos",
         label: "Compromissos",
         icone: <Calendar className="h-5 w-5" />,
         onClick: () => navigate('/compromissos'),
      },
      {
         id: "dashboard",
         label: "Dashboard",
         icone: <BarChart3 className="h-5 w-5" />,
         onClick: () => navigate('/dashboard'),
      },
   ]

   return (
      <div className="space-y-4">
         <h2 className="text-lg font-semibold text-foreground">Ações rápidas</h2>

         <div className="grid grid-cols-4 gap-2">
            {acoes.map((acao) => (
               <Button
                  key={acao.id}
                  variant="ghost"
                  className="flex h-auto flex-col items-center gap-2 rounded-lg p-3 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={acao.onClick}
               >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                     {acao.icone}
                  </div>
                  <span className="text-center text-xs leading-tight">{acao.label}</span>
               </Button>
            ))}
         </div>
      </div>
   )
}