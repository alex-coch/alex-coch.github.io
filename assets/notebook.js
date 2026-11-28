(() => {
  const frame = document.getElementById('notebook-export');
  const root = document.documentElement;
  let resizeObserver;

  function fragment() {
    try { return decodeURIComponent(location.hash.slice(1)); }
    catch { return ''; }
  }

  function scrollToCell(id) {
    const cell = frame.contentDocument?.getElementById(id);
    if (!cell || !frame.contentDocument.getElementById('notebook')?.contains(cell)) return;
    const header = document.querySelector('body > header');
    const top = window.scrollY + frame.getBoundingClientRect().top
      + cell.getBoundingClientRect().top - header.offsetHeight - 16;
    window.scrollTo({top, behavior: 'instant'});
    cell.setAttribute('tabindex', '-1');
    cell.focus({preventScroll: true});
  }

  function visitCell(id) {
    const hash = '#' + encodeURIComponent(id);
    if (fragment() !== id) history.pushState(null, '', hash);
    scrollToCell(id);
  }

  function connectNotebook() {
    resizeObserver?.disconnect();
    const doc = frame.contentDocument;
    const notebook = doc?.getElementById('notebook');
    if (!notebook) return;

    function syncTheme() {
      const theme = root.dataset.theme;
      if (theme) doc.documentElement.dataset.theme = theme;
      else delete doc.documentElement.dataset.theme;
    }

    function fitNotebook() {
      frame.style.height = Math.ceil(notebook.getBoundingClientRect().height) + 2 + 'px';
    }

    syncTheme();
    fitNotebook();
    resizeObserver = new ResizeObserver(fitNotebook);
    resizeObserver.observe(notebook);

    doc.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = decodeURIComponent(link.hash.slice(1));
      if (!doc.getElementById(id)) return;
      event.preventDefault();
      visitCell(id);
    });
    scrollToCell(fragment());
  }

  for (const link of document.querySelectorAll('[data-notebook-fragment]')) {
    link.addEventListener('click', event => {
      const id = link.dataset.notebookFragment;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
          || !frame.contentDocument?.getElementById(id)) return;
      event.preventDefault();
      visitCell(id);
    });
  }

  new MutationObserver(() => {
    const notebookRoot = frame.contentDocument?.documentElement;
    if (notebookRoot) notebookRoot.dataset.theme = root.dataset.theme || '';
  }).observe(root, {attributeFilter: ['data-theme']});

  window.addEventListener('hashchange', () => scrollToCell(fragment()));
  frame.addEventListener('load', connectNotebook);
  if (frame.contentDocument?.readyState === 'complete') connectNotebook();
})();
