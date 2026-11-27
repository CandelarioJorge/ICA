const URL_PROYECTOS = "https://script.google.com/macros/s/AKfycbzaC7ce2TtqPQlpS6RvgmqhU3PPemGMFBdGDHPPBuhpYIhmuOLjEIO4sShRDL_AoBQ/exec";

export async function cargarProyectos() {
  const respuesta = await fetch(URL_PROYECTOS);

  if (!respuesta.ok) {
    throw new Error(`El API respondió con HTTP ${respuesta.status}.`);
  }

  const resultado = await respuesta.json();

  if (!resultado.ok || !Array.isArray(resultado.data)) {
    throw new Error(resultado.mensaje || "El API devolvió un formato inesperado.");
  }

  return resultado.data;
}

cargarProyectos()
  .then(proyectos => {
    // Aquí puedes generar las tarjetas y sus carruseles con Bootstrap.
    console.log("Proyectos del ICA:", proyectos);
  })
  .catch(error => {
    console.error("Error al cargar los proyectos del ICA:", error);
  });