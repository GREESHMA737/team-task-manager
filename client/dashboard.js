let allTasks = [];

// FETCH TASKS

async function fetchTasks() {
  try {
    const response = await fetch(
      "https://team-task-manager-production-8cb5.up.railway.app/api/tasks",
    );

    const tasks = await response.json();

    allTasks = tasks;

    renderTasks(tasks);
  } catch (error) {
    console.log(error);
  }
}

// RENDER TASKS

function renderTasks(tasks) {
  document.getElementById("totalTasks").innerText = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  document.getElementById("completedTasks").innerText = completedTasks;

  document.getElementById("pendingTasks").innerText = pendingTasks;

  const progress =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  document.getElementById("progressBar").style.width = `${progress}%`;

  document.getElementById("progressText").innerText = `${progress}% Completed`;

  const tableBody = document.getElementById("taskTableBody");

  tableBody.innerHTML = "";

  tasks.forEach((task) => {
    const row = `
      <tr>

        <td>${task.title}</td>

        <td>

          <span class="
            badge
            ${task.status === "Completed" ? "bg-success" : "bg-warning"}
          ">

            ${task.status}

          </span>

        </td>

        <td>

          ${task.priority || "Medium"}

        </td>

        <td>

          ${new Date(task.dueDate).toLocaleDateString()}

        </td>

        <td>

          <button
            class="btn btn-danger btn-sm"
            onclick="deleteTask('${task._id}')"
          >
            Delete
          </button>

        </td>

      </tr>
    `;

    tableBody.innerHTML += row;
  });
}

// CREATE TASK

const taskForm = document.getElementById("taskForm");

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;

  const description = document.getElementById("description").value;

  const dueDate = document.getElementById("dueDate").value;

  const priority = document.getElementById("priority").value;

  try {
    const response = await fetch(
      "https://team-task-manager-production-8cb5.up.railway.app/api/tasks/create",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          description,
          dueDate,
          priority,
        }),
      },
    );

    const data = await response.json();

    alert(data.message);

    await fetchTasks();

    taskForm.reset();
  } catch (error) {
    console.log(error);
  }
});

// FILTER TASKS

function filterTasks(status) {
  if (status === "all") {
    renderTasks(allTasks);
  } else {
    const filtered = allTasks.filter((task) => task.status === status);

    renderTasks(filtered);
  }
}

// SHOW SECTION

function showSection(section) {
  const dashboard = document.getElementById("dashboardSection");

  const tasks = document.getElementById("tasksSection");

  const analytics = document.getElementById("analyticsSection");

  const calendar = document.getElementById("calendarSection");

  dashboard.style.display = "none";

  tasks.style.display = "none";

  analytics.style.display = "none";

  calendar.style.display = "none";

  if (section === "dashboard") {
    dashboard.style.display = "block";
  }

  if (section === "tasks") {
    tasks.style.display = "block";
  }

  if (section === "analytics") {
    analytics.style.display = "block";

    updateAnalytics();
  }

  if (section === "calendar") {
    calendar.style.display = "block";
  }
}

// ANALYTICS

function updateAnalytics() {
  const total = allTasks.length;

  const completed = allTasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const pending = allTasks.filter((task) => task.status === "Pending").length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById("analyticsTotal").innerText = total;

  document.getElementById("analyticsCompletion").innerText =
    `${completionRate}%`;

  document.getElementById("analyticsPending").innerText = pending;
}

// CALENDAR

function showTasksForDate() {
  const selectedDate = document.getElementById("calendarDate").value;

  const calendarTasks = document.getElementById("calendarTasks");

  const filteredTasks = allTasks.filter((task) => {
    const taskDate = new Date(task.dueDate).toISOString().split("T")[0];

    return taskDate === selectedDate;
  });

  if (filteredTasks.length === 0) {
    calendarTasks.innerHTML = `
      <p>
        No tasks due on this date.
      </p>
    `;

    return;
  }

  let html = "";

  filteredTasks.forEach((task) => {
    html += `
      <div class="glass-card mt-3">

        <h4>${task.title}</h4>

        <p>${task.description}</p>

      </div>
    `;
  });

  calendarTasks.innerHTML = html;
}

// DELETE TASK

async function deleteTask(id) {
  const confirmDelete = confirm("Delete this task?");

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(
      `https://team-task-manager-production-8cb5.up.railway.app/api/tasks/${id}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    alert(data.message);

    fetchTasks();
  } catch (error) {
    console.log(error);
  }
}

// LOGOUT

function logout() {
  localStorage.removeItem("token");

  window.location.href = "login.html";
}

// INITIAL LOAD

fetchTasks();
