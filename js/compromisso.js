document.addEventListener('DOMContentLoaded', () => {
   const form = document.getElementById('form-compromisso');
   form.addEventListener('submit', salvarCompromisso);
});

function alterarTipo() {
   const tipo = document.getElementById('tipo').value;

   blocoPadrao.style.display = 'none';
   blocoCartao.style.display = 'none';

   if (tipo === 'fixo' || tipo === 'variavel') {
      blocoPadrao.style.display = 'block';
   }

   if (tipo === 'cartao') {
      blocoCartao.style.display = 'block';
   }
}


function gerarParcelas(total) {
   const select = document.getElementById('parcelas');
   select.innerHTML = '<option value="">Parcelas</option>';

   for (let i = 1; i <= total; i++) {
      const option = document.createElement('option');
      option.value = i;          // usado pelo backend
      option.textContent = `${i}/${total}`; // UX
      select.appendChild(option);
   }
}


async function salvarCompromisso(e) {
   e.preventDefault();

   const tipo = document.getElementById('tipo').value;
   console.log(tipo);
   if (tipo === 'cartao') {
      await salvarCartao();
   } else {
      await salvarPadrao();
   }

   msg.innerText = 'Compromisso salvo 📅';
   e.target.reset();
}


async function salvarPadrao() {
   await apiPost({
      acao: 'criarCompromisso',
      tipo: tipo.value,
      descricao: descricao.value,
      categoria: categoria.value,
      valor: valor.value,
      dataVencimento: dataVencimentoFixoVariavel.value
   });
}

async function salvarCartao() {
   await apiPost({
      acao: 'criarCartao',
      descricao: descricao.value,
      categoria: categoria.value,
      cartao: cartao.value,
      valorTotal: valorTotal.value,
      parcelas: parcelas.value,
      dataVencimento: dataVencimentoCartao.value
   });
}

async function listarCompromissos() {
   const mes = document.getElementById('filtroMes').value;
   const ano = document.getElementById('filtroAno').value;
   const lista = document.getElementById('listaCompromissos');

   lista.innerHTML = 'Carregando...';

   try {
      const dados = await apiGet({
         acao: 'listarCompromissos',
         mes,
         ano
      });

      lista.innerHTML = '';

      if (!dados.length) {
         lista.innerHTML = '<li>Nenhum compromisso encontrado</li>';
         return;
      }
      dados.forEach(c => {
         const li = document.createElement('li');

         const parcela = c.parcela
            ? ` (${c.parcela}/${c.totalParcelas})`
            : '';

         li.innerText = `
${c.pago ? '✅' : '⏳'} ${c.descricao}${parcela}
📂 ${c.categoria}
📅 Venc: ${c.dataVencimento}
💰 ${c.valor}
${c.cartao ? '💳 ' + c.cartao : ''}
      `.trim();

         lista.appendChild(li);
      });

   } catch (err) {
      console.error(err);
      lista.innerHTML = '<li>Erro ao listar compromissos</li>';
   }
}
