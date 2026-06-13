import { capitalizeWords } from './utils.js';
import { getAllMenus } from './utils.js';

console.log('order.js');

let shoppingCart = {};
let sheetCloseTimer = null;

const FAVORITE_MENU_STORAGE_KEY = 'favoriteMenuIds';
const SHEET_TRANSITION_MS = 220;

function formatPrice(price) {
  return `₩${Number(price).toLocaleString()}`;
}

function formatCartCount(count, language) {
  const labels = {
    kor: `${count}개 메뉴`,
    eng: `${count} items`,
    esp: `${count} menús`,
  };

  return labels[language] ?? labels.kor;
}

function clearCartItems() {
  shoppingCart = {};
  renderCartSheet();
  renderCartSummary();

  closeCartSheet();
  return true;
}

/**
 * 장바구니 전체 객체를 반환합니다
 * @returns Object.values(shoppingCart)
 */
function getCartItems() {
  return Object.values(shoppingCart);
}

function getCartCount() {
  return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return getCartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// 이름 아이디어가 없어서 cart sheet라고 지음: 의도 - 장바구니 상세보기
// 뭐 일단 sheet(shit 아님)긴 하잖...아...?
function isCartSheetOpen() {
  const i_wanna_go_home = true; // for real
  return document.getElementById('cart-bottom-sheet')?.classList.contains('is-open') ?? false;
}

function addToCart(menu) {
  if (shoppingCart[menu.id]) {
    shoppingCart[menu.id].quantity += 1;
  } else {
    shoppingCart[menu.id] = {
      id: menu.id,
      name: menu.displayName,
      price: Number(menu.price),
      quantity: 1,
    };
  }

  renderCartSummary();
}

function removeFromCart(menuId) {
  delete shoppingCart[menuId];
  renderCartSummary();
}

function increaseQuantity(menuId) {
  if (!shoppingCart[menuId]) return;

  shoppingCart[menuId].quantity += 1;
  renderCartSummary();
}

function decreaseQuantity(menuId) {
  if (!shoppingCart[menuId]) return;

  if (shoppingCart[menuId].quantity <= 1) {
    removeFromCart(menuId);
    return;
  }

  shoppingCart[menuId].quantity -= 1;
  renderCartSummary();
}

// order.html 하단에 뜨는 그 플로팅 바 렌더러
function renderCartSummary() {
  const count = getCartCount();
  const total = getCartTotal();
  const cartSummaryBar = document.getElementById('cart-summary-bar');
  const cartSummaryCount = document.getElementById('cart-summary-count');
  const cartSummaryTotal = document.getElementById('cart-summary-total');
  const selectedLanguage = localStorage.getItem('selectedLanguage') || 'kor';

  if (!cartSummaryBar || !cartSummaryCount || !cartSummaryTotal) return;

  if (count > 0) {
    cartSummaryBar.hidden = false;
    cartSummaryBar.disabled = false;
    cartSummaryCount.innerText = formatCartCount(count, selectedLanguage);
    cartSummaryTotal.innerText = formatPrice(total);
  } else {
    cartSummaryBar.hidden = true;
    cartSummaryBar.disabled = true;

    if (isCartSheetOpen()) {
      closeCartSheet();
    }
  }

  if (isCartSheetOpen()) {
    renderCartSheet();
  }
}

// 주문 상세보기 렌더러
function renderCartSheet() {
  const cartList = document.getElementById('cart-list');
  const cartSheetTotal = document.getElementById('cart-sheet-total');

  if (!cartList || !cartSheetTotal) return;

  cartList.innerHTML = '';

  getCartItems().forEach((item) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">${formatPrice(item.price)} × ${item.quantity}</div>
        <div class="quantity-control" aria-label="${item.name} 수량 조절">
          <button type="button" data-action="decrease" data-menu-id="${item.id}" aria-label="${item.name} 수량 줄이기">-</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="increase" data-menu-id="${item.id}" aria-label="${item.name} 수량 늘리기">+</button>
        </div>
      </div>
      <div class="cart-item-subtotal">${formatPrice(item.price * item.quantity)}</div>
    `;
    cartList.appendChild(cartItem);
  });

  cartSheetTotal.innerText = formatPrice(getCartTotal());
}

function openCartSheet() {
  if (getCartCount() === 0) return;

  const kioskScreen = document.querySelector('.kiosk-screen');
  const backdrop = document.getElementById('sheet-backdrop');
  const sheet = document.getElementById('cart-bottom-sheet');
  const cartSummaryBar = document.getElementById('cart-summary-bar');

  if (!backdrop || !sheet || !cartSummaryBar) return;

  clearTimeout(sheetCloseTimer);
  renderCartSheet();
  backdrop.hidden = false;
  sheet.hidden = false;
  cartSummaryBar.setAttribute('aria-expanded', 'true');
  kioskScreen?.classList.add('sheet-open');

  requestAnimationFrame(() => {
    backdrop.classList.add('is-open');
    sheet.classList.add('is-open');
  });
}

function closeCartSheet() {
  const kioskScreen = document.querySelector('.kiosk-screen');
  const backdrop = document.getElementById('sheet-backdrop');
  const sheet = document.getElementById('cart-bottom-sheet');
  const cartSummaryBar = document.getElementById('cart-summary-bar');

  if (!backdrop || !sheet || !cartSummaryBar) return;

  backdrop.classList.remove('is-open');
  sheet.classList.remove('is-open');
  cartSummaryBar.setAttribute('aria-expanded', 'false');
  kioskScreen?.classList.remove('sheet-open');

  clearTimeout(sheetCloseTimer);
  sheetCloseTimer = setTimeout(() => {
    backdrop.hidden = true;
    sheet.hidden = true;
  }, SHEET_TRANSITION_MS);
}

function getDisplayName(menu, language) {
  try {
    const parsedName = JSON.parse(menu.name);
    return parsedName[language] ?? parsedName.kor ?? Object.values(parsedName)[0] ?? '';
  } catch {
    return menu.name;
  }
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

document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('menuList');
  const menus = (await getAllMenus()) ?? [];
  const favoriteMenuIds = loadFavoriteMenuIds();

  //   console.log(menus);
  const categories = menus.reduce((categories, curr) => {
    if (categories.includes(curr.category)) return categories;
    else {
      return [...categories, curr.category];
    }
  }, []);

  //   console.log(categories);

  const categories_ele = document.getElementById('categories');
  categories.forEach((category) => {
    const newCategory = document.createElement('button');
    newCategory.innerText = capitalizeWords(category);
    newCategory.className = 'category';
    newCategory.dataset.target = category.toLowerCase();
    categories_ele.appendChild(newCategory);
  });

  //   menus.forEach((menu) => {
  //     const menu_element = document.createElement('div');
  //     menu_element.innerHTML = `
  //     <div>${menu.name}</div>
  //     <div>${menu.price}원</div>
  //     `;

  //     menuList.appendChild(menu_element);
  //   });

  // new
  const langText = document.getElementById('lang-text');
  const selectedLanguage = localStorage.getItem('selectedLanguage');

  const langMap = {
    kor: 'Korean',
    eng: 'English',
    esp: 'Spanish',
  };

  ['kor', 'eng', 'esp']
    .filter((lang) => lang !== selectedLanguage)
    .forEach((lang) => {
      const newLangButton = document.createElement('div');
      newLangButton.id = `button-${langMap[lang].toLowerCase()}`;
      newLangButton.dataset.lang = lang;
      newLangButton.innerText = langMap[lang];

      newLangButton.addEventListener('click', () => {
        localStorage.setItem('selectedLanguage', lang);
        window.location.reload();
      });

      langText.appendChild(newLangButton);
    });

  const toFirstButton = document.getElementById('to-first');
  toFirstButton.addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  // back button to go landing
  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  // Main Sections
  const menuArea = document.getElementById('menu-scroll-area');
  categories.forEach((category) => {
    const newSection = document.createElement('section');

    const newHeader = document.createElement('h1');
    newHeader.innerText = capitalizeWords(category);
    newSection.appendChild(newHeader);

    const includedMenus = menus.filter((menu) => menu.category === category);
    // console.log(category, includedMenus);

    const newMenusCardWrapper = document.createElement('div');
    newMenusCardWrapper.className = 'menu-cards-wrapper';
    includedMenus.forEach((menu) => {
      const newMenuCard = document.createElement('button');
      const newImageWrapper = document.createElement('div');
      const newImageEle = document.createElement('img');
      const newMenuName = document.createElement('div');
      const newPrice = document.createElement('div');
      const displayName = getDisplayName(menu, localStorage.getItem('selectedLanguage') || 'kor');

      newMenuCard.type = 'button';
      newImageEle.src = menu.image;
      newImageEle.alt = displayName;
      newImageWrapper.appendChild(newImageEle);
      newImageWrapper.className = 'menu-card-image';

      if (favoriteMenuIds.has(String(menu.id))) {
        const recommendationBadge = document.createElement('div');
        recommendationBadge.className = 'recommended-menu-badge';
        recommendationBadge.innerText = '추천 메뉴';
        newImageWrapper.appendChild(recommendationBadge);
      }

      newMenuName.innerText = displayName;
      newMenuName.className = 'menu-card-name';

      newPrice.innerText = `₩${Number(menu.price).toLocaleString()}`;
      newPrice.className = 'menu-card-price';

      newMenuCard.className = 'menu-card';
      newMenuCard.appendChild(newImageWrapper);
      newMenuCard.appendChild(newMenuName);
      newMenuCard.appendChild(newPrice);
      newMenuCard.addEventListener('click', () => {
        addToCart({
          id: menu.id,
          displayName,
          price: menu.price,
        });
      });
      newMenusCardWrapper.appendChild(newMenuCard);
    });
    newSection.appendChild(newMenusCardWrapper);

    newSection.id = category.toLowerCase();
    newSection.className = 'menu-section';

    menuArea.appendChild(newSection);
  });

  // navigation bar - scrolling
  const tabButtons = document.querySelectorAll('.category');
  const sections = [...document.getElementsByClassName('menu-section')];
  let currentSection = sections[0].id;

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      const targetSection = document.getElementById(targetId);

      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });

  // active tabs
  /**
   * NOTE:
   * 기본 아이디어 - 현재 스크롤이 어느 섹션 근처인지 판단해서, 탭 active 하기
   * - [x] section들 가져오기
   * - [x] 전체 Area에 스크롤 이벤트 걸기(스크롤 할 때마다 훅)
   * - [x] 초기값은 첫 번째 섹션(아마 커피)로 지정
   * - [x] 아 어떻게 구현할지 헷갈려요 Next 쓰게해주세요
   * - [x] 자바스크립트는 못쓰겠어 타입스크립트를..제게...!
   * - [x] 내리다가 새로운 섹션 근처에 오면(딱 맞게보다 나을듯) active 탭 바꿔주기
   *    - 일단 한 40 정도로 해놓고, 손코딩하기
   * - [x] 신에게는 아직 12개의 논리오류가 있사옵니다
   *
   * TODO: ISSUE:
   * - "coffee" - "tea" 구성이라고 가정하면
   * tea 밑으로 내려갈 때, coffee 밑이기도 해서
   * 둘 다 자기 섹션이라고 주장함 -> 새로운 논리 필요
   *
   * -> 현재 위치보다 "위에 있는 섹션"들 중에서, "가장 아래 있는 것"을 찾기?
   * 섹션 밑에서부터 점검하면서(reverse check)
   * 현재 스크롤이 등장하면 끊기(break)
   */
  // const sections = [...document.getElementsByClassName('menu-section')]; // move up
  const scrollArea = document.querySelector('#menu-scroll-area');

  // let currentSection = sections[0].id; // move up
  scrollArea.addEventListener('scroll', () => {
    for (let idx = sections.length - 1; idx >= 0; idx--) {
      const section = sections[idx];

      if (scrollArea.scrollTop >= section.offsetTop - 120) {
        currentSection = section.id;
        console.log("it's me! ", section.id);
        break;
      }
    }

    tabButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.target === currentSection);
    });
  });

  document.getElementById('cart-summary-bar')?.addEventListener('click', openCartSheet);
  document.getElementById('sheet-backdrop')?.addEventListener('click', closeCartSheet);
  document.getElementById('cart-sheet-close')?.addEventListener('click', closeCartSheet);
  document.getElementById('order-button')?.addEventListener('click', () => {
    const items = getCartItems();

    if (items.length === 0) return;

    sessionStorage.setItem(
      'checkoutDraft',
      JSON.stringify({
        items,
        total: getCartTotal(),
        createdAt: Date.now(),
      }),
    );
    window.location.href = './checkout.html';
  });

  document.getElementById('order-clear-button')?.addEventListener('click', clearCartItems);

  document.getElementById('cart-list')?.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const target = event.target.closest('button[data-action]');
    if (!target) return;

    const menuId = target.dataset.menuId;

    if (target.dataset.action === 'increase') {
      increaseQuantity(menuId);
    } else if (target.dataset.action === 'decrease') {
      decreaseQuantity(menuId);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isCartSheetOpen()) {
      closeCartSheet();
    }
  });

  renderCartSummary();
});
