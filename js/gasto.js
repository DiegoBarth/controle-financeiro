document.addEventListener('DOMContentLoaded', () => {
   const form = document.getElementById('form-gasto');
   const valorInput = document.getElementById('valor');
   const msg = document.getElementById('msg');
   const btnBuscar = document.getElementById('btn-buscar');

   valorInput.addEventListener('input', () => formatarMoeda(valorInput));
   form.addEventListener('submit', salvarGasto);
   btnBuscar.addEventListener('click', listarGastos);
});


async function salvarGasto(e) {
   e.preventDefault();

   const data = document.getElementById('data').value; // yyyy-mm-dd
   const descricao = document.getElementById('descricao').value;
   const categoria = document.getElementById('categoria').value;
   const valorFormatado = document.getElementById('valor').value;

   const valor = converterValor(valorFormatado);

   if (valor <= 0) {
      alert('Informe um valor válido');
      return;
   }

   let dataFormatada = formatarData(data);

   const payload = {
      tipoCadastro: 'gasto',
      data: dataFormatada,
      descricao,
      categoria,
      valor
   };

   await apiPost({
      acao: 'criarGasto',
      ...payload
   });

   msg.innerText = 'Gasto salvo 💸';
   e.target.reset();
}

async function listarGastos() {
   const mes = document.getElementById('mes').value;
   const ano = document.getElementById('ano').value;
   const lista = document.getElementById('lista');

   const dados = await apiGet({
      acao: 'listarGastos',
      mes,
      ano
   });

   lista.innerHTML = '';

   dados.forEach(l => {
      const li = document.createElement('li');
      li.innerText = `${l[1]} - ${l[2]} - R$ ${l[3]}`;
      lista.appendChild(li);
   });
}
