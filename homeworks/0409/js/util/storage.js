import { getUsers, saveUsers, hashString } from './auth.js';

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
