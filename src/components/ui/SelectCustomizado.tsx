import { ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface SelectProps {
   value: string;
   onChange: (val: string) => void;
   options: string[];
}

export function SelectCustomizado({ value, onChange, options }: SelectProps) {
   const [aberto, setAberto] = useState(false);
   const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
   const containerRef = useRef<HTMLDivElement>(null);
   const itemSelecionadoRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (aberto && containerRef.current) {
         const rect = containerRef.current.getBoundingClientRect();
         setCoords({
            top: rect.top,
            left: rect.left,
            width: rect.width
         });
      }
   }, [aberto]);

   useEffect(() => {
      if (aberto && itemSelecionadoRef.current) {
         const timer = setTimeout(() => {
            itemSelecionadoRef.current?.scrollIntoView({
               block: 'center',
               behavior: 'auto'
            });
         }, 10);
         return () => clearTimeout(timer);
      }
   }, [aberto]);

   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setAberto(false);
         }
      }
      if (aberto) {
         document.addEventListener("mousedown", handleClickOutside);
      }
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, [aberto]);

   const handleSelecionar = (opcao: string) => {
      onChange(opcao);
      setAberto(false);
   };

   return (
      <div className="relative w-full" ref={containerRef}>
         <button
            type="button"
            onClick={() => setAberto(!aberto)}
            className="flex h-10 w-full items-center justify-between rounded-md border bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-black"
         >
            <span className={value ? "text-black" : "text-muted-foreground"}>
               {value || "Selecione"}
            </span>
            <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${aberto ? 'rotate-180' : ''}`} />
         </button>

         {aberto && createPortal(
            <div
               style={{
                  position: 'fixed',
                  top: coords.top,
                  left: coords.left,
                  width: coords.width,
                  transform: 'translateY(-100%) translateY(-4px)',
                  zIndex: 10000
               }}
               className="overflow-hidden rounded-md border bg-white shadow-2xl animate-in fade-in zoom-in-95"
            >
               <div className="max-h-60 overflow-y-auto p-1 scroll-smooth">
                  {options.map((opcao) => {
                     const isSelected = value === opcao;
                     return (
                        <div
                           key={opcao}
                           ref={isSelected ? itemSelecionadoRef : null}
                           onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelecionar(opcao);
                           }}
                           className={`
                              flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors hover:bg-gray-100
                              ${isSelected ? 'bg-gray-100 font-semibold text-black' : 'text-gray-600'}
                           `}
                        >
                           <span>{opcao}</span>
                           {isSelected && <Check className="h-4 w-4 text-black" />}
                        </div>
                     );
                  })}
               </div>
            </div>,
            document.body
         )}
      </div>
   );
}