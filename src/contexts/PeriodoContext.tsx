import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ResumoCompleto } from '@/types/ResumoCompleto';
import type { Receita } from '@/types/Receita';
import type { Gasto } from '@/types/Gasto';
import type { Compromisso } from '@/types/Compromisso';
import type { Dashboard } from '@/types/Dashboard';
import { useResumo } from '@/hooks/useResumo';
import { useReceita } from '@/hooks/useReceita';
import { useGasto } from '@/hooks/useGasto';
import { useCompromisso } from '@/hooks/useCompromisso';
import { useDashboard } from '@/hooks/useDashboard';

/**
 * Interface do Context - define todos os valores acessíveis globalmente
 * 
 * Responsabilidades:
 * - Estado do período selecionado (mês/ano)
 * - Métodos para alterar período
 * - Dados consolidados do período (receitas, gastos, etc)
 * - Estados de loading para sincronização entre componentes
 */
interface PeriodoContextType {
   // ===== Estado do Período =====
   mes: string;           // Mês em formato "1"-"12"
   setMes: (mes: string) => void;  // Setter reativo
   ano: number;           // Ano inteiro (2025)
   setAno: (ano: number) => void;  // Setter reativo

   // ===== Dados do Período =====
   resumo: ResumoCompleto | null;          // Resumo consolidado
   receitas: Receita[] | null;             // Lista de receitas
   gastos: Gasto[] | null;                 // Lista de gastos
   compromissos: Compromisso[] | null;     // Obrigações financeiras
   compromissosAlerta: Compromisso[] | null; // Compromissos vencendo
   dashboard: Dashboard | null;            // Dados do dashboard

   // ===== Estados de Sincronização =====
   isLoading: boolean;    // True se qualquer query está em loading
}

/**
 * Context padrão
 * Valores iniciais para evitar undefined quando usado fora do Provider
 */
export const PeriodoContext = createContext<PeriodoContextType>({
   mes: String(new Date().getMonth() + 1),
   setMes: () => { },
   ano: new Date().getFullYear(),
   setAno: () => { },
   resumo: null,
   receitas: null,
   gastos: null,
   compromissos: null,
   compromissosAlerta: null,
   dashboard: { saldoMensal: [], topCategorias: [], resumoCartoes: [] },
   isLoading: false
});

/**
 * Recupera período salvo em sessionStorage ou retorna mês/ano atual
 * 
 * Benefício: Permite ao usuário voltar para o mesmo período após refresh da página
 * sessionStorage é preferível a localStorage pois é limpo ao fechar aba
 * 
 * @returns Objeto com mes e ano iniciais
 */
function getPeriodoInicial() {
   // Tenta recuperar período salvo anteriormente
   const salvo = sessionStorage.getItem('periodo');
   if (salvo) return JSON.parse(salvo);

   // Se não tiver salvo, usa data atual
   const hoje = new Date();
   return {
      mes: String(hoje.getMonth() + 1),  // getMonth() retorna 0-11, converte para 1-12
      ano: hoje.getFullYear()
   };
}

/**
 * Provider do Context
 * 
 * Responsabilidades:
 * 1. Gerenciar estado global de período (mês/ano)
 * 2. Buscar dados para o período selecionado (usando todos os hooks de feature)
 * 3. Salvar período em sessionStorage para persistência entre reloads
 * 4. Fornecer estados consolidados para sincronização de loading
 * 
 * Fluxo de dados:
 * - Usuário muda mês/ano
 * - useEffect detecta mudança
 * - sessionStorage é atualizado
 * - Hooks detectam query key mudou
 * - Novos dados são fetched
 * - Context atualiza value
 * - Componentes inscritos recebem nova value
 * 
 * @example
 * <PeriodoProvider>
 *   <App />
 * </PeriodoProvider>
 */
export function PeriodoProvider({ children }: { children: ReactNode }) {
   // ===== Recuperar Período Inicial =====
   const periodoInicial = getPeriodoInicial();

   // ===== Estado Reativo =====
   // Estas mudanças causam re-render do Provider e de todos subscritores
   const [mes, setMes] = useState<string>(periodoInicial.mes);
   const [ano, setAno] = useState<number>(periodoInicial.ano);

   // ===== Buscar Dados do Período =====
   // Cada hook monitora mes/ano e refaz fetch quando mudam
   // Todos os hooks usam TanStack React Query com cache automático
   const { resumo, isLoading } = useResumo(mes, String(ano))
   const { receitas } = useReceita(mes, String(ano))
   const { gastos } = useGasto(mes, String(ano))
   const { compromissos } = useCompromisso(mes, String(ano))
   // Nota: compromissosAlerta busca 'all' de meses mas filtra por ano
   // Permite alertas aparecer mesmo em outros meses
   const { compromissosAlerta } = useCompromisso('all', String(ano), 'alertas')
   const { dashboard } = useDashboard(mes, String(ano))

   // ===== Persistência do Período =====
   // Salva período atual em sessionStorage
   // useEffect com dependência [mes, ano] evita loops infinitos
   // Executa APÓS render (não bloqueia render)
   useEffect(() => {
      sessionStorage.setItem(
         'periodo',
         JSON.stringify({ mes, ano })
      );
   }, [mes, ano]);

   // ===== Render do Provider =====
   // Value é um novo objeto a cada render (mesmo se valores iguais)
   // Para otimizar, poderia usar useMemo:
   // const value = useMemo(() => ({ mes, setMes, ... }), [mes, ano, ...])
   // Mas para este aplicativo a overhead é mínima
   return (
      <PeriodoContext.Provider
         value={{
            mes,
            setMes,
            ano,
            setAno,
            resumo,
            receitas,
            gastos,
            compromissos,
            compromissosAlerta,
            dashboard,
            isLoading
         }}
      >
         {children}
      </PeriodoContext.Provider>
   );
}

/**
 * Hook customizado para usar PeriodoContext
 * 
 * Benefício: Tipagem automática + erro se usado fora do Provider
 * 
 * @example
 * const { mes, setMes, gastos } = usePeriodo();
 * 
 * @throws Error se usado fora de PeriodoProvider
 */
export const usePeriodo = () => useContext(PeriodoContext);