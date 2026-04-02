"use strict";

const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");

let count = 1;

function addTodo() {
  const todoText = todoInput.value.trim();
  const finalText = todoText.charAt(0).toUpperCase() + todoText.slice(1);

  if (todoText === "") {
    alert("Lütfen bir görev yaz.");
    return;
  }

  const li = document.createElement("li");
li.textContent = count + "." + finalText;
count++;

li.addEventListener("click", function () {
  li.classList.toggle("done");
});

todoList.appendChild(li);

todoInput.value = "";
}

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && todoInput.value !== "") {
    addTodo(); // aynı kodu iki event’e (click ve keydown) bağlamak için, ortak işi fonksiyona çıkardım
  } 
});