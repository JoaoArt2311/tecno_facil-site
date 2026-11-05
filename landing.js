/* =========================================================
   TecnoFacil | Landing page: interações e animações
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const WHATSAPP = "5562982403261";

  /* ---------- Header, progresso e botão de topo ---------- */
  const header = $("#header");
  const toTop = $("#toTop");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 30);
    toTop.classList.toggle("show", y > 700);
    updateStepsLine();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Menu mobile ---------- */
  const menuToggle = $("#menuToggle");
  const navMenu = $("#navMenu");

  function closeMenu() {
    navMenu.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }
  menuToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  $$(".nav-link").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- Link ativo do menu conforme a seção ---------- */
  const navLinks = $$(".nav-link");
  const sections = navLinks
    .filter((l) => l.getAttribute("href").startsWith("#"))
    .map((l) => $(l.getAttribute("href")))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Revelar elementos ao rolar ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Contadores animados ---------- */
  const counters = $$("[data-count]");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        countObserver.unobserve(e.target);
        const el = e.target;
        const target = Number(el.dataset.count);
        if (reduceMotion) {
          el.textContent = target;
          return;
        }
        const duration = 1600;
        const start = performance.now();
        (function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => countObserver.observe(c));

  /* ---------- Texto digitado no título ---------- */
  const typedEl = $("#typed");
  const words = [
    "sites que vendem",
    "design que marca",
    "marketing que cresce",
    "suporte ágil",
    "automação prática",
  ];

  if (!typedEl) {
    // página interna: sem texto digitado
  } else if (reduceMotion) {
    typedEl.textContent = words[0];
  } else {
    let wi = 0;
    let ci = 0;
    let deleting = false;
    (function typeLoop() {
      const word = words[wi];
      ci += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, ci);
      let delay = deleting ? 35 : 75;
      if (!deleting && ci === word.length) {
        delay = 1800;
        deleting = true;
      } else if (deleting && ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        delay = 350;
      }
      setTimeout(typeLoop, delay);
    })();
  }

  /* ---------- Janela de código digitando ---------- */
  const codeBody = $("#codeBody");
  const codeText = [
    "// tecnofacil.js",
    "const empresa = {",
    '  nome: "TecnoFacil",',
    '  cidade: "Caldas Novas - GO",',
    '  servicos: ["Sites", "Design", "Marketing", "Suporte"],',
    "};",
    "",
    "function facilitar(cliente) {",
    "  const solucao = criarSobMedida(cliente);",
    '  return solucao.entregar("com resultado");',
    "}",
    "",
    'facilitar("seu negócio");',
  ].join("\n");

  function highlight(text) {
    const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return esc.replace(
      /(\/\/.*$)|("[^"\n]*"?)|\b(const|function|return)\b|\b([a-zA-Z_]\w*)(?=\()|\b([a-zA-Z_]\w*)(?=:)/gm,
      (m, com, str, kw, fn, prop) => {
        if (com) return '<span class="c">' + com + "</span>";
        if (str) return '<span class="s">' + str + "</span>";
        if (kw) return '<span class="k">' + kw + "</span>";
        if (fn) return '<span class="f">' + fn + "</span>";
        if (prop) return '<span class="p">' + prop + "</span>";
        return m;
      }
    );
  }

  function renderCode(n) {
    codeBody.innerHTML = highlight(codeText.slice(0, n)) + '<span class="cur"></span>';
  }

  if (!codeBody) {
    // página interna: sem janela de código
  } else if (reduceMotion) {
    renderCode(codeText.length);
  } else {
    let n = 0;
    const codeObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      codeObserver.disconnect();
      setTimeout(function typeCode() {
        n += 1;
        renderCode(n);
        if (n < codeText.length) setTimeout(typeCode, codeText[n - 1] === "\n" ? 140 : 16);
      }, 700);
    });
    codeObserver.observe(codeBody);
    renderCode(0);
  }

  /* ---------- Partículas conectadas no hero ---------- */
  const canvas = $("#heroCanvas");
  const ctx = canvas.getContext("2d");
  const hero = $("#inicio");
  let particles = [];
  let cw = 0;
  let ch = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: -9999, y: -9999 };
  let heroVisible = true;
  let rafId = null;

  function resizeCanvas() {
    cw = hero.clientWidth;
    ch = hero.clientHeight;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(95, Math.floor((cw * ch) / 15000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * cw,
      y: Math.random() * ch,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.6 + 0.6,
      green: Math.random() > 0.72,
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, cw, ch);
    const LINK = 130;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > cw) p.vx *= -1;
      if (p.y < 0 || p.y > ch) p.vy *= -1;

      // leve repulsão do mouse
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 110 && md > 0) {
        p.x += (mdx / md) * 1.4;
        p.y += (mdy / md) * 1.4;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.green ? "rgba(30,211,140,0.9)" : "rgba(181,85,255,0.85)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK) {
          ctx.strokeStyle = "rgba(151,47,238," + (0.32 * (1 - d / LINK)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      // linhas até o mouse
      if (md < 170) {
        ctx.strokeStyle = "rgba(30,211,140," + (0.5 * (1 - md / 170)).toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  function loop() {
    if (!heroVisible || document.hidden) {
      rafId = null;
      return;
    }
    drawParticles();
    rafId = requestAnimationFrame(loop);
  }
  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  resizeCanvas();
  if (!reduceMotion) {
    startLoop();
    window.addEventListener("resize", () => {
      resizeCanvas();
    });
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("mouseleave", () => {
      mouse.x = mouse.y = -9999;
    });
    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible) startLoop();
    }).observe(hero);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) startLoop();
    });
  } else {
    drawParticles();
  }

  /* ---------- Brilho que segue o mouse nos cards ---------- */
  $$(".glow-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* ---------- Efeitos só para desktop (mouse) ---------- */
  if (canHover && !reduceMotion) {
    // luz que acompanha o cursor
    const glow = $("#cursorGlow");
    let gx = 0;
    let gy = 0;
    let tx = 0;
    let ty = 0;
    window.addEventListener(
      "mousemove",
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
        glow.classList.add("on");
      },
      { passive: true }
    );
    (function followGlow() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = "translate(" + gx + "px," + gy + "px)";
      requestAnimationFrame(followGlow);
    })();

    // inclinação 3D da janela de código
    const visual = $(".hero-visual");
    const tilt = $(".tilt");
    if (visual && tilt) {
      visual.addEventListener("mousemove", (e) => {
        const r = visual.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = "rotateY(" + x * 10 + "deg) rotateX(" + -y * 10 + "deg)";
      });
      visual.addEventListener("mouseleave", () => {
        tilt.style.transform = "";
      });
    }

    // botões "magnéticos"
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * 0.18 + "px," + y * 0.25 + "px)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Linha de progresso do "Como funciona" ---------- */
  const steps = $(".steps");
  const stepsFill = $("#stepsFill");
  function updateStepsLine() {
    if (!steps || !stepsFill) return;
    const r = steps.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(Math.max((vh * 0.75 - r.top) / (r.height + vh * 0.2), 0), 1);
    stepsFill.style.width = p * 100 + "%";
  }

  /* ---------- Filtro do portfólio ---------- */
  const filters = $$(".filter");
  const works = $$(".work");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      const f = btn.dataset.filter;
      works.forEach((w) => {
        const show = f === "all" || w.dataset.cat === f;
        w.classList.toggle("hide", !show);
        w.classList.remove("pop");
        if (show) {
          void w.offsetWidth; // reinicia a animação
          w.classList.add("pop");
        }
      });
    });
  });

  /* ---------- Carrossel de depoimentos ---------- */
  const tcar = $("#tcar");
  if (tcar) {
    const imgs = $$(".tcar-img", tcar);
    const slides = $$(".tcar-slide", tcar);
    const dots = $$(".tcar-dot", tcar);
    let cur = 0;
    function showSlide(n) {
      cur = (n + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.classList.toggle("active", i === cur);
        s.setAttribute("aria-hidden", String(i !== cur));
      });
      imgs.forEach((im, i) => im.classList.toggle("active", i === cur));
      dots.forEach((d, i) => d.classList.toggle("active", i === cur));
    }
    $("#tcarPrev").addEventListener("click", () => showSlide(cur - 1));
    $("#tcarNext").addEventListener("click", () => showSlide(cur + 1));
    dots.forEach((d, i) => d.addEventListener("click", () => showSlide(i)));
  }

  /* ---------- FAQ: abas + acordeão ---------- */
  const faqRoot = $("#faqRoot");
  if (faqRoot) {
    const tabs = $$(".faq-tab", faqRoot);
    const panels = $$(".faq-panel", faqRoot);

    function selectTab(tab, focus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach((p) => {
        p.hidden = p.id !== tab.getAttribute("aria-controls");
      });
      if (focus) tab.focus();
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => selectTab(tab));
      tab.addEventListener("keydown", (e) => {
        const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (dir) {
          e.preventDefault();
          selectTab(tabs[(i + dir + tabs.length) % tabs.length], true);
        } else if (e.key === "Home" || e.key === "End") {
          e.preventDefault();
          selectTab(e.key === "Home" ? tabs[0] : tabs[tabs.length - 1], true);
        }
      });
    });

    $$(".faq-q", faqRoot).forEach((q) => {
      q.addEventListener("click", () => {
        const open = q.closest(".faq-item").classList.toggle("open");
        q.setAttribute("aria-expanded", String(open));
      });
    });
  }

  /* ---------- Formulário de orçamento -> WhatsApp ---------- */
  const form = $("#quoteForm");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#qName").value.trim();
    const service = $("#qService").value;
    const msg = $("#qMsg").value.trim();

    let text = "Olá! Meu nome é " + name + ". Vim pelo site e tenho interesse em: " + service + ".";
    if (msg) text += "\n\nSobre o projeto: " + msg;

    if (typeof gtag === "function") {
      gtag("event", "generate_lead", { event_category: "whatsapp", event_label: service });
    }
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text), "_blank", "noopener");
  });

  // estado inicial
  onScroll();
})();
