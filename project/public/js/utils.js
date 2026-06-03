export function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const getAllMenus = async () => {
  const res = await fetch(`/api/menus`);
  const menus = await res.json();
  return menus;
};

export const updateMenu = async (id, name, price, category, image = '') => {
  const res = await fetch(`/api/menus/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      price,
      category,
      image,
    }),
  });

  if (res.status === 200) return true;
  else false;
};

export const createNewMenu = async (name, price, category, image = '') => {
  const res = await fetch('/api/menus', {
    method: 'POST',
    body: JSON.stringify({
      name,
      price,
      category,
      image,
    }),
  });

  if (res.status === 200) return true;
  return false;
};

export const deleteMenu = async (id) => {
  const res = await fetch(`/api/menus/${id}`, {
    method: 'DELETE',
  });

  if (res.status === 200) return true;
  return false;
};

export function getAllCategories(menus) {
  const categories = menus.reduce((categories, curr) => {
    if (categories.includes(curr.category)) return categories;
    else {
      return [...categories, curr.category];
    }
  }, []);

  return categories ?? [];
}
