(() => {
  const walkthrough = document.querySelector('[data-failure-walkthrough]');
  const selector = walkthrough.querySelector('.failure-selector');
  const panels = [...walkthrough.querySelectorAll('[data-failure-scenario]')];
  const previous = walkthrough.querySelector('[data-failure-previous]');
  const next = walkthrough.querySelector('[data-failure-next]');
  const status = walkthrough.querySelector('[role="status"]');
  let step = 0;

  function render() {
    const scenario = selector.querySelector('input:checked').value;
    const panel = panels.find(candidate => candidate.id === scenario);
    const steps = [...panel.querySelectorAll('li')];
    panels.forEach(candidate => { candidate.hidden = candidate !== panel; });
    steps.forEach((item, index) => { item.hidden = index !== step; });
    previous.setAttribute('aria-disabled', String(step === 0));
    next.setAttribute('aria-disabled', String(step === steps.length - 1));
    status.textContent = `Step ${step + 1} of ${steps.length}`;
  }

  selector.addEventListener('change', () => {
    step = 0;
    render();
  });

  for (const [button, offset] of [[previous, -1], [next, 1]]) {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-disabled') === 'true') return;
      step += offset;
      render();
    });
  }

  render();
  selector.hidden = false;
  walkthrough.querySelector('.failure-controls').hidden = false;
  walkthrough.querySelectorAll('h3').forEach(heading => { heading.hidden = true; });
})();
