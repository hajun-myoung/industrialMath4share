document.addEventListener('DOMContentLoaded', () => {
  const langButtons = [...document.getElementsByClassName('lang-buttons')];
  if (!localStorage.getItem('selectedLanguage')) {
    localStorage.setItem('selectedLanguage', 'kor');
  }
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'kor';

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

  // admin button
  const adminBtn = document.getElementById('admin-button');
  let pressTimer;
  const adminModal = document.getElementById('admin-modal');

  // 2초 이상 클릭해야 모달창 뜨게 하기
  adminBtn.addEventListener('pointerdown', () => {
    pressTimer = setTimeout(() => {
      adminModal.style.display = 'block';
    }, 2000);
  });

  adminBtn.addEventListener('pointerup', () => {
    clearTimeout(pressTimer);
    // 포인터 업(클릭 취소)하면 무조건 타이머 삭제
    // 2초 넘으면 모달창이 먼저 뜸
    // 그 전에 포인터 업하면 취소됨
  });

  adminBtn.addEventListener('pointerleave', () => {
    clearTimeout(pressTimer);
    // 같은 원리, 다만 마우스가 떠나기만 해도 취소됨
  });

  // form buttons
  const adminCancelBtn = document.getElementById('cancel');
  adminCancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adminModal.style.display = 'none';
  });

  // form submitting
  const adminForm = document.getElementById('admin-form');
  const adminInputId = document.getElementById('form-input-id');
  const adminInputPw = document.getElementById('form-input-pw');

  adminForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (adminInputId !== 'admin') {
      alert('Wrong ID');
      window.location.href = '/index.html';
    } else if (adminInputPw !== '1q2w3e4r') {
      alert('Wrong PW');
      window.location.href = '/index.html';
    } else {
      window.location.href = '/admin.html';
    }
  });
});
