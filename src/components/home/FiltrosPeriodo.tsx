import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePeriodo } from "@/contexts/PeriodoContext"
import { Skeleton } from "@/components/ui/Skeleton"

interface FiltrosPeriodoProps {
   mes: string
   ano: number
   onMesChange: (mes: string) => void
   onAnoChange: (ano: number) => void,
   isLoading: boolean
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

export function FiltrosPeriodo({
   mes,
   ano,
   onMesChange,
   onAnoChange,
   isLoading
}: FiltrosPeriodoProps) {
   const { resumo } = usePeriodo();

   const anos = resumo?.anosDisponiveis
      ?.slice()
      .sort((a, b) => a - b) ?? [];

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
               {isLoading ? (
                  <div className="flex flex-col gap-2 p-2 w-25 shadow-sm">
                     <Skeleton className="h-5 w-12 rounded-sm" />
                     <Skeleton className="h-5 w-12 rounded-sm" />
                     <Skeleton className="h-5 w-12 rounded-sm" />
                  </div>
               ) : (
                  anos.map((a) => (
                     <DropdownMenuItem key={a} onClick={() => onAnoChange(a)}>
                        {a}
                     </DropdownMenuItem>
                  ))
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   )
}
