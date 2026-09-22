/* SOLO SUSPEITO — navegação dos slides e perguntas.
   Sem memória: ao recarregar a página, tudo recomeça do início. */
(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  const btnPrev = document.querySelector('.nav-prev');
  const btnNext = document.querySelector('.nav-next');
  const btnHome = document.querySelector('.nav-home');
  const atual = document.getElementById('nav-atual');
  document.getElementById('nav-total').textContent = total;

  let idx = 0;

  function fecharPerguntas() {
    document.querySelectorAll('.q.open').forEach(function (q) {
      q.classList.remove('open');
      q.querySelector('.q-btn').setAttribute('aria-expanded', 'false');
    });
  }

  function ir(n) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === idx && slides[n].classList.contains('active')) return;
    fecharPerguntas();
    slides[idx].classList.remove('active');
    idx = n;
    const s = slides[idx];
    s.querySelector('.stage').scrollTop = 0;
    s.classList.add('active');
    atual.textContent = idx + 1;
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx === total - 1;
    btnHome.hidden = idx === 0;
  }

  const proximo = function () { ir(idx + 1); };
  const anterior = function () { ir(idx - 1); };

  btnNext.addEventListener('click', proximo);
  btnPrev.addEventListener('click', anterior);

  // Botões que levam a um slide específico (capa e "início")
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () { ir(Number(b.dataset.go) - 1); });
  });

  // Perguntas: clicar no "?" mostra/esconde o balão
  document.querySelectorAll('.q-btn').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      const q = b.closest('.q');
      const abrir = !q.classList.contains('open');
      fecharPerguntas();
      if (abrir) {
        q.classList.add('open');
        b.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.q')) fecharPerguntas();
  });

  // Teclado
  document.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ':
        e.preventDefault(); proximo(); break;
      case 'ArrowLeft': case 'PageUp':
        e.preventDefault(); anterior(); break;
      case 'Home': ir(0); break;
      case 'End': ir(total - 1); break;
      case 'Escape': fecharPerguntas(); break;
    }
  });

  // Deslizar no celular
  let x0 = null, y0 = 0;
  document.addEventListener('touchstart', function (e) {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? proximo() : anterior();
    }
  }, { passive: true });

  ir(0);
})();
