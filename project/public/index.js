console.log('index.js');

const getAllMenus = async () => {
  const res = await fetch(`/api/menus`);
  const menus = await res.json();
  return menus;
};

document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('menuList');
  const menus = (await getAllMenus()) ?? [];

  menus.forEach((menu) => {
    const menu_element = document.createElement('div');
    menu_element.innerHTML = `
    <div>${menu.name}</div>
    <div>${menu.price}원</div>
    `;

    menuList.appendChild(menu_element);
  });
});
