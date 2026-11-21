(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const key = 'portfolio-theme';
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch { /* System colours also work without storage. */ }

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    function isDark() {
      return root.dataset.theme ? root.dataset.theme === 'dark' : systemTheme.matches;
    }
    function syncSwitch() {
      toggle.checked = isDark();
    }
    toggle.addEventListener('change', () => {
      root.dataset.theme = toggle.checked ? 'dark' : 'light';
      try { localStorage.setItem(key, root.dataset.theme); } catch { /* Session-only choice. */ }
      syncSwitch();
    });
    if (systemTheme.addEventListener) systemTheme.addEventListener('change', syncSwitch);
    else systemTheme.addListener(syncSwitch);
    syncSwitch();
    toggle.closest('.theme-switch').hidden = false;
  });
})();
