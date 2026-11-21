(() => {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  const lines = [...document.querySelectorAll('.hero-focus-lines span')];
  const toggle = document.querySelector('.hero-focus-toggle');
  let current = 0;
  let paused = false;
  let timer;

  function showLine(index) {
    lines[current].removeAttribute('data-visible');
    current = index;
    lines[current].setAttribute('data-visible', '');
  }

  function updateRotation() {
    clearInterval(timer);
    toggle.hidden = !motion.matches;
    if (!motion.matches) showLine(0);
    if (motion.matches && !paused && !document.hidden) {
      timer = setInterval(() => showLine((current + 1) % lines.length), 4000);
    }
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-label', paused ? 'Play headline rotation' : 'Pause headline rotation');
    updateRotation();
  });

  motion.addEventListener('change', updateRotation);
  document.addEventListener('visibilitychange', updateRotation);
  updateRotation();

  if (!motion.matches || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(({ target }) => {
      observer.unobserve(target);
      if (motion.matches) {
        target.animate(
          [{ opacity: 0.65, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 220, easing: 'ease-out' }
        );
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
})();
