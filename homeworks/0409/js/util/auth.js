const STORAGE_KEY = 'auth:users';
const SESSION_KEY = 'auth:session';

/**
 * @param {HTMLElement} errorBox
 */
function hideError(errorBox) {
  errorBox.style.height = `${errorBox.scrollHeight}px`;

  requestAnimationFrame(() => {
    errorBox.style.height = '0px';
    errorBox.style.opacity = '0';
    errorBox.style.paddingTop = '0px';
    errorBox.style.paddingBottom = '0px';
  });

  setTimeout(() => {
    errorBox.textContent = '';
  }, 350);

  return true;
}

export function getUsers() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/**
 * @param {String} text
 * @returns HashedPasswrod: String
 */
export async function hashString(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * @param {HTMLElement} errorBox
 * @param {String} message
 */
export function showError(errorBox, message) {
  errorBox.textContent = message;
  errorBox.style.paddingTop = '10px';
  errorBox.style.paddingBottom = '10px';
  errorBox.style.opacity = '1';

  errorBox.style.height = 'auto';
  const targetHeight = errorBox.scrollHeight;
  errorBox.style.height = '0px';

  requestAnimationFrame(() => {
    errorBox.style.height = `${targetHeight}px`;
  });

  setTimeout(() => {
    hideError(errorBox);
  }, 3000);

  return true;
}

/**
 *
 * @param {{email: String}} user
 */
export function setSignin(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: user.email,
      signedAt: new Date().toISOString(),
    }),
  );
}

export function getSignin() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

export function clearSignin() {
  localStorage.removeItem(SESSION_KEY);
}

export function isSignedIn() {
  return getSignin() !== null;
}
