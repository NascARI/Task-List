# Task-List
Projeto simples de lista de tarefas utilizando HTML, CSS e JavaScript
Com interface feita no Figma [Visite o meu projeto no Figma](https://www.figma.com/design/yr6awRAnq81uifmxE6BgIo/Task-List?node-id=0-1&t=2JscnKVk3UMUslcP-1)   

## Funcionalidades

- **Adicionar tarefas** — clique no botão "Add Task" para criar uma nova tarefa na lista.
- **Marcar como concluída** — clique no checkbox da tarefa para marcá-la (ou desmarcá-la) como feita, com feedback visual (ícone e estilo alterados).
- **Editar tarefas** — dê duplo clique no texto de uma tarefa para editá-lo diretamente. Pressione **Enter** ou clique fora para salvar a alteração.
- **Remover tarefas** — clique no botão de lixeira para excluir uma tarefa da lista.

## Tecnologias utilizadas

- **HTML5** — estrutura da página.
- **CSS3** — estilização, layout com Flexbox.
- **JavaScript (Vanilla)** — toda a lógica de interação (criar, editar, marcar e remover tarefas), usando manipulação do DOM e delegação de eventos.
- **Google Fonts** — fonte [Martian Mono](https://fonts.google.com/specimen/Martian+Mono).

## Estrutura do projeto

```
├── index.html          # Estrutura principal da página
├── scripts.js          # Lógica da aplicação (JavaScript)
├── styles/
│   └── index.css       # Estilos da aplicação
└── assets/
    ├── Frame 9.svg      # Ícone de excluir tarefa
    ├── Frame 11.svg     # Ícone de checkbox (não marcado)
    └── Frame 12.svg     # Ícone de checkbox (marcado)
```

## Como executar o projeto

Como é um projeto front-end simples (sem dependências ou build), basta:

1. Clonar ou baixar este repositório.
2. Abrir o arquivo `index.html` diretamente no navegador,

   **ou**, para evitar possíveis problemas com carregamento de arquivos locais, servir a pasta com uma extensão como o [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (VS Code) ou rodando um servidor local simples:

   ```bash
   # Python 3
   python -m http.server

   # Node (usando o pacote serve)
   npx serve
   ```

3. Acessar `http://localhost:PORTA` no navegador (a porta depende da ferramenta usada).

## Como funciona (visão geral do JavaScript)

O `scripts.js` é organizado em torno de dois conceitos principais:

- **Criação dinâmica de tarefas**: a função `addItem()` gera o HTML de uma nova tarefa e a insere na lista, sempre antes do botão "Add Task".
- **Delegação de eventos**: em vez de adicionar um `addEventListener` em cada tarefa individualmente (o que não funcionaria para tarefas criadas depois do carregamento da página), os eventos de clique, duplo clique, perda de foco (`blur`) e teclado (`keydown`) são registrados **uma única vez** no elemento pai `.list`. Usando `event.target.closest()`, o código identifica em qual tarefa e em qual botão específico o evento ocorreu.

## Possíveis melhorias futuras

- Persistência de dados com `localStorage`, para que as tarefas não se percam ao recarregar a página.
- Contador de tarefas pendentes/concluídas.
- Animações de transição ao adicionar/remover tarefas.
- Ajustes de responsividade para telas menores.

## Licença

Este projeto é livre para uso educacional e pessoal.
