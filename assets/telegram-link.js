(() => {
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!mobile) return;

  const link = document.querySelector('[data-telegram-app]');
  let fallbackTimer;

  function cancelFallback() {
    clearTimeout(fallbackTimer);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelFallback();
  });
  window.addEventListener('pagehide', cancelFallback);

  link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    cancelFallback();
    fallbackTimer = setTimeout(() => {
      if (!document.hidden) window.location.assign(link.href);
    }, 1500);
    window.location.assign(link.dataset.telegramApp);
  });
})();
