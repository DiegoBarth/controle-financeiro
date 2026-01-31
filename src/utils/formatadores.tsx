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