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