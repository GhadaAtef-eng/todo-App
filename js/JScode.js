"use strict";

const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const apiKey = "6763362c60a208ee1fde518c";
const loadingScreen = document.querySelector(".loading");

let allTodos = [];
getAllTodo();

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(inputElement.value);

  if (inputElement.value.trim().length > 0) {
    addTodo();
  } else {
    toastr.error("Title is empty");
  }
});

async function addTodo() {
  showLoading();
  const todo = {
    title: inputElement.value,
    apiKey: apiKey,
  };
  // console.log(todo);
  const objAdd = {
    method: "post",
    body: JSON.stringify(todo),
    headers: { "content-type": "application/json" },
  };

  const res = await fetch("https://todos.routemisr.com/api/v1/todos", objAdd);

  if (res.ok) {
    const data = await res.json();
    console.log(data);

    if (data.message === "success") {
      await getAllTodo();
      formElement.reset();
      toastr.success("Added Successfuly", "Toastr APP");

      // console.log("added");
    }
  }
  hideLoading();
}

async function getAllTodo() {
  showLoading();
  const res = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`);

  if (res.ok) {
    const data = await res.json();
    console.log(data);

    if (data.message === "success") {
      allTodos = data.todos;
      displayTodos();
    }
  }
  hideLoading();
}

function displayTodos() {
  let blackBox = ``;

  for (const todo of allTodos) {
    blackBox += `
 <li class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2" >
  <span onclick="markCompleted('${todo._id}')" 
            style="${
              todo.completed ? `text-decoration: line-through;` : ``
            }" class="task-name">${todo.title}</span>

            <div
              class="d-flex justify-content-between align-items-center gap-4"
            >
              ${
                todo.completed
                  ? `<span
                ><i
                  class="fa-regular fa-circle-check"
                  style="color: rgb(23, 184, 130)"
                ></i
              ></span>`
                  : ``
              }
              <span onclick="deleteTodo('${
                todo._id
              }')" class="icon"><i class="fa-solid fa-trash-can"></i></span>
            </div>
          </li>
    `;
  }

  document.querySelector(".task-container").innerHTML = blackBox;
  changeProgress();
}

// function eventadded() {
//   const editBtn = document.querySelector(".icon");
//   for (let i = 0; i < editBtn.length; i++) {
//     editBtn.addEventListener("click", deleteTodo);
//   }
// }

async function deleteTodo(todoid) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
      // delete code
      const todoIDdata = {
        todoId: todoid,
      };

      const obj = {
        method: "DELETE",
        body: JSON.stringify(todoIDdata),
        headers: { "content-type": "application/json" },
      };

      const res = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
      if (res.ok) {
        const data = await res.json();
        if (data.message === "success") {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });

          await getAllTodo();
        }
      } // delete code

      hideLoading();
    }
  });
}

async function markCompleted(todoid) {
  // sweet alert for complete
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, completed it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
      const todoIDdata = {
        todoId: todoid,
      };

      const obj = {
        method: "PUT",
        body: JSON.stringify(todoIDdata),
        headers: { "content-type": "application/json" },
      };

      const res = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
      if (res.ok) {
        const data = await res.json();
        if (data.message === "success") {
          Swal.fire({
            title: "Completed!",
            text: "Your TODO has been completed.",
            icon: "success",
          });
          await getAllTodo();
        }
      }

      hideLoading();
    }
  });

  console.log("doneeeee");
}

function showLoading() {
  loadingScreen.classList.remove("d-none");
}

function hideLoading() {
  loadingScreen.classList.add("d-none");
}

function changeProgress() {
  const completedTaskNumber = allTodos.filter((todo) => todo.completed).length;
  console.log(completedTaskNumber);
  const totalTask = allTodos.length;
  document.getElementById("progress").style.width = `${
    (completedTaskNumber / totalTask) * 100
  }%`;

  const statusNumber = document.querySelectorAll(".status-number span");
  statusNumber[0].innerHTML=completedTaskNumber;
  statusNumber[1].innerHTML=totalTask;



}
