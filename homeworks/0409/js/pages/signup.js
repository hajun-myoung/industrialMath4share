import * as validation from '../util/validation.js';
import * as storage from '../util/storage.js';
import { showError } from '../util/auth.js';

console.log('Signup Script Has Benn Loaded');

document.addEventListener('DOMContentLoaded', () => {
  const e_id = document.getElementById('input-id');
  const e_pw = document.getElementById('input-pw');
  const e_pwConfirm = document.getElementById('input-pwConfirm');
  const e_signupBtn = document.getElementById('signup');

  // error boxes
  const e_id_error = document.querySelector('#formWrapper > form > div:nth-child(1) > div');
  const e_pw_error = document.querySelector('#formWrapper > form > div:nth-child(2) > div');
  const e_pwConfirm_error = document.querySelector('#formWrapper > form > div:nth-child(3) > div');

  // console.log(e_id, e_pw, e_pwConfirm);
  e_signupBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const id = e_id.value;
    const pw = e_pw.value;
    const pwConfirm = e_pwConfirm.value;

    try {
      validation.ValidateEmail(id);
    } catch (err) {
      console.log(err);
      showError(e_id_error, `🚨 ${err.message.split('Error: ')[0]}`);
      return;
    }

    try {
      validation.ValidatePassword(pw);
    } catch (err) {
      console.log(err);
      showError(e_pw_error, `🚨 ${err.message.split('Error: ')[0]}`);
      return;
    }

    if (!validation.ValidatePasswordConfirm(pw, pwConfirm)) {
      console.log('Password and Confirmation are not equal');
      showError(e_pwConfirm_error, `🚨 비밀번호화 비밀번호 확인이 다릅니다`);
      return;
    }

    try {
      const result = await storage.newUser(id, pw);
    } catch (err) {
      alert(err);
      return;
    }

    e_id.value = '';
    e_pw.value = '';
    e_pwConfirm.value = '';

    alert(
      '회원가입이 완료되었습니다 :) 확인 버튼을 누르시면 자동으로 로그인 페이지로 이동하니, 기다려주세요.',
    );
    window.location.href = './signin.html';

    return true;
  });
});
