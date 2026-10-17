/* Royal Beauty — utilidades compartilhadas */
(function () {
  const WA = '5551998894537';
  const IG = 'royalbeauty_poa';
  const RB = (window.RB = {});

  RB.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  RB.money = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  RB.waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  RB.igLink = `https://instagram.com/${IG}`;
  RB.igHandle = '@' + IG;
  RB.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ICON = {
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3.1.9.9-3-.2-.3a8.1 8.1 0 1 1 6.8 3.7Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.200s.9 2.500 1.100 2.700c.1.2 1.900 2.900 4.600 4.100 1.700.7 2.400.8 3.200.7.5-.1 1.500-.6 1.700-1.200.2-.6.2-1.100.2-1.200-.1-.1-.3-.2-.5-.3Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.5 2h9A5.500 5.500 0 0 1 22 7.500v9a5.500 5.500 0 0 1-5.500 5.500h-9A5.500 5.500 0 0 1 2 16.500v-9A5.500 5.500 0 0 1 7.500 2Zm0 2A3.500 3.500 0 0 0 4 7.500v9A3.500 3.500 0 0 0 7.500 20h9a3.500 3.500 0 0 0 3.500-3.500v-9A3.500 3.500 0 0 0 16.500 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.300-3.200a1.200 1.200 0 1 1 0 2.400 1.200 1.200 0 0 1 0-2.400Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.200 7 13 7 13s7-7.800 7-13a7 7 0 0 0-7-7Zm0 9.500A2.500 2.500 0 1 1 12 6.500a2.500 2.500 0 0 1 0 5Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.200L4.500 7H4v.6l8 5.600 8-5.600V7h-.5L12 12.200Z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v5.400l3.700 2.200-.9 1.500L11 13V7h2Z"/></svg>',
  };
  RB.icon = (n) => ICON[n] || '';

  // mascote original (fofinho, com coroa)
  RB.mascot = () => `<svg class="mascot" viewBox="0 0 200 210" role="img" aria-label="Mascote Royal Beauty">
    <ellipse cx="100" cy="196" rx="52" ry="8" fill="#b03a78" opacity=".18"/>
    <g class="m-body">
      <ellipse cx="100" cy="124" rx="72" ry="64" fill="#fff" stroke="#ff6aa8" stroke-width="5"/>
      <ellipse cx="60" cy="136" rx="13" ry="8" fill="#ffb3d1"/><ellipse cx="140" cy="136" rx="13" ry="8" fill="#ffb3d1"/>
      <ellipse class="eye" cx="76" cy="120" rx="6.500" ry="9.500" fill="#5a1038"/><ellipse class="eye" cx="124" cy="120" rx="6.500" ry="9.500" fill="#5a1038"/>
      <circle cx="78" cy="116" r="2.200" fill="#fff"/><circle cx="126" cy="116" r="2.200" fill="#fff"/>
      <path d="M92 136q8 8 16 0" stroke="#5a1038" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M100 176c-10-8-18-13-18-20a9 9 0 0 1 18-2 9 9 0 0 1 18 2c0 7-8 12-18 20Z" fill="#ff5c9f" transform="translate(0 6) scale(.55) translate(82 130)" opacity="0"/>
      <path d="M66 68 74 30l16 22 10-32 10 32 16-22 8 38Z" fill="#ffd166" stroke="#e8a02c" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="74" cy="28" r="5" fill="#ff5c9f"/><circle cx="100" cy="16" r="5.500" fill="#ff5c9f"/><circle cx="126" cy="28" r="5" fill="#ff5c9f"/>
      <rect x="66" y="64" width="68" height="9" rx="4.500" fill="#e8a02c"/>
    </g></svg>`;

  // cabeçalho + rodapé
  RB.layout = (active) => {
    const nav = [['/', 'Loja', 'loja'], ['/sobre', 'Sobre nós', 'sobre'], ['/#contato', 'Contato', 'contato']];
    const h = document.getElementById('hdr');
    if (h) h.innerHTML = `
      <header class="top"><div class="wrap top-in">
        <a class="brand" href="/" aria-label="Royal Beauty — início"><img src="/logo.jpg" alt="" width="46" height="46"><span><b>Royal</b> Beauty</span></a>
        <button class="burger" aria-label="Abrir menu" aria-expanded="false"><i></i><i></i><i></i></button>
        <nav class="nav" id="nav">${nav.map(([u, t, k]) => `<a href="${u}" class="${k === active ? 'on' : ''}">${t}</a>`).join('')}
          <a class="pill-wa" href="${RB.waLink('Olá, Royal Beauty! 👑 Vim pelo site.')}" target="_blank" rel="noopener">${ICON.wa}<span>WhatsApp</span></a></nav>
      </div></header>`;
    const f = document.getElementById('ftr');
    if (f) f.innerHTML = `
      <footer class="foot" id="contato"><div class="wrap foot-in">
        <div class="foot-brand"><img src="/logo.jpg" alt="Royal Beauty" width="110" height="110"><p class="script">Sua beleza, sua realeza.</p></div>
        <div class="foot-col"><h4>Fale com a gente 💬</h4>
          <a href="${RB.waLink('Olá, Royal Beauty! 👑')}" target="_blank" rel="noopener">${ICON.wa} (51) 99889-4537</a>
          <a href="${RB.igLink}" target="_blank" rel="noopener">${ICON.ig} ${RB.igHandle}</a>
          <a href="mailto:acontato422@gmail.com">${ICON.mail} acontato422@gmail.com</a></div>
        <div class="foot-col"><h4>Onde estamos 📍</h4>
          <span>${ICON.pin} Av. Baltazar de Oliveira Garcia, 2478<br>Porto Alegre – RS</span>
          <span>${ICON.clock} Atendimento: 08h às 20h</span></div>
        <div class="foot-col"><h4>Entrega 🚚</h4>
          <span>Frete por conta do cliente. O valor é informado antes da confirmação da compra, conforme a região.</span></div>
      </div>
      <div class="wrap foot-end"><span>© ${new Date().getFullYear()} Royal Beauty 👑 — Responsável: Aline Pedroso</span><a href="/admin" rel="nofollow">Área da loja</a></div></footer>
      <a class="fab" href="${RB.waLink('Olá, Royal Beauty! 👑 Vim pelo site.')}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${ICON.wa}</a>`;
    const b = document.querySelector('.burger');
    if (b) b.addEventListener('click', () => {
      const o = document.body.classList.toggle('menu-open');
      b.setAttribute('aria-expanded', o);
    });
  };

  // elementos flutuando no fundo (3D)
  RB.floaters = () => {
    if (RB.reduced) return;
    const box = document.createElement('div');
    box.className = 'floaters';
    box.setAttribute('aria-hidden', 'true');
    const items = ['💖', '🎀', '✨', '⭐', '💗', '🍓', '👑', '🌸', '💕', '☁️'];
    const n = window.innerWidth < 700 ? 12 : 22;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.textContent = items[i % items.length];
      s.style.setProperty('--x', Math.random() * 100 + 'vw');
      s.style.setProperty('--s', 14 + Math.random() * 26 + 'px');
      s.style.setProperty('--d', 14 + Math.random() * 16 + 's');
      s.style.setProperty('--dl', -Math.random() * 30 + 's');
      s.style.setProperty('--sp', 5 + Math.random() * 6 + 's');
      box.appendChild(s);
    }
    document.body.prepend(box);
  };

  // inclinação 3D com o mouse/dedo
  RB.tilt = (el, max) => {
    if (RB.reduced || !window.matchMedia('(hover:hover)').matches) return;
    max = max || 10;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', x * max * 2 + 'deg');
      el.style.setProperty('--rx', -y * max * 2 + 'deg');
      el.style.setProperty('--gx', (x + 0.5) * 100 + '%');
      el.style.setProperty('--gy', (y + 0.5) * 100 + '%');
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--rx', '0deg');
    });
  };

  // surgir ao rolar
  RB.reveal = (root) => {
    const els = (root || document).querySelectorAll('.rv:not(.in)');
    if (!('IntersectionObserver' in window) || RB.reduced) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  };

  // corações ao tocar
  RB.sparkle = () => {
    if (RB.reduced) return;
    document.addEventListener('pointerdown', (e) => {
      if (e.target.closest('input,textarea,select')) return;
      for (let i = 0; i < 5; i++) {
        const s = document.createElement('span');
        s.className = 'pop';
        s.textContent = ['💖', '✨', '🎀', '💗', '⭐'][i % 5];
        s.style.left = e.clientX + 'px';
        s.style.top = e.clientY + 'px';
        s.style.setProperty('--dx', (Math.random() - 0.5) * 120 + 'px');
        s.style.setProperty('--dy', -40 - Math.random() * 90 + 'px');
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 900);
      }
    }, { passive: true });
  };

  RB.init = (active) => {
    RB.layout(active);
    RB.floaters();
    RB.sparkle();
    RB.reveal();
    document.querySelectorAll('[data-mascot]').forEach((n) => (n.innerHTML = RB.mascot()));
  };
})();
