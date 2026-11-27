import { cargarProyectos } from "./DatosProyectos.js";

const lista = document.querySelector("#lista-proyectos");
const estado = document.querySelector("#estado-proyectos");

function obtenerUrl(valor) {
  if (typeof valor !== "string" || !valor.trim()) return null;

  try {
    const url = new URL(valor, document.baseURI);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function crearImagen(url, textoAlternativo) {
  const imagen = document.createElement("img");
  imagen.className = "card-img-top media";
  const origen = new URL(url);
const archivoDrive = origen.hostname === "drive.google.com"
  ? origen.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/)
  : null;

imagen.src = archivoDrive
  ? `https://drive.google.com/thumbnail?id=${archivoDrive[1]}&sz=w1200`
  : url;
  imagen.alt = textoAlternativo;
  imagen.loading = "lazy";
  return imagen;
}

function crearCarrusel(imagenes, titulo, id) {
  const carrusel = document.createElement("div");
  carrusel.id = id;
  carrusel.className = "carousel slide";
  carrusel.setAttribute("role", "group");
  carrusel.setAttribute("aria-label", `Imágenes de ${titulo}`);

  const interior = document.createElement("div");
  interior.className = "carousel-inner";

  imagenes.forEach((url, indice) => {
    const diapositiva = document.createElement("div");
    diapositiva.className = indice === 0 ? "carousel-item active" : "carousel-item";
    diapositiva.append(crearImagen(url, `${titulo}, imagen ${indice + 1}`));
    interior.append(diapositiva);
  });

  carrusel.append(interior);

  for (const [accion, etiqueta] of [["prev", "Anterior"], ["next", "Siguiente"]]) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = `carousel-control-${accion}`;
    boton.dataset.bsTarget = `#${id}`;
    boton.dataset.bsSlide = accion;
    boton.setAttribute("aria-label", `${etiqueta} imagen de ${titulo}`);

    const icono = document.createElement("span");
    icono.className = `carousel-control-${accion}-icon bg-dark rounded`;
    icono.setAttribute("aria-hidden", "true");
    boton.append(icono);
    carrusel.append(boton);
  }

  return carrusel;
}

function crearTarjeta(proyecto, indice) {
  const { titulo, descripcion, enlaceProyecto } = proyecto;
  const imagenes = (proyecto.imagenes ?? []).map(obtenerUrl).filter(Boolean);
  const enlace = obtenerUrl(enlaceProyecto);

  const columna = document.createElement("div");
  columna.className = "col";

  const tarjeta = document.createElement("article");
  tarjeta.className = "card h-100";

  if (imagenes.length > 1) {
    tarjeta.append(crearCarrusel(imagenes, titulo, `carrusel-proyecto-${indice + 1}`));
  } else if (imagenes.length === 1) {
    tarjeta.append(crearImagen(imagenes[0], titulo));
  }

  const cuerpo = document.createElement("div");
  cuerpo.className = "card-body d-flex flex-column align-items-start p-4";

  const encabezado = document.createElement("h3");
  encabezado.className = "h5 card-title mb-2";
  encabezado.textContent = titulo;

  const texto = document.createElement("p");
  texto.className = "card-text mb-0";
  texto.textContent = descripcion ?? "";

  cuerpo.append(encabezado, texto);

  if (enlace) {
    const pie = document.createElement("div");
    pie.className = "mt-auto pt-4";

    const boton = document.createElement("a");
    boton.className = "btn btn-outline-ica px-3";
    boton.href = enlace;
    boton.textContent = "Ver proyecto";
    boton.setAttribute("aria-label", `Ver proyecto ${titulo}`);

    pie.append(boton);
    cuerpo.append(pie);
  }

  tarjeta.append(cuerpo);
  columna.append(tarjeta);
  return columna;
}

async function mostrarProyectos() {
  try {
    const proyectos = await cargarProyectos();
    lista.replaceChildren(...proyectos.map(crearTarjeta));
    lista.replaceChildren(...proyectos.map(crearTarjeta));
    lista.querySelectorAll(".carousel").forEach(carrusel => {
    const instancia = bootstrap.Carousel.getOrCreateInstance(carrusel, {
        interval: 2500,
        pause: "hover",
        ride: "carousel"
    });

    instancia.cycle();
    });
    estado.textContent = proyectos.length ? "" : "Aún no hay proyectos publicados.";
  } catch (error) {
    estado.textContent = "No se pudieron cargar los proyectos. Intenta recargar la página.";
    console.error("Error al mostrar los proyectos del ICA:", error);
  }
}

mostrarProyectos();