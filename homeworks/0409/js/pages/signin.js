import { getUsers, hashString, showError } from '../util/auth.js';

console.log('Signin Scripts Has Been Loaded');

/**
 * @param {String} id
 * @param {String} pw
 * @returns isSigninSuccess(boolean)
 */
async function signin(id, pw) {
  const users = getUsers();
  const hashedPasswrod = await hashString(pw);

  const selected_users = users.filter((user) => user.id === id)[0];

  if (selected_users.length === 0) {
    throw new Error('가입되지 않은 사용자입니다');
  } else if (selected_users.length > 1) {
    throw new Error('중복 계정이 둘 이상 존재합니다 (관리자에게 문의하세요)');
  }

  const user = selected_users[0];
  if (user.password !== hashedPasswrod) {
    throw new Error('비밀번호가 일치하지 않습니다');
  }

  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  const e_id = document.getElementById('id');
  const e_pw = document.getElementById('pw');
  const e_signinBtn = document.getElementById('signin');
  const e_signinError = document.querySelector('#formWrapper > form > div:nth-child(3) > div');

  const id = e_id.value;
  const pw = e_pw.value;

  e_signinBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
      const isSigninSuccess = await signin(id, pw);
    } catch (err) {
      showError(e_signinError, `🚨 비밀번호가 틀렸습니다`);
    }
  });
});
