(function () {
  RB.init('sobre');
  const wa = RB.waLink('Olá, Royal Beauty! 👑 Vim pela página Sobre nós.');
  document.getElementById('waLink').href = wa;
  document.getElementById('igLink').href = RB.igLink;
  document.getElementById('igLink').target = '_blank';
  document.getElementById('waLink').target = '_blank';
  const b = document.getElementById('waBtn');
  b.href = wa; b.innerHTML = RB.icon('wa') + ' Falar no WhatsApp';

  // cartões viram também por toque/teclado
  document.querySelectorAll('.flip').forEach((f) => f.addEventListener('click', () => f.classList.toggle('on')));
  // entrada em 3D na rolagem
  document.querySelectorAll('.flip').forEach((f) => RB.tilt && void 0);
})();
