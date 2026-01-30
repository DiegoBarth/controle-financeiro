function formatarMoeda(input) {
  let valor = input.value.replace(/\D/g, '');

  if (!valor) {
    input.value = '';
    return;
  }

  const numero = Number(valor) / 100;

  input.value = numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}


function numeroParaMoeda(numero) {
  if (numero === null || numero === undefined || isNaN(numero)) return '';

  return Number(numero).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
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