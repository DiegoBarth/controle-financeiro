export const API_URL = import.meta.env.VITE_API_URL;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/** Tempo máximo da sessão (7 dias em ms). */
export const AUTH_TIMEOUT_MS = 1000 * 60 * 60 * 24 * 7;

/** Intervalo para renovar o login_time no localStorage (5 min em ms). */
export const AUTH_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

/** staleTime padrão do React Query (5 min em ms). */
export const QUERY_STALE_TIME_MS = 1000 * 60 * 5;

/** Base URL do app (ex.: /controle-financeiro/). Usado em assets. */
export const BASE_PATH = import.meta.env.BASE_URL;

/** Timeout das requisições à API (Apps Script), em ms. */
export const API_TIMEOUT_MS = 30 * 1000;

/** Largura (em pixels) da área sensível nas bordas da tela. */
export const EDGE_ZONE = 80;

/** Ordem das rotas usadas na navegação por swipe horizontal. */
export const SWIPE_ROUTES = [
   '/',
   '/receitas',
   '/gastos',
   '/compromissos',
   '/dashboard'
];