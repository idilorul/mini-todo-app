"use strict";

const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");

const todos = [];

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

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";

    deleteBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      todos.splice(index, 1);
      renderTodos();
    });

    li.addEventListener("click", function () {
      todo.completed = !todo.completed;
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

  renderTodos();
  todoInput.value = "";
}

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});