(() => {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  function setupHeadline() {
    const text = document.querySelector('.hero-focus-text');
    if (!text || !motion.matches) return;

    const phrase = text.textContent;
    let length = 0;
    let timer;

    function finishHeadline() {
      clearTimeout(timer);
      text.textContent = phrase;
      text.removeAttribute('data-typing');
      motion.removeEventListener('change', finishHeadline);
    }

    function typeCharacter() {
      length += 1;
      if (length === phrase.length) {
        finishHeadline();
        return;
      }

      text.textContent = phrase.slice(0, length);
      timer = setTimeout(typeCharacter, 60);
    }

    text.textContent = '';
    text.setAttribute('data-typing', '');
    motion.addEventListener('change', finishHeadline);
    timer = setTimeout(typeCharacter, 800);
  }

  setupHeadline();

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    const visibleCards = new Set(entries.filter(entry => entry.isIntersecting).map(entry => entry.target));
    visibleCards.forEach(target => {
      observer.unobserve(target);
      if (motion.matches) {
        target.animate(
          [{ opacity: 0.65, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 220, easing: 'ease-out' }
        );
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.skill-card, .work-card').forEach(card => observer.observe(card));
})();
