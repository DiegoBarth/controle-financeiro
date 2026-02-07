/**
 * UTILITÁRIOS DE FORMATAÇÃO
 * 
 * Conjunto de funções para conversão entre formatos comuns:
 * - Moeda: String BRL ↔ Number
 * - Data: Formato BR (DD/MM/YYYY) ↔ ISO (YYYY-MM-DD)
 */

/**
 * Converte string de moeda para número
 * 
 * Suporta múltiplos formatos:
 * - "R$ 1.234,56" → 1234.56
 * - "1.234,56" → 1234.56
 * - "1234,56" → 1234.56
 * 
 * Processamento:
 * 1. Remove espaços em branco
 * 2. Remove "R$"
 * 3. Remove pontos (separador de milhares)
 * 4. Substitui vírgula por ponto (decimal)
 * 5. Converte para Number
 * 
 * @param valor - String de moeda (ex: "R$ 1.234,56")
 * @returns Número em ponto flutuante (ex: 1234.56)
 * 
 * @example
 * moedaParaNumero("R$ 100,50") // → 100.50
 * moedaParaNumero("1.500,00") // → 1500.00
 */
export function moedaParaNumero(valor: string): number {
   if (!valor) return 0;

   return Number(
      valor
         .replace(/\s/g, '')        // Remove espaços
         .replace('R$', '')         // Remove símbolo
         .replace(/\./g, '')        // Remove separador de milhares
         .replace(',', '.')         // Converte vírgula em ponto decimal
   );
}

/**
 * Converte número para string de moeda BRL formatada
 * 
 * Usa Intl.NumberFormat para lidar com:
 * - Separador de milhares (.)
 * - Separador decimal (,)
 * - Símbolo BRL (R$)
 * - Exatamente 2 casas decimais
 * 
 * @param valor - Número a formatar (ex: 1234.56)
 * @returns String formatada em BRL (ex: "R$ 1.234,56")
 * 
 * @example
 * numeroParaMoeda(1234.56) // → "R$ 1.234,56"
 * numeroParaMoeda(0)       // → "R$ 0,00"
 */
export function numeroParaMoeda(valor: number): string {
   return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
   });
}

/**
 * Converte data em formato brasileiro para formato ISO
 * 
 * Conversão:
 * - "25/12/2025" → "2025-12-25"
 * 
 * Casos especiais:
 * - Input vazio: retorna string vazia
 * - Pads com zeros: "1/1/2025" → "2025-01-01"
 * 
 * @param data - Data em formato BR (DD/MM/YYYY)
 * @returns Data em formato ISO (YYYY-MM-DD)
 * 
 * @example
 * dataBRParaISO("25/12/2025") // → "2025-12-25"
 * dataBRParaISO("1/1/2025")   // → "2025-01-01"
 * dataBRParaISO("")           // → ""
 */
export function dataBRParaISO(data: string) {
   if (!data) return '';

   const [dia, mes, ano] = data.split('/');
   return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

/**
 * Formata string de moeda à medida que o usuário digita
 * 
 * Fluxo:
 * 1. Remove tudo que não é número
 * 2. Divide por 100 (para lidar com centavos)
 * 3. Formata com numeroParaMoeda
 * 
 * Útil para inputs de moeda em tempo real:
 * "123" → "R$ 1,23"
 * "1234" → "R$ 12,34"
 * "123456" → "R$ 1.234,56"
 * 
 * @param valor - Valor digitado no input (ex: "123")
 * @returns Valor formatado em moeda (ex: "R$ 1,23")
 * 
 * @example
 * formatarMoeda("123") // → "R$ 1,23"
 * formatarMoeda("1234567") // → "R$ 12.345,67"
 */
export function formatarMoeda(valor: string) {
   const apenasNumeros = valor.replace(/\D/g, '');

   const numero = Number(apenasNumeros) / 100;

   return numeroParaMoeda(numero);
}

/**
 * Converte Date ou string ISO para formato brasileiro
 * 
 * Suporta inputs:
 * - Date object: new Date("2025-12-25")
 * - String ISO: "2025-12-25"
 * 
 * Tratamento de fusos horários:
 * - Adiciona 'T12:00:00' para evitar problemas de fuso
 * - Garante mesma data em qualquer fuso
 * 
 * @param data - Date ou string ISO (YYYY-MM-DD)
 * @returns Data em formato BR (DD/MM/YYYY)
 * 
 * @example
 * formatarDataBR(new Date("2025-12-25")) // → "25/12/2025"
 * formatarDataBR("2025-12-25")          // → "25/12/2025"
 * formatarDataBR("2025-01-01")          // → "01/01/2025"
 */
export function formatarDataBR(data: string | Date): string {
   // Adiciona T12:00:00 para evitar problemas de interpretação de fuso horário
   // Por exemplo, "2025-12-25" poderia ser interpretado como 23:00 na véspera
   const d = new Date(data + 'T12:00:00');
   const dia = String(d.getDate()).padStart(2, '0');
   const mes = String(d.getMonth() + 1).padStart(2, '0');
   const ano = d.getFullYear();

   return `${dia}/${mes}/${ano}`;
}

/**
 * Extrai mês e ano de uma data em formato brasileiro
 * 
 * Útil para filtros de período sem o dia
 * 
 * @param data - Data em formato BR (DD/MM/YYYY)
 * @returns Objeto com mes e ano como strings
 * 
 * @example
 * getMesAno("25/12/2025") // → { mes: "12", ano: "2025" }
 * getMesAno("01/01/2025") // → { mes: "01", ano: "2025" }
 */
export function getMesAno(data: string): { mes: string; ano: string } {
   const [_dia, mes, ano] = data.split('/');
   return { mes, ano };
}