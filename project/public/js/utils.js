export function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const getAllMenus = async () => {
  const res = await fetch(`/api/menus`);
  const menus = await res.json();
  return menus;
};
