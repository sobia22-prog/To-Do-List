const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value.trim() === '') {
    alert("Write something to add a task!");
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = inputBox.value;
  listContainer.appendChild(li);

  let editSpan = document.createElement("span");
  editSpan.innerHTML = "Edit";
  editSpan.classList.add("edit");
  li.appendChild(editSpan);

  let deleteSpan = document.createElement("span");
  deleteSpan.innerHTML = "Delete";
  deleteSpan.classList.add("delete");
  li.appendChild(deleteSpan);

  inputBox.value = "";
  saveData();
}

listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveData();
  } else if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    saveData();
  } else if (e.target.classList.contains("edit")) {
    let newValue = prompt("Edit your task:", e.target.parentElement.childNodes[0].nodeValue.trim());
    if (newValue !== null && newValue.trim() !== "") {
      e.target.parentElement.childNodes[0].nodeValue = newValue;
      saveData();
    }
  }
}, false);

function filterTasks() {
  const filterValue = document.getElementById("filter").value;
  const tasks = document.querySelectorAll("#list-container li");

  tasks.forEach(task => {
    if (filterValue === "all") {
      task.style.display = "flex";
    } else if (filterValue === "done" && task.classList.contains("checked")) {
      task.style.display = "flex";
    } else if (filterValue === "not-done" && !task.classList.contains("checked")) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
}

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ action: "refreshUI" });
  }
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data") || "";

  document.querySelectorAll("#list-container li").forEach((li) => {
    if (!li.querySelector(".delete")) {
      let deleteSpan = document.createElement("span");
      deleteSpan.innerHTML = "Delete";
      deleteSpan.classList.add("delete");
      li.appendChild(deleteSpan);
    }

    if (!li.querySelector(".edit")) {
      let editSpan = document.createElement("span");
      editSpan.innerHTML = "Edit";
      editSpan.classList.add("edit");
      li.appendChild(editSpan);
    }
  });
}

showTask();

if ('Notification' in window && navigator.serviceWorker) {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification("Welcome to the To-Do List PWA!");
      });
    }
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").then(reg => {
    console.log("Service Worker Registered");
  });

  navigator.serviceWorker.addEventListener("message", event => {
    if (event.data.action === "refreshUI") {
      console.log("Updating UI...");
      showTask();
    }
  });
}
