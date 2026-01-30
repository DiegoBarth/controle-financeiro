document.addEventListener('DOMContentLoaded', () => {
   const form = document.getElementById('form-compromisso');
   form.addEventListener('submit', salvarCompromisso);

   const hoje = new Date();
   const mesAtual = hoje.getMonth() + 1;

   const filtroMes = document.getElementById('filtroMes');
   const filtroAno = document.getElementById('filtroAno');

   filtroMes.value = mesAtual;
   filtroAno.value = hoje.getFullYear();
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
   const grid = document.getElementById('gridCompromissos');

   grid.innerHTML = '<tr><td colspan="8">Carregando...</td></tr>';

   const dados = await apiGet({
      acao: 'listarCompromissos',
      mes,
      ano
   });

   grid.innerHTML = '';

   dados.forEach(c => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
      <td>${c.descricao}</td>
      <td>${c.categoria}</td>
      <td>${c.parcela ? `${c.parcela}/${c.totalParcelas}` : '-'}</td>
      <td>
        <input type="text"
               value="${numeroParaMoeda(c.valor)}"
               oninput="formatarMoeda(this)">
      </td>
      <td>${c.dataVencimento}</td>
      <td>
        <input type="date"
               value="${dataParaISO(c.dataPagamento)}">
      </td>
      <td>
        <input type="checkbox" ${c.pago ? 'checked' : ''} disabled>
      </td>
      <td>
        <button onclick="atualizarCompromisso(this, ${c.rowIndex})">
            💾
        </button>
         <button onclick="excluirCompromisso(this, ${c.rowIndex})">
            🗑
        </button>
      </td>
    `;

      grid.appendChild(tr);
   });
}


function dataParaISO(dataBR) {
   if (!dataBR) return '';

   const [dia, mes, ano] = dataBR.split('/');
   return `${ano}-${mes}-${dia}`;
}


async function atualizarCompromisso(botao, rowIndex) {
   const tr = botao.closest('tr');
   const inputs = tr.querySelectorAll('input');

   const valor = inputs[0].value;
   const dataPagamento = inputs[1].value;
   const pago = inputs[2].checked;

   await apiPost({
      acao: 'atualizarCompromisso',
      rowIndex,
      valor,
      dataPagamento,
      pago
   });

   alert('Compromisso atualizado ✔️');
}

async function excluirCompromisso(botao, rowIndex) {
   try {
      await apiPost({
         acao: 'excluirCompromisso',
         rowIndex
      });

      const tr = botao.closest('tr');

      tr.remove();

      alert('Compromisso excluído ✔️');
   }
   catch(e) {
      console.log(e);
   }

}