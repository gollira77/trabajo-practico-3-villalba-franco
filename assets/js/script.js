let todosLosPersonajes = [];
let resultados;

function limpiarResultados() {
  resultados.innerHTML = "";
}

function mostrarPersonajes(personajes) {
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
    limpiarResultados();
    mostrarPersonajes(todosLosPersonajes);
  } catch (error) {
    mostrarMensaje("Error al obtener personajes.");
    console.error(error);
  }
}

function buscarPersonajes(nombre) {
  limpiarMensajes();
  limpiarResultados();

  const nombreBuscado = nombre.toLowerCase();

  const personajesFiltrados = todosLosPersonajes.filter(personaje =>
    personaje.name.toLowerCase().includes(nombreBuscado)
  );

  if (personajesFiltrados.length === 0) {
    mostrarMensaje("No se encontraron personajes con ese nombre.");
  } else {
    mostrarPersonajes(personajesFiltrados);
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
    const nombre = busqueda.value.trim();
    if (nombre === "") {
      limpiarMensajes();
      mostrarMensaje("Por favor, ingresá un nombre para buscar.");
    } else {
      buscarPersonajes(nombre);
    }
  });

  botonLimpiar.addEventListener("click", () => {
    limpiarMensajes();
    busqueda.value = "";
    limpiarResultados();
    mostrarPersonajes(todosLosPersonajes);
  });

  obtenerPersonajes();
});
