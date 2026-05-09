document.addEventListener('DOMContentLoaded', () => {
  const langButtons = [...document.getElementsByClassName('lang-buttons')];
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'ko';

  langButtons.forEach((button) => {
    if (button.dataset.lang === savedLanguage) {
      button.classList.add('selected');
    }

    button.addEventListener('click', () => {
      const selectedLanguage = button.dataset.lang;
      localStorage.setItem('selectedLanguage', selectedLanguage);

      langButtons.forEach((button) => button.classList.remove('selected'));
      button.classList.add('selected');
    });
  });

  const isTogoButtons = [...document.getElementsByClassName('box-selector')];

  isTogoButtons.forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = './pages/order.html';
    });
  });
});
