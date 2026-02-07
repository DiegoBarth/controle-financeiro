export function moedaParaNumero(valor: string): number {
   if (!valor) return 0;

   return Number(
      valor
         .replace(/\s/g, '')
         .replace('R$', '')
         .replace(/\./g, '')
         .replace(',', '.')
   );
}

export function numeroParaMoeda(valor: number): string {
   return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
   });
}

export function dataBRParaISO(data: string) {
   if (!data) return '';

   const [dia, mes, ano] = data.split('/');
   return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}


export function formatarMoeda(valor: string) {
   const apenasNumeros = valor.replace(/\D/g, '');

   const numero = Number(apenasNumeros) / 100;

   return numeroParaMoeda(numero);
}

export function formatarDataBR(data: string | Date): string {
   const d = new Date(data + 'T12:00:00');
   const dia = String(d.getDate()).padStart(2, '0');
   const mes = String(d.getMonth() + 1).padStart(2, '0');
   const ano = d.getFullYear();

   return `${dia}/${mes}/${ano}`;
}

export function getMesAno(data: string): { mes: string; ano: string } {
   const [_dia, mes, ano] = data.split('/');
   return { mes, ano };
}