// =========================================
// ISSUE #2
// OBTENER TAREAS
// =========================================
//
// Esta funcion:
//
// ✔ consulta tareas
// ✔ usa GET
// ✔ muestra tareas en pantalla
//
// =========================================

async function getTasks() {

  // Consultar API
  const response =
    await fetch(URL);

  // Convertir JSON
  const tasks =
    await response.json();

  console.log(tasks);

  // Limpiar lista
  taskList.innerHTML = "";

  // Recorrer tareas
  tasks.forEach(task => {

    // Crear elemento
    const li =
      document.createElement("li");

    // Mostrar tarea
    li.textContent =
      task.title;

    // Insertar en DOM
    taskList.appendChild(li);

  });

}

// =========================================
// CARGAR TAREAS
// =========================================

getTasks();

// =========================================
// ISSUE #3
// CREAR TAREA
// =========================================
//
// Esta funcion:
//
// ✔ captura formulario
// ✔ valida input
// ✔ envia POST
// ✔ actualiza DOM
//
// =========================================

async function createTask(event) {

  // Evitar recarga
  event.preventDefault();

  // Obtener valor input
  const title =
    taskTitle.value.trim();

  // Validar vacio
  if (title === "") {

    message.textContent =
      "La tarea es obligatoria";

    return;
  }

  // Crear objeto
  const newTask = {

    title: title

  };

  // Enviar POST
  await fetch(URL, {

    method: "POST",

    headers: {

      "Content-Type":
        "application/json"

    },

    body:
      JSON.stringify(newTask)

  });

  // Mensaje exito
  message.textContent =
    "Tarea creada";

  // Limpiar input
  taskTitle.value = "";

  // Actualizar lista
  getTasks();

}



// =========================================
// EVENTO FORMULARIO
// =========================================

taskForm.addEventListener(
  "submit",
  createTask
);

// Validar input vacio
if (title === "") {

  message.textContent =
    "Debe ingresar una tarea";

  message.style.color =
    "red";

  return;
}