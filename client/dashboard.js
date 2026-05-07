let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function renderTasks(tasks) {
  document.getElementById("totalTasks").innerText = tasks.length;

  const completed = tasks.filter((task) => task.status === "Completed").length;

  const pending = tasks.filter((task) => task.status === "Pending").length;

  document.getElementById("completedTasks").innerText = completed;

  document.getElementById("pendingTasks").innerText = pending;

  const tableBody = document.getElementById("taskTableBody");

  tableBody.innerHTML = "";

  tasks.forEach((task, index) => {
    tableBody.innerHTML += `
      <tr>

        <td>${task.title}</td>

        <td>${task.status}</td>

        <td>${task.priority}</td>

        <td>${task.dueDate}</td>

        <td>

          <button
            onclick="toggleStatus(${index})"
            class="btn btn-success btn-sm"
          >
            Done
          </button>

          <button
            onclick="deleteTask(${index})"
            class="btn btn-danger btn-sm"
          >
            Delete
          </button>

        </td>

      </tr>
    `;
  });
}

document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;

  const description = document.getElementById("description").value;

  const dueDate = document.getElementById("dueDate").value;

  const priority = document.getElementById("priority").value;

  const task = {
    title,

    description,

    dueDate,

    priority,

    status: "Pending",
  };

  allTasks.push(task);

  saveTasks();

  renderTasks(allTasks);

  document.getElementById("taskForm").reset();
});

function deleteTask(index) {
  allTasks.splice(index, 1);

  saveTasks();

  renderTasks(allTasks);
}

function toggleStatus(index) {
  allTasks[index].status =
    allTasks[index].status === "Pending" ? "Completed" : "Pending";

  saveTasks();

  renderTasks(allTasks);
}

function filterTasks(status) {
  if (status === "all") {
    renderTasks(allTasks);
  } else {
    const filtered = allTasks.filter((task) => task.status === status);

    renderTasks(filtered);
  }
}

function showSection(section) {
  document.getElementById("dashboardSection").style.display =
    section === "dashboard" ? "block" : "none";

  document.getElementById("tasksSection").style.display =
    section === "tasks" ? "block" : "none";

  document.getElementById("analyticsSection").style.display =
    section === "analytics" ? "block" : "none";

  document.getElementById("calendarSection").style.display =
    section === "calendar" ? "block" : "none";
}

function logout() {
  window.location.href = "login.html";
}

renderTasks(allTasks);
