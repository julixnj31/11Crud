const URL =
  "http://localhost:3000/tasks";



/* ISSUE #1
 SELECCIONAR ELEMENTOS DEL DOM


 Aqui obtenemos:

 ✔ formulario
 ✔ inputs
 ✔ tabla
 ✔ mensajes
*/

const taskForm =
  document.getElementById("task-form");

const taskTitle =
  document.getElementById("task-title");

const taskDescription =
  document.getElementById("task-description");

const taskStatus =
  document.getElementById("task-status");

const taskList =
  document.getElementById("task-list");

const message =
  document.getElementById("message");


/* ISSUE #2
/ OBTENER TAREAS (READ)
 Esta funcion:
 ✔ consulta tareas
 ✔ usa GET
 ✔ actualiza DOM
*/
async function getTasks() {

  try {

    // Consultar API
    const response =
      await fetch(URL);

    // Convertir JSON
    const tasks =
      await response.json();

    // Limpiar tabla
    taskList.innerHTML = "";

    // Recorrer tareas
    tasks.forEach(task => {

      // Crear fila
      const row =
        document.createElement("tr");

      // Insertar contenido
      row.innerHTML = `

        <td>${task.id}</td>

        <td>${task.title}</td>

        <td>${task.description}</td>

        <td>${task.status}</td>

        <td>

          <!-- ISSUE #5 -->
          <!-- BOTON EDITAR -->

          <button
            onclick="editTask(${task.id})"
          >
            Editar
          </button>
          <!-- ISSUE #6 -->
          <!-- BOTON ELIMINAR -->
          <button
            onclick="deleteTask(${task.id})"
          >
            Eliminar
          </button>

        </td>
      `;
      // Insertar fila
      taskList.appendChild(row);
    });

  } catch (error) {
    // ISSUE #9
    // MANEJO ERRORES
    console.log(error);
    message.textContent =
      "Error al cargar tareas";

  }

}

/* ISSUE #3
 CREAR TAREA (CREATE)
 Esta funcion:
 ✔ captura submit
 ✔ valida campos
 ✔ envia POST
 ✔ actualiza DOM
*/


async function createTask(event) {

  // Evitar recarga
  event.preventDefault();

  // Obtener valores
  const title =
    taskTitle.value.trim();

  const description =
    taskDescription.value.trim();

  const status =
    taskStatus.value;

  // ISSUE #4
  // VALIDACIONES
 
  if (title === "") {

    message.textContent =
      "El titulo es obligatorio";

    return;
  }

  if (description === "") {

    message.textContent =
      "La descripcion es obligatoria";

    return;
  }

  if (status === "") {

    message.textContent =
      "Seleccione un estado";

    return;
  }

  try {

    // Crear objeto
    const newTask = {

      title,
      description,
      status

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

    // ISSUE #8
    // MENSAJE EXITO

    message.textContent =
      "Tarea creada correctamente";

    // Limpiar formulario
    taskForm.reset();

    // ISSUE #7
    // ACTUALIZAR DOM

    getTasks();

  } catch (error) {

    console.log(error);

    message.textContent =
      "Error al crear tarea";

  }

}



/* ISSUE #5
 EDITAR TAREA (UPDATE)
 Esta funcion:

 ✔ modifica tarea
 ✔ usa PATCH
 ✔ actualiza DOM
*/
async function editTask(id) {

  // Pedir nuevo titulo
  const newTitle =
    prompt(
      "Nuevo titulo"
    );

  // Validar
  if (!newTitle) return;

  try {

    // Actualizar API
    await fetch(`${URL}/${id}`, {

      method: "PATCH",

      headers: {

        "Content-Type":
          "application/json"

      },

      body:
        JSON.stringify({

          title: newTitle

        })

    });

    // Mensaje
    message.textContent =
      "Tarea actualizada";

    // Actualizar DOM
    getTasks();

  } catch (error) {

    console.log(error);

    message.textContent =
      "Error al actualizar";

  }

}

/*ISSUE #6
 ELIMINAR TAREA (DELETE)
 Esta funcion:

✔ elimina tarea
 ✔ usa DELETE
 ✔ actualiza DOM
*/

async function deleteTask(id) {

  // Confirmar
  const confirmDelete =
    confirm(
      "¿Eliminar tarea?"
    );

  // Cancelar
  if (!confirmDelete) return;

  try {
    // Enviar DELETE
    await fetch(`${URL}/${id}`, {
      method: "DELETE"
    });
    // Mensaje
    message.textContent =
      "Tarea eliminada";

    // Actualizar DOM
    getTasks();

  } catch (error) {
    console.log(error);
    message.textContent =
      "Error al eliminar";

  }

}

/*ISSUE #3
 EVENTO SUBMIT
*/

taskForm.addEventListener(
  "submit",
  createTask
);



/* ISSUE #13
 
 VALIDACION FINAL CRUD

 ✔ CREATE
 ✔ READ
 ✔ UPDATE
 ✔ DELETE
 ✔ DOM DINAMICO
 ✔ FETCH
 ✔ VALIDACIONES
 ✔ MENSAJES

*/

getTasks();