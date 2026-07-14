const btnNovaTarefa = document.getElementById('primary-btn');
const main = document.querySelector('main');
const contador = document.getElementById('count');
const modalOverlay = document.getElementById('modal-overlay');
const formTarefa = document.getElementById('form-tarefa');
const btnCancelar = document.getElementById('btn-cancelar');
const modalTitulo = document.getElementById('modal-titulo');8
const inputTitulo = document.getElementById('input-titulo');
const inputDescricao = document.getElementById('input-descricao');
const inputDificuldade = document.getElementById('input-dificuldade');
const inputPrazo = document.getElementById('input-prazo');

let totalTarefas = 0;

const navBotoes = document.querySelectorAll('.nav-icon');
const views = {
  tarefas: document.getElementById('view-tarefas'),
  perfil: document.getElementById('view-perfil'),
  historico: document.getElementById('view-historico')
};


const listaHistorico = document.getElementById('historico-lista');
let historico = [];

let tarefaEmEdicao = null;
let dadosEmEdicao = null; 

btnNovaTarefa.addEventListener('click', () => {
  abrirModalCriacao();
});

function abrirModalCriacao() {
  tarefaEmEdicao = null;
  dadosEmEdicao = null;

  modalTitulo.textContent = 'Adicionar tarefa';
  formTarefa.reset();

  modalOverlay.classList.add('ativo');
}



function abrirModalEdicao(task, dados) {
  tarefaEmEdicao = task;
  dadosEmEdicao = dados;

  modalTitulo.textContent = 'Editar tarefa';

  inputTitulo.value = dados.titulo;
  inputDescricao.value = dados.descricao;
  inputDificuldade.value = dados.dificuldade;
  inputPrazo.value = converterParaISO(dados.data);

  modalOverlay.classList.add('ativo');
}



function fecharModal() {
  modalOverlay.classList.remove('ativo');
  formTarefa.reset();
  tarefaEmEdicao = null;
  dadosEmEdicao = null;
}

btnCancelar.addEventListener('click', fecharModal);

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    fecharModal();
  }
});



function mostrarView(nomeView) {
  Object.entries(views).forEach(([nome, secao]) => {
    secao.hidden = nome !== nomeView;
  });

  animarEntradaView(views[nomeView]);

  navBotoes.forEach((botao) => {
    botao.classList.toggle('ativo', botao.dataset.view === nomeView);
  });
}


function animarEntradaView(secao) {
  secao.classList.remove('view-entrando');
  void secao.offsetWidth;
  secao.classList.add('view-entrando');

  secao.addEventListener('animationend', () => {
    secao.classList.remove('view-entrando');
  }, { once: true });
}

navBotoes.forEach((botao) => {
  botao.addEventListener('click', () => {
    mostrarView(botao.dataset.view);
  });
});

mostrarView('tarefas');

// ---------- Perfil ----------

document.getElementById('perfil-membro-desde').textContent =
  `Membro desde ${new Date().toLocaleDateString('pt-BR')}`;



formTarefa.addEventListener('submit', (event) => {
  event.preventDefault();

  const dadosFormulario = {
    titulo: inputTitulo.value.trim(),
    descricao: inputDescricao.value.trim(),
    dificuldade: inputDificuldade.value,
    data: formatarData(inputPrazo.value)
  };

  if (tarefaEmEdicao) {

    const novosDados = {
      ...dadosFormulario,
      status: dadosEmEdicao.status
    };
    renderizarTask(tarefaEmEdicao, novosDados);
    animarSalvo(tarefaEmEdicao);
  } else {

    criarTarefa({
      ...dadosFormulario,
      status: 'Não iniciado'
    });
  }

  fecharModal();
});



function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function converterParaISO(dataBR) {
  const [dia, mes, ano] = dataBR.split('/');
  return `${ano}-${mes}-${dia}`;
}


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


function aplicarCorDificuldade(elementoDificuldade, dificuldade) {
  elementoDificuldade.classList.remove('dificuldade-facil', 'dificuldade-medio', 'dificuldade-dificil');

  const mapaDificuldade = {
    'Fácil': 'dificuldade-facil',
    'Médio': 'dificuldade-medio',
    'Difícil': 'dificuldade-dificil'
  };

  const classe = mapaDificuldade[dificuldade];
  if (classe) {
    elementoDificuldade.classList.add(classe);
  }
}


const ORDEM_STATUS = ['Não iniciado', 'Iniciado', 'Finalizado'];

function proximoStatus(statusAtual) {
  const indexAtual = ORDEM_STATUS.indexOf(statusAtual);

  const proximoIndex = indexAtual === -1 ? 0 : (indexAtual + 1) % ORDEM_STATUS.length;
  return ORDEM_STATUS[proximoIndex];
}


function animarSalvo(task) {

  task.classList.remove('task-salva');
  void task.offsetWidth; 
  task.classList.add('task-salva');

  task.addEventListener('animationend', () => {
    task.classList.remove('task-salva');
  }, { once: true });
}
function arquivarNoHistorico(dados) {
  historico.unshift({
    titulo: dados.titulo,
    data: dados.data,
    arquivadoEm: new Date().toLocaleDateString('pt-BR')
  });
  renderizarHistorico();
}

function renderizarHistorico() {
  if (historico.length === 0) {
    listaHistorico.innerHTML = '<p class="historico-vazio">Nenhuma tarefa concluída arquivada ainda.</p>';
    return;
  }

  listaHistorico.innerHTML = historico.map((item) => `
    <div class="historico-item">
      <p class="historico-titulo">${item.titulo}</p>
      <p class="historico-data">Concluída em ${item.data} • arquivada em ${item.arquivadoEm}</p>
    </div>
  `).join('');
}



function removerTask(task, dados) {
  
  if (dados.status === 'Finalizado') {
    arquivarNoHistorico(dados);
  }


  const alturaAtual = task.getBoundingClientRect().height;
  task.style.height = alturaAtual + 'px';

  void task.offsetWidth; 

  task.classList.add('task-saindo');


  task.addEventListener('transitionend', () => {
    task.remove();
    totalTarefas--;
    atualizarContador();
    atualizarVisibilidadeGrupos();
  }, { once: true });
}



function criarTarefa(dados) {
  const task = document.createElement('div');
  task.className = 'task';

  renderizarTask(task, dados);

  moverTaskParaGrupo(task, dados.status); 

  totalTarefas++;
  atualizarContador();
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

  const statusEl = task.querySelector('.status p');
  aplicarCorStatus(statusEl, dados.status);

  const dificuldadeEl = task.querySelector('.dificult');
  aplicarCorDificuldade(dificuldadeEl, dados.dificuldade);


  statusEl.addEventListener('click', () => {
    dados.status = proximoStatus(dados.status);
    statusEl.textContent = dados.status;
    aplicarCorStatus(statusEl, dados.status);
    animarMudancaStatus(statusEl);

    moverTaskParaGrupo(task, dados.status);
  });

  const btnEditar = task.querySelector('.edit');
  const btnRemover = task.querySelector('.remove');

  btnEditar.addEventListener('click', () => {
    abrirModalEdicao(task, dados);
  });

  btnRemover.addEventListener('click', () => {
    removerTask(task, dados);
  });
}



function animarMudancaStatus(elementoStatus) {
  elementoStatus.classList.remove('status-alterado');
  void elementoStatus.offsetWidth;
  elementoStatus.classList.add('status-alterado');

  elementoStatus.addEventListener('animationend', () => {
    elementoStatus.classList.remove('status-alterado');
  }, { once: true });
}



function animarEntradaTask(task) {
  task.classList.remove('task-entrando');
  void task.offsetWidth; 
  task.classList.add('task-entrando');

  task.addEventListener('animationend', () => {
    task.classList.remove('task-entrando');
  }, { once: true });
}

const GRUPOS = {
  'Finalizado': document.getElementById('lista-finalizado'),
  'Iniciado': document.getElementById('lista-iniciado'),
  'Não iniciado': document.getElementById('lista-nao-iniciado')
};


function moverTaskParaGrupo(task, status) {
  const grupo = GRUPOS[status];
  if (grupo) {
    grupo.appendChild(task);
    animarEntradaTask(task);
  }
  atualizarVisibilidadeGrupos();
}


function atualizarVisibilidadeGrupos() {
  document.querySelectorAll('.task-group').forEach((secao) => {
    const lista = secao.querySelector('.group-list');
    secao.classList.toggle('vazio', lista.children.length === 0);
  });
}

document.querySelectorAll('.task-group').forEach((secao) => {
  secao.classList.add('sem-transicao');
});

atualizarVisibilidadeGrupos();

requestAnimationFrame(() => {
  document.querySelectorAll('.task-group').forEach((secao) => {
    secao.classList.remove('sem-transicao');
  });
});


function atualizarContador() {
  contador.textContent = `${totalTarefas} Tarefas`;
}