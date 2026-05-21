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

    newMenuTitle.innerText = JSON.parse(menu.name)[selectedLanguage];
    newEditButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>수정`;
    newDeleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>삭제`;

    newEditButton.className = 'menu-edit';
    newDeleteButton.className = 'menu-delete';
    newMenuWrapper.className = 'menu-wrapper';

    newButtonGroups.appendChild(newEditButton);
    newButtonGroups.appendChild(newDeleteButton);

    newMenuWrapper.appendChild(newMenuTitle);
    newMenuWrapper.appendChild(newButtonGroups);
    menuList.appendChild(newMenuWrapper);
  });
});
