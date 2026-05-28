import { getAllMenus, getAllCategories, createNewMenu } from './utils.js';

console.log('[INFO]File Loaded: admin.js');

document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('menuList');
  const menus = (await getAllMenus()) ?? [];
  const categoreis = getAllCategories(menus);

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

  // mockup-touch-cursor
  const tabletScreen = document.querySelector('.tablet-screen');
  const cursor = document.getElementById('cursor');

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

  const modalCategoryDropdown = document.getElementById('menuCategory');
  categoreis.forEach((category) => {
    const newOption = document.createElement('option');
    newOption.value = category;
    newOption.innerText = category;

    modalCategoryDropdown.appendChild(newOption);
  });

  const modal = document.getElementById('modal');
  const menuAddingModal = document.getElementById('menuAddingModal');
  menuAddingModal.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    // [Log] {menuNameKor: "", menuNameEng: "", menuNameEsp: "", menuPrice: "", menuImage: ""} (admin.js, line 87)

    const menuName = {
      kor: data['menuNameKor'],
      eng: data['menuNameEng'],
      esp: data['menuNameEsp'],
    };

    const price = +data['menuPrice'];
    const category = data['category'];
    const image = data['menuImage'];

    createNewMenu(menuName, price, category, image);

    modal.style.display = 'none';
  });

  // Modal Opener
  const addMenuBtn = document.getElementById('addMenuBtn');
  addMenuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // reuse menuAddingModal when I decleared at submit handle
    modal.style.display = 'flex';
  });

  window.addEventListener('click', (e) => {
    e.target === modal && (modal.style.display = 'none');
  });
});
