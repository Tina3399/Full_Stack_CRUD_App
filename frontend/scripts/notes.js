let inputEle = document.querySelector(".input");
let submitEle = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let containerDiv = document.querySelector(".container");

const title = document.getElementById("titleInput");
const addBtn = document.getElementById("title");

// addBtn.addEventListener("click", addTask);

let arrayOfTasks = [];
// console.log(inputEle)

if (window.localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
}
getTaskFromLocalStorage();

submitEle.onclick = function () {
  if (inputEle.value !== "") {
    addTaskToArray(inputEle.value);
    inputEle.value = "";
  }
};

function addTaskToArray(taskText) {
  let payload = {
    title: title.value,
  };
  console.log(payload);
  fetch("http://localhost:4500/notes/create", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((res) => {
      const task = {
        id: res._id,
        title: taskText,
        complated: false,
      };
      console.log(task);
      arrayOfTasks.push(task);
      // console.log(arrayOfTasks);
      addTaskToPage(arrayOfTasks);

      addTaskToLocalStorage(arrayOfTasks);
      // localStorage.setItem("token", res.token);
    })
    .catch((err) => console.log(err));
}

function addTaskToPage(arrayOfTasks) {
  tasksDiv.innerHTML = "";

  arrayOfTasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "task";
    if (task.complated) {
      div.className = "task done";
    }
    div.setAttribute("data-id", task.id);
    // console.log(div, "div");
    div.appendChild(document.createTextNode(task.title));
    let span = document.createElement("span");
    span.className = "del";
    span.appendChild(document.createTextNode("Delete"));

    div.append(span);

    tasksDiv.appendChild(div);
    // console.log(div)
  });
}

function addTaskToLocalStorage(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}
function getTaskFromLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    // console.log(tasks)
    addTaskToPage(tasks);
  }
}

function addElementsToPageFrom(arrayOfTasks) {
  // Empty Tasks Div
  tasksDiv.innerHTML = "";
  // Looping On Array Of Tasks
  arrayOfTasks.forEach((task) => {
    // Create Main Div
    let div = document.createElement("div");
    div.className = "task";
    // Check If Task is Done
    if (task.completed) {
      div.className = "task done";
    }
    div.setAttribute("data-id", task.id);
    div.appendChild(document.createTextNode(task.title));
    // Create Delete Button
    let span = document.createElement("span");
    span.className = "del";
    span.appendChild(document.createTextNode("Delete"));

    // Append Button To Main Div
    div.append(span);
    // Add Task Div To Tasks Container
    tasksDiv.appendChild(div);
  });
}

// Click On Task Element
tasksDiv.onclick = (e) => {
  if (e.target.classList.contains("del")) {
    // e.target.parentElement.remove();
    e.target.parentElement.remove();
    deleteTaskFromLocalStorage(e.target.parentElement.getAttribute("data-id"));
  }
  if (e.target.classList.contains("task")) {
    e.target.classList.toggle("done");
    updateStatusInLocalStorage(e.target.getAttribute("data-id"));
  }
};

function deleteTaskFromLocalStorage(taskId) {
  fetch(`http://localhost:4500/notes/delete/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res, "ress");
      arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
      addTaskToLocalStorage(arrayOfTasks);
      // localStorage.setItem("token", res.token);
    })
    .catch((err) =>
      console.log({ msg: "something went wwrong", err: err.message })
    );
}
function updateStatusInLocalStorage(taskId) {
  arrayOfTasks.forEach((task) => {
    if (task.id == taskId)
      task.complated == false
        ? (task.complated = true)
        : (task.complated = false);
  });

  addTaskToLocalStorage(arrayOfTasks);
}
