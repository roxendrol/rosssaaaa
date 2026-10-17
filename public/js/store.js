(function () {
  const { esc, money } = RB;
  RB.init('loja');
  document.querySelectorAll('[data-ic]').forEach((n) => (n.innerHTML = RB.icon(n.dataset.ic)));
  document.getElementById('heroWa').href = RB.waLink('Olá, Royal Beauty! 👑 Vim pelo site e gostaria de ajuda.');

  // 3D do herói acompanha o mouse
  const stage = document.getElementById('stage');
  if (stage && !RB.reduced) {
    const inner = stage.firstElementChild;
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      inner.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 36 + 'deg');
      inner.style.setProperty('--rx', -((e.clientY - r.top) / r.height - 0.5) * 28 + 'deg');
    });
    stage.addEventListener('pointerleave', () => { inner.style.setProperty('--ry', '0deg'); inner.style.setProperty('--rx', '0deg'); });
  }

  const state = { cats: [], prods: [], cat: 'all', q: '', sort: '' };
  const $ = (id) => document.getElementById(id);
  const catName = (id) => (state.cats.find((c) => c.id === id) || {}).name || '';

  function renderCats() {
    const count = (id) => state.prods.filter((p) => id === 'all' || p.cat === id).length;
    const all = [{ id: 'all', name: 'Todos', emoji: '👑' }, ...state.cats];
    $('cats').innerHTML = all.map((c) => `<button class="cat ${c.id === state.cat ? 'on' : ''}" role="tab" aria-selected="${c.id === state.cat}" data-id="${esc(c.id)}">
      <span class="em">${esc(c.emoji)}</span>${esc(c.name)}<small>${count(c.id)} ${count(c.id) === 1 ? 'item' : 'itens'}</small></button>`).join('');
  }

  function list() {
    const q = state.q.trim().toLowerCase();
    let a = state.prods.filter((p) => (state.cat === 'all' || p.cat === state.cat) && (!q || (p.title + ' ' + catName(p.cat)).toLowerCase().includes(q)));
    if (state.sort) a = a.slice().sort((x, y) => (state.sort === 'asc' ? x.price - y.price : y.price - x.price));
    return a;
  }

  function renderGrid() {
    const a = list();
    $('count').textContent = a.length ? `${a.length} ${a.length === 1 ? 'produto' : 'produtos'} 💖` : '';
    if (!a.length) {
      $('grid').innerHTML = `<div class="empty" style="grid-column:1/-1"><div data-mascot></div><h3>Em breve, novidades!</h3><p>Ainda não temos itens aqui. Chame a gente no WhatsApp e consulte o que está chegando 💕</p></div>`;
      $('grid').querySelector('[data-mascot]').innerHTML = RB.mascot();
      return;
    }
    $('grid').innerHTML = a.map((p, i) => `
      <article class="card rv" style="transition-delay:${Math.min(i % 8, 7) * 50}ms">
        <button class="ph" data-open="${esc(p.id)}" aria-label="Ver ${esc(p.title)}">
          ${p.cat ? `<span class="tag">${esc(catName(p.cat))}</span>` : ''}
          <img src="${esc(p.img)}" alt="${esc(p.title)}" loading="lazy" decoding="async" width="400" height="500"></button>
        <h3>${esc(p.title)}</h3>
        <div class="price">${money(p.price)}</div>
        <div class="acts">
          <a class="btn small wa" target="_blank" rel="noopener" href="${esc(waFor(p))}">${RB.icon('wa')} Quero este</a>
          <a class="btn small ig" target="_blank" rel="noopener" href="${esc(RB.igLink)}" aria-label="Instagram da Royal Beauty">${RB.icon('ig')}</a>
        </div>
      </article>`).join('');
    $('grid').querySelectorAll('.card').forEach((c) => RB.tilt(c, 7));
    RB.reveal($('grid'));
  }

  const waFor = (p) => RB.waLink(`Olá, Royal Beauty! 👑 Tenho interesse neste produto:\n\n*${p.title}* — ${money(p.price)}\n\nEstá disponível? Pode me informar o valor do frete para a minha região?`);

  function openModal(id) {
    const p = state.prods.find((x) => x.id === id);
    if (!p) return;
    $('mimg').src = p.img; $('mimg').alt = p.title;
    $('mcat').textContent = catName(p.cat) || 'Royal Beauty'; $('mtitle').textContent = p.title;
    $('mprice').textContent = money(p.price); $('mdesc').textContent = p.desc || '';
    $('mwa').href = waFor(p); $('mwa').innerHTML = RB.icon('wa') + ' Pedir pelo WhatsApp';
    $('mig').href = RB.igLink; $('mig').innerHTML = RB.icon('ig') + ' Ver no Instagram ' + esc(RB.igHandle);
    $('modal').classList.add('open'); document.body.style.overflow = 'hidden'; $('mclose').focus();
  }
  function closeModal() { $('modal').classList.remove('open'); document.body.style.overflow = ''; }
  $('mclose').addEventListener('click', closeModal);
  $('modal').addEventListener('click', (e) => { if (e.target === $('modal')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  $('grid').addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (b) openModal(b.dataset.open); });
  $('cats').addEventListener('click', (e) => {
    const b = e.target.closest('.cat'); if (!b) return;
    state.cat = b.dataset.id; renderCats(); renderGrid();
    document.getElementById('produtos').scrollIntoView({ behavior: RB.reduced ? 'auto' : 'smooth' });
  });
  let t;
  $('q').addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value; renderGrid(); }, 150); });
  $('sort').addEventListener('change', (e) => { state.sort = e.target.value; renderGrid(); });

  fetch('/api/catalog').then((r) => { if (!r.ok) throw 0; return r.json(); }).then((d) => {
    state.cats = d.categories; state.prods = d.products; renderCats(); renderGrid();
    RB.reveal();
  }).catch(() => {
    $('grid').innerHTML = `<div class="empty" style="grid-column:1/-1"><div data-mascot></div><h3>Ops! Não conseguimos carregar agora 🥺</h3><p>Atualize a página ou chame a gente no WhatsApp.</p></div>`;
    $('grid').querySelector('[data-mascot]').innerHTML = RB.mascot();
  });
  document.querySelectorAll('#grid [data-mascot]').forEach((n) => (n.innerHTML = RB.mascot()));
})();
