/* =========================================================
   TecnoFacil | Galeria de trabalhos por cliente (servico-design)

   COMO ADICIONAR UM TRABALHO NOVO:
   1. Coloque a imagem na pasta img-service/trabalhos/<cliente>/
   2. Inclua uma linha em "items" do cliente abaixo:
      { src: "img-service/trabalhos/dermaxx/cartao.png", legenda: "Cartão de visita" }
   Para um PDF, adicione também:  pdf: "img-service/trabalhos/dermaxx/arquivo.pdf"
   ========================================================= */
(function () {
  "use strict";

  const TRABALHOS = {
    supermercado: {
      nome: "Supermercado Aqui Tem",
      items: [
        { src: "img-service/trabalhos/supermercado/1-s.png", legenda: "Post Promoção" },
        { src: "img-service/trabalhos/supermercado/2-s.png", legenda: "Cartão de visita - Frente" },
        { src: "img-service/trabalhos/supermercado/3-s.png", legenda: "Cartão de visita - Verso" },
      ],
    },
    dermaxx: {
      nome: "Dermaxx",
      items: [
        { src: "img-service/trabalhos/dermaxx/1.png", legenda: "Post Istagram" },
        { src: "img-service/trabalhos/dermaxx/2.png", legenda: "Post Istagram" },
        { src: "img-service/trabalhos/dermaxx/3.png", legenda: "Post Istagram" },
      ],
    },
    maisa: {
      nome: "Maisa Santos",
      items: [
        { src: "img-service/trabalhos/maisa/1-m.png", legenda: "Documento Personalizado" },
        { src: "img-service/trabalhos/maisa/2-m.png", legenda: "Declaração" },
        { src: "img-service/trabalhos/maisa/3-m.png", legenda: "Relatorio" },
      ],
    },
  };

  const modal = document.getElementById("galeriaModal");
  if (!modal) return;

  const titulo = modal.querySelector(".gal-title");
  const grade = modal.querySelector(".gal-grid");
  const viewer = modal.querySelector(".gal-viewer");
  const viewerImg = viewer.querySelector("img");
  const viewerCap = viewer.querySelector(".gal-caption");
  const viewerPdf = viewer.querySelector(".gal-pdf");

  let atual = null;
  let indice = 0;
  let ultimoFoco = null;

  function mostrar(i) {
    const lista = atual.items;
    indice = (i + lista.length) % lista.length;
    const it = lista[indice];
    viewerImg.src = it.src;
    viewerImg.alt = it.legenda;
    viewerCap.textContent = it.legenda + " (" + (indice + 1) + "/" + lista.length + ")";
    viewerPdf.hidden = !it.pdf;
    if (it.pdf) viewerPdf.href = it.pdf;
    viewer.hidden = false;
    grade.hidden = true;
  }

  function voltarGrade() {
    viewer.hidden = true;
    grade.hidden = false;
  }

  function abrir(chave, gatilho) {
    atual = TRABALHOS[chave];
    if (!atual) return;
    ultimoFoco = gatilho;
    titulo.textContent = atual.nome;
    grade.innerHTML = "";
    atual.items.forEach(function (it, i) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "gal-thumb";
      const img = document.createElement("img");
      img.src = it.src;
      img.alt = it.legenda;
      img.loading = "lazy";
      const span = document.createElement("span");
      span.textContent = it.legenda;
      b.append(img, span);
      b.addEventListener("click", function () { mostrar(i); });
      grade.appendChild(b);
    });
    voltarGrade();
    modal.hidden = false;
    document.body.classList.add("gal-open");
    modal.querySelector(".gal-close").focus();
  }

  function fechar() {
    modal.hidden = true;
    document.body.classList.remove("gal-open");
    if (ultimoFoco) ultimoFoco.focus();
  }

  document.querySelectorAll("[data-galeria]").forEach(function (btn) {
    btn.addEventListener("click", function () { abrir(btn.dataset.galeria, btn); });
  });

  modal.querySelector(".gal-close").addEventListener("click", fechar);
  modal.addEventListener("click", function (e) { if (e.target === modal) fechar(); });
  viewer.querySelector(".gal-back").addEventListener("click", voltarGrade);
  viewer.querySelector(".gal-prev").addEventListener("click", function () { mostrar(indice - 1); });
  viewer.querySelector(".gal-next").addEventListener("click", function () { mostrar(indice + 1); });

  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") fechar();
    else if (!viewer.hidden && e.key === "ArrowLeft") mostrar(indice - 1);
    else if (!viewer.hidden && e.key === "ArrowRight") mostrar(indice + 1);
  });
})();
