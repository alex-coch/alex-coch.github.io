(() => {
  const header = document.querySelector('body > header');
  const sections = Array.from(header.querySelectorAll('a[href^="#"]'), link => ({
    link,
    section: document.getElementById(link.hash.slice(1))
  }));
  let current;

  function update() {
    const threshold = header.offsetHeight + 18;
    const atBottom = window.scrollY > 0 &&
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
    const active = atBottom ? sections.at(-1) :
      sections.findLast(({ section }) => section.getBoundingClientRect().top <= threshold);
    if (current === active) return;
    current?.link.removeAttribute('aria-current');
    active?.link.setAttribute('aria-current', 'location');
    current = active;
  }

  function measureHeader() {
    document.documentElement.style.setProperty('--nav-height', header.offsetHeight + 'px');
    if (sections.length) update();
  }

  const toggle = header.querySelector('.menu-toggle');
  function setMenuOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close main menu' : 'Open main menu');
    toggle.textContent = open ? '×' : '☰';
  }
  function closeMenu() {
    setMenuOpen(false);
  }
  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target) || event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  matchMedia('(max-width:48rem)').addEventListener('change', closeMenu);
  window.addEventListener('pageshow', closeMenu);

  measureHeader();
  document.documentElement.dataset.pinnedNav = '';
  new ResizeObserver(measureHeader).observe(header);
  if (!sections.length) return;
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('pageshow', update);
})();
