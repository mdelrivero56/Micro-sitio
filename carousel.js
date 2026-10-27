(function () {
  "use strict";

  var DATA = window.PUEBLOS || [];
  var IDIOMAS = window.IDIOMAS && window.IDIOMAS.length ? window.IDIOMAS : [{ codigo: "es", nombre: "Español", voz: "es-MX" }];
  var CFG = Object.assign({ autoplay: true, intervaloMs: 7000, pausaAlInteractuar: true }, window.CARRUSEL_CONFIG);
  var MICRO = document.body.getAttribute("data-modo") === "micrositio";
  if (MICRO) CFG.autoplay = false;
  var $ = function (id) { return document.getElementById(id); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var ICONS = {
    arrow: '<svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M3 9.500v5h3.500L11 18.500v-13L6.500 9.500H3zm10.500-1.800v8.600a4.300 4.300 0 0 0 0-8.600zm0-3.500v1.900a8.400 8.400 0 0 1 0 12.400v1.900a10.300 10.300 0 0 0 0-16.200z"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M6 2h8l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm7 1.500V8h4.500zM8 12.500h8v1.500H8zm0 3.500h8v1.500H8zm0-7h3v1.500H8z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 1.500a7.500 7.500 0 0 0-7.500 7.500c0 5.600 7.500 13.500 7.500 13.500S19.500 14.600 19.500 9A7.500 7.500 0 0 0 12 1.500zm0 10.500a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>',
    beca: '<svg viewBox="0 0 24 24"><path d="M12 3L1 8.500l11 5.500 9-4.500V16h2V8.500L12 3zM5 13.200V17c0 1.600 3.100 3 7 3s7-1.400 7-3v-3.800l-7 3.500-7-3.500z"/></svg>',
    salud: '<svg viewBox="0 0 24 24"><path d="M12 21.500l-1.400-1.300C5.400 15.500 2 12.400 2 8.600 2 5.500 4.400 3 7.500 3c1.700 0 3.400.8 4.500 2.100C13.100 3.800 14.800 3 16.500 3 19.600 3 22 5.500 22 8.600c0 3.800-3.400 6.900-8.600 11.600L12 21.500zM7 11.800h3l1.500-2.800 2 5 1.300-2.200H17v-1.500h-2.800l-.7 1.200-2-5-2 3.600H7z" fill-rule="evenodd"/></svg>',
    casa: '<svg viewBox="0 0 24 24"><path d="M12 2.500L1.500 12H5v9h5.500v-6h3v6H19v-9h3.500z"/></svg>',
    grupo: '<svg viewBox="0 0 24 24"><path d="M9 11.500a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7zm7.500.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 13.500c-3.300 0-7 1.700-7 4.200V20h14v-2.300c0-2.500-3.700-4.200-7-4.200zm7.500.5c-.5 0-1 0-1.600.1 1.500 1 2.600 2.400 2.600 4V20H23v-2c0-2.200-3.500-4-6.500-4z"/></svg>'
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function rich(s) { return esc(s).replace(/\[\[(.+?)\]\]/g, '<span class="hl">$1</span>'); }
  function plain(s) { return String(s || "").replace(/\[\[|\]\]/g, ""); }

  /* ---------- Idioma ---------- */
  var lang = store.get("cp-lang");
  if (!IDIOMAS.some(function (i) { return i.codigo === lang; })) lang = IDIOMAS[0].codigo;
  function T(p, k) {
    var t = p.textos || {};
    return (t[lang] && t[lang][k]) || (t.es && t.es[k]) || "";
  }
  function vozActual() { return (IDIOMAS.filter(function (i) { return i.codigo === lang; })[0] || {}).voz || "es-MX"; }

  var selIdioma = $("selIdioma");
  IDIOMAS.forEach(function (i) { var o = document.createElement("option"); o.value = i.codigo; o.textContent = i.nombre; selIdioma.appendChild(o); });
  selIdioma.value = lang;
  document.documentElement.lang = lang === "es" ? "es" : lang;

  /* ---------- Estructura ---------- */
  var viewport = $("viewport"), dotsEl = $("dots"), thumbsEl = $("thumbs"), carousel = $("carousel");
  var live = $("liveStatus"), btnPlay = $("btnPlay"), langbar = $("langbar");
  var slides = [], dots = [], thumbs = [], current = -1;

  function buildSlide(p, i) {
    var c = p.colores || {};
    var s = document.createElement("article");
    s.className = "slide"; s.id = "slide-" + p.id;
    s.setAttribute("role", "group"); s.setAttribute("aria-roledescription", "diapositiva");
    s.setAttribute("aria-label", (i + 1) + " de " + DATA.length + ": " + p.nombre);
    ["a", "b", "acento", "btn1", "btn2"].forEach(function (k) { if (c[k]) s.style.setProperty("--" + k, c[k]); });
    s.innerHTML =
      '<div class="photo"><img alt="Persona del pueblo ' + esc(p.nombre) + '" decoding="async"></div>' +
      '<div class="badge">' + (p.glifo ? '<img alt="" src="' + esc(p.glifo) + '">' : "") + esc(p.nombre) + "</div>" +
      '<div class="body">' +
        '<span class="pill" data-t="pill"></span>' +
        '<p class="sub" data-t="sub"></p>' +
        '<h2 class="title" data-t="titulo"></h2>' +
        '<p class="desc" data-t="desc"></p>' +
        '<div class="cta-row">' +
          '<a class="cta" href="' + esc(p.enlace) + '"><span class="cta__ico">' + ICONS.arrow + '</span><span class="cta__sep"></span><span data-t="boton"></span></a>' +
          '<button type="button" class="listen" data-listen="' + i + '" aria-label="Escuchar mensaje">' + ICONS.sound + '<span class="tip">Escuchar mensaje</span></button>' +
        "</div>" +
      "</div>";
    var img = s.querySelector(".photo img"), photo = s.querySelector(".photo");
    var fallback = function () { img.onerror = function () { img.remove(); photo.classList.add("is-empty"); }; img.src = p.imagen; };
    if (p.imagenHD) { img.onerror = fallback; img.src = p.imagenHD; } else fallback();
    return s;
  }

  function fillTexts() {
    slides.forEach(function (s, i) {
      var p = DATA[i];
      s.querySelectorAll("[data-t]").forEach(function (el) {
        var k = el.getAttribute("data-t"), v = T(p, k);
        if (k === "titulo" || k === "desc") el.innerHTML = rich(v); else el.textContent = v;
        if (k === "pill") el.hidden = !v;
      });
    });
    langbar.innerHTML = "";
    var st = document.createElement("strong"); st.textContent = (window.TEXTOS_SITIO || {}).barraLenguas || ""; langbar.appendChild(st);
    DATA.forEach(function (p, i) {
      var a = document.createElement("a"); a.href = p.enlace; a.textContent = p.nombre;
      langbar.appendChild(a);
    });
  }

  DATA.forEach(function (p, i) {
    var s = buildSlide(p, i); viewport.appendChild(s); slides.push(s);

    var d = document.createElement("button");
    d.type = "button"; d.className = "dot"; d.setAttribute("role", "tab"); d.setAttribute("aria-label", "Ir a " + p.nombre);
    d.addEventListener("click", function () { go(i, "user"); });
    dotsEl.appendChild(d); dots.push(d);

    var li = document.createElement("li"), b = document.createElement("button");
    b.type = "button"; b.className = "thumb"; b.setAttribute("aria-label", p.nombre);
    b.style.setProperty("--tb", (p.colores && p.colores.btn1) || "#7b51e5");
    b.innerHTML = '<img alt="" loading="lazy" src="' + esc(p.miniatura) + '">';
    b.addEventListener("click", function () { go(i, "user"); });
    li.appendChild(b); thumbsEl.appendChild(li); thumbs.push(b);
  });

  var quick = $("quick");
  (window.ACCESOS || []).forEach(function (a) {
    quick.insertAdjacentHTML("beforeend",
      '<a class="qcard" href="micrositio.html?seccion=' + esc(a.id) + '">' + (ICONS[a.icono] || "") +
      "<strong>" + esc(a.titulo) + "</strong><span>" + esc(a.texto) + "</span></a>");
  });

  fillTexts();
  if (!DATA.length) return;

  /* ---------- Navegación ---------- */
  var playing = CFG.autoplay, hover = false, listening = false, timerId = null;
  var motionOff = false;

  function go(next, origin) {
    var n = ((next % DATA.length) + DATA.length) % DATA.length;
    if (n === current) { schedule(); return; }
    var dir = origin === "prev" ? -1 : 1;
    var prev = current >= 0 ? slides[current] : null, nxt = slides[n];
    slides.forEach(function (s) { s.classList.remove("is-leaving", "to-right"); });
    if (prev) {
      prev.classList.remove("is-active"); prev.classList.add("is-leaving");
      if (dir < 0) prev.classList.add("to-right");
      setTimeout(function () { prev.classList.remove("is-leaving", "to-right"); }, 720);
    }
    nxt.classList.add("is-active");
    slides.forEach(function (s, k) { s.setAttribute("aria-hidden", k === n ? "false" : "true"); s.inert = k !== n; });
    dots.forEach(function (d, k) { d.setAttribute("aria-selected", k === n ? "true" : "false"); d.tabIndex = k === n ? 0 : -1; });
    thumbs.forEach(function (t, k) { if (k === n) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current"); });
    [].forEach.call(langbar.querySelectorAll("a"), function (a, k) { if (k === n) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
    var t = thumbs[n];
    if (t && matchMedia("(max-width:900px)").matches) {
      var wrap = thumbsEl; wrap.scrollTo({ left: t.parentNode.offsetLeft - (wrap.clientWidth - t.offsetWidth) / 2, behavior: "smooth" });
    }
    stopSpeech(true);
    current = n;
    live.textContent = origin === "auto" || origin === "init" ? "" : "Pueblo " + DATA[n].nombre + ", " + (n + 1) + " de " + DATA.length;
    if (window.cpOnChange) window.cpOnChange(DATA[n], n, origin);
    schedule();
  }

  /* ---------- Rotación automática (pausable) ---------- */
  function canRun() { return playing && !hover && !listening && !document.hidden && !motionOff; }
  function schedule() {
    clearTimeout(timerId);
    if (canRun()) timerId = setTimeout(function () { go(current + 1, "auto"); }, CFG.intervaloMs);
  }
  function setPlaying(v) {
    playing = v;
    btnPlay.textContent = v ? "Pausar" : "Reanudar";
    btnPlay.setAttribute("aria-label", v ? "Pausar rotación automática" : "Reanudar rotación automática");
    schedule();
  }
  btnPlay.addEventListener("click", function () { setPlaying(!playing); });
  if (CFG.pausaAlInteractuar) {
    carousel.addEventListener("mouseenter", function () { hover = true; clearTimeout(timerId); });
    carousel.addEventListener("mouseleave", function () { hover = false; schedule(); });
    carousel.addEventListener("focusin", function () { hover = true; clearTimeout(timerId); });
    carousel.addEventListener("focusout", function () { hover = false; schedule(); });
  }
  document.addEventListener("visibilitychange", schedule);

  /* ---------- Botones ---------- */
  var prev = function () { go(current - 1, "prev"); }, next = function () { go(current + 1, "user"); };
  $("btnPrev").addEventListener("click", prev); $("btnNext").addEventListener("click", next);
  $("thumbPrev").addEventListener("click", prev); $("thumbNext").addEventListener("click", next);
  carousel.addEventListener("keydown", function (e) {
    var k = e.key;
    if (k === "ArrowLeft") { prev(); e.preventDefault(); }
    else if (k === "ArrowRight") { next(); e.preventDefault(); }
    else if (k === "Home") { go(0, "user"); e.preventDefault(); }
    else if (k === "End") { go(DATA.length - 1, "user"); e.preventDefault(); }
  });
  var sx = 0, sy = 0, tracking = false;
  viewport.addEventListener("touchstart", function (e) { var t = e.touches[0]; sx = t.clientX; sy = t.clientY; tracking = true; }, { passive: true });
  viewport.addEventListener("touchend", function (e) {
    if (!tracking) return; tracking = false;
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) next(); else prev(); }
  }, { passive: true });

  /* ---------- Escuchar mensaje ---------- */
  var audioEl = null, activeBtn = null;
  function stopSpeech(silent) {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    if (audioEl) { audioEl.pause(); audioEl = null; }
    if (activeBtn) activeBtn.classList.remove("is-playing");
    $("btnEscuchar").setAttribute("aria-pressed", "false");
    activeBtn = null; listening = false; if (!silent) schedule();
  }
  function speak(i) {
    var btn = slides[i].querySelector("[data-listen]");
    var same = listening && activeBtn === btn;
    stopSpeech(true); if (same) { schedule(); return; }
    var p = DATA[i]; activeBtn = btn; listening = true; clearTimeout(timerId);
    btn.classList.add("is-playing"); $("btnEscuchar").setAttribute("aria-pressed", "true");
    var done = function () { if (activeBtn === btn) stopSpeech(); };
    if (p.audio) {
      audioEl = new Audio(p.audio); audioEl.addEventListener("ended", done); audioEl.addEventListener("error", done);
      audioEl.play().catch(done);
    } else if ("speechSynthesis" in window) {
      var u = new SpeechSynthesisUtterance([T(p, "sub"), plain(T(p, "titulo")), plain(T(p, "desc"))].join(". "));
      u.lang = vozActual(); u.onend = done; u.onerror = done; speechSynthesis.speak(u);
    } else done();
  }
  viewport.addEventListener("click", function (e) {
    var b = e.target.closest("[data-listen]"); if (b) speak(+b.getAttribute("data-listen"));
  });
  $("btnEscuchar").addEventListener("click", function () { speak(current); });

  /* ---------- Idioma ---------- */
  selIdioma.addEventListener("change", function () {
    lang = selIdioma.value; store.set("cp-lang", lang);
    document.documentElement.lang = lang; stopSpeech(true); fillTexts();
    live.textContent = "Idioma: " + selIdioma.options[selIdioma.selectedIndex].text;
  });

  /* ---------- Accesibilidad ---------- */
  var btnAcc = $("btnAcc"), panel = $("panelAcc");
  function closePanel() { panel.hidden = true; btnAcc.setAttribute("aria-expanded", "false"); }
  btnAcc.addEventListener("click", function (e) {
    e.stopPropagation();
    var open = panel.hidden; panel.hidden = !open; btnAcc.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", function (e) { if (!panel.hidden && !panel.contains(e.target)) closePanel(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { closePanel(); btnAcc.focus(); } });

  var zoom = parseFloat(store.get("cp-zoom")) || 1;
  function applyZoom(z) {
    zoom = Math.max(0.9, Math.min(1.3, Math.round(z * 100) / 100));
    document.documentElement.style.setProperty("--z", zoom); store.set("cp-zoom", zoom);
  }
  applyZoom(zoom);
  $("txtMas").addEventListener("click", function () { applyZoom(zoom + 0.1); });
  $("txtMenos").addEventListener("click", function () { applyZoom(zoom - 0.1); });
  $("txtReset").addEventListener("click", function () { applyZoom(1); });

  var optC = $("optContraste"), optM = $("optMovimiento");
  function applyContrast(v) { document.body.classList.toggle("hc", v); optC.checked = v; store.set("cp-hc", v ? "1" : "0"); }
  function applyMotion(off) {
    motionOff = off; document.body.classList.toggle("no-motion", off); optM.checked = off; store.set("cp-nomotion", off ? "1" : "0");
    if (off) { clearTimeout(timerId); stopSpeech(true); } else schedule();
  }
  optC.addEventListener("change", function () { applyContrast(optC.checked); });
  optM.addEventListener("change", function () { applyMotion(optM.checked); });
  applyContrast(store.get("cp-hc") === "1");
  applyMotion(store.get("cp-nomotion") === "1" || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches));

  /* ---------- Ayuda ---------- */
  var dlg = $("dlgAyuda");
  $("btnAyuda").addEventListener("click", function () { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); });

  /* ---------- Inicio (admite index.html#pueblo=pima) ---------- */
  function fromHash() {
    var m = location.hash.match(/pueblo=([\w-]+)/) || location.search.match(/pueblo=([\w-]+)/); if (!m) return -1;
    return DATA.findIndex(function (p) { return p.id === m[1]; });
  }
  btnPlay.textContent = playing ? "Pausar" : "Reanudar";
  var start = fromHash(); if (start < 0) start = 0;
  slides.forEach(function (s) { s.classList.add("no-anim"); });
  go(start, "init");
  requestAnimationFrame(function () { requestAnimationFrame(function () { slides.forEach(function (s) { s.classList.remove("no-anim"); }); }); });
  window.addEventListener("hashchange", function () { var k = fromHash(); if (k >= 0) go(k, "user"); });
})();
