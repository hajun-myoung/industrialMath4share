import { capitalizeWords } from './utils.js';

console.log('order.js');

const getAllMenus = async () => {
  const res = await fetch(`/api/menus`);
  const menus = await res.json();
  return menus;
};

document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('menuList');
  const menus = (await getAllMenus()) ?? [];

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
    includedMenus.forEach(async (menu) => {
      const newMenuCard = document.createElement('div');
      const newImageWrapper = document.createElement('div');
      const newImageEle = document.createElement('img');
      const newMenuName = document.createElement('div');
      const newPrice = document.createElement('div');

      newImageEle.src = menu.image;
      newImageWrapper.appendChild(newImageEle);
      newImageWrapper.className = 'menu-card-image';

      const parsedName = await JSON.parse(menu.name);
      newMenuName.innerText = parsedName[localStorage.getItem('selectedLanguage')];
      newMenuName.className = 'menu-card-name';

      newPrice.innerText = `₩${Number(menu.price).toLocaleString()}`;
      newPrice.className = 'menu-card-price';

      newMenuCard.className = 'menu-card';
      newMenuCard.appendChild(newImageWrapper);
      newMenuCard.appendChild(newMenuName);
      newMenuCard.appendChild(newPrice);
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
});
