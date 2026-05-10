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
});
