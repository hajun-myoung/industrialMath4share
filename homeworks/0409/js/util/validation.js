/**
 * @param {String} email
 * @returns
 */
export function ValidateEmail(email) {
  if (!email) {
    throw new Error('메일주소가 입력되지 않았습니다');
  }

  // email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    throw new Error('메일주소 형식이 올바르지 않습니다');
  }

  return true;
}

/**
 * @param {String} password
 * @returns
 */
export function ValidatePassword(password) {
  if (!password) {
    throw new Error('비밀번호가 입력되지 않았습니다');
  }

  if (password.length < 8) {
    throw new Error('비밀번호는 8자 이상 입력하세요');
  }

  // regexp testing
  if (!/[a-zA-Z]/.test(password)) {
    throw new Error('비밀번호에는 영어 문자가 포함되어야 합니다');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('비밀번호에는 숫자가 포함되어야 합니다');
  }

  return true;
}

export function ValidatePasswordConfirm(password, passwordConfirm) {
  return password === passwordConfirm;
}
