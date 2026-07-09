//Selecionando as funções a serem criadas

const btnNovaTarefa = document.getElementById('primary-btn');
const main = document.querySelector('main');
const contador = document.getElementById('count');
const modalOverlay = document.getElementById('modal-overlay');
const formTarefa = document.getElementById('form-tarefa');
const btnCancelar = document.getElementById('btn-cancelar');

let totalTarefas = 0;


//Criar nova tarefa

btnNovaTarefa.addEventListener('click', () => {
  modalOverlay.classList.add('ativo');
});

//Fechar modal ao criar tarefa

function fecharModal() {
  modalOverlay.classList.remove('ativo');
  formTarefa.reset();
}

btnCancelar.addEventListener('click', fecharModal);

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    fecharModal();
  }
});

// Formatação padrão da task

formTarefa.addEventListener('submit', (event) => {
  event.preventDefault();

  const dados = {
    titulo: document.getElementById('input-titulo').value,
    descricao: document.getElementById('input-descricao').value,
    status: 'Não iniciado',
    dificuldade: document.getElementById('input-dificuldade').value,
    data: formatarData(document.getElementById('input-prazo').value)
  };

  criarTarefa(dados);
  fecharModal();
});

//Formatação da data

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function converterParaISO(dataBR) {
  const [dia, mes, ano] = dataBR.split('/');
  return `${ano}-${mes}-${dia}`;
}

//Aplicação da cor do status de acordo com o seu estado

function aplicarCorStatus(elementoStatus, status) {
  elementoStatus.classList.remove('status-finalizado', 'status-iniciado', 'status-nao-iniciado');

  const mapaStatus = {
    'Finalizado': 'status-finalizado',
    'Iniciado': 'status-iniciado',
    'Não iniciado': 'status-nao-iniciado'
  };

  const classe = mapaStatus[status];
  if (classe) {
    elementoStatus.classList.add(classe);
  }
}

// ---------- Criar tarefa ----------

function criarTarefa(dados) {
  const task = document.createElement('div');
  task.className = 'task';

  renderizarTask(task, dados);

  main.insertBefore(task, contador);

  totalTarefas++;
  atualizarContador();
}


//Estrutura HTML para crição da task 

function renderizarTask(task, dados) {
  task.innerHTML = `
    <div class="task-header">
      <div class="task-title-group">
        <h1>${dados.titulo}</h1>
        <h3>${dados.descricao}</h3>
      </div>
      <div class="status">
        <p>${dados.status}</p>
      </div>
    </div>

    <div class="task-main">
      <div class="task-meta">
        <div class="dificult">
          <p>${dados.dificuldade}</p>
        </div>
        <div class="term">
          <p>${dados.data}</p>
        </div>
      </div>

      <div class="task-actions">
        <div class="edit"><p>Editar</p></div>
        <div class="remove"><p>Remover</p></div>
      </div>
    </div>
  `;

  const statusEl = task.querySelector('.status p');
  aplicarCorStatus(statusEl, dados.status);

  const btnEditar = task.querySelector('.edit');
  const btnRemover = task.querySelector('.remove');

  btnEditar.addEventListener('click', () => {
    editarTarefa(task, dados);
  });

  btnRemover.addEventListener('click', () => {
    task.remove();
    totalTarefas--;
    atualizarContador();
  });
}


//Após a criação da task, essa função edita a tarefa

function editarTarefa(task, dados) {
  const tituloEl = task.querySelector('.task-title-group h1');
  const descricaoEl = task.querySelector('.task-title-group h3');
  const statusEl = task.querySelector('.status p');
  const dificuldadeEl = task.querySelector('.dificult p');
  const dataEl = task.querySelector('.term p');
  const acoesEl = task.querySelector('.task-actions');

  tituloEl.outerHTML = `<input type="text" class="edit-titulo" value="${dados.titulo}" required>`;
  descricaoEl.outerHTML = `<textarea class="edit-descricao" required>${dados.descricao}</textarea>`;

  dificuldadeEl.outerHTML = `
    <select class="edit-dificuldade">
      <option value="Fácil" ${dados.dificuldade === 'Fácil' ? 'selected' : ''}>Fácil</option>
      <option value="Médio" ${dados.dificuldade === 'Médio' ? 'selected' : ''}>Médio</option>
      <option value="Difícil" ${dados.dificuldade === 'Difícil' ? 'selected' : ''}>Difícil</option>
    </select>
  `;

  dataEl.outerHTML = `<input type="date" class="edit-data" value="${converterParaISO(dados.data)}" required>`;

  statusEl.outerHTML = `
    <select class="edit-status">
      <option value="Finalizado" ${dados.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
      <option value="Iniciado" ${dados.status === 'Iniciado' ? 'selected' : ''}>Iniciado</option>
      <option value="Não iniciado" ${dados.status === 'Não iniciado' ? 'selected' : ''}>Não iniciado</option>
    </select>
  `;

  acoesEl.innerHTML = `
    <div class="cancelar-edicao"><p>Cancelar</p></div>
    <div class="salvar"><p>Salvar</p></div>
  `;

  const btnSalvar = acoesEl.querySelector('.salvar');
  btnSalvar.addEventListener('click', () => {
    salvarEdicao(task, dados);
  });

  const btnCancelarEdicao = acoesEl.querySelector('.cancelar-edicao');
  btnCancelarEdicao.addEventListener('click', () => {
    renderizarTask(task, dados); // volta ao estado original, sem salvar nada
  });
}

// Atualiza os dados da tarefa

function salvarEdicao(task, dadosOriginais) {
  const novoTitulo = task.querySelector('.edit-titulo').value.trim();
  const novaDescricao = task.querySelector('.edit-descricao').value.trim();
  const novoStatus = task.querySelector('.edit-status').value;
  const novaDificuldade = task.querySelector('.edit-dificuldade').value;
  const novaDataISO = task.querySelector('.edit-data').value;

  if (!novoTitulo || !novaDescricao || !novaDataISO) {
    alert('Preencha todos os campos antes de salvar.');
    return;
  }

  const novosDados = {
    titulo: novoTitulo,
    descricao: novaDescricao,
    status: novoStatus,
    dificuldade: novaDificuldade,
    data: formatarData(novaDataISO)
  };

  renderizarTask(task, novosDados);
}

// Atualização do contador de acordo com a quantidade de tarefas

function atualizarContador() {
  contador.textContent = `${totalTarefas} Tarefas`;
}