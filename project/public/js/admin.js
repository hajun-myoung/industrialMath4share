import { getAllMenus, getAllCategories, createNewMenu, deleteMenu, updateMenu } from './utils.js';

let isEditting = false;
let menu_id = null;

console.log('[INFO]File Loaded: admin.js');

// FIXME: State-based table update가 아니라 forced refreshing으로 접근하고 있음
// state를 구현하거나, 페이지 전체가 아니라 표만 refresh하는 방법을 찾고
// 안된다고 하면 menus 배열이라도 메뉴얼하게 컨트롤하기
// index.js

document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('menuList');
  const menus = await getAllMenus();
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

    newEditButton.addEventListener('click', () => {
      isEditting = true;
      menu_id = menu.id;
      // console.log('target menu:', menu);
      modal.style.display = 'flex';
      const modalTitle = document.querySelector('.modal-title');
      modalTitle.innerText = '메뉴 수정하기';

      const menuNameKorInput = document.getElementById('menuNameKor');
      const menuNameEngInput = document.getElementById('menuNameEng');
      const menuNameEspInput = document.getElementById('menuNameEsp');
      const menuPriceInput = document.getElementById('menuPrice');
      const menuImageInput = document.getElementById('menuImage');
      const menuCategorySelect = document.getElementById('menuCategory');

      // 기존값 세팅
      const menuNameObj = JSON.parse(menu.name);
      menuNameKorInput.value = menuNameObj.kor || '';
      menuNameEngInput.value = menuNameObj.eng || '';
      menuNameEspInput.value = menuNameObj.esp || '';
      menuPriceInput.value = menu.price || '';
      menuImageInput.value = menu.image || '';
      menuCategorySelect.value = menu.category || '';

      // 버튼 내부 텍스트 바꾸기
      const menuEditSubmitButton = document.getElementById('modal-submit-button');
      menuEditSubmitButton.style.backgroundColor = '#76e4b8';
      menuEditSubmitButton.style.color = '#000';
      menuEditSubmitButton.innerHTML = `
        <i class="fa-solid fa-pen"></i>
        메뉴수정
      `;
    });

    // deleteButton feature
    newDeleteButton.addEventListener('click', () => {
      const doubleCheck = confirm(
        `This will remove menu: ${JSON.parse(menu.name)[selectedLanguage]} Are you SURE?`,
      );

      if (!doubleCheck) location.reload();
      else {
        const isDeleted = deleteMenu(menu.id);
        if (isDeleted) alert('Successfully Deleted: ');
        else alert('Failed to delete a menu');
        location.reload();
      }
    });

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

    let res = null;
    if (!isEditting) {
      res = createNewMenu(menuName, price, category, image);
    } else {
      res = updateMenu(menu_id, menuName, price, category, image);
    }
    if (res) {
      if (isEditting) alert('successfully editted');
      else alert('succesfully created');
    } else alert('failed to create');
    location.reload();

    modal.style.display = 'none';
  });

  // Modal Opener
  const addMenuBtn = document.getElementById('addMenuBtn');
  addMenuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isEditting = false;
    menu_id = null;

    // reuse menuAddingModal when I decleared at submit handle
    modal.style.display = 'flex';
    const modalTitle = document.querySelector('.modal-title');
    modalTitle.innerText = '메뉴 추가하기';

    const menuNameKorInput = document.getElementById('menuNameKor');
    const menuNameEngInput = document.getElementById('menuNameEng');
    const menuNameEspInput = document.getElementById('menuNameEsp');
    const menuPriceInput = document.getElementById('menuPrice');
    const menuImageInput = document.getElementById('menuImage');
    const menuCategorySelect = document.getElementById('menuCategory');

    // 값 초기화
    menuNameKorInput.value = '';
    menuNameEngInput.value = '';
    menuNameEspInput.value = '';
    menuPriceInput.value = '';
    menuImageInput.value = '';
    menuCategorySelect.value = '';

    // 추가용
    const menuEditSubmitButton = document.getElementById('modal-submit-button');
    menuEditSubmitButton.style.backgroundColor = '#76e4b8';
    menuEditSubmitButton.style.color = '#000';
    menuEditSubmitButton.innerHTML = `
        <i class="fas fa-plus"></i>
        메뉴추가
      `;
  });

  window.addEventListener('click', (e) => {
    e.target === modal && (modal.style.display = 'none');
  });
});
