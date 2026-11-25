(() => {
  const posts = [...document.querySelectorAll('.post-list li')];
  const controls = document.querySelector('.post-pagination');
  const pageSize = 10;
  const last = Math.ceil(posts.length / pageSize);
  const requested = Number(new URLSearchParams(location.search).get('page'));
  const page = Number.isInteger(requested) ? Math.max(1, Math.min(last, requested)) : 1;

  posts.forEach((post, index) => {
    post.hidden = Math.floor(index / pageSize) + 1 !== page;
  });
  if (last < 2) return;

  function addLink(number, text, label) {
    const link = document.createElement('a');
    link.href = number === 1 ? '/posts/' : '?page=' + number;
    link.textContent = text;
    link.setAttribute('aria-label', label);
    if (number === page) link.setAttribute('aria-current', 'page');
    controls.append(link);
  }

  if (page > 1) addLink(page - 1, '‹', 'Previous page');
  let previous = 0;
  for (let number = 1; number <= last; number++) {
    if (number !== 1 && number !== last && Math.abs(number - page) > 1) continue;
    if (number - previous > 2) {
      const gap = document.createElement('span');
      gap.textContent = '…';
      gap.setAttribute('aria-hidden', 'true');
      controls.append(gap);
    } else if (number - previous === 2) {
      addLink(number - 1, number - 1, 'Page ' + (number - 1));
    }
    addLink(number, number, 'Page ' + number);
    previous = number;
  }
  if (page < last) addLink(page + 1, '›', 'Next page');
  controls.hidden = false;
})();
