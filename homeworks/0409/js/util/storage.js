import { getUsers, saveUsers, hashString } from './auth.js';

const SESSION_KEY = 'auth:session';
// const SESSION_EXPIRE_MS = 2 * 60 * 60 * 1000;
const SESSION_EXPIRE_MS = 5 * 1000;

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

/**
 * @param {{email: String, signedAt: String}} session
 */
export function isSessionExpired(session) {
  if (!session.signedAt) return true;

  const signedInTime = new Date(session.signedAt).getTime();
  const now = new Date().getTime();

  console.log(now - signedInTime);
  return now - signedInTime > SESSION_EXPIRE_MS;
}
