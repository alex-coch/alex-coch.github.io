(() => {
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!mobile) return;

  let fallbackTimer;

  function cancelFallback() {
    clearTimeout(fallbackTimer);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelFallback();
  });
  window.addEventListener('pagehide', cancelFallback);

  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-app-url]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    cancelFallback();
    fallbackTimer = setTimeout(() => {
      if (!document.hidden) window.location.assign(link.href);
    }, 1500);
    window.location.assign(link.dataset.appUrl);
  });
})();
