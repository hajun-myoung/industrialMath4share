import * as auth from '../util/auth.js';
import * as storage from '../util/storage.js';

console.log('Welcome Script Has Been Loaded');

document.addEventListener('DOMContentLoaded', () => {
  // auth check
  const isSignedIn = auth.isSignedIn();
  if (!isSignedIn) {
    alert('로그인이 필요한 페이지입니다');
    window.location.href = './signin.html';
  }

  const e_userInfo = document.getElementById('user-info');
  const session = auth.getSignin();

  if (storage.isSessionExpired(session)) {
    auth.clearSignin();
    alert('마지막으로 로그인한 시간이 2시간 이상 전입니다. 다시 로그인해주세요.');
    window.location.href = './signin.html';
  }
  try {
    e_userInfo.innerText = session.email.split('@')[0];
  } catch (err) {
    console.log(err);
  }

  const e_signoutBtn = document.getElementById('signout');
  e_signoutBtn.addEventListener('click', () => {
    auth.clearSignin();
    window.location.href = './signin.html';
  });
});
