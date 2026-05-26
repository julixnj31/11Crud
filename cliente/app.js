const TASKS_URL = "http://localhost:3000/tasks";
const USERS_URL = "http://localhost:3000/users";

/* ==================================================
    Aquí seleccionamos los elementos que hay en la página
   ================================================== */
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const taskStatus = document.getElementById("task-status");
const taskUser = document.getElementById("task-user");
const taskSubmitButton = document.getElementById("task-submit");
const taskList = document.getElementById("task-list");
const message = document.getElementById("message");
const userForm = document.getElementById("user-form");
const userName = document.getElementById("user-name");
const userList = document.getElementById("user-list");

let editingTaskId = null; // Guarda la tarea que se está editando
let users = []; // Lista de usuarios que trae el servidor

/* ==================================================
    Funciones pequeñas que ayudan al resto del código
   ================================================== */
function showMessage(text, type = "success") {
  // Muestra un mensaje al usuario en la parte superior
  message.textContent = text;
  message.className = `message message--${type}`;
}

function clearMessage() {
  // Limpia el mensaje para que no quede el texto antiguo
  message.textContent = "";
  message.className = "message";
}

function resetTaskForm() {
  // Devuelve el formulario de tarea al estado inicial
  taskForm.reset();
  editingTaskId = null;
  taskSubmitButton.textContent = "Guardar tarea";
}

function populateUserSelect() {
  // Llena el selector de usuarios en el formulario de tarea
  taskUser.innerHTML = "<option value=''>Seleccione usuario</option>";
  users.forEach(user => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    taskUser.appendChild(option);
  });
}

function renderUserList() {
  // Muestra la lista de usuarios que ya están guardados
  userList.innerHTML = "";
  if (users.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "Aún no hay usuarios registrados.";
    userList.appendChild(emptyItem);
    return;
  }

  users.forEach(user => {
    const item = document.createElement("li");
    item.textContent = user.name;
    userList.appendChild(item);
  });
}

function buildTableRow(task) {
  // Prepara una fila de la tabla para mostrar una tarea nueva
  const row = document.createElement("tr");
  const user = users.find(userItem => userItem.id === task.userId);

  row.innerHTML = `
    <td>${task.id}</td>
    <td>${task.title}</td>
    <td>${task.description}</td>
    <td>${task.status}</td>
    <td>${user ? user.name : "Sin usuario"}</td>
    <td></td>
  `;

  const actionsCell = row.querySelector("td:last-child");
  const editButton = document.createElement("button");
  editButton.textContent = "Editar";
  editButton.className = "action-button action-button--edit";
  editButton.addEventListener("click", () => editTask(task.id));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  deleteButton.className = "action-button action-button--delete";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);

  return row;
}

/* ==================================================
    Carga de datos desde la API
   ================================================== */
async function loadUsers() {
  // Trae los usuarios guardados en el servidor
  try {
    const response = await fetch(USERS_URL);
    if (!response.ok) {
      throw new Error("No se pudo cargar la lista de usuarios.");
    }

    users = await response.json();
    populateUserSelect();
    renderUserList();
  } catch (error) {
    console.error(error);
    showMessage("Error al cargar usuarios. Verifica el servidor.", "error");
  }
}

async function loadTasks() {
  // Trae las tareas guardadas en el servidor
  try {
    const response = await fetch(TASKS_URL);
    if (!response.ok) {
      throw new Error("No se pudo cargar las tareas.");
    }

    const tasks = await response.json();
    taskList.innerHTML = "";

    if (tasks.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `
        <td colspan="6" class="empty-state">No hay tareas registradas.</td>
      `;
      taskList.appendChild(emptyRow);
      return;
    }

    tasks.forEach(task => {
      taskList.appendChild(buildTableRow(task));
    });
  } catch (error) {
    console.error(error);
    showMessage("Error al cargar tareas. Verifica el servidor.", "error");
  }
}

/* ==================================================
    Registrar usuario nuevo
   ================================================== */
async function addUser(event) {
  // Evita que la página se recargue al enviar el formulario
  event.preventDefault();
  clearMessage();

  const nameValue = userName.value.trim();
  if (nameValue === "") {
    showMessage("El nombre de usuario es obligatorio.", "error");
    return;
  }

  try {
    const response = await fetch(USERS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameValue })
    });

    if (!response.ok) {
      throw new Error("No se pudo guardar el usuario.");
    }

    userForm.reset();
    await loadUsers();
    showMessage("Usuario agregado correctamente.");
  } catch (error) {
    console.error(error);
    showMessage("Error al agregar usuario.", "error");
  }
}

/* ==================================================
    Crear o actualizar tarea
   ================================================== */
async function saveTask(event) {
  // Evita que la página se recargue al enviar el formulario
  event.preventDefault();
  clearMessage();

  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();
  const status = taskStatus.value;
  const userId = parseInt(taskUser.value, 10);

  if (title === "" || description === "" || status === "" || isNaN(userId)) {
    showMessage("Completa todos los campos y selecciona un usuario.", "error");
    return;
  }

  const taskData = { title, description, status, userId };

  try {
    const url = editingTaskId ? `${TASKS_URL}/${editingTaskId}` : TASKS_URL;
    const method = editingTaskId ? "PATCH" : "POST";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      throw new Error(editingTaskId ? "No se pudo actualizar la tarea." : "No se pudo crear la tarea.");
    }

    const successMessage = editingTaskId ? "Tarea actualizada correctamente." : "Tarea creada correctamente.";
    showMessage(successMessage);
    resetTaskForm();
    await loadTasks();
  } catch (error) {
    console.error(error);
    showMessage(error.message || "Error al guardar la tarea.", "error");
  }
}

/* ==================================================
    Cargar tarea en el formulario para editar
   ================================================== */
async function editTask(id) {
  clearMessage();

  try {
    const response = await fetch(`${TASKS_URL}/${id}`);
    if (!response.ok) {
      throw new Error("No se pudo cargar la tarea para editar.");
    }

    const task = await response.json();
    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskStatus.value = task.status;
    taskUser.value = task.userId || "";
    editingTaskId = id;
    taskSubmitButton.textContent = "Actualizar tarea";
    showMessage("Edita la tarea y presiona Actualizar tarea.");
  } catch (error) {
    console.error(error);
    showMessage("Error al cargar tarea para edición.", "error");
  }
}

/* ==================================================
    Eliminar tarea
   ================================================== */
async function deleteTask(id) {
  clearMessage();

  const confirmDelete = confirm("¿Deseas eliminar esta tarea?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${TASKS_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("No se pudo eliminar la tarea.");
    }

    showMessage("Tarea eliminada correctamente.");
    resetTaskForm();
    await loadTasks();
  } catch (error) {
    console.error(error);
    showMessage("Error al eliminar la tarea.", "error");
  }
}

/* ==================================================
  Eventos y arranque de la aplicación
   ================================================== */
taskForm.addEventListener("submit", saveTask);
userForm.addEventListener("submit", addUser);

async function initApp() {
  await loadUsers();
  await loadTasks();
}

initApp();
