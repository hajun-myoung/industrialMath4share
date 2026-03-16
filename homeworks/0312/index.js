// 2번
const myStr = 'my industrial math class is great.';
console.log(myStr.at(4));

console.log(myStr.charCodeAt(4));

console.log(myStr.includes('great'));
console.log(myStr.includes('pizza'));

console.log(myStr.endsWith('great'));
console.log(myStr.endsWith('great.'));

console.log(myStr.split());
console.log(myStr.split('math'));
console.log(myStr.split(' '));

// 3번
const price = 199_900;
const quantity = 3;
console.log(`총합은 ${price * quantity}원 입니다.`);

// 4번
const user = {
  name: 'Hajun Myoung',
  student_id: 2022270033,
};

console.log(user);

// 5번
const username = 'username';
const email = 'email';
const myObj = {
  [username]: username,
  [email]: email,
};
console.log(myObj);
