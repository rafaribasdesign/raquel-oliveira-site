/* ==========================================================
   CONFIGURAÇÃO — preencha aqui e o site inteiro atualiza.
   ========================================================== */
const CONFIG = {
  whatsapp: "77981269119",            // só números com DDD, ex.: "77999999999" (sem +55)
  instagram: "psicomquel",           // sem @, ex.: "raqueloliveira.psi"
  mensagem: "Olá, Raquel! Vim pelo site e gostaria de saber mais sobre o atendimento."
};

(function () {
  "use strict";

  /* ---- Links de WhatsApp ---- */
  if (CONFIG.whatsapp) {
    const url = "https://wa.me/55" + CONFIG.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(CONFIG.mensagem);
    document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = url; });
  }

  /* ---- Instagram ---- */
  if (CONFIG.instagram) {
    var ig = document.querySelector("[data-instagram]");
    if (ig) ig.href = "https://instagram.com/" + CONFIG.instagram.replace(/^@/, "");
  }

  var reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var hero = document.querySelector(".hero");
  var marcas = document.querySelectorAll("[data-parallax]");
  var ticking = false;

  /* ---- Header, barra de progresso e parallax suave ---- */
  function atualizar() {
    ticking = false;
    var y = window.scrollY;
    var limite = hero ? hero.offsetHeight - header.offsetHeight : 40;
    header.classList.toggle("is-scrolled", y > limite);
    if (reduzir) return;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    header.style.setProperty("--p", total > 0 ? Math.min(1, y / total).toFixed(4) : 0);
    marcas.forEach(function (m) {
      var secao = m.parentElement;
      var rel = y - secao.offsetTop;
      m.style.setProperty("--py", (rel * parseFloat(m.dataset.parallax)).toFixed(1) + "px");
    });
  }
  function pedir() { if (!ticking) { ticking = true; requestAnimationFrame(atualizar); } }
  window.addEventListener("scroll", pedir, { passive: true });
  window.addEventListener("resize", pedir);
  atualizar();

  /* ---- Divide títulos em palavras (cada uma sobe de uma máscara) ---- */
  function dividir(el) {
    var n = 0;
    (function andar(no) {
      Array.prototype.slice.call(no.childNodes).forEach(function (filho) {
        if (filho.nodeType === 3) {
          var partes = filho.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          partes.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "w";
            var wi = document.createElement("span"); wi.className = "wi";
            wi.style.setProperty("--i", n++);
            wi.textContent = p; w.appendChild(wi); frag.appendChild(w);
          });
          no.replaceChild(frag, filho);
        } else if (filho.nodeType === 1) { andar(filho); }
      });
    })(el);
  }
  if (!reduzir) document.querySelectorAll(".split").forEach(dividir);

  /* ---- Ícones de linha: preparados para se desenhar ---- */
  document.querySelectorAll(".icone *").forEach(function (f) { f.setAttribute("pathLength", "1"); });

  /* ---- Revelação suave ao rolar ---- */
  var itens = document.querySelectorAll(".reveal");
  if (reduzir || !("IntersectionObserver" in window)) {
    itens.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  itens.forEach(function (el) { io.observe(el); });
})();
