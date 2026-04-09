import { getUsers, saveUsers } from './auth.js';

/**
 * @param {String} text
 * @returns HashedPasswrod: String
 */
async function hashString(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * @param {String} email
 * @param {String} password
 * @returns
 */
export async function newUser(email, password) {
  const users = getUsers();

  const exists = users.some((user) => user.email === email);
  if (exists) {
    throw new Error('이미 존재하는 이메일입니다');
  }

  const hashed_password = await hashString(password);

  const newUser = {
    email,
    password: hashed_password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return true;
}
