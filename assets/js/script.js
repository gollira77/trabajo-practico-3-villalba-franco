let todosLosPersonajes = [];
let resultados;

function limpiarResultados() {
  resultados.innerHTML = "";
}

function traducirAfiliacion(afiliacion) {
  switch (afiliacion) {
    case 'Z Fighter':
      return 'Luchador Z';
    case 'Frieza Force':
      return 'Fuerza Freezer';
    case 'God of Destruction':
      return 'Dios de la Destrucción';
    default:
      return afiliacion || 'Desconocida';
  }
}

function mostrarPersonajes(personajes) {
  personajes.forEach(personaje => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "col-md-3 mb-4";
    tarjeta.innerHTML = `
  <div class="tarjeta-personaje">
    <img src="${personaje.image}" alt="${personaje.name}" />
    <div class="contenido">
      <h5 class="fw-bold">${personaje.name}</h5>
      <p class="text-warning">${personaje.race} - ${personaje.gender === 'Male' ? 'Masculino' : 'Femenino'}</p>
      <p><strong>KI base:</strong> <span class="text-warning">${personaje.ki}</span></p>
      <p><strong>KI total:</strong> <span class="text-warning">${personaje.maxKi}</span></p>
      <p><strong>Afiliación:</strong> <span class="text-warning">${traducirAfiliacion(personaje.affiliation)}</span></p><br>
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

function aplicarFiltros() {
  limpiarMensajes();
  limpiarResultados();

  const kiMin = Number(document.getElementById("kiMin").value) || 0;
  const kiMax = Number(document.getElementById("kiMax").value) || Infinity;
  const afiliacionFiltro = document.getElementById("afiliacion").value.trim().toLowerCase();

  const filtrados = todosLosPersonajes.filter(p => {
    const kiOk = p.ki >= kiMin && p.ki <= kiMax;
    const afiliacionOk = afiliacionFiltro === "" || 
      (p.affiliation && p.affiliation.toLowerCase().includes(afiliacionFiltro));
    return kiOk && afiliacionOk;
  });

  if (filtrados.length === 0) {
    mostrarMensaje("No se encontraron personajes con esos filtros.");
  } else {
    mostrarPersonajes(filtrados);
  }
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

  document.getElementById("aplicarFiltro").addEventListener("click", aplicarFiltros);

  obtenerPersonajes();
});
