(() => {
  const audio = document.getElementById('example-narration');
  const segments = Array.from(document.querySelectorAll('#example-transcript [data-start]'), (element) => ({
    element,
    start: Number(element.dataset.start),
    end: Number(element.dataset.end),
  }));
  let active;

  function syncHighlight() {
    const time = audio.currentTime;
    const current = audio.ended ? undefined : segments.find(({ start, end }) => start <= time && time < end);
    if (current === active) return;

    active?.element.removeAttribute('data-active');
    current?.element.setAttribute('data-active', '');
    active = current;
  }

  for (const event of ['play', 'timeupdate', 'seeked', 'ended']) {
    audio.addEventListener(event, syncHighlight);
  }
})();
