/*
 * DATOS DEL BANNER — edita aquí; no necesitas tocar HTML ni JS.
 *
 * PUEBLOS (un bloque por slide; agrega o quita bloques y todo se ajusta solo)
 *  id           identificador único sin espacios
 *  nombre       nombre que aparece sobre la foto y en la miniatura
 *  textos       textos por idioma. "es" es obligatorio. Para ofrecer el sitio en una lengua
 *               originaria agrega, por ejemplo, textos.tar = {...} y registra el idioma en IDIOMAS.
 *               Si a un idioma le falta un campo, se usa el español.
 *               En titulo/desc usa [[texto]] para resaltar con el color de acento.
 *  enlace       micrositio al que lleva el botón y el nombre en la barra de lenguas
 *  audio        (opcional) mp3 grabado en la lengua del pueblo para "Escuchar mensaje".
 *               Si está vacío se lee el texto con la voz del navegador.
 *  imagen       foto del slide (1600×788 aprox., persona a la derecha)
 *  imagenHD     (opcional) foto en alta resolución; si existe se usa en lugar de "imagen"
 *  miniatura    imagen de la miniatura inferior
 *  glifo        glifo blanco del pueblo (PNG con transparencia o SVG)
 *  colores      a: tono oscuro izquierdo · b: tono medio · acento: color de resalte
 *               btn1/btn2: degradado de la píldora y del botón
 */
window.PUEBLOS = [
  {
    id: "raramuri", nombre: "Rarámuri",
    textos: { es: {
      pill: "",
      sub: "Trámites y servicios en sus lenguas",
      titulo: "Consulta apoyos, becas y [[estancias]]",
      desc: "Educación, salud, vivienda, programas sociales y [[más...]]",
      boton: "Entrar al micrositio"
    } },
    enlace: "micrositio.html?pueblo=raramuri", audio: "",
    imagen: "assets/hero/raramuri.jpg", imagenHD: "",
    miniatura: "assets/thumbs/raramuri.jpg", glifo: "assets/glyph/raramuri.png",
    colores: { a: "#012e72", b: "#0147a0", acento: "#b97df9", btn1: "#7b51e5", btn2: "#7b5eec" }
  },
  {
    id: "tepehuan", nombre: "Tepehuan",
    textos: { es: {
      pill: "",
      sub: "Trámites y servicios en sus lenguas",
      titulo: "Consulta apoyos, becas y [[estancias]]",
      desc: "Educación, salud, vivienda, programas sociales y [[más...]]",
      boton: "Entrar al micrositio"
    } },
    enlace: "micrositio.html?pueblo=tepehuan", audio: "",
    imagen: "assets/hero/tepehuan.jpg", imagenHD: "",
    miniatura: "assets/thumbs/tepehuan.jpg", glifo: "assets/glyph/tepehuan.png",
    colores: { a: "#2a0d63", b: "#6a2bd0", acento: "#e0b4ff", btn1: "#8b45e8", btn2: "#a867f2" }
  },
  {
    id: "pima", nombre: "Pima",
    textos: { es: {
      pill: "",
      sub: "Trámites y servicios en sus lenguas",
      titulo: "Consulta apoyos, becas y [[estancias]]",
      desc: "Educación, salud, vivienda, programas sociales y [[más...]]",
      boton: "Entrar al micrositio"
    } },
    enlace: "micrositio.html?pueblo=pima", audio: "",
    imagen: "assets/hero/pima.jpg", imagenHD: "",
    miniatura: "assets/thumbs/pima.jpg", glifo: "assets/glyph/pima.png",
    colores: { a: "#04353d", b: "#0a8f9c", acento: "#86f2e0", btn1: "#0e8f9a", btn2: "#25b3b4" }
  },
  {
    id: "guarijio", nombre: "Guarijío",
    textos: { es: {
      pill: "",
      sub: "Trámites y servicios en sus lenguas",
      titulo: "Consulta apoyos, becas y [[estancias]]",
      desc: "Educación, salud, vivienda, programas sociales y [[más...]]",
      boton: "Entrar al micrositio"
    } },
    enlace: "micrositio.html?pueblo=guarijio", audio: "",
    imagen: "assets/hero/guarijio.jpg", imagenHD: "",
    miniatura: "assets/thumbs/guarijio.jpg", glifo: "assets/glyph/guarijio.png",
    colores: { a: "#4a2a00", b: "#bd7c06", acento: "#ffe08a", btn1: "#b8700a", btn2: "#d98f14" }
  },
  {
    id: "odam", nombre: "O'dam",
    textos: { es: {
      pill: "",
      sub: "Trámites y servicios en sus lenguas",
      titulo: "Consulta apoyos, becas y [[estancias]]",
      desc: "Educación, salud, vivienda, programas sociales y [[más...]]",
      boton: "Entrar al micrositio"
    } },
    enlace: "micrositio.html?pueblo=odam", audio: "",
    imagen: "assets/hero/odam.jpg", imagenHD: "",
    miniatura: "assets/thumbs/odam.jpg", glifo: "assets/glyph/odam.png",
    colores: { a: "#561506", b: "#c9481b", acento: "#ffd0a0", btn1: "#d4501f", btn2: "#e67a35" }
  }
];

/* Idiomas del sitio. Agrega { codigo: "tar", nombre: "Rarámuri", voz: "es-MX" } cuando
   existan traducciones en textos.tar de cada pueblo. */
window.IDIOMAS = [
  { codigo: "es", nombre: "Español", voz: "es-MX" }
];

window.ACCESOS = [
  { id: "tramites",  titulo: "Trámites y servicios", texto: "Conoce los requisitos",       icono: "doc" },
  { id: "modulos",   titulo: "¿Dónde acudir?",       texto: "Ubica tu módulo más cercano", icono: "pin" },
  { id: "becas",     titulo: "Becas y apoyos",       texto: "Impulsa tu educación",        icono: "beca" },
  { id: "salud",     titulo: "Salud",                texto: "Cuida tu bienestar",          icono: "salud" },
  { id: "vivienda",  titulo: "Vivienda",             texto: "Construye tu futuro",         icono: "casa" },
  { id: "programas", titulo: "Programas sociales",   texto: "Más oportunidades",           icono: "grupo" }
];

window.TEXTOS_SITIO = {
  barraLenguas: "Consulta la información en tu lengua."
};

window.CARRUSEL_CONFIG = {
  autoplay: true,
  intervaloMs: 7000,
  pausaAlInteractuar: true
};
