// Selecionando os elementos principais

const btnNovaTarefa = document.getElementById('primary-btn');
const main = document.querySelector('main');
const contador = document.getElementById('count');
const modalOverlay = document.getElementById('modal-overlay');
const formTarefa = document.getElementById('form-tarefa');
const btnCancelar = document.getElementById('btn-cancelar');
const modalTitulo = document.getElementById('modal-titulo');

const inputTitulo = document.getElementById('input-titulo');
const inputDescricao = document.getElementById('input-descricao');
const inputDificuldade = document.getElementById('input-dificuldade');
const inputPrazo = document.getElementById('input-prazo');

let totalTarefas = 0;

// Navegação entre telas
const navBotoes = document.querySelectorAll('.nav-icon');
const views = {
  tarefas: document.getElementById('view-tarefas'),
  perfil: document.getElementById('view-perfil'),
  historico: document.getElementById('view-historico')
};

// Histórico de tarefas concluídas
const listaHistorico = document.getElementById('historico-lista');
let historico = [];

// Controla se o modal está criando uma tarefa nova ou editando uma existente.
// null = modo criação. Uma referência à div.task = modo edição.
let tarefaEmEdicao = null;
let dadosEmEdicao = null; // guarda os dados que o modal não edita (ex: status)

// ---------- Abrir modal (criação) ----------

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

// ---------- Abrir modal (edição) ----------

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

// ---------- Fechar modal ----------

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

// ---------- Navegação entre Tarefas / Perfil / Histórico ----------

function mostrarView(nomeView) {
  Object.entries(views).forEach(([nome, secao]) => {
    secao.hidden = nome !== nomeView;
  });

  animarEntradaView(views[nomeView]);

  navBotoes.forEach((botao) => {
    botao.classList.toggle('ativo', botao.dataset.view === nomeView);
  });
}

// Fade + leve deslize toda vez que uma tela é exibida
function animarEntradaView(secao) {
  secao.classList.remove('view-entrando');
  void secao.offsetWidth; // força reflow, permitindo reiniciar a animação
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

mostrarView('tarefas'); // tela inicial, ao carregar a página

// ---------- Perfil ----------

document.getElementById('perfil-membro-desde').textContent =
  `Membro desde ${new Date().toLocaleDateString('pt-BR')}`;

// ---------- Envio do formulário (cria OU edita, dependendo do modo) ----------

formTarefa.addEventListener('submit', (event) => {
  event.preventDefault();

  const dadosFormulario = {
    titulo: inputTitulo.value.trim(),
    descricao: inputDescricao.value.trim(),
    dificuldade: inputDificuldade.value,
    data: formatarData(inputPrazo.value)
  };

  if (tarefaEmEdicao) {
    // Modo edição: mantém o status atual da tarefa (o modal não mexe nisso)
    const novosDados = {
      ...dadosFormulario,
      status: dadosEmEdicao.status
    };
    renderizarTask(tarefaEmEdicao, novosDados);
    animarSalvo(tarefaEmEdicao);
  } else {
    // Modo criação: toda tarefa nova começa como "Não iniciado"
    criarTarefa({
      ...dadosFormulario,
      status: 'Não iniciado'
    });
  }

  fecharModal();
});

// ---------- Utilitários de data ----------

// Converte "2026-07-01" (formato do input date) para "01/07/2026" (formato exibido)
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Converte "01/07/2026" (formato exibido) para "2026-07-01" (formato exigido pelo input date)
function converterParaISO(dataBR) {
  const [dia, mes, ano] = dataBR.split('/');
  return `${ano}-${mes}-${dia}`;
}

// ---------- Cor do status ----------

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

// ---------- Cor da dificuldade ----------

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

// ---------- Ciclo de status (clique direto na interface) ----------

// Ordem em que o status avança a cada clique
const ORDEM_STATUS = ['Não iniciado', 'Iniciado', 'Finalizado'];

function proximoStatus(statusAtual) {
  const indexAtual = ORDEM_STATUS.indexOf(statusAtual);
  // Se por algum motivo o status atual não estiver na lista, começa do início
  const proximoIndex = indexAtual === -1 ? 0 : (indexAtual + 1) % ORDEM_STATUS.length;
  return ORDEM_STATUS[proximoIndex];
}

// ---------- Animação de "salvo" ----------

function animarSalvo(task) {
  // Remove a classe antes de reaplicar, para garantir que a animação
  // rode de novo mesmo se a task já tiver sido salva recentemente
  task.classList.remove('task-salva');
  void task.offsetWidth; // força o navegador a "recalcular" o layout (reflow),
                         // o que permite reiniciar a animação do zero
  task.classList.add('task-salva');

  // Remove a classe sozinha quando a animação terminar, para não deixá-la
  // "presa" no elemento (o que impediria a animação de rodar de novo depois)
  task.addEventListener('animationend', () => {
    task.classList.remove('task-salva');
  }, { once: true });
}

// ---------- Histórico de tarefas concluídas ----------

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

// ---------- Animação de saída (remover tarefa) ----------

function removerTask(task, dados) {
  // Se a tarefa já estava "Finalizada", ela vira um registro no Histórico
  // em vez de simplesmente desaparecer
  if (dados.status === 'Finalizado') {
    arquivarNoHistorico(dados);
  }

  // Fixa a altura ATUAL da task em pixels (em vez de "auto"),
  // porque o CSS só consegue animar transition entre valores numéricos —
  // não é possível fazer transition de "auto" até "0".
  const alturaAtual = task.getBoundingClientRect().height;
  task.style.height = alturaAtual + 'px';

  void task.offsetWidth; // força reflow, garantindo que o navegador registre
                         // a altura fixada acima ANTES de iniciarmos a transição

  task.classList.add('task-saindo');

  // Só remove a task do DOM (e atualiza o contador) depois que a
  // transição de saída realmente terminar
  task.addEventListener('transitionend', () => {
    task.remove();
    totalTarefas--;
    atualizarContador();
    atualizarVisibilidadeGrupos();
  }, { once: true });
}

// ---------- Criar tarefa ----------

function criarTarefa(dados) {
  const task = document.createElement('div');
  task.className = 'task';

  renderizarTask(task, dados);

  moverTaskParaGrupo(task, dados.status); // já dispara a animação de entrada

  totalTarefas++;
  atualizarContador();
}

// ---------- Renderizar a task (usada na criação e após editar) ----------

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

  // Clicar no status avança para o próximo estado do ciclo
  statusEl.addEventListener('click', () => {
    dados.status = proximoStatus(dados.status);
    statusEl.textContent = dados.status;
    aplicarCorStatus(statusEl, dados.status);
    animarMudancaStatus(statusEl);

    // Move a task para a seção correspondente ao novo status
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

// ---------- Animação ao mudar o status ----------

function animarMudancaStatus(elementoStatus) {
  elementoStatus.classList.remove('status-alterado');
  void elementoStatus.offsetWidth;
  elementoStatus.classList.add('status-alterado');

  elementoStatus.addEventListener('animationend', () => {
    elementoStatus.classList.remove('status-alterado');
  }, { once: true });
}

// ---------- Animação de entrada da task no grupo ----------

function animarEntradaTask(task) {
  task.classList.remove('task-entrando');
  void task.offsetWidth; // força reflow, permitindo reiniciar a animação
  task.classList.add('task-entrando');

  task.addEventListener('animationend', () => {
    task.classList.remove('task-entrando');
  }, { once: true });
}

// ---------- Grupos por status ----------

// Mapeia cada status ao seu container correspondente no HTML
const GRUPOS = {
  'Finalizado': document.getElementById('lista-finalizado'),
  'Iniciado': document.getElementById('lista-iniciado'),
  'Não iniciado': document.getElementById('lista-nao-iniciado')
};

// Move (ou insere pela primeira vez) a task para dentro do grupo do status atual.
// appendChild em um elemento que já está no DOM não o duplica — ele apenas
// é "desconectado" de onde estava e reconectado no novo lugar.
function moverTaskParaGrupo(task, status) {
  const grupo = GRUPOS[status];
  if (grupo) {
    grupo.appendChild(task);
    animarEntradaTask(task);
  }
  atualizarVisibilidadeGrupos();
}

// Esconde a seção inteira (título + lista) quando ela não tem nenhuma task dentro
function atualizarVisibilidadeGrupos() {
  document.querySelectorAll('.task-group').forEach((secao) => {
    const lista = secao.querySelector('.group-list');
    secao.classList.toggle('vazio', lista.children.length === 0);
  });
}

// Roda uma vez ao carregar a página, para que seções sem nenhuma task
// já comecem escondidas (em vez de aparecerem vazias até a primeira ação).
// Desativamos a transição momentaneamente para que essa checagem inicial
// não dispare a animação de colapso visível no primeiro instante da página.
document.querySelectorAll('.task-group').forEach((secao) => {
  secao.classList.add('sem-transicao');
});

atualizarVisibilidadeGrupos();

// Reativa a transição no próximo quadro de renderização, para que só
// mudanças de status DAQUI PRA FRENTE animem normalmente
requestAnimationFrame(() => {
  document.querySelectorAll('.task-group').forEach((secao) => {
    secao.classList.remove('sem-transicao');
  });
});

// ---------- Contador ----------

function atualizarContador() {
  contador.textContent = `${totalTarefas} Tarefas`;
}