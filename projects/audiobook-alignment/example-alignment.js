(() => {
  const audio = document.getElementById('example-narration');
  const segments = Array.from(document.querySelectorAll('#example-transcript [data-start]'), (element) => ({
    element,
    start: Number(element.dataset.start),
    end: Number(element.dataset.end),
  }));
  let active;

  function setHighlight(current) {
    if (current === active) return;

    active?.element.removeAttribute('data-active');
    current?.element.setAttribute('data-active', '');
    active = current;
  }

  function syncHighlight() {
    const time = audio.currentTime;
    setHighlight(audio.ended ? undefined : segments.find(({ start, end }) => start <= time && time < end));
  }

  for (const segment of segments) {
    segment.element.addEventListener('click', () => {
      audio.currentTime = segment.start;
      setHighlight(segment);
      if (audio.paused) audio.play().catch(syncHighlight);
    });
  }

  for (const event of ['play', 'timeupdate', 'seeking', 'seeked', 'ended']) {
    audio.addEventListener(event, syncHighlight);
  }
})();
