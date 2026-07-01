const lista = document.querySelector(".list")
const addButton = lista.querySelector("button")

function addItem(texto = "Nova tarefa"){
  const task = document.createElement("div")
  task.classList.add("task")

  task.innerHTML = 
 `<button class="check-box">
      <img src="assets/Frame 11.svg" alt="Marcar tarefa">
    </button>
    <p contenteditable="false">${texto}</p>
    <button class="delete">
      <img src="assets/Frame 9.svg" alt="Excluir tarefa">
    </button>`;
    

  lista.insertBefore(task, addButton);
}
  addButton.addEventListener("click", () => {
    addItem();
  });
  
  function atualizarIMGCheckbox(task ) {
    const img = task.querySelector(".check-box img");
    const marcado = task.classList.contains("done")
    img.src = marcado? "assets/Rectangle 4.svg" : "assets/Frame 11.svg"
  }


  //Essa função são as funções de click, ao clicar na checkbox ela será marcada ou desmarcada. E quando clicar no button delete, a task será removida
  lista.addEventListener("click", (event) => {
    const task = event.target.closest(".task");

    if (!task) return;
    
    if (event.target.closest(".check-box")) {
      task.classList.toggle("done");
      atualizarIMGCheckbox(task);
    }

    if(event.target.closest(".delete")) {
      task.remove()
    }
  });


  //Quando o usuario fizer o "Double Click" a tarefa pode ser editada
  lista.addEventListener("dblclick", (event) => { 
    const paragrafo = event.target.closest("p")

    if (!paragrafo) return ;

    paragrafo.contentEditable = "true";

    paragrafo.focus();

    const range = document.createRange();
    range.selectNodeContents(paragrafo);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });

  lista.addEventListener('blur', (e) => {
  if (e.target.tagName === 'P') {
    e.target.contentEditable = 'false';
  }
}, true); //Nesse evento, se o usuario clicar fora do campo de texto quando estiver editando, o texto deixa de ser editavel


//Quando o usuario apertar a tecla Enter quando estiver editando o texto será "finalizado" automaticamente
lista.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'P' && e.key === 'Enter') {
    e.preventDefault();
    e.target.blur();
  }
});

