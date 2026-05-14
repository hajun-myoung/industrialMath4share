const adminLoginBtn = document.getElementById('adminLoginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const menuList = document.getElementById('menuList');
const orderList = document.getElementById('orderList');
let menus = [];
let currentOrder = [];
const getAllMenus = async () => {
  const resp = await fetch(`/api/menus`);
  const menus = await resp.json();
  // console.log('menus', menus);
  return menus;
};
// getAllMenus();
document.addEventListener('DOMContentLoaded', async (e) => {
  menus = await getAllMenus();
  console.log('menus', menus);
  renderMenus();
  window.addEventListener('click', (e) => {
    console.log('e.target', e.target);
    if (e.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'admin' && password === 'admin') {
      loginModal.style.display = 'none';
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      window.location.href = 'admin.html';
    } else {
      alert('사용자명 또는 비밀번호가 올바르지 않습니다.');
    }
  });
  adminLoginBtn.addEventListener('click', (e) => {
    loginModal.style.display = 'flex';
  });
});
function renderMenus() {
  menus.forEach((menu) => {
    const menuElm = document.createElement('div');
    menuElm.innerHTML = `
    <div>메뉴이름: ${menu.name}</div>
    <div>가격: ${menu.price}</div>
    `;
    menuElm.addEventListener('click', (e) => {
      addToOrder(menu);
    });
    menuList.appendChild(menuElm);
  });
}
function addToOrder(menu) {
  currentOrder.push(menu);
  console.log('currentOrder', currentOrder);
}
