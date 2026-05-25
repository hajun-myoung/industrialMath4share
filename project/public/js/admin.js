import { getAllMenus } from './utils.js';

console.log('[INFO]File Loaded: admin.js');

document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('menuList');
  const menus = (await getAllMenus()) ?? [];

  const selectedLanguage = localStorage.getItem('selectedLanguage');

  menus.forEach((menu) => {
    const newMenuWrapper = document.createElement('div');
    const newMenuTitle = document.createElement('div');
    const newButtonGroups = document.createElement('div');
    const newEditButton = document.createElement('button');
    const newDeleteButton = document.createElement('button');

    // category and 그 뭐냐 price
    const newMenuCategory = document.createElement('div');
    const newMenuPrice = document.createElement('div');

    newMenuCategory.className = 'menu-category';
    newMenuPrice.className = 'menu-price';

    newMenuCategory.innerText = menu.category;
    newMenuPrice.innerText = `₩${Number(menu.price).toLocaleString()}`;

    newMenuTitle.innerText = JSON.parse(menu.name)[selectedLanguage];
    newEditButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>수정`;
    newDeleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>삭제`;

    newMenuTitle.className = 'menu-name';

    newEditButton.className = 'menu-edit';
    newDeleteButton.className = 'menu-delete';
    newMenuWrapper.className = 'menu-wrapper';

    newButtonGroups.className = 'menu-button-group';

    newButtonGroups.appendChild(newEditButton);
    newButtonGroups.appendChild(newDeleteButton);

    newMenuWrapper.appendChild(newMenuTitle);
    newMenuWrapper.appendChild(newMenuCategory);
    newMenuWrapper.appendChild(newMenuPrice);
    newMenuWrapper.appendChild(newButtonGroups);
    menuList.appendChild(newMenuWrapper);
  });
});
