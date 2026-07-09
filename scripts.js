const btnNovaTarefa = document.getElementById('primary-btn');
const main = document.querySelector('main');
const contador = document.getElementById('count');
const modalOverlay = document.getElementById('modal-overlay');
const formTarefa = document.getElementById('form-tarefa');
const btnCancelar = document.getElementById('btn-cancelar');

let totalTarefas = 0;

btnNovaTarefa.addEventListener('click', () => {
  modalOverlay.classList.add('ativo');
});


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

// Ao enviar o formulário
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


function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}
//Cria uma nova task


function criarTarefa(dados) {
  const task = document.createElement('div');
  task.className = 'task';

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
        <div class="edit">
          <p>Editar</p>
        </div>
        <div class="remove">
          <p>Remover</p>
        </div>
      </div>
    </div>
  `;

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
  const statusEl = task.querySelector('.status p');
  aplicarCorStatus(statusEl, dados.status);


  main.insertBefore(task, contador);

  const btnRemover = task.querySelector('.remove');
  btnRemover.addEventListener('click', () => {
    task.remove();
    totalTarefas--;
    atualizarContador();
  });

  totalTarefas++;
  atualizarContador();
}
function editarTarefa(task, dados) {
  
  const tituloEl = task.querySelector('.task-title-group h1');
  const descricaoEl = task.querySelector('.task-title-group h3');
  const statusEl = task.querySelector('.status p');
  const dificuldadeEl = task.querySelector('.dificult p');
  const dataEl = task.querySelector('.term p');
  const acoesEl = task.querySelector('.task-actions');

 
  tituloEl.outerHTML = `<input type="text" class="edit-titulo" value="${dados.titulo}">`;
  descricaoEl.outerHTML = `<input type="text" class="edit-descricao" value="${dados.descricao}">`;
  dificuldadeEl.outerHTML = `<input type="text" class="edit-dificuldade" value="${dados.dificuldade}">`;
  dataEl.outerHTML = `<input type="text" class="edit-data" value="${dados.data}">`;

  statusEl.outerHTML = `
    <select class="edit-status">
      <option value="Finalizado" ${dados.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
      <option value="Iniciado" ${dados.status === 'Iniciado' ? 'selected' : ''}>Iniciado</option>
      <option value="Não iniciado" ${dados.status === 'Não iniciado' ? 'selected' : ''}>Não iniciado</option>
    </select>
  `;

  
  acoesEl.innerHTML = `<div class="salvar"><p>Salvar</p></div>`;

  const btnSalvar = acoesEl.querySelector('.salvar');
  btnSalvar.addEventListener('click', () => {
    salvarEdicao(task);
  });
}

function salvarEdicao(task) {
  
  const novoTitulo = task.querySelector('.edit-titulo').value;
  const novaDescricao = task.querySelector('.edit-descricao').value;
  const novoStatus = task.querySelector('.edit-status').value;
  const novaDificuldade = task.querySelector('.edit-dificuldade').value;
  const novaData = task.querySelector('.edit-data').value;

  
  const novosDados = {
    titulo: novoTitulo,
    descricao: novaDescricao,
    status: novoStatus,
    dificuldade: novaDificuldade,
    data: novaData
  };

  renderizarTask(task, novosDados);
}


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

  // Reaplica a cor do status
  const statusEl = task.querySelector('.status p');
  aplicarCorStatus(statusEl, dados.status);

  // Reconecta os eventos de editar e remover
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



function atualizarContador() {
  contador.textContent = `${totalTarefas} Tarefas`;
}