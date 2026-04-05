"use strict";

const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");

const savedTodos = localStorage.getItem("todos");
const todos = savedTodos ? JSON.parse(savedTodos) : [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach(function (todo, index) {
    const li = document.createElement("li");

    if (todo.completed) {
      li.classList.add("done");
    }

    const numberSpan = document.createElement("span");
    numberSpan.classList.add("number");
    numberSpan.textContent = (index + 1) + ". ";

    const textSpan = document.createElement("span");
    textSpan.classList.add("text");
    textSpan.textContent = todo.text;

    textSpan.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    textSpan.addEventListener("dblclick", function (event) {
      event.stopPropagation();

      const input = document.createElement("input");
      input.type = "text";
      input.value = todo.text;

      li.replaceChild(input, textSpan);
      input.focus();

      input.addEventListener("click", function (event) {
        event.stopPropagation();
      });

      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          const newText = input.value.trim();

          if (newText === "") {
            alert("Boş bırakamazsın");
            return;
          }

          const finalText =
            newText.charAt(0).toUpperCase() + newText.slice(1);

          todos[index].text = finalText;
          saveTodos();
          renderTodos();
        }
      });
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";

    deleteBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.addEventListener("click", function () {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    li.appendChild(numberSpan);
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
  });
}

function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText === "") {
    alert("Lütfen bir görev yaz.");
    return;
  }

  const finalText = todoText.charAt(0).toUpperCase() + todoText.slice(1);

  todos.push({
    text: finalText,
    completed: false
  });

  saveTodos();
  renderTodos();
  todoInput.value = "";
}

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

renderTodos();