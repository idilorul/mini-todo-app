"use strict";

const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");

let count = 1;

function updateNumbers() {
  const allLi = todoList.querySelectorAll("li");

  allLi.forEach(function(li, index) {
    const span = li.querySelector("span");
    const parts = span.textContent.split(".");
    span.textContent = (index + 1) + "." + parts[1];
  });
}

function addTodo() {
  const todoText = todoInput.value.trim();
  const finalText = todoText.charAt(0).toUpperCase() + todoText.slice(1);

  if (todoText === "") {
    alert("Lütfen bir görev yaz.");
    return;
  }

  const li = document.createElement("li");
const span = document.createElement("span");
span.textContent = count + "." + finalText;
count++;

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Sil";
deleteBtn.addEventListener("click", function() {
    event.stopPropagation();
    li.remove();
    updateNumbers();
})
li.appendChild(span);
li.appendChild(deleteBtn);

li.addEventListener("click", function () {
  li.classList.toggle("done");
});

// li.addEventListener("dblclick", function () {
 // li.remove();
//  updateNumbers();
// });                       çift tıklamayla butonu yani seçilen li satırını kaldırmak için yapmıştım.

todoList.appendChild(li);

todoInput.value = "";
}

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && todoInput.value !== "") {
    addTodo(); // aynı kodu iki event’e (click ve keydown) bağlamak için, ortak işi fonksiyona çıkardım
  } 
});