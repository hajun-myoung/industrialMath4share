function generateRandomString(length = 10) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
/**
 * NOTE: toString method returns just stringify something
 * But when it use 36 as a optinoal instance
 * this method returns 36-base incorded string transfer result
 *
 * FIXME: For now, more than 10 chracters' string cannot be generated
 */

function generateRandomStringMinMax(min = 2, max = 10) {
  const tempLength = Math.floor(Math.random() * max) + 1;
  const length = tempLength < min ? min : tempLength;
  return generateRandomString(length);
}

function generateMail() {
  const mailMap = {
    korea: 'ac.kr',
    naver: 'com',
    gmail: 'com',
  };
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
