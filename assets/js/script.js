let todosLosPersonajes = [];
let resultados;

function limpiarResultados() {
  resultados.innerHTML = "";
}

function mostrarPersonajes(personajes) {
  limpiarResultados();

  personajes.forEach(personaje => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "col-md-4 mb-4";
    tarjeta.innerHTML = `
      <div class="card h-100 shadow">
        <img src="${personaje.image}" class="card-img-top" alt="${personaje.name}">
        <div class="card-body">
          <h5 class="card-title">${personaje.name}</h5>
          <p class="card-text"><strong>Raza:</strong> ${personaje.race}</p>
          <p class="card-text"><strong>Género:</strong> ${personaje.gender}</p>
        </div>
      </div>
    `;
    resultados.appendChild(tarjeta);
  });
}

function mostrarMensaje(texto) {
  const mensajes = document.getElementById("mensajes");
  mensajes.innerHTML = `
    <div class="alert alert-danger mt-3 mb-0" role="alert">
      ${texto}
    </div>
  `;
}

function limpiarMensajes() {
  const mensajes = document.getElementById("mensajes");
  mensajes.innerHTML = "";
}

async function obtenerPersonajes() {
  try {
    const respuesta = await fetch("https://dragonball-api.com/api/characters");
    const data = await respuesta.json();
    todosLosPersonajes = data.items;
    mostrarPersonajes(todosLosPersonajes);
  } catch (error) {
    mostrarMensaje("Error al obtener personajes.");
    console.error(error);
  }
}

async function buscarPersonajes(nombre) {
  try {
    const respuesta = await fetch(`https://dragonball-api.com/api/characters?name=${nombre}`);
    const data = await respuesta.json();

    if (!data || data.length === 0) {
      mostrarMensaje("No se encontraron personajes con ese nombre.");
    } else {
      mostrarPersonajes(data);
    }
  } catch (error) {
    mostrarMensaje("Ocurrió un error al consultar la API.");
    console.error("Error al buscar personajes:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const busqueda = document.getElementById("inputNombre");
  const botonBuscar = document.getElementById("buscar");
  const botonLimpiar = document.getElementById("limpiar");
  resultados = document.getElementById("resultados");

  let mensajes = document.createElement("div");
  mensajes.id = "mensajes";
  botonBuscar.parentNode.parentNode.appendChild(mensajes);

  botonBuscar.addEventListener("click", () => {
    limpiarMensajes();

    const nombre = busqueda.value.trim();
    if (nombre === "") {
      mostrarMensaje("Por favor, ingresá un nombre para buscar.");
    } else {
      buscarPersonajes(nombre);
    }
  });

  botonLimpiar.addEventListener("click", () => {
    limpiarMensajes();
    busqueda.value = "";
    mostrarPersonajes(todosLosPersonajes); 
  });

  obtenerPersonajes(); 
});
