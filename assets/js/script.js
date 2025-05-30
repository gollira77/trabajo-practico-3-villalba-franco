document.addEventListener("DOMContentLoaded", () => {
  const busqueda = document.getElementById("inputNombre");
  const boton = document.getElementById("buscar");

  let mensajes = document.createElement("div");
  mensajes.id = "mensajes";
  boton.parentNode.parentNode.appendChild(mensajes);

  function mostrarMensaje(texto) {
    mensajes.innerHTML = `
      <div class="alert alert-danger mt-3 mb-0" role="alert">
        ${texto}
      </div>
    `;
  }

  function limpiar() {
    mensajes.innerHTML = "";
  }

  boton.addEventListener("click", () => {
    limpiar();

    const nombre = busqueda.value.trim();

    if (nombre === "") {
      mostrarMensaje("Por favor, ingresá un nombre para buscar.");
    } else {
      mostrarMensaje("Ocurrió un error al consultar la api");
    }
  });
});
