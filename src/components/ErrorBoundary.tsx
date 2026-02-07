import React, { ReactNode } from 'react';

interface Props {
   children: ReactNode;
}

interface State {
   hasError: boolean;
   error: Error | null;
}

/**
 * ErrorBoundary: Componente para capturar erros não tratados em componentes filhos
 * 
 * Descrição:
 * - Implementa React Error Boundary (apenas com class components)
 * - Captura erros em qualquer componente filho (render, lifecycle, construtores)
 * - Exibe UI fallback quando erro é capturado
 * - Permite ao usuário recarregar a aplicação
 * 
 * Limitações (NÃO captura):
 * - Erros em event handlers (use try/catch)
 * - Erros assíncronos (use .catch() ou try/catch em async/await)
 * - Erros durante SSR (apenas client-side)
 * - Erros no próprio ErrorBoundary
 * 
 * Colocação:
 * - Deve envolver AppProvider em App.tsx (camada mais alta possível)
 * - Pode haver múltiplos ErrorBoundaries para isolação de erros
 * 
 * @example
 * <ErrorBoundary>
 *   <AppProvider>
 *     <AppRouter />
 *   </AppProvider>
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
   constructor(props: Props) {
      super(props);
      // Estado inicial: sem erros
      this.state = {
         hasError: false,
         error: null
      };
   }

   /**
    * Ciclo de vida estático que é chamado quando erro é lançado cm componente filho
    * 
    * Responsabilidade: Atualizar state para triggar novo render com fallback UI
    * 
    * Nota: Deve ser um método estático puro (sem side effects)
    * Use componentDidCatch para logging e side effects
    * 
    * @param error - Erro lançado pelo componente filho
    * @returns Novo state parcial
    */
   static getDerivedStateFromError(error: Error): State {
      // Retorna novo state que trigga render do fallback UI
      return {
         hasError: true,
         error
      };
   }

   /**
    * Ciclo de vida chamado APÓS getDerivedStateFromError
    * 
    * Responsabilidade: Side effects (logging, error reporting, etc)
    * 
    * Executado em desenvolvimento 2x (para detectar bugs mais facilmente)
    * Executado 1x em produção
    * 
    * @param error - Erro que foi lançado
    * @param errorInfo - Informações adicionais (component stack trace)
    */
   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      // Log detalhado para debugging
      // Em produção, aqui você poderia enviar para serviço de error tracking
      // (ex: Sentry, LogRocket, etc)
      console.error('ErrorBoundary capturou um erro:', error, errorInfo);
   }

   render() {
      // Se houver erro, renderiza fallback UI
      if (this.state.hasError) {
         return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
               <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
                  {/* Ícone visual */}
                  <div className="text-6xl mb-4">⚠️</div>

                  {/* Títulos e descrição */}
                  <h1 className="text-2xl font-bold text-red-600 mb-2">
                     Algo deu errado
                  </h1>
                  <p className="text-gray-600 mb-4">
                     Desculpe, ocorreu um erro inesperado. Por favor, tente recarregar a página.
                  </p>

                  {/* Seção colapsível com detalhes técnicos */}
                  {/* Útil para debugging, mas oculta detalhes técnicos do usuário final */}
                  <details className="mb-6 text-left bg-red-50 p-4 rounded border border-red-200">
                     <summary className="cursor-pointer font-semibold text-red-700 mb-2">
                        Detalhes técnicos
                     </summary>
                     <pre className="text-xs text-red-600 overflow-auto max-h-48 whitespace-pre-wrap break-words">
                        {this.state.error?.toString()}
                     </pre>
                  </details>

                  {/* Botão para recarregar a página */}
                  {/* window.location.reload() é mais confiável que React Router para this kind of recovery */}
                  <button
                     onClick={() => window.location.reload()}
                     className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                     Recarregar página
                  </button>
               </div>
            </div>
         );
      }

      // Se não houver erro, renderiza normal os children
      return this.props.children;
   }
}
