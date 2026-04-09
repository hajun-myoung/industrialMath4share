function generateRandomString(length = 10) {
  return Array.from({ length }, () => {
    return Math.random().toString(36).substring(2, 3);
  }).join('');
}
/**
 * NOTE: toString method returns just stringify something
 * But when it use 36 as a optinoal instance
 * this method returns 36-base incorded string transfer result
 */

function generateRandomStringMinMax(min = 2, max = 10) {
  const tempLength = Math.floor(Math.random() * max) + 1;
  const length = tempLength < min ? min : tempLength;
  return generateRandomString(length);
}

function generateMail(min = 2, max = 6) {
  const mails = ['korea.ac.kr', 'naver.com', 'gmail.com'];
  return `${generateRandomStringMinMax(min, max)}@${mails[Math.floor(Math.random() * 3)]}`;
}

/**
 * @param {Array} array
 * @param {Function} func
 */
function arrayFunc(array, func) {
  const result = [];
  for (const e of array) {
    try {
      result.push(func(e));
    } catch {
      return false;
    }
  }
  return result;
}

function generatUsers(length = 2) {
  return Array.from({ length }, () => {
    return generateMail((max = 10));
  });
}

// From here, test codes
console.group('generateRandomString Test');
console.log('generateRandomString: ', generateRandomString());
console.log('generateRandomString: ', generateRandomString());
console.log('generateRandomString: ', generateRandomString());
console.log('generateRandomString with 5 len: ', generateRandomString(5));
console.log('generateRandomString with 20 len: ', generateRandomString(20));
console.groupEnd('generateRandomString Test');

console.group('generateRandomStringMinMax');
console.log('generateRandomStringMinMax: ', generateRandomStringMinMax());
console.log('generateRandomStringMinMax: ', generateRandomStringMinMax());
console.log('generateRandomStringMinMax between 5 and 10: ', generateRandomStringMinMax(5, 10));
console.groupEnd('generateRandomStringMinMax');

console.group('gernerateMail');
console.log('generateMail: ', generateMail());
console.log('generateMail: ', generateMail());
console.log('generateMail: ', generateMail());
console.groupEnd('gernerateMail');

console.group('array func');
console.log(
  'arrayFunc: ',
  arrayFunc([1, 2, 3], (x) => x === 2),
);
console.log(
  'arrayFunc: ',
  arrayFunc([1, 2, 3, 4], (x) => {
    if (x % 2 === 0) throw new Error('Even error');
    return x;
  }),
);
console.groupEnd('array func');

console.group('generateMail');
console.log('generatUsers', generatUsers());
console.log('generatUsers', generatUsers(4));
console.log('generatUsers', generatUsers(10));
console.groupEnd('generateMail');
