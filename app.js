
window.addEventListener("DOMContentLoaded", () => {
    const tareasSaved = JSON.parse(localStorage.getItem("tareas")) || []
    tareasSaved.forEach(n => {
        ui.mostrarTarea(n)
    })
})



class Tareas {
    constructor(tarea, profesor, nota) {
        if (!tarea || !profesor || !nota) {
            throw new Error ("Los campos son requeridos")
        }
        this.tarea = tarea
        this.profesor = profesor
        this.nota = nota
        this.id = crypto.randomUUID()
        
    }

}

class Interfaz {
    mostrarTarea(nuevaTarea) {
        const lista = document.getElementById("lista-tareas");
        const item = document.createElement("tr");
        item.className = "border-t border-gray-200 hover:bg-gray-50 task";
        item.dataset.id = nuevaTarea.id;
        item.innerHTML = `
        <td class="px-4 py-2">${nuevaTarea.tarea}</td>
        <td class="px-4 py-2">${nuevaTarea.profesor}</td>
        <td class="px-4 py-2 text-center">${nuevaTarea.nota}</td>
        <td class="px-4 py-2 text-center">
            <button class="eliminar-tarea bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" title="Eliminar">🗑️</button>
            <button class="editar-tarea bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" title="Editar">✏️</button>
        </td>
    `;
        lista.appendChild(item);
    }

    eliminarTarea(nuevaTarea) {
        if (nuevaTarea.target.classList.contains("eliminar-tarea")) {
            const fila = nuevaTarea.target.closest("tr");
            const id = fila.dataset.id
            fila.remove()
            eliminarDeStorage(id)
            this.mostrarMensaje("La Tarea ha sido eliminada", "bg-red-100 text-red-800 font-semibold border border-red-300 shadow-md px-4 py-2 rounded")

        }
    }

    editarTarea(nuevaTarea) {
        if (nuevaTarea.target.classList.contains("editar-tarea")) {
            const fila = nuevaTarea.target.closest('tr')
            const celdas = fila.children
            const tarea = celdas[0].textContent
            const profesor = celdas[1].textContent
            const nota = celdas[2].textContent

            document.getElementById("input-tarea").value = tarea
            document.getElementById("input-profesor").value = profesor
            document.getElementById("input-nota").value = nota
            document.getElementById("boton").textContent = "Guardar cambios";

            filaEditada = fila




        }
    }

    mostrarMensaje(mensaje, css) {
        const div = document.createElement("div")
        const container = document.querySelector(".contenedor")
        div.className = `${css} px-4 py-2 rounded mb-4 text-center`
        div.textContent = mensaje
        container.prepend(div)
        setTimeout(() => {
            div.remove()
        }, 2500);
    }
}

const ui = new Interfaz()
let filaEditada = null

//eventos dom
document.getElementById("form-task").addEventListener("submit", handleSubtmit)
function handleSubtmit(e) {
    e.preventDefault()
    const tarea = document.getElementById("input-tarea").value
    const profesor = document.getElementById("input-profesor").value
    const nota = document.getElementById("input-nota").value

    if (filaEditada) {
        actualizarTarea({ tarea, profesor, nota })

    } else {
        agregarTarea({ tarea, profesor, nota })
    }
}

function agregarTarea({ tarea, profesor, nota }) {
    const nuevaTarea = new Tareas(tarea, profesor, nota)


    ui.mostrarTarea(nuevaTarea)
    guardarLocalStorage(nuevaTarea)
    ui.mostrarMensaje("La tarea a sido agregada correctamente", "bg-green-100 text-green-800 font-semibold border border-green-300 shadow-md px-4 py-2 rounded")
}

function actualizarTarea({ tarea, profesor, nota }) {
    filaEditada.children[0].textContent = tarea
    filaEditada.children[1].textContent = profesor
    filaEditada.children[2].textContent = nota
    actualizarStorage();
    filaEditada = null
    document.getElementById("boton").textContent = "Agregar Tarea";
    document.getElementById("form-task").reset();
    ui.mostrarMensaje("Tarea actualizada correctamente", "bg-green-100 text-green-800 font-semibold border border-green-300 shadow-md px-4 py-2 rounded")
}

document.getElementById("lista-tareas").addEventListener("click", function (elementoTarea) {
    ui.eliminarTarea(elementoTarea)
    ui.editarTarea(elementoTarea)
})



function guardarLocalStorage(tarea) {
    const tareas = JSON.parse(localStorage.getItem("tareas")) || []
    console.log(tareas)
    tareas.push(tarea)
    localStorage.setItem("tareas", JSON.stringify(tareas))

}

function eliminarDeStorage(id) {
    const tareas = JSON.parse(localStorage.getItem("tareas")) || []
    const nuevas = tareas.filter(t => t.id !== id)
    localStorage.setItem("tareas", JSON.stringify(nuevas))
}

function actualizarStorage() {
    const filas = document.querySelectorAll("#lista-tareas tr")
    const tareasActuales = []
    filas.forEach(fila => {
        tareasActuales.push({
            id: fila.dataset.id,
            tarea: fila.children[0].textContent,
            profesor: fila.children[1].textContent,
            nota: fila.children[2].textContent
        })
    })

    localStorage.setItem("tareas", JSON.stringify(tareasActuales))
}