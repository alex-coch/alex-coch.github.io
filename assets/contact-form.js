(() => {
  const form = document.querySelector('#contact-form form');
  const submit = form.querySelector('button[type="submit"]');
  const status = document.getElementById('contact-status');

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;

    const data = new FormData(form);
    if (!data.get('g-recaptcha-response')) {
      status.textContent = 'Complete the CAPTCHA before sending your message. If it is unavailable, use Telegram or WhatsApp.';
      return;
    }

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
      window.grecaptcha?.reset();
      submit.disabled = false;
    }
  });
})();
