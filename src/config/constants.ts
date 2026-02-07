export const API_URL = import.meta.env.VITE_API_URL;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = 60 * MS_PER_SECOND;
export const MS_PER_HOUR = 60 * MS_PER_MINUTE;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

/** Tempo máximo da sessão (7 dias em ms). */
export const AUTH_TIMEOUT_MS = MS_PER_DAY * 7;

/** Intervalo para renovar o login_time no localStorage (5 min em ms). */
export const AUTH_REFRESH_INTERVAL_MS = 5 * MS_PER_MINUTE;

/** staleTime padrão do React Query (5 min em ms). */
export const QUERY_STALE_TIME_MS = 5 * MS_PER_MINUTE;

/** Base URL do app (ex.: /controle-financeiro/). Usado em assets. */
export const BASE_PATH = import.meta.env.BASE_URL;

/** Timeout das requisições à API (Apps Script), em ms. */
export const API_TIMEOUT_MS = 30 * MS_PER_SECOND;

/** Largura (em pixels) da área sensível nas bordas da tela. */
export const EDGE_ZONE = 80;

/** Distância mínima de swipe para acionar navegações. */
export const SWIPE_MIN_DISTANCE_PX = 50;

/** Delta do swipeable para detectar movimento. */
export const SWIPE_DELTA_PX = 10;

/** Dias usados no alerta semanal de compromissos. */
export const ALERTA_SEMANA_DIAS = 7;

/** Duração padrão dos toasts (em ms). */
export const TOAST_DEFAULT_DURATION_MS = 3000;

/** Comprimento do id gerado para toasts. */
export const TOAST_ID_LENGTH = 9;

/** Ordem das rotas usadas na navegação por swipe horizontal. */
export const SWIPE_ROUTES = [
   '/',
   '/receitas',
   '/gastos',
   '/compromissos',
   '/dashboard'
];

/** Categorias usadas no cadastro de gastos/compromissos */
export const CATEGORIAS = [
   'Alimentação', 'Banco', 'Beleza', 'Casa', 'Educação',
   'Empréstimos', 'Investimento', 'Lazer', 'Pets', 'Presentes',
   'Roupas', 'Saúde', 'Serviços', 'Streaming', 'Telefonia',
   'Transporte', 'Viagem'
];

/** Tipos de compromisso usados no cadastro. */
export const TIPOS = ['Fixo', 'Variável', 'Cartão'];

/** Cartões usados no cadastro de compromissos do tipo "Cartão". */
export const CARTOES = ['Bradesco', 'Itaú', 'Mercado Pago'];