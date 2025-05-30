let todosLosPersonajes = [];
let resultados;
let modalPersonaje;
let modalContenido;
let personajesPorPagina = 20;
let paginaActual = 1;
let cargando = false;
let ultimaPagina = false;
let filtroActivo = false;
let personajesFiltrados = [];

function limpiarResultados() {
  resultados.innerHTML = "";
  paginaActual = 1;
  ultimaPagina = false;
}

function traducirAfiliacion(afiliacion) {
  switch (afiliacion) {
    case 'Z Fighter': return 'Luchador Z';
    case 'Frieza Force': return 'Fuerza Freezer';
    case 'God of Destruction': return 'Dios de la Destrucción';
    default: return afiliacion || 'Desconocida';
  }
}

function mostrarPersonajes(personajes) {
  const inicio = (paginaActual - 1) * personajesPorPagina;
  const fin = inicio + personajesPorPagina;
  const personajesAMostrar = personajes.slice(inicio, fin);

  personajesAMostrar.forEach(personaje => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "col-md-3 mb-4";
    tarjeta.innerHTML = `
      <div class="tarjeta-personaje" style="cursor:pointer;">
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

    tarjeta.querySelector(".tarjeta-personaje").addEventListener("click", () => {
      abrirModalPersonaje(personaje);
    });

    resultados.appendChild(tarjeta);
  });

  if (fin >= personajes.length) {
    ultimaPagina = true;
  } else {
    paginaActual++;
  }
}

function mostrarMensaje(texto) {
  const mensajes = document.getElementById("mensajes");
  mensajes.innerHTML = `
    <div class="alert alert-danger mt-3 mb-0" role="alert">${texto}</div>
  `;
}

function limpiarMensajes() {
  document.getElementById("mensajes").innerHTML = "";
}

function aplicarFiltros() {
  limpiarMensajes();
  limpiarResultados();

  const kiMin = Number(document.getElementById("kiMin").value) || 0;
  const kiMax = Number(document.getElementById("kiMax").value) || Infinity;
  const afiliacionFiltro = document.getElementById("afiliacion").value.trim().toLowerCase();

  personajesFiltrados = todosLosPersonajes.filter(p => {
    const kiOk = p.ki >= kiMin && p.ki <= kiMax;
    const afiliacionOk = afiliacionFiltro === "" ||
      (p.affiliation && p.affiliation.toLowerCase().includes(afiliacionFiltro));
    return kiOk && afiliacionOk;
  });

  if (personajesFiltrados.length === 0) {
    mostrarMensaje("No se encontraron personajes con esos filtros.");
  } else {
    filtroActivo = true;
    mostrarPersonajes(personajesFiltrados);
  }
}

async function obtenerTodosLosPersonajes() {
  let pagina = 1;
  let personajes = [];
  let continuar = true;

  while (continuar) {
    try {
      const respuesta = await fetch(`https://dragonball-api.com/api/characters?limit=20&page=${pagina}`);
      const data = await respuesta.json();

      if (data.items.length === 0) {
        continuar = false;
      } else {
        personajes = personajes.concat(data.items);
        pagina++;
      }
    } catch (error) {
      mostrarMensaje("Error al obtener personajes.");
      console.error(error);
      continuar = false;
    }
  }

  return personajes;
}

function buscarPersonajes(nombre) {
  limpiarMensajes();
  limpiarResultados();

  const nombreBuscado = nombre.toLowerCase();
  personajesFiltrados = todosLosPersonajes.filter(p =>
    p.name.toLowerCase().includes(nombreBuscado)
  );

  if (personajesFiltrados.length === 0) {
    mostrarMensaje("No se encontraron personajes con ese nombre.");
  } else {
    filtroActivo = true;
    mostrarPersonajes(personajesFiltrados);
  }
}

function abrirModalPersonaje(personaje) {
  modalContenido.innerHTML = `
    <div class="row">
      <div class="col-md-5 text-center mb-3">
        <img src="${personaje.image}" alt="${personaje.name}" class="img-fluid rounded" />
      </div>
      <div class="col-md-7">
        <h3>${personaje.name}</h3>
        <p><strong>Raza:</strong> ${personaje.race || "Desconocida"}</p>
        <p><strong>Género:</strong> ${personaje.gender === 'Male' ? 'Masculino' : 'Femenino'}</p>
        <p><strong>KI base:</strong> ${personaje.ki}</p>
        <p><strong>KI total:</strong> ${personaje.maxKi}</p>
        <p><strong>Afiliación:</strong> ${traducirAfiliacion(personaje.affiliation)}</p>
        <p><strong>Descripción:</strong> ${personaje.description || 'No disponible'}</p>
      </div>
    </div>
  `;

  modalPersonaje.show();
}

document.addEventListener("DOMContentLoaded", async () => {
  const busqueda = document.getElementById("inputNombre");
  const botonBuscar = document.getElementById("buscar");
  const botonLimpiar = document.getElementById("limpiar");
  resultados = document.getElementById("resultados");

  const mensajes = document.createElement("div");
  mensajes.id = "mensajes";
  botonBuscar.parentNode.parentNode.appendChild(mensajes);

  modalPersonaje = new bootstrap.Modal(document.getElementById('modalPersonaje'));
  modalContenido = document.getElementById('modalContenido');

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
    document.getElementById("kiMin").value = "";
    document.getElementById("kiMax").value = "";
    document.getElementById("afiliacion").value = "";
    limpiarResultados();
    filtroActivo = false;
    mostrarPersonajes(todosLosPersonajes);
  });

  document.getElementById("aplicarFiltro").addEventListener("click", aplicarFiltros);

  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !ultimaPagina) {
      if (filtroActivo) {
        mostrarPersonajes(personajesFiltrados);
      } else {
        mostrarPersonajes(todosLosPersonajes);
      }
    }
  });

  todosLosPersonajes = await obtenerTodosLosPersonajes();
  mostrarPersonajes(todosLosPersonajes);
});
