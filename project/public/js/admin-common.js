document.addEventListener('DOMContentLoaded', () => {
  const currentPage = document.body.dataset.adminPage;

  document.querySelectorAll('[data-nav-page]').forEach((navItem) => {
    const isCurrentPage = navItem.dataset.navPage === currentPage;
    navItem.classList.toggle('selected', isCurrentPage);

    if (isCurrentPage) {
      navItem.setAttribute('aria-current', 'page');
    } else {
      navItem.removeAttribute('aria-current');
    }
  });

  const tabletScreen = document.querySelector('.tablet-screen');
  const cursor = document.getElementById('cursor');

  if (!tabletScreen || !cursor) return;

  tabletScreen.addEventListener('pointermove', (e) => {
    const rect = tabletScreen.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cursor.style.transform = `translate(${x}px, ${y}px)`;
  });

  tabletScreen.addEventListener('pointerdown', () => {
    cursor.classList.add('active');
  });

  tabletScreen.addEventListener('pointerup', () => {
    cursor.classList.remove('active');
  });
});
