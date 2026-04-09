"use strict";

const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");
const allBtn = document.querySelector("#allBtn");
const activeBtn = document.querySelector("#activeBtn");
const completedBtn = document.querySelector("#completedBtn");
const clearCompletedBtn = document.querySelector("#clearCompletedBtn");
const taskCount = document.querySelector("#taskCount");

// ========================
// STATE
// ========================
let currentFilter = "all";

const savedTodos = localStorage.getItem("todos");
let todos = savedTodos ? JSON.parse(savedTodos) : [];

// ========================
// LOCAL STORAGE
// ========================
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ========================
// HELPER FUNCTIONS
// ========================

// İlk harfi büyük yapar
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ID'ye göre todo objesini bulur
function findTodoById(id) {
  return todos.find(function (todo) {
    return todo.id === id;
  });
}

// ID'ye göre todo index'ini bulur
function findTodoIndexById(id) {
  return todos.findIndex(function (todo) {
    return todo.id === id;
  });
}

// Mevcut filtreye göre gösterilecek todo'ları döndürür
function getFilteredTodos() {
  return todos.filter(function (todo) {
    if (currentFilter === "active") {
      return todo.completed === false;
    }

    if (currentFilter === "completed") {
      return todo.completed === true;
    }

    return true;
  });
}

// ========================
// FILTER BUTTON UI
// ========================
function updateFilterButtons() {
  allBtn.classList.remove("selected");
  activeBtn.classList.remove("selected");
  completedBtn.classList.remove("selected");

  if (currentFilter === "all") {
    allBtn.classList.add("selected");
  } else if (currentFilter === "active") {
    activeBtn.classList.add("selected");
  } else if (currentFilter === "completed") {
    completedBtn.classList.add("selected");
  }
}

// ========================
// TASK COUNT UI
// ========================
function updateTaskCount() {
  const remainingCount = todos.filter(function (todo) {
    return !todo.completed;
  }).length;

  if (remainingCount === 1) {
    taskCount.textContent = "1 görev kaldı";
  } else {
    taskCount.textContent = remainingCount + " görev kaldı";
  }
}

// ========================
// TODO ACTIONS
// ========================
function deleteTodo(id) {
  const todoIndex = findTodoIndexById(id);

  if (todoIndex === -1) return;

  todos.splice(todoIndex, 1);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  const foundTodo = findTodoById(id);

  if (!foundTodo) return;

  foundTodo.completed = !foundTodo.completed;
  saveTodos();
  renderTodos();
}

function updateTodo(id, newText) {
  const foundTodo = findTodoById(id);
  const trimmedText = newText.trim();

  if (!foundTodo) return;
  if (trimmedText === "") return;

  foundTodo.text = capitalizeFirstLetter(trimmedText);
  saveTodos();
  renderTodos();
}

function clearCompletedTodos() {
  const hasCompletedTodo = todos.some(function (todo) {
    return todo.completed;
  });

  if (!hasCompletedTodo) return;

  todos = todos.filter(function (todo) {
    return !todo.completed;
  });

  saveTodos();
  renderTodos();
}

// ========================
// EDIT MODE
// ========================
function enableEditMode(li, textSpan, todo) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = todo.text;
  input.classList.add("edit-input");

  li.replaceChild(input, textSpan);
  input.focus();

  input.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  input.addEventListener("blur", function () {
    renderTodos();
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const newText = input.value.trim();

      if (newText === "") {
        alert("Boş bırakamazsın");
        return;
      }

      updateTodo(todo.id, newText);
    }

    if (event.key === "Escape") {
      renderTodos();
    }
  });
}

// ========================
// CREATE TODO ITEM
// ========================
function createTodoElement(todo, index) {
  const li = document.createElement("li");

  if (todo.completed) {
    li.classList.add("done");
  }

  const numberSpan = document.createElement("span");
  numberSpan.classList.add("number");
  numberSpan.textContent = index + 1 + ". ";

  const textSpan = document.createElement("span");
  textSpan.classList.add("text");
  textSpan.textContent = todo.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Sil";

  textSpan.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  textSpan.addEventListener("dblclick", function (event) {
    event.stopPropagation();
    enableEditMode(li, textSpan, todo);
  });

  deleteBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    deleteTodo(todo.id);
  });

  li.addEventListener("click", function () {
    toggleTodo(todo.id);
  });

  li.appendChild(numberSpan);
  li.appendChild(textSpan);
  li.appendChild(deleteBtn);

  return li;
}

// ========================
// RENDER
// ========================
function renderTodos() {
  todoList.innerHTML = "";

  const filteredTodos = getFilteredTodos();

  if (todos.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.classList.add("empty-message");
    emptyMessage.textContent = "Henüz görev yok.";
    todoList.appendChild(emptyMessage);
  } else if (filteredTodos.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.classList.add("empty-message");
    emptyMessage.textContent = "Bu filtrede gösterilecek görev yok.";
    todoList.appendChild(emptyMessage);
  } else {
    filteredTodos.forEach(function (todo, index) {
      const li = createTodoElement(todo, index);
      todoList.appendChild(li);
    });
  }

  updateFilterButtons();
  updateTaskCount();
}

// ========================
// ADD TODO
// ========================
function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText === "") {
    alert("Lütfen bir görev yaz.");
    return;
  }

  todos.push({
    id: Date.now(),
    text: capitalizeFirstLetter(todoText),
    completed: false
  });

  saveTodos();
  renderTodos();
  todoInput.value = "";
}

// ========================
// EVENTS
// ========================
clearCompletedBtn.addEventListener("click", clearCompletedTodos);

allBtn.addEventListener("click", function () {
  currentFilter = "all";
  renderTodos();
});

activeBtn.addEventListener("click", function () {
  currentFilter = "active";
  renderTodos();
});

completedBtn.addEventListener("click", function () {
  currentFilter = "completed";
  renderTodos();
});

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

// ========================
// INITIAL RENDER
// ========================
renderTodos();