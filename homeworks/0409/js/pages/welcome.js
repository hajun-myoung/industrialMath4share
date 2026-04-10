import * as auth from '../util/auth.js';

console.log('Welcome Script Has Been Loaded');

document.addEventListener('DOMContentLoaded', () => {
  // auth check
  const isSignedIn = auth.isSignedIn();
  if (!isSignedIn) {
    alert('로그인이 필요한 페이지입니다');
    window.location.href = './signin.html';
  }
});
