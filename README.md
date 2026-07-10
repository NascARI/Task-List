# Task List

Aplicação simples de lista de tarefas (To-Do List) feita em HTML, CSS e JavaScript puro (vanilla), sem frameworks ou bibliotecas externas. Permite criar, editar, remover e categorizar tarefas por status, com animações de transição em toda a interface.

## Funcionalidades

- **Criar tarefas** através de um modal com campos de título, descrição, dificuldade e prazo.
- **Editar tarefas** reabrindo o mesmo modal, agora pré-preenchido com os dados atuais.
- **Remover tarefas**, com animação de saída antes de sair do DOM.
- **Alternar o status de uma tarefa** clicando diretamente sobre o texto do status, em um ciclo: `Não iniciado` → `Iniciado` → `Finalizado` → volta ao início.
- **Categorização automática**: as tarefas são organizadas em três seções (Finalizadas, Iniciadas, Não iniciadas) e se movem entre elas automaticamente quando o status muda.
- **Seções que aparecem/somem dinamicamente**: uma categoria some da tela quando fica sem nenhuma tarefa, e reaparece assim que recebe a primeira.
- **Contador de tarefas** atualizado em tempo real no rodapé da lista.
- **Rolagem interna**: a página inteira não rola; apenas a área de tarefas (`main`) tem scroll, mantendo o cabeçalho sempre fixo e visível.
- **Animações** em praticamente todas as interações (ver seção específica abaixo).

## Estrutura de arquivos

```
.
├── index.html
├── scripts.js
└── styles/
    ├── index.css        # ponto de entrada, importa todos os outros arquivos
    ├── utils.css         # reset global, container principal, animações genéricas
    ├── header.css        # cabeçalho (título + botão "Nova Tarefa")
    ├── main.css           # área principal de rolagem (main)
    ├── task.css           # cartão de cada tarefa individual
    ├── modalAdd.css      # modal de criação/edição de tarefa
    └── category.css      # seções de categoria (Finalizadas/Iniciadas/Não iniciadas)
```

O `index.css` não contém nenhuma regra própria — ele só importa os demais arquivos via `@import`, na seguinte ordem: `header → utils → main → task → modalAdd → category`. Como o CSS resolve conflitos de mesma especificidade pela ordem de declaração, arquivos importados depois têm prioridade sobre os anteriores em caso de seletores repetidos.

## HTML — estrutura geral

```html
<body class="conteiner">
  <header>...</header>

  <main>
    <section class="task-group" data-status="Finalizado">
      <h2 class="group-title">Tarefas Finalizadas</h2>
      <div class="group-list" id="lista-finalizado"></div>
    </section>

    <section class="task-group" data-status="Iniciado">...</section>
    <section class="task-group" data-status="Não iniciado">...</section>

    <p id="count">0 Tarefas</p>
  </main>

  <div class="modal-overlay" id="modal-overlay">
    <div class="modal">...</div>
  </div>

  <script src="scripts.js"></script>
</body>
```

Cada `.group-list` é populado dinamicamente pelo JavaScript — as tarefas nunca ficam fixas no HTML, todas são criadas via `document.createElement`.

## JavaScript — visão geral (`scripts.js`)

O script é organizado em blocos, cada um responsável por uma parte da lógica:

| Bloco | Responsabilidade |
|---|---|
| Seleção de elementos | Guarda referências do DOM usadas em todo o script |
| Modal (criação/edição) | `abrirModalCriacao`, `abrirModalEdicao`, `fecharModal` — um único modal reutilizado para os dois modos |
| Submit do formulário | Decide se cria uma tarefa nova ou atualiza uma existente, com base em `tarefaEmEdicao` |
| Utilitários de data | `formatarData` / `converterParaISO` — conversão entre o formato do `<input type="date">` e o formato exibido (`DD/MM/AAAA`) |
| Cor e ciclo de status | `aplicarCorStatus`, `proximoStatus` — controla a cor de cada status e a ordem do ciclo ao clicar |
| Animações | `animarSalvo`, `animarMudancaStatus`, `animarEntradaTask` — disparam classes CSS temporárias, removidas automaticamente ao final da animação |
| Criar / renderizar tarefa | `criarTarefa`, `renderizarTask` — `renderizarTask` é a única fonte de verdade de como uma tarefa é desenhada, usada tanto na criação quanto após uma edição |
| Remover tarefa | `removerTask` — anima a saída antes de remover o elemento do DOM |
| Grupos por status | `GRUPOS`, `moverTaskParaGrupo`, `atualizarVisibilidadeGrupos` — move a tarefa para a seção correta e esconde/mostra seções vazias |
| Contador | `atualizarContador` |

### Conceitos importantes usados no código

- **Um objeto `dados` por tarefa**: cada cartão de tarefa tem um objeto JavaScript associado (`{ titulo, descricao, status, dificuldade, data }`), passado por referência para todos os event listeners daquele cartão. É esse objeto — não o HTML — que é a fonte de verdade; o HTML é apenas uma "foto" dele em cada momento.
- **`renderizarTask` centralizada**: tanto criar quanto editar uma tarefa terminam chamando essa mesma função, evitando ter a estrutura HTML da tarefa duplicada em vários lugares do código.
- **Re-registro de listeners após `innerHTML`**: sempre que `renderizarTask` substitui o conteúdo de uma tarefa, os elementos antigos (e seus listeners) são destruídos. Por isso os eventos de clique (`editar`, `remover`, `status`) são reconectados a cada chamada de `renderizarTask`.
- **`appendChild` para mover entre grupos**: mover uma tarefa de uma categoria para outra usa `grupo.appendChild(task)` — como o elemento já existe no DOM, isso o desconecta do local antigo e o reconecta no novo, sem duplicar nada.

## Animações

| Gatilho | Efeito | Mecanismo |
|---|---|---|
| Página carrega | Cabeçalho entra com fade + leve deslize | `@keyframes entrarBarra`, aplicada direto no `body` |
| Modal abre/fecha | Fade + leve escala do modal e do fundo escurecido | `transition` em `opacity`/`transform`, ativada pela classe `.ativo` |
| Foco no campo de dificuldade | Leve zoom e brilho na borda | `:focus` + `transition` |
| Tarefa criada / muda de categoria | Entra com fade + leve deslize vertical | Classe `.task-entrando`, via JS (`animarEntradaTask`) |
| Tarefa editada e salva | Pulso verde ao redor do cartão | Classe `.task-salva`, via JS (`animarSalvo`) |
| Status clicado (ciclo) | "Pop" de escala + brilho no texto do status | Classe `.status-alterado`, via JS (`animarMudancaStatus`) |
| Tarefa removida | Colapsa altura/opacidade antes de sair do DOM | Classe `.task-saindo`, com remoção real disparada por `transitionend` |
| Categoria fica vazia / ganha a 1ª tarefa | Seção (e seu título) encolhe/expande suavemente | Classe `.vazio`, via `transition` em `max-height`/`opacity` na `.task-group` |

A maioria das animações segue o mesmo padrão em JS: remover a classe → forçar um reflow (`void elemento.offsetWidth`) → readicionar a classe → escutar `animationend`/`transitionend` com `{ once: true 	}` para limpar a classe depois. Isso garante que a animação sempre rode do zero, mesmo que seja disparada várias vezes seguidas no mesmo elemento.

## Layout: rolagem restrita à área principal

A página inteira não tem scroll — apenas a lista de tarefas (`main`) rola internamente, mantendo o cabeçalho sempre visível. Isso depende da combinação de três ajustes:

1. `html { height: 100%; overflow: hidden; }` — trava a altura da página no nível mais alto, sem deixar brecha para scroll geral.
2. `.conteiner` (o `body`) usa `height: 100vh` **fixo** (não `min-height`) — isso impede que ele cresça além da tela conforme tarefas são adicionadas.
3. `main` usa `flex: 1` (ocupa o espaço restante após o cabeçalho) + `min-height: 0` (necessário porque itens flex, por padrão, resistem a encolher abaixo do tamanho do próprio conteúdo) + `overflow-y: auto` (mostra a barra de rolagem só quando necessário).

O `header` usa `flex-shrink: 0` (não `height: 100%`) para ocupar apenas a altura do seu próprio conteúdo, deixando o restante do espaço vertical disponível para o `main`.

## Pontos de atenção para evolução futura

- Existem algumas regras duplicadas entre `utils.css` e `category.css` (ex.: `.task-group`, `.task-salva`, `.status p`). Não estão causando bugs no momento — a ordem de `@import` no `index.css` garante que `category.css` (importado por último) prevaleça — mas vale a pena consolidar isso em um único lugar para evitar confusão futura.
- O modal de edição atualmente não permite alterar o status da tarefa — isso só é feito clicando diretamente no status do cartão. Se o status também precisar ser editável pelo modal, será necessário adicionar um campo `<select>` a mais e sincronizar com o ciclo de cores.
- Não há persistência de dados: ao recarregar a página, todas as tarefas são perdidas, já que tudo vive apenas em memória (objetos JavaScript). Um próximo passo natural seria salvar em `localStorage` ou em um backend.
