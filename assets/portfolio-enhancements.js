(() => {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  function setupHeadline() {
    const text = document.querySelector('.hero-focus-text');
    if (!text) return;

    const lines = [...document.querySelectorAll('.hero-focus-line')].map(line => line.textContent);
    let index;
    let length;
    let deleting;
    let timer;

    function animateHeadline() {
      length += deleting ? -1 : 1;
      text.textContent = lines[index].slice(0, length);

      if (length === 0) {
        index = (index + 1) % lines.length;
        deleting = false;
        timer = setTimeout(animateHeadline, 400);
      } else if (length === lines[index].length) {
        deleting = true;
        timer = setTimeout(animateHeadline, 2000);
      } else {
        timer = setTimeout(animateHeadline, deleting ? 40 : 60);
      }
    }

    function updateHeadlineMotion() {
      clearTimeout(timer);
      index = 0;
      length = 0;
      deleting = false;
      text.textContent = motion.matches ? '' : lines[0];
      text.toggleAttribute('data-typing', motion.matches);
      if (motion.matches) timer = setTimeout(animateHeadline, 800);
    }

    motion.addEventListener('change', updateHeadlineMotion);
    updateHeadlineMotion();
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
