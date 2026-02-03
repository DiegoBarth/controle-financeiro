"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FiltrosPeriodoProps {
   mes: string
   ano: number
   onMesChange: (mes: string) => void
   onAnoChange: (ano: number) => void
}

const meses = [
   { value: "all", label: "Ano Inteiro" },
   { value: "1", label: "Janeiro" },
   { value: "2", label: "Fevereiro" },
   { value: "3", label: "Março" },
   { value: "4", label: "Abril" },
   { value: "5", label: "Maio" },
   { value: "6", label: "Junho" },
   { value: "7", label: "Julho" },
   { value: "8", label: "Agosto" },
   { value: "9", label: "Setembro" },
   { value: "10", label: "Outubro" },
   { value: "11", label: "Novembro" },
   { value: "12", label: "Dezembro" },
]

const anos = [2020, 2021, 2022, 2023, 2024, 2025, 2026]

export function FiltrosPeriodo({
   mes,
   ano,
   onMesChange,
   onAnoChange,
}: FiltrosPeriodoProps) {
   const mesAtual = meses.find((m) => m.value === mes)?.label || "Ano Inteiro"

   return (
      <div className="flex gap-2">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="outline"
                  className="justify-between gap-2 rounded-full border-border bg-background px-4"
               >
                  {mesAtual}
                  <ChevronDown className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
               {meses.map((m) => (
                  <DropdownMenuItem key={m.value} onClick={() => onMesChange(m.value)}>
                     {m.label}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="outline"
                  className="justify-between gap-2 rounded-full border-border bg-background px-4"
               >
                  {ano}
                  <ChevronDown className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
               {anos.map((a) => (
                  <DropdownMenuItem key={a} onClick={() => onAnoChange(a)}>
                     {a}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   )
}
