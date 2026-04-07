"use strict";

const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");
const allBtn = document.querySelector("#allBtn");
const activeBtn = document.querySelector("#activeBtn");
const completedBtn = document.querySelector("#completedBtn");
const clearCompletedBtn = document.querySelector("#clearCompletedBtn")

// ========================
// FILTER STATE
// ========================
// Hangi todo'ların gösterileceğini belirler (all / active / completed)
let currentFilter = "all";

// ========================
// LOCAL STORAGE'DAN VERİ ÇEKME
// ========================
// Daha önce kayıtlı todos varsa al, yoksa boş dizi başlat
const savedTodos = localStorage.getItem("todos");
let todos = savedTodos ? JSON.parse(savedTodos) : [];

// Completed olan tüm task'ları siler (sadece aktif olanları bırakır)
clearCompletedBtn.addEventListener("click", function() {
    todos= todos.filter(function (todo) {
        return !todo.completed;
    });

    saveTodos();
    renderTodos();
});

// ========================
// LOCAL STORAGE'A KAYDETME
// ========================
// todos dizisini string'e çevirip saklıyorum
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ========================
// FILTER BUTTON UI GÜNCELLEME
// ========================
// Aktif filter butonuna selected class ekler
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
// RENDER FONKSİYONU
// ========================
// Ekrandaki todo listesini baştan oluşturur
function renderTodos() {
  // Önce listeyi tamamen temizler
  todoList.innerHTML = "";

  // ========================
  // FILTER UYGULAMA
  // ========================
  // currentFilter'a göre hangi todo'ların gösterileceğini belirler
  const filteredTodos = todos.filter(function (todo) {
    if (currentFilter === "active") {
      return todo.completed === false;
    }

    if (currentFilter === "completed") {
      return todo.completed === true;
    }

    return true; // "all"
  });

  // ========================
  // TODO'LARI EKRANA BASMA
  // ========================
  filteredTodos.forEach(function (todo, index) {
    const li = document.createElement("li");

    // Eğer tamamlandıysa görsel stil ekle (üstü çizilir)
    if (todo.completed) {
      li.classList.add("done");
    }

    // Görev numarası
    const numberSpan = document.createElement("span");
    numberSpan.classList.add("number");
    numberSpan.textContent = index + 1 + ". ";

    // Görev metni
    const textSpan = document.createElement("span");
    textSpan.classList.add("text");
    textSpan.textContent = todo.text;

    // Text'e tıklayınca li click tetiklenmesin
    textSpan.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    // ========================
    // EDIT (DOUBLE CLICK)
    // ========================
    textSpan.addEventListener("dblclick", function (event) {
      event.stopPropagation();

      const input = document.createElement("input");
      input.type = "text";
      input.value = todo.text;

      // span yerine input koyar (edit mode)
      li.replaceChild(input, textSpan);
      input.focus();

      // input içindeki click'ler üst elemana gitmesin
      input.addEventListener("click", function (event) {
        event.stopPropagation();
      });

      // Enter'a basınca güncelle
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          const newText = input.value.trim();

          if (newText === "") {
            alert("Boş bırakamazsın");
            return;
          }

          const finalText =
            newText.charAt(0).toUpperCase() + newText.slice(1);

          // id kullan çünkü filter sonrası index güvenli değil
          const foundTodo = todos.find(function (item) {
            return item.id === todo.id;
          });

          if (!foundTodo) return;

          foundTodo.text = finalText;

          saveTodos();
          renderTodos();
        }
      });
    });

    // ========================
    // DELETE
    // ========================
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";

    deleteBtn.addEventListener("click", function (event) {
      event.stopPropagation();

      // Silinecek todo'nun gerçek index'ini bulur
      const todoIndex = todos.findIndex(function (item) {
        return item.id === todo.id;
      });

      if (todoIndex === -1) return;

      // Diziden kaldırır
      todos.splice(todoIndex, 1);

      saveTodos();
      renderTodos();
    });

    // ========================
    // TOGGLE COMPLETED
    // ========================
    li.addEventListener("click", function () {
      const foundTodo = todos.find(function (item) {
        return item.id === todo.id;
      });

      if (!foundTodo) return;

      // true ↔ false değiştir
      foundTodo.completed = !foundTodo.completed;

      saveTodos();
      renderTodos();
    });

    // Elemanları birleştir
    li.appendChild(numberSpan);
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);

    // Listeye ekle
    todoList.appendChild(li);
  });

  // Filter butonlarını render sonunda bir kere güncelle
  updateFilterButtons();
}

// ========================
// TODO EKLEME
// ========================
function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText === "") {
    alert("Lütfen bir görev yaz.");
    return;
  }

  const finalText = todoText.charAt(0).toUpperCase() + todoText.slice(1);

  // Yeni todo objesi oluşturur
  // id: kimlik (filter sonrası doğru elemanı bulmak için)
  todos.push({
    id: Date.now(),
    text: finalText,
    completed: false
  });

  saveTodos();
  renderTodos();

  // Input'u temizliyoruz (yeni giriş için)
  todoInput.value = "";
}

// ========================
// FILTER BUTTONS
// ========================
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

// ========================
// EVENTLER
// ========================
addBtn.addEventListener("click", addTodo);

// Enter ile ekleme
todoInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

// ========================
// INITIAL RENDER
// ========================
// Sayfa açıldığında mevcut todos'ları göster
renderTodos();