(() => {
  const section = document.getElementById('writing');
  const posts = [...section.querySelectorAll('.post-list li')];
  const controls = section.querySelector('.post-pagination');
  const previous = controls.querySelector('[data-page="previous"]');
  const next = controls.querySelector('[data-page="next"]');
  const status = controls.querySelector('[role="status"]');
  const pageSize = 10;
  const pageCount = Math.ceil(posts.length / pageSize);
  let page = 1;

  function showPage(number) {
    page = number;
    const start = (page - 1) * pageSize;
    posts.forEach((post, index) => {
      post.hidden = index < start || index >= start + pageSize;
    });
    previous.disabled = page === 1;
    next.disabled = page === pageCount;
    status.textContent = `Page ${page} of ${pageCount}`;
  }

  previous.addEventListener('click', () => showPage(page - 1));
  next.addEventListener('click', () => showPage(page + 1));
  showPage(1);
  controls.hidden = pageCount < 2;
})();
