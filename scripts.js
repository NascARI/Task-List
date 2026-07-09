const btnNovaTarefa = document.getElementById('primary-btn');
const main = document.querySelector('main');
const contador = document.getElementById('count');

let totalTarefas = 0;

//Cria uma nova task
btnNovaTarefa.addEventListener('click', () => {
  criarTarefa({
    titulo: 'Nova tarefa',
    descricao: 'Descrição da nova tarefa',
    status: 'Não iniciado',
    dificuldade: 'Fácil',
    data: new Date().toLocaleDateString('pt-BR')
  });
});

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
  // Remove qualquer classe de status antiga (útil se o status mudar depois)
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

function atualizarContador() {
  contador.textContent = `${totalTarefas} Tarefas`;
}