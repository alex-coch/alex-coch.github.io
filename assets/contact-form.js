(() => {
  const form = document.querySelector('#contact-form form');
  const submit = form.querySelector('button[type="submit"]');
  const status = document.getElementById('contact-status');
  const captcha = document.getElementById('contact-captcha');
  const root = document.documentElement;
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const widgets = new Map();
  let activeWidget;

  function syncCaptchaTheme() {
    const theme = root.dataset.theme || (systemTheme.matches ? 'dark' : 'light');
    if (activeWidget?.theme === theme) return;

    const api = window.grecaptcha;
    if (activeWidget) {
      const wasVerified = Boolean(api.getResponse(activeWidget.id));
      api.reset(activeWidget.id);
      activeWidget.container.hidden = true;
      if (wasVerified && !submit.disabled) {
        status.textContent = 'Theme changed. Please complete the CAPTCHA again.';
      }
    }

    if (!widgets.has(theme)) {
      const container = captcha.appendChild(document.createElement('div'));
      const id = api.render(container, {
        sitekey: captcha.dataset.sitekey,
        size: captcha.dataset.size,
        theme
      });
      widgets.set(theme, { id, container, theme });
    }
    activeWidget = widgets.get(theme);
    activeWidget.container.hidden = false;
  }

  window.initContactCaptcha = () => {
    syncCaptchaTheme();
    new MutationObserver(syncCaptchaTheme).observe(root, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    if (systemTheme.addEventListener) systemTheme.addEventListener('change', syncCaptchaTheme);
    else systemTheme.addListener(syncCaptchaTheme);
  };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;

    const token = activeWidget && window.grecaptcha.getResponse(activeWidget.id);
    if (!token) {
      status.textContent = 'Complete the CAPTCHA before sending your message. If it is unavailable, use Telegram or WhatsApp.';
      return;
    }

    const data = new FormData(form);
    data.set('g-recaptcha-response', token);
    submit.disabled = true;
    status.textContent = 'Sending…';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        redirect: 'error',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        status.textContent = 'Formspree did not confirm the submission. Check the CAPTCHA and try again.';
        return;
      }

      form.reset();
      status.textContent = 'Message sent. Thanks for getting in touch.';
    } catch {
      status.textContent = 'Could not confirm delivery. Please try again or contact me via Telegram or WhatsApp.';
    } finally {
      if (activeWidget) window.grecaptcha.reset(activeWidget.id);
      submit.disabled = false;
    }
  });
})();
