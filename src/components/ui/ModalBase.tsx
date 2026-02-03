interface ModalBaseProps {
   aberto: boolean
   onClose: () => void
   titulo?: string
   children: React.ReactNode
   tipo: 'inclusao' | 'edicao'
   onSalvar?: () => void
   onExcluir?: () => void
   loading?: boolean
   loadingTexto?: string
}

export function ModalBase({
   aberto,
   onClose,
   titulo,
   children,
   tipo,
   onSalvar,
   onExcluir,
   loading = false,
   loadingTexto = 'Salvando...'
}: ModalBaseProps) {
   if (!aberto) return null

   return (
      <div className="fixed inset-0 z-50 flex justify-center items-end md:items-center">
         {/* Overlay */}
         <div
            className="absolute inset-0 bg-black/40"
            onClick={loading ? undefined : onClose}
         />

         {/* Container */}
         <div className="relative w-full md:w-[400px] max-h-[90vh] bg-white rounded-t-2xl md:rounded-2xl flex flex-col">
            {/* Header */}
            {titulo && (
               <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                  <h2 className="text-lg font-semibold">{titulo}</h2>
                  <button
                     onClick={loading ? undefined : onClose} // desabilita X se carregando
                     className={`text-sm text-muted-foreground hover:text-gray-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                  >
                     Fechar
                  </button>
               </div>
            )}

            {/* Conteúdo */}
            <div className="p-4 overflow-y-auto flex-1">{children}</div>

            {/* Footer inteligente */}
            <div className="flex gap-2 p-4 border-t flex-shrink-0">
               <button
                  onClick={onClose}
                  disabled={loading}
                  className={`flex-1 border rounded-md p-2 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''
                     }`}
               >
                  Cancelar
               </button>

               {tipo === 'edicao' && onExcluir && (
                  <button
                     onClick={onExcluir}
                     disabled={loading}
                     className={`flex-1 border border-red-500 text-red-600 rounded-md p-2 text-sm hover:bg-red-50 transition ${loading ? 'opacity-50 cursor-not-allowed hover:bg-red-500/10' : ''
                        }`}
                  >
                     {loading && loadingTexto === 'Excluindo...' ? 'Excluindo...' : 'Excluir'}
                  </button>
               )}

               {onSalvar && (
                  <button
                     onClick={onSalvar}
                     disabled={loading}
                     className={`flex-1 bg-primary text-white rounded-md p-2 text-sm transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                  >
                     {loading && loadingTexto !== 'Excluindo...' ? loadingTexto : 'Salvar'}
                  </button>
               )}
            </div>
         </div>
      </div>
   )
}