(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const key = 'portfolio-theme';
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch { /* System colours also work without storage. */ }

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme-toggle');
    function isDark() {
      return root.dataset.theme ? root.dataset.theme === 'dark' : systemTheme.matches;
    }
    function updateButton() {
      button.setAttribute('aria-pressed', String(isDark()));
    }
    button.addEventListener('click', () => {
      root.dataset.theme = isDark() ? 'light' : 'dark';
      try { localStorage.setItem(key, root.dataset.theme); } catch { /* Session-only choice. */ }
      updateButton();
    });
    systemTheme.addEventListener('change', updateButton);
    updateButton();
    button.hidden = false;
  });
})();
