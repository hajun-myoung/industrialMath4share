import { getAllMenus } from './utils.js';

const FAVORITE_MENU_STORAGE_KEY = 'favoriteMenuIds';
const moneyFormatter = new Intl.NumberFormat('ko-KR');

document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('favoriteMenuList');
  const message = document.getElementById('favoriteMessage');
  const count = document.getElementById('favoriteCount');
  const resetButton = document.getElementById('favoriteResetButton');

  try {
    const menus = await getAllMenus();
    const favoriteMenuIds = loadFavoriteMenuIds();

    renderFavoriteMenus(menuList, menus, favoriteMenuIds, () => {
      saveFavoriteMenuIds(favoriteMenuIds);
      renderFavoriteCount(count, favoriteMenuIds.size);
    });

    renderFavoriteCount(count, favoriteMenuIds.size);
    message.innerHTML =
      menus.length > 0
        ? `<i class="fa fa-info-circle" aria-hidden="true"></i>즐겨찾기 설정은 이 브라우저의 로컬 스토리지에 저장됩니다.`
        : `<i class="fa-regular fa-face-frown"></i>등록된 메뉴가 없습니다.`;
    message.classList.toggle('is-empty', menus.length === 0);

    resetButton.addEventListener('click', () => {
      favoriteMenuIds.clear();
      saveFavoriteMenuIds(favoriteMenuIds);
      renderFavoriteMenus(menuList, menus, favoriteMenuIds, () => {
        saveFavoriteMenuIds(favoriteMenuIds);
        renderFavoriteCount(count, favoriteMenuIds.size);
      });
      renderFavoriteCount(count, favoriteMenuIds.size);
    });
  } catch (error) {
    console.error(error);
    message.textContent = '메뉴 데이터를 불러오지 못했습니다.';
    message.classList.add('is-error');
  }
});

function renderFavoriteMenus(container, menus, favoriteMenuIds, onToggle) {
  container.innerHTML = '';

  if (menus.length === 0) {
    const emptyRow = document.createElement('div');
    emptyRow.className = 'favorite-empty-row';
    emptyRow.textContent = '표시할 메뉴가 없습니다.';
    container.appendChild(emptyRow);
    return;
  }

  menus.forEach((menu) => {
    const menuId = String(menu.id);
    const row = document.createElement('div');
    const toggleCell = document.createElement('div');
    const nameCell = document.createElement('div');
    const categoryCell = document.createElement('div');
    const priceCell = document.createElement('div');
    const toggleButton = document.createElement('button');

    row.className = 'favorite-row';
    toggleCell.className = 'favorite-toggle-cell';
    nameCell.className = 'favorite-menu-name';
    categoryCell.className = 'favorite-menu-category';
    priceCell.className = 'favorite-menu-price';
    toggleButton.type = 'button';
    toggleButton.className = 'favorite-toggle-button';

    nameCell.textContent = getKoreanMenuName(menu.name);
    categoryCell.textContent = menu.category || '-';
    priceCell.textContent = `₩${moneyFormatter.format(Number(menu.price) || 0)}`;

    updateFavoriteButton(toggleButton, favoriteMenuIds.has(menuId));
    toggleButton.addEventListener('click', () => {
      if (favoriteMenuIds.has(menuId)) {
        favoriteMenuIds.delete(menuId);
      } else {
        favoriteMenuIds.add(menuId);
      }

      updateFavoriteButton(toggleButton, favoriteMenuIds.has(menuId));
      onToggle();
    });

    toggleCell.appendChild(toggleButton);
    row.appendChild(toggleCell);
    row.appendChild(nameCell);
    row.appendChild(categoryCell);
    row.appendChild(priceCell);
    container.appendChild(row);
  });
}

function updateFavoriteButton(button, isFavorite) {
  button.classList.toggle('is-selected', isFavorite);
  button.setAttribute('aria-pressed', String(isFavorite));
  button.innerHTML = isFavorite
    ? '<i class="fa-solid fa-star"></i><span>선택됨</span>'
    : '<i class="fa-regular fa-star"></i><span>선택</span>';
}

function renderFavoriteCount(container, favoriteCount) {
  container.textContent = `${moneyFormatter.format(favoriteCount)}개`;
}

function loadFavoriteMenuIds() {
  try {
    const savedValue = localStorage.getItem(FAVORITE_MENU_STORAGE_KEY);
    const parsedValue = JSON.parse(savedValue || '[]');

    if (!Array.isArray(parsedValue)) return new Set();

    return new Set(parsedValue.map(String));
  } catch {
    return new Set();
  }
}

function saveFavoriteMenuIds(favoriteMenuIds) {
  localStorage.setItem(FAVORITE_MENU_STORAGE_KEY, JSON.stringify([...favoriteMenuIds]));
}

function getKoreanMenuName(rawName) {
  let parsedName = rawName;

  for (let i = 0; i < 2; i += 1) {
    if (typeof parsedName !== 'string') break;

    try {
      parsedName = JSON.parse(parsedName);
    } catch {
      break;
    }
  }

  if (typeof parsedName === 'string') return parsedName;
  if (parsedName?.kor) return parsedName.kor;
  if (parsedName?.menuname?.kor) return parsedName.menuname.kor;

  return '이름 없음';
}
