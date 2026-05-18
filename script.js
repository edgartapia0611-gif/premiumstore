/* =====================================================
   PremiumStore — JavaScript
   ===================================================== */

// ── Scroll animations ─────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => observer.observe(el));

// ── FAQ accordion ─────────────────────────────────────
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const icon   = btn.querySelector('.faq-icon');
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('open'));
  if (!isOpen) { answer.classList.add('open'); icon.classList.add('open'); }
}

// ── Countdown timer ───────────────────────────────────
function newEnd() {
  const d = new Date();
  d.setHours(d.getHours() + 5);
  d.setMinutes(d.getMinutes() + 47);
  d.setSeconds(d.getSeconds() + 33);
  localStorage.setItem('offerEnd', d.toISOString());
  return d;
}
const saved = localStorage.getItem('offerEnd');
let endTime = (saved && new Date(saved) > new Date()) ? new Date(saved) : newEnd();

function updateCountdown() {
  const diff = endTime - new Date();
  if (diff <= 0) { endTime = newEnd(); return; }
  document.getElementById('hours').textContent   = String(Math.floor(diff / 3600000)).padStart(2,'0');
  document.getElementById('minutes').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
  document.getElementById('seconds').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ── Stock counter ─────────────────────────────────────
const stocks = {
  '13': { el: document.getElementById('stock-13'), count: 4, min: 2 },
  '14': { el: document.getElementById('stock-14'), count: 3, min: 1 },
  '15': { el: document.getElementById('stock-15'), count: 2, min: 1 },
  '16': { el: document.getElementById('stock-16'), count: 3, min: 2 },
  '17': { el: document.getElementById('stock-17'), count: 1, min: 1 },
};
setInterval(() => {
  Object.values(stocks).forEach(s => {
    if (Math.random() < 0.2 && s.count > s.min) {
      s.count--;
      s.el.textContent = s.count === 1 ? '¡Último disponible!' : s.count + ' restantes';
      s.el.style.color = s.count <= 1 ? '#ff4444' : '#f97316';
    }
  });
}, 14000);

// ── Color swatch selector ─────────────────────────────
function selColor(btn, imgId) {
  if (btn.classList.contains('sold-out')) return;
  const wrap = btn.closest('.swatch-group');
  if (wrap) wrap.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const img = document.getElementById(imgId);
  if (img && btn.dataset.img) {
    img.style.opacity = '0';
    img.src    = btn.dataset.img;
    img.onload  = () => { img.style.opacity = '1'; };
    img.onerror = () => { img.style.opacity = '1'; };
  }
  const lbl = document.getElementById(imgId + '-lbl');
  if (lbl && btn.title) lbl.textContent = btn.title;
}

// ── WhatsApp opener ───────────────────────────────────
function abrirWhatsApp(modelo, precio) {
  const msg = encodeURIComponent('Hola, me interesa el ' + modelo + ' (' + precio + '). ¿Está disponible? Quiero más información antes de comprar.');
  window.open('https://wa.me/521XXXXXXXXXX?text=' + msg, '_blank');
}

// ── Mobile hamburger menu ─────────────────────────────
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('menuBtn');
  if (!menu || !btn) return;
  const isOpen = menu.classList.contains('open');
  if (isOpen) {
    menu.classList.remove('open');
    btn.classList.remove('open');
  } else {
    menu.classList.add('open');
    btn.classList.add('open');
    closeDropdown();
  }
}
function closeMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('menuBtn');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.classList.remove('open');
}

// ── Smooth scroll ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ============================================================
//  CURRENCY CONVERTER
// ============================================================
const RATES = {
  MXN: { rate:1,        sym:'$',   code:'MXN', name:'Peso Mexicano',       flag:'🇲🇽', dec:0 },
  USD: { rate:0.0571,   sym:'$',   code:'USD', name:'Dólar EE.UU.',        flag:'🇺🇸', dec:2 },
  ARS: { rate:62.86,    sym:'$',   code:'ARS', name:'Peso Argentino',      flag:'🇦🇷', dec:0 },
  COP: { rate:240.0,    sym:'$',   code:'COP', name:'Peso Colombiano',     flag:'🇨🇴', dec:0 },
  CLP: { rate:55.4,     sym:'$',   code:'CLP', name:'Peso Chileno',        flag:'🇨🇱', dec:0 },
  PEN: { rate:0.2143,   sym:'S/',  code:'PEN', name:'Sol Peruano',         flag:'🇵🇪', dec:2 },
  BRL: { rate:0.3343,   sym:'R$',  code:'BRL', name:'Real Brasileño',      flag:'🇧🇷', dec:2 },
  BOB: { rate:0.3943,   sym:'Bs.', code:'BOB', name:'Boliviano',           flag:'🇧🇴', dec:2 },
  PYG: { rate:445.7,    sym:'₲',   code:'PYG', name:'Guaraní',             flag:'🇵🇾', dec:0 },
  UYU: { rate:2.543,    sym:'$',   code:'UYU', name:'Peso Uruguayo',       flag:'🇺🇾', dec:0 },
  DOP: { rate:2.086,    sym:'RD$', code:'DOP', name:'Peso Dominicano',     flag:'🇩🇴', dec:0 },
  GTQ: { rate:0.4429,   sym:'Q',   code:'GTQ', name:'Quetzal',             flag:'🇬🇹', dec:2 },
  HNL: { rate:1.4229,   sym:'L',   code:'HNL', name:'Lempira',             flag:'🇭🇳', dec:2 },
  NIO: { rate:2.1,      sym:'C$',  code:'NIO', name:'Córdoba',             flag:'🇳🇮', dec:2 },
  CRC: { rate:30.86,    sym:'₡',   code:'CRC', name:'Colón Costarricense', flag:'🇨🇷', dec:0 },
  EUR: { rate:0.0531,   sym:'€',   code:'EUR', name:'Euro',                flag:'🇪🇺', dec:2 },
};

let activeCurr = localStorage.getItem('psCurr') || 'MXN';

const PRODS = [
  { id:'13', mxn:500,  origMxn:1200 },
  { id:'14', mxn:750,  origMxn:1800 },
  { id:'15', mxn:1000, origMxn:2500 },
  { id:'16', mxn:2000, origMxn:4200 },
  { id:'17', mxn:3500, origMxn:7000 },
];

function fmtNum(n, dec) {
  if (dec === 0) return Math.round(n).toLocaleString('es-MX');
  return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function applyRates(code) {
  const r = RATES[code];
  if (!r) return;
  activeCurr = code;
  localStorage.setItem('psCurr', code);

  PRODS.forEach(p => {
    const prEl = document.getElementById('pr' + p.id);
    const orEl = document.getElementById('or' + p.id);
    if (!prEl || !orEl) return;
    const converted     = p.mxn     * r.rate;
    const origConverted = p.origMxn * r.rate;
    prEl.innerHTML  = r.sym + fmtNum(converted, r.dec)
      + ' <span class="text-base font-normal text-gray-400">' + code + '</span>';
    orEl.textContent = r.sym + fmtNum(origConverted, r.dec) + ' ' + code;
    prEl.classList.remove('price-flash');
    void prEl.offsetWidth;
    prEl.classList.add('price-flash');
  });

  const fc = document.getElementById('navCurrFlag');
  const cc = document.getElementById('navCurrCode');
  if (fc) fc.textContent = r.flag;
  if (cc) cc.textContent = code;

  document.querySelectorAll('.chip-btn').forEach(b => {
    const active = b.dataset.code === code;
    b.style.cssText = active
      ? 'border-color:rgba(255,255,255,0.4); background:rgba(255,255,255,0.12); color:#fff; transition:all 0.2s;'
      : 'border-color:rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); color:#999; transition:all 0.2s;';
  });

  document.querySelectorAll('.curr-opt').forEach(o => {
    o.classList.toggle('active', o.dataset.code === code);
  });
}

function buildCurrencyUI() {
  if (document.getElementById('currChips')?.hasChildNodes()) return;

  const chipsWrap = document.getElementById('currChips');
  if (chipsWrap) {
    Object.keys(RATES).forEach(code => {
      const r   = RATES[code];
      const btn = document.createElement('button');
      btn.className    = 'chip-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border';
      btn.dataset.code = code;
      btn.style.cssText = 'border-color:rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); color:#aaa;';
      btn.innerHTML = r.flag + ' ' + code;
      btn.onclick   = () => applyRates(code);
      chipsWrap.appendChild(btn);
    });
  }

  const dd = document.getElementById('currDropdown');
  if (dd && !dd.hasChildNodes()) {
    Object.values(RATES).forEach(r => {
      const opt = document.createElement('div');
      opt.className    = 'curr-opt';
      opt.dataset.code = r.code;
      opt.innerHTML    = '<span style="font-size:18px">' + r.flag + '</span>'
        + '<span class="cc">' + r.code + '</span>'
        + '<span class="cn">' + r.name + '</span>';
      opt.onclick = e => { e.stopPropagation(); applyRates(r.code); closeDropdown(); };
      dd.appendChild(opt);
    });
  }

  applyRates(activeCurr);
}

function toggleCurrDropdown(e) {
  e.stopPropagation();
  document.getElementById('currDropdown').classList.toggle('open');
}
function closeDropdown() {
  const dd = document.getElementById('currDropdown');
  if (dd) dd.classList.remove('open');
}
document.addEventListener('click', (e) => {
  closeDropdown();
  // Close mobile menu when tapping outside navbar
  // But NEVER interfere when the payment modal is open
  const modal = document.getElementById('payModal');
  if (modal && modal.classList.contains('active')) return;
  const nav = document.getElementById('navbar');
  if (nav && !nav.contains(e.target)) closeMenu();
});

document.addEventListener('DOMContentLoaded', buildCurrencyUI);
if (document.readyState !== 'loading') buildCurrencyUI();

// ============================================================
//  MERCADO PAGO MODAL
// ============================================================
let curProduct = '', curPrice = 0;

// ── Links de pago por producto ────────────────────────
// Reemplaza con los links reales de tu cuenta Mercado Pago
const MP_LINKS = {
  'iPhone 13':     'https://mpago.la/1C9L6pK',
  'iPhone 14':     'https://mpago.la/11PBkFY',
  'iPhone 15':     'https://mpago.la/21pCVWY',
  'iPhone 17 Pro': 'https://mpago.la/2drdZR1',
};
const MP_LINK_DEFAULT = 'https://mpago.la/1C9L6pK';

function abrirModal(producto, precio) {
  curProduct = producto;
  curPrice   = precio;
  const fmt  = precio.toLocaleString('es-MX');

  document.getElementById('modalTitle').textContent   = producto;
  document.getElementById('modalProduct').textContent = producto;
  document.getElementById('modalPrice').textContent   = '$' + fmt + ' MXN';
  document.getElementById('successOverlay').classList.remove('show');

  const mpBtn = document.getElementById('mpPayBtn');
  if (mpBtn) mpBtn.href = MP_LINKS[producto] || MP_LINK_DEFAULT;

  const waBtn = document.getElementById('modalWABtn');
  if (waBtn) {
    waBtn.onclick = function() {
      abrirWhatsApp(producto, fmt + ' MXN');
      cerrarModal();
    };
  }

  document.getElementById('payModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  const modal = document.getElementById('payModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Modal: cerrar al hacer click en el fondo (overlay) pero NO dentro del modal-box
// Se usa stopPropagation en el modal-box para que el click no llegue al overlay
document.addEventListener('DOMContentLoaded', () => {
  const payModal = document.getElementById('payModal');
  const modalBox = document.getElementById('modalBox');
  if (payModal) {
    payModal.addEventListener('click', (e) => {
      if (e.target === payModal) cerrarModal();
    });
  }
  if (modalBox) {
    modalBox.addEventListener('click', (e) => {
      e.stopPropagation(); // evita que el click llegue al overlay
    });
  }
  // El botón de MP cierra el modal después de 500ms (tiempo para abrir la pestaña)
  const mpBtn = document.getElementById('mpPayBtn');
  if (mpBtn) {
    mpBtn.addEventListener('click', () => {
      setTimeout(cerrarModal, 500);
    });
  }
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });

// ============================================================
//  PARTICLE CANVAS
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const pts = [];
  const N   = 65;

  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }

  function spawn() {
    pts.length = 0;
    for (let i = 0; i < N; i++) {
      pts.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r:  Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        o:  Math.random() * 0.35 + 0.08,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.o})`;
      ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx   = pts[i].x - pts[j].x;
        const dy   = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${(1 - dist/110) * 0.04})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize(); spawn(); draw();
  window.addEventListener('resize', () => { resize(); spawn(); });
})();

// ============================================================
//  PRODUCTION RESILIENCE INIT
//  Runs after EVERY external resource has loaded (fonts, CDNs, etc.)
//  Re-enforces pointer-events on all interactive elements so that
//  no late-loading external CSS can silently disable clicks.
// ============================================================
(function productionInit() {
  function enforceClickability() {
    // All anchor tags with real hrefs
    document.querySelectorAll('a[href]').forEach(function(el) {
      el.style.pointerEvents = 'auto';
      el.style.cursor        = 'pointer';
    });

    // All enabled buttons
    document.querySelectorAll('button:not([disabled])').forEach(function(el) {
      el.style.pointerEvents = 'auto';
      el.style.cursor        = 'pointer';
    });

    // Card buy CTAs (Comprar ahora anchors → Mercado Pago)
    document.querySelectorAll('.card-buy-btn').forEach(function(el) {
      el.style.pointerEvents  = 'auto';
      el.style.cursor         = 'pointer';
      el.style.position       = 'relative';
      el.style.zIndex         = '10';
      el.style.display        = 'block';
      el.style.textDecoration = 'none';
      el.style.touchAction    = 'manipulation';
    });

    // Decorative/canvas elements must NEVER intercept clicks
    var noClick = document.querySelectorAll(
      '#particleCanvas, .glow-orb-1, .glow-orb-2, .glow-orb-3, ' +
      '.hero-phone-side, .hero-phone-l, .hero-phone-r'
    );
    noClick.forEach(function(el) {
      el.style.pointerEvents = 'none';
    });
  }

  // Run immediately (DOM is already parsed — script is at end of body)
  enforceClickability();

  // Run again after ALL resources finish loading (catches late CDN injections)
  window.addEventListener('load', enforceClickability);
}());
