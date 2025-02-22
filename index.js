const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value.trim() === '') {
    alert("You must write something!");
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = inputBox.value;
  listContainer.appendChild(li);

  let scheduleSpan = document.createElement("span");
  scheduleSpan.innerHTML = "Schedule";
  scheduleSpan.classList.add("schedule");
  li.appendChild(scheduleSpan);

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
  } else if (e.target.classList.contains("schedule")) {
    let newTime = prompt("Enter due date and time (YYYY-MM-DD HH:MM):", "");
    if (newTime) {
      let timeSpan = e.target.parentElement.querySelector(".time");
      if (!timeSpan) {
        timeSpan = document.createElement("span");
        timeSpan.classList.add("time");
        e.target.parentElement.appendChild(timeSpan);
      }
      timeSpan.innerHTML = ` | Due: ${newTime}`;
      saveData();
    }
  }
}, false);

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
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

    if (!li.querySelector(".schedule")) {
      let scheduleSpan = document.createElement("span");
      scheduleSpan.innerHTML = "Schedule";
      scheduleSpan.classList.add("schedule");
      li.appendChild(scheduleSpan);
    }
    console.log(localStorage.getItem("data"));
  });
}

showTask();