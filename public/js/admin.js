(function () {

  RB.floaters(); RB.sparkle();
  const { esc, money } = RB;
  const $ = (id) => document.getElementById(id);
  const view = $('view');
  const S = { cats: [], prods: [], email: '', tab: 'prod', q: '', fcat: '' };
  const mascot = () => `<div>${RB.mascot()}</div>`;

  // ---------- util ----------
  async function api(url, body) {
    const r = await fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Rb': '1' }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(d.error || 'Erro. Tente novamente.'); e.status = r.status; throw e; }
    return d;
  }
  let tt;
  function toast(msg, bad) {
    const t = $('toast'); t.textContent = msg; t.className = 'show' + (bad ? ' bad' : '');
    clearTimeout(tt); tt = setTimeout(() => (t.className = ''), 3200);
  }
  function parsePrice(s) {
    s = String(s).replace(/[^\d.,]/g, '');
    if (!s) return NaN;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    else if ((s.match(/\./g) || []).length > 1) s = s.replace(/\./g, '');
    const n = parseFloat(s);
    return isNaN(n) ? NaN : Math.round(n * 100);
  }
  const priceStr = (c) => (c / 100).toFixed(2).replace('.', ',');
  const catOf = (id) => S.cats.find((c) => c.id === id);
  function busy(btn, on) { if (btn) { btn.disabled = on; } }

  function confirmBox(text, okLabel) {
    return new Promise((res) => {
      const d = $('dlg');
      d.innerHTML = `<div class="form"><h2>Tem certeza? 🥺</h2><p>${esc(text)}</p><div class="row"><button class="btn danger" data-y>${esc(okLabel || 'Sim, excluir')}</button><button class="btn white" data-n>Cancelar</button></div></div>`;
      d.classList.add('open');
      const done = (v) => { d.classList.remove('open'); d.innerHTML = ''; res(v); };
      d.querySelector('[data-y]').onclick = () => done(true);
      d.querySelector('[data-n]').onclick = () => done(false);
      d.onclick = (e) => { if (e.target === d) done(false); };
      d.querySelector('[data-n]').focus();
    });
  }

  // reduz a foto do celular antes de enviar
  function compress(file) {
    return new Promise((resolve, reject) => {
      if (!/^image\//.test(file.type)) return reject(new Error('Escolha uma imagem.'));
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const max = 1100, k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        let q = 0.85, out = c.toDataURL('image/jpeg', q);
        while (out.length > 560000 && q > 0.4) { q -= 0.1; out = c.toDataURL('image/jpeg', q); }
        if (out.length > 900000) return reject(new Error('Imagem muito grande.'));
        resolve(out);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Não consegui abrir essa foto. Tente JPG ou PNG.')); };
      img.src = url;
    });
  }

  // ---------- telas de acesso ----------
  function authShell(inner) {
    $('btnOut').hidden = true;
    view.innerHTML = `<div class="panel center">${mascot()}${inner}</div>`;
  }
  const errBox = (m) => (m ? `<div class="err" role="alert">${esc(m)}</div>` : '');

  function showSetup(msg, keep) {
    authShell(`<h1>Bem-vinda à sua loja! 👑</h1><p class="sub">Primeiro acesso: cadastre o e-mail e a senha do painel. Vamos enviar um código para confirmar o e-mail.</p>${errBox(msg)}
      <form id="f" style="text-align:left" novalidate>
        <label class="fld">Seu e-mail<input type="email" name="email" autocomplete="email" required value="${esc((keep && keep.email) || '')}"></label>
        <label class="fld">Crie uma senha<input type="password" name="p1" autocomplete="new-password" minlength="8" required><span class="hint">Mínimo de 8 caracteres, com letras e números.</span></label>
        <label class="fld">Repita a senha<input type="password" name="p2" autocomplete="new-password" required></label>
        <button class="btn block" type="submit">Enviar código para o e-mail 💌</button></form>`);
    $('f').onsubmit = async (e) => {
      e.preventDefault();
      const f = e.target, btn = f.querySelector('button');
      if (f.p1.value !== f.p2.value) return showSetup('As senhas não são iguais.', { email: f.email.value });
      busy(btn, true);
      try {
        const d = await api('/api/auth', { action: 'setup-start', email: f.email.value, password: f.p1.value });
        showCode(d.email, d.devCode);
      } catch (er) { showSetup(er.message, { email: f.email.value }); }
    };
  }
  function showCode(email, devCode, msg) {
    authShell(`<h1>Confirme seu e-mail 💌</h1><p class="sub">Enviamos um código de 6 números para <b>${esc(email)}</b>. Digite abaixo (vale por 15 minutos).</p>${errBox(msg)}
      ${devCode ? `<div class="ok">Modo teste: seu código é <b>${esc(devCode)}</b></div>` : ''}
      <form id="f" novalidate><label class="fld"><input class="code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••" required></label>
      <button class="btn block" type="submit">Confirmar e entrar ✨</button></form>
      <button class="link" id="back">← Voltar</button>`);
    $('back').onclick = () => showSetup();
    $('f').querySelector('input').focus();
    $('f').onsubmit = async (e) => {
      e.preventDefault(); const btn = e.target.querySelector('button'); busy(btn, true);
      try { await api('/api/auth', { action: 'setup-confirm', code: e.target.code.value.trim() }); await boot(); }
      catch (er) { showCode(email, devCode, er.message); }
    };
  }
  function showLogin(msg, email) {
    authShell(`<h1>Entrar no painel 🔐</h1><p class="sub">Só a dona da loja tem acesso aqui.</p>${errBox(msg)}
      <form id="f" style="text-align:left" novalidate>
        <label class="fld">E-mail<input type="email" name="email" autocomplete="username" required value="${esc(email || '')}"></label>
        <label class="fld">Senha<input type="password" name="pw" autocomplete="current-password" required></label>
        <button class="btn block" type="submit">Entrar 💖</button></form>
      <button class="link" id="forgot">Esqueci minha senha</button>`);
    $('forgot').onclick = () => showForgot();
    $('f').onsubmit = async (e) => {
      e.preventDefault(); const f = e.target; busy(f.querySelector('button'), true);
      try { await api('/api/auth', { action: 'login', email: f.email.value, password: f.pw.value }); await boot(); }
      catch (er) { showLogin(er.message, f.email.value); }
    };
  }
  function showForgot(msg) {
    authShell(`<h1>Recuperar senha 🔑</h1><p class="sub">Digite o e-mail cadastrado e enviaremos um código.</p>${errBox(msg)}
      <form id="f" style="text-align:left" novalidate><label class="fld">E-mail<input type="email" name="email" required></label>
      <button class="btn block" type="submit">Enviar código 💌</button></form><button class="link" id="back">← Voltar</button>`);
    $('back').onclick = () => showLogin();
    $('f').onsubmit = async (e) => {
      e.preventDefault(); const f = e.target; busy(f.querySelector('button'), true);
      try { const d = await api('/api/auth', { action: 'forgot', email: f.email.value }); showReset(f.email.value, d.devCode); }
      catch (er) { showForgot(er.message); }
    };
  }
  function showReset(email, devCode, msg) {
    authShell(`<h1>Nova senha 🔑</h1><p class="sub">Se este e-mail estiver cadastrado, o código chegou na caixa de entrada (confira o spam).</p>${errBox(msg)}
      ${devCode ? `<div class="ok">Modo teste: seu código é <b>${esc(devCode)}</b></div>` : ''}
      <form id="f" style="text-align:left" novalidate>
        <label class="fld">Código<input class="code" name="code" inputmode="numeric" maxlength="6" required></label>
        <label class="fld">Nova senha<input type="password" name="pw" autocomplete="new-password" required><span class="hint">Mínimo de 8 caracteres, com letras e números.</span></label>
        <button class="btn block" type="submit">Salvar nova senha ✨</button></form>`);
    $('f').onsubmit = async (e) => {
      e.preventDefault(); const f = e.target; busy(f.querySelector('button'), true);
      try { await api('/api/auth', { action: 'reset', email, code: f.code.value.trim(), password: f.pw.value }); await boot(); }
      catch (er) { showReset(email, devCode, er.message); }
    };
  }

  // ---------- painel ----------
  function setData(d) { if (d.categories) S.cats = d.categories; if (d.products) S.prods = d.products; if (d.email) S.email = d.email; }
  async function call(body) {
    try { const d = await api('/api/admin', body); setData(d); return d; }
    catch (e) { if (e.status === 401) { toast('Sua sessão acabou. Entre de novo.', true); showLogin(); } throw e; }
  }

  function dash() {
    $('btnOut').hidden = false;
    const tabs = [['prod', '🛍️ Produtos'], ['cat', '🗂️ Categorias'], ['acc', '⚙️ Minha conta']];
    view.innerHTML = `<div class="tabs" role="tablist">${tabs.map(([k, t]) => `<button role="tab" class="${S.tab === k ? 'on' : ''}" data-tab="${k}">${t}</button>`).join('')}</div><div id="tabbody"></div>`;
    view.querySelector('.tabs').onclick = (e) => { const b = e.target.closest('[data-tab]'); if (b) { S.tab = b.dataset.tab; dash(); } };
    ({ prod: tabProducts, cat: tabCategories, acc: tabAccount })[S.tab]();
  }

  // --- produtos ---
  function tabProducts() {
    const body = $('tabbody');
    body.innerHTML = `<div class="bar"><input id="aq" type="search" placeholder="🔍 Buscar produto" value="${esc(S.q)}">
      <select id="afc" aria-label="Filtrar categoria"><option value="">Todas as categorias</option>${S.cats.map((c) => `<option value="${esc(c.id)}" ${S.fcat === c.id ? 'selected' : ''}>${esc(c.emoji)} ${esc(c.name)}</option>`).join('')}<option value="_none" ${S.fcat === '_none' ? 'selected' : ''}>Sem categoria</option></select>
      <span class="grow"></span><button class="btn" id="newp">➕ Novo produto</button></div><div class="plist" id="plist"></div>`;
    const draw = () => {
      const q = S.q.trim().toLowerCase();
      const a = S.prods.filter((p) => (!S.fcat || (S.fcat === '_none' ? !catOf(p.cat) : p.cat === S.fcat)) && (!q || p.title.toLowerCase().includes(q)));
      $('plist').innerHTML = a.length ? a.map((p) => `
        <div class="pitem ${p.hidden ? 'off' : ''}"><img src="${esc(p.img)}" alt="" loading="lazy" width="96" height="120">
          <div><h3>${esc(p.title)}</h3>
            <div class="meta">${catOf(p.cat) ? esc(catOf(p.cat).emoji + ' ' + catOf(p.cat).name) : '<span class="badge warn">Sem categoria</span>'} ${p.hidden ? '<span class="badge">Oculto na loja</span>' : ''}</div>
            <div class="priceedit"><span>R$</span><input value="${priceStr(p.price)}" inputmode="decimal" data-price="${esc(p.id)}" aria-label="Preço de ${esc(p.title)}"><button class="btn small" data-saveprice="${esc(p.id)}" title="Salvar preço">✓</button></div>
            <div class="acts"><button class="btn small white" data-edit="${esc(p.id)}">✏️ Editar</button><button class="btn small danger" data-del="${esc(p.id)}">🗑️</button></div></div></div>`).join('')
        : `<div class="panel center wide" style="grid-column:1/-1">${mascot()}<p>Nenhum produto por aqui.</p></div>`;
    };
    draw();
    let t; $('aq').oninput = (e) => { clearTimeout(t); t = setTimeout(() => { S.q = e.target.value; draw(); }, 150); };
    $('afc').onchange = (e) => { S.fcat = e.target.value; draw(); };
    $('newp').onclick = () => productForm();
    $('plist').onclick = async (e) => {
      const ed = e.target.closest('[data-edit]'), dl = e.target.closest('[data-del]'), sp = e.target.closest('[data-saveprice]');
      if (ed) return productForm(S.prods.find((p) => p.id === ed.dataset.edit));
      if (dl) {
        const p = S.prods.find((x) => x.id === dl.dataset.del);
        if (!(await confirmBox(`Excluir "${p.title}" da loja? Isso não pode ser desfeito.`))) return;
        try { await call({ action: 'product-delete', id: p.id }); toast('Produto excluído'); draw(); } catch (er) { toast(er.message, true); }
      }
      if (sp) {
        const p = S.prods.find((x) => x.id === sp.dataset.saveprice);
        const val = parsePrice(document.querySelector(`[data-price="${p.id}"]`).value);
        if (isNaN(val)) return toast('Preço inválido', true);
        try { await call({ action: 'product-save', id: p.id, title: p.title, price: val, cat: p.cat, desc: p.desc, hidden: p.hidden }); toast('Preço atualizado 💖'); draw(); } catch (er) { toast(er.message, true); }
      }
    };
  }

  function productForm(p) {
    const d = $('dlg'); let image = null;
    d.innerHTML = `<form class="form" novalidate><h2>${p ? 'Editar produto' : 'Novo produto'} ✨</h2><div id="ferr"></div>
      <label class="drop" id="drop"><input type="file" accept="image/*" id="file">${p ? `<img src="${esc(p.img)}" alt="">` : '<span style="font-size:44px">📷</span>'}<span>${p ? 'Toque para trocar a foto' : 'Toque para escolher a foto da galeria'}</span></label>
      <label class="fld">Título<input name="title" maxlength="80" required value="${esc(p ? p.title : '')}"></label>
      <div class="two"><label class="fld">Preço (R$)<input name="price" inputmode="decimal" placeholder="29,90" required value="${p ? priceStr(p.price) : ''}"></label>
      <label class="fld">Categoria<select name="cat"><option value="">Sem categoria</option>${S.cats.map((c) => `<option value="${esc(c.id)}" ${p && p.cat === c.id ? 'selected' : ''}>${esc(c.emoji)} ${esc(c.name)}</option>`).join('')}</select></label></div>
      <label class="fld">Descrição (opcional)<textarea name="desc" maxlength="500">${esc(p ? p.desc : '')}</textarea></label>
      <label class="check"><input type="checkbox" name="hidden" ${p && p.hidden ? 'checked' : ''}> Ocultar da loja (não aparece para as clientes)</label>
      <div class="row"><button class="btn" type="submit">Salvar 💖</button><button class="btn white" type="button" id="cancel">Cancelar</button></div></form>`;
    d.classList.add('open');
    const close = () => { d.classList.remove('open'); d.innerHTML = ''; };
    $('cancel').onclick = close; d.onclick = (e) => { if (e.target === d) close(); };
    const pick = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try {
        image = await compress(f);
        $('drop').innerHTML = `<input type="file" accept="image/*" id="file"><img src="${image}" alt=""><span>Foto escolhida ✔ (toque para trocar)</span>`;
        $('ferr').innerHTML = '';
        $('file').onchange = pick;
      } catch (er) { $('ferr').innerHTML = errBox(er.message); }
    };
    $('file').onchange = pick;
    d.querySelector('form').onsubmit = async (e) => {
      e.preventDefault(); const f = e.target, btn = f.querySelector('[type=submit]');
      const price = parsePrice(f.price.value);
      if (isNaN(price)) return ($('ferr').innerHTML = errBox('Digite um preço válido, ex.: 29,90'));
      if (!p && !image) return ($('ferr').innerHTML = errBox('Escolha uma foto para o produto.'));
      busy(btn, true);
      try {
        await call({ action: 'product-save', id: p && p.id, title: f.title.value, price, cat: f.cat.value, desc: f.desc.value, hidden: f.hidden.checked, image });
        close(); toast(p ? 'Produto atualizado 💖' : 'Produto criado 🎉'); tabProducts();
      } catch (er) { busy(btn, false); $('ferr').innerHTML = errBox(er.message); }
    };
    d.querySelector('[name=title]').focus();
  }

  // --- categorias ---
  function tabCategories() {
    const n = (id) => S.prods.filter((p) => p.cat === id).length;
    $('tabbody').innerHTML = `<div class="panel wide"><h2>Categorias 🗂️</h2><p class="sub">Troque o nome e o emoji, mude a ordem, crie ou apague categorias. A ordem daqui é a da loja.</p>
      ${S.cats.map((c, i) => `<div class="crow" data-id="${esc(c.id)}"><label class="mini"><span class="sr">Emoji</span><input class="emo" value="${esc(c.emoji)}" maxlength="8" data-f="emoji" aria-label="Emoji"></label>
        <label class="mini"><span class="sr">Nome</span><input value="${esc(c.name)}" maxlength="30" data-f="name" aria-label="Nome da categoria"></label>
        <div class="acts"><button class="btn small" data-save>Salvar</button><button class="btn small white" data-up ${i === 0 ? 'disabled' : ''} aria-label="Subir">↑</button><button class="btn small white" data-down ${i === S.cats.length - 1 ? 'disabled' : ''} aria-label="Descer">↓</button><button class="btn small danger" data-delc aria-label="Apagar">🗑️</button></div>
        <div class="small-note">${n(c.id)} produto(s) nesta categoria</div></div>`).join('') || '<p>Nenhuma categoria ainda.</p>'}
      <div class="crow"><label class="mini"><input class="emo" id="nemo" value="💖" maxlength="8" aria-label="Emoji da nova categoria"></label><label class="mini"><input id="nname" maxlength="30" placeholder="Nome da nova categoria" aria-label="Nome da nova categoria"></label><div class="acts"><button class="btn small" id="addc">➕ Criar</button></div></div></div>`;
    $('addc').onclick = async () => {
      try { await call({ action: 'category-save', name: $('nname').value, emoji: $('nemo').value }); toast('Categoria criada 🎀'); tabCategories(); } catch (er) { toast(er.message, true); }
    };
    $('tabbody').onclick = async (e) => {
      const row = e.target.closest('.crow[data-id]'); if (!row) return;
      const id = row.dataset.id, c = catOf(id);
      try {
        if (e.target.closest('[data-save]')) {
          await call({ action: 'category-save', id, name: row.querySelector('[data-f=name]').value, emoji: row.querySelector('[data-f=emoji]').value });
          toast('Categoria salva 💖'); tabCategories();
        } else if (e.target.closest('[data-up]') || e.target.closest('[data-down]')) {
          await call({ action: 'category-move', id, dir: e.target.closest('[data-up]') ? 'up' : 'down' }); tabCategories();
        } else if (e.target.closest('[data-delc]')) {
          const k = n(id);
          if (!(await confirmBox(`Apagar a categoria "${c.name}"?${k ? ` Os ${k} produto(s) dela ficarão "sem categoria" (continuam na loja).` : ''}`))) return;
          await call({ action: 'category-delete', id }); toast('Categoria apagada'); tabCategories();
        }
      } catch (er) { toast(er.message, true); }
    };
  }

  // --- conta ---
  function tabAccount() {
    $('tabbody').innerHTML = `<div class="panel"><h2>Minha conta ⚙️</h2><p class="sub">Você está logada como <b>${esc(S.email)}</b>. Dá para entrar de qualquer celular ou computador com este e-mail e a senha.</p><div id="aerr"></div>
      <form id="pw" novalidate><label class="fld">Senha atual<input type="password" name="cur" autocomplete="current-password" required></label>
      <label class="fld">Nova senha<input type="password" name="nw" autocomplete="new-password" required><span class="hint">Mínimo de 8 caracteres, com letras e números.</span></label>
      <button class="btn" type="submit">Trocar senha 🔑</button></form>
      <hr style="border:0;border-top:3px dashed #ffc2dc;margin:22px 0"><button class="btn white" id="outall">Sair de todos os aparelhos</button></div>`;
    $('pw').onsubmit = async (e) => {
      e.preventDefault(); const f = e.target;
      try { await call({ action: 'change-password', current: f.cur.value, password: f.nw.value }); f.reset(); $('aerr').innerHTML = '<div class="ok">Senha alterada! Os outros aparelhos foram desconectados.</div>'; }
      catch (er) { $('aerr').innerHTML = errBox(er.message); }
    };
    $('outall').onclick = async () => { try { await call({ action: 'logout-all' }); showLogin(); } catch (er) { toast(er.message, true); } };
  }

  $('btnOut').onclick = async () => { try { await api('/api/auth', { action: 'logout' }); } catch {} showLogin(); };

  async function boot() {
    try {
      const st = await (await fetch('/api/auth', { credentials: 'same-origin' })).json();
      if (!st.configured) return showSetup();
      if (!st.loggedIn) return showLogin();
      const d = await api('/api/admin', { action: 'get' }); setData(d); dash();
    } catch (e) {
      authShell(`<h1>Ops 🥺</h1>${errBox(e.message || 'Não foi possível carregar. Tente de novo.')}<button class="btn" onclick="location.reload()">Tentar de novo</button>`);
    }
  }
  document.querySelectorAll('[data-mascot]').forEach((n) => (n.innerHTML = RB.mascot()));
  boot();
})();
