(() => {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  if (!motion.matches) return;

  const text = document.querySelector('.hero-focus-text');
  const lines = [...document.querySelectorAll('.hero-focus-line')].map(line => line.textContent);
  const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
  let typing = true;

  motion.addEventListener('change', () => {
    typing = false;
    text.textContent = lines[0];
    text.removeAttribute('data-typing');
  }, { once: true });

  async function typeHeadline() {
    text.setAttribute('data-typing', '');
    for (const line of lines.slice(1)) {
      await wait(950);
      while (typing && text.textContent.length) {
        text.textContent = text.textContent.slice(0, -1);
        await wait(10);
      }
      for (let length = 1; typing && length <= line.length; length++) {
        text.textContent = line.slice(0, length);
        await wait(19);
      }
      if (!typing) return;
    }
    text.removeAttribute('data-typing');
  }

  typeHeadline();

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

  document.querySelectorAll('.skill-card, #work article').forEach(card => observer.observe(card));
})();
