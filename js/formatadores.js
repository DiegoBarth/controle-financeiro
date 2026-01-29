function formatarMoeda(input) {
   let valor = input.value.replace(/\D/g, '');

   if (!valor) {
      input.value = '';
      return;
   }

   valor = (parseInt(valor, 10) / 100).toFixed(2);

   valor = valor
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

   input.value = 'R$ ' + valor;
}

function converterValor(valor) {
   return Number(
      valor
         .replace(/\./g, '')
         .replace(',', '.')
         .replace('R$', '')
   );
}

function formatarData(data) {
   const [dia, mes, ano] = data.split('-');

   return `${dia}/${mes}/${ano}`;
}