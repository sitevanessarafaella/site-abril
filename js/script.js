/* ══════════════════════════════════════════════════════════
   VANESSA RAFAELLA — script.js
   ══════════════════════════════════════════════════════════ */

  /* ────────────────────────────────────────────────────
     CONFIGURAÇÃO — EDITE AQUI
  ──────────────────────────────────────────────────── */
  const WA_NUMBER = '5581995469947';

  const WA_MESSAGES = {
    pt: 'Olá Vanessa! Vi seu site e gostaria de saber mais.',
    en: 'Hello Vanessa! I saw your website and would like to know more.',
    es: '¡Hola Vanessa! Vi tu sitio web y me gustaría saber más.'
  };

  /* ────────────────────────────────────────────────────
     HELPERS
  ──────────────────────────────────────────────────── */
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);
  const html = document.documentElement;

  /* ────────────────────────────────────────────────────
     ESTADO GLOBAL
  ──────────────────────────────────────────────────── */
  let currentTheme = localStorage.getItem('vr-theme') || 'dark';
  let currentLang  = localStorage.getItem('vr-lang')  || 'pt';

  /* ════════════════════════════════════════════════════
     1. TEMA ESCURO / CLARO
  ════════════════════════════════════════════════════ */
  const themeToggle = $('themeToggle');
  const mobThemeBtn = $('mobThemeBtn');
  const themeIcon   = $('themeIcon');
  const mobThemeLbl = $('mobThemeLbl');

  function setTheme(t) {
    html.setAttribute('data-theme', t);
    currentTheme = t;
    localStorage.setItem('vr-theme', t);
    if (themeIcon) themeIcon.className = t === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    if (mobThemeLbl) mobThemeLbl.textContent = t === 'dark' ? 'Escuro' : 'Claro';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t === 'dark' ? '#080808' : '#F4F4F8';
  }

  /* Aplica sem flash de transição */
  html.style.transition = 'none';
  setTheme(localStorage.getItem('vr-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  requestAnimationFrame(() => { html.style.transition = ''; });

  themeToggle?.addEventListener('click', () =>
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  mobThemeBtn?.addEventListener('click', () =>
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  /* ════════════════════════════════════════════════════
     2. IDIOMA (PT / EN / ES)
  ════════════════════════════════════════════════════ */
  function applyLanguage(lang) {
    currentLang = lang;
    html.lang = lang === 'en' ? 'en' : lang === 'es' ? 'es' : 'pt-BR';

    $$('[data-pt], [data-en], [data-es]').forEach(el => {
      const text = el.getAttribute('data-' + lang) || el.getAttribute('data-pt');
      if (!text) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else if (el.children.length > 0) {
        Array.from(el.childNodes).forEach(n => {
          if (n.nodeType === 3 && n.textContent.trim()) n.textContent = ' ' + text;
        });
      } else {
        el.textContent = text;
      }
    });

    updateWALinks();
    localStorage.setItem('vr-lang', lang);
  }

  function updateWALinks() {
    const msg = encodeURIComponent(WA_MESSAGES[currentLang] || WA_MESSAGES.pt);
    const url = 'https://wa.me/' + WA_NUMBER + '?text=' + msg;
    ['waFloat', 'mobWa', 'linksWa', 'footerWa'].forEach(id => {
      const el = $(id);
      if (el) el.href = url;
    });
  }

  /* ════════════════════════════════════════════════════
     3. DROPDOWN DE IDIOMA
  ════════════════════════════════════════════════════ */
  const langSel     = $('langSel');
  const langTrigger = $('langTrigger');
  const langFlag    = $('langFlag');
  const langCode    = $('langCode');
  const langOpts    = $$('.lang-opt');

  function closeLangDropdown() {
    langSel?.classList.remove('open');
    langTrigger?.setAttribute('aria-expanded', 'false');
  }

  langTrigger?.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = langSel.classList.toggle('open');
    langTrigger.setAttribute('aria-expanded', String(isOpen));
  });

  langOpts.forEach(opt => {
    opt.addEventListener('click', e => {
      e.stopPropagation();
      const l    = opt.dataset.lang;
      const flag = opt.dataset.flag;
      if (langFlag) langFlag.textContent = flag;
      if (langCode) langCode.textContent = l.toUpperCase();
      langOpts.forEach(o => o.setAttribute('aria-selected', 'false'));
      opt.setAttribute('aria-selected', 'true');
      closeLangDropdown();
      applyLanguage(l);
    });
  });

  document.addEventListener('click', e => {
    if (langSel && !langSel.contains(e.target)) closeLangDropdown();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLangDropdown();
  });

  applyLanguage(currentLang);

  /* ════════════════════════════════════════════════════
     4. MENU MOBILE
  ════════════════════════════════════════════════════ */
  const hamburger      = $('hamburger');
  const btnMenuDesktop = $('btnMenuDesktop');
  const mobMenu        = $('mobMenu');
  const mobOverlay     = $('mobOverlay');
  const mobClose       = $('mobClose');

  function openMobMenu() {
    [hamburger, btnMenuDesktop].forEach(btn => {
      btn?.classList.add('active');
      btn?.setAttribute('aria-expanded', 'true');
    });
    mobMenu?.removeAttribute('hidden');
    requestAnimationFrame(() => {
      mobMenu?.classList.add('active');
      mobOverlay?.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
    mobClose?.focus();
  }

  function closeMobMenu() {
    [hamburger, btnMenuDesktop].forEach(btn => {
      btn?.classList.remove('active');
      btn?.setAttribute('aria-expanded', 'false');
    });
    mobMenu?.classList.remove('active');
    mobOverlay?.classList.remove('active');
    document.body.style.overflow = '';
    mobMenu?.addEventListener('transitionend', () => {
      if (!mobMenu.classList.contains('active')) mobMenu.setAttribute('hidden', '');
    }, { once: true });
    hamburger?.focus();
  }

  hamburger?.addEventListener('click', openMobMenu);
  btnMenuDesktop?.addEventListener('click', openMobMenu);
  mobClose?.addEventListener('click', closeMobMenu);
  mobOverlay?.addEventListener('click', closeMobMenu);
  $$('#mobMenu a').forEach(link => link.addEventListener('click', closeMobMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobMenu?.classList.contains('active')) closeMobMenu();
  });

  /* ════════════════════════════════════════════════════
     5. NAVBAR — SOMBRA AO ROLAR
  ════════════════════════════════════════════════════ */
  const mainNav = $('mainNav');
  const heroEl  = document.querySelector('.hero');
  if (heroEl) {
    new IntersectionObserver(
      ([entry]) => mainNav?.classList.toggle('scrolled', !entry.isIntersecting),
      { threshold: 0 }
    ).observe(heroEl);
  }

  /* ════════════════════════════════════════════════════
     6. SCROLL REVEAL
  ════════════════════════════════════════════════════ */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  $$('[data-reveal]').forEach(el => revealObs.observe(el));

  /* ════════════════════════════════════════════════════
     7. CURSOR PERSONALIZADO + TRAIL DE PARTÍCULAS
  ════════════════════════════════════════════════════ */
  const CFG = {
    trail: {
      perMove: 2,     /* partículas por movimento */
      decay:   0.042, /* velocidade de sumiço (0–1) */
      spread:  8,     /* dispersão lateral (px)     */
    },
    embers: {
      colors: ['#FF2D8B', '#FF6BB8', '#F0C040', '#ffffff'],
    }
  };
  const FX = { embers: false, trail: true };

  /* Canvas para as partículas — criado via JS, não precisa estar no HTML */
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9997;';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const trailParticles = [];
  let mouseX = -999, mouseY = -999;

  class TrailParticle {
    constructor(x, y) {
      this.x    = x + (Math.random() - 0.5) * CFG.trail.spread;
      this.y    = y + (Math.random() - 0.5) * CFG.trail.spread;
      this.vx   = (Math.random() - 0.5) * 1.4;
      this.vy   = -(Math.random() * 1.8);
      this.size = 1.5 + Math.random() * 2.8;
      this.life = 1;
      this.color = CFG.embers.colors[Math.floor(Math.random() * CFG.embers.colors.length)];
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.vy   += 0.05;
      this.life -= CFG.trail.decay;
      this.size *= 0.965;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life * 0.85;
      ctx.fillStyle   = this.color;
      ctx.shadowBlur  = this.size * 3;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function animLoop() {
    requestAnimationFrame(animLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (FX.trail) {
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        p.update();
        if (p.life <= 0) trailParticles.splice(i, 1);
        else p.draw();
      }
    }
  }
  animLoop();

  const cursorDot  = $('cursor-dot');
  const cursorRing = $('cursor-ring');

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
        cursorDot.classList.add('visible');
      }
      if (cursorRing) {
        cursorRing.style.left = mouseX + 'px';
        cursorRing.style.top  = mouseY + 'px';
        cursorRing.classList.add('visible');
      }

      if (FX.trail) {
        for (let i = 0; i < CFG.trail.perMove; i++) {
          trailParticles.push(new TrailParticle(mouseX, mouseY));
        }
      }
    }, { passive: true });

    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ════════════════════════════════════════════════════
     . SMOOTH SCROLL
  ════════════════════════════════════════════════════ */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = mainNav?.offsetHeight || 0;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  console.log('✨ Vanessa Rafaella — site carregado!');
