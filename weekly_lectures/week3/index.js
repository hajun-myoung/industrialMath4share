const myArr1 = [1, 2, 3, 4, 5];
// 다른 언어에서의 배열들과 같음
console.log(myArr1);

// 값으로의 접근
console.log(myArr1['2']);
console.log(myArr1[2]); // same as myArr1['2']

// auto-assigned undefined
const myArr2 = [1, , 2, 3, , 4];
console.log(myArr2[1]); // it's undefined!

const errorObjStr =
  '{ "name": "Harry Smith", "age": 42, "lucky numbers": [17, 29], "lucky": false }';
console.log(JSON.parse(errorObjStr));

// destructuring and rest operator
console.log('\ndestructuring and rest operator'.toUpperCase());
const myArr3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const [first, second] = myArr3;
// const [first, second, ...others] = myArr3;
console.log(first);
console.log(second);
// console.log(others);

// what about not-number elements?
console.log('\nwhat about not-number elements?'.toUpperCase());
console.log('\nwhat about not-number elements?'.toUpperCase());
const myArr4 = [1, 2, { name: 'hajun' }];
const [first2, second2, ...others2] = myArr4;
console.log(first2);
console.log(second2);
console.log(others2);

// Object Destructuring
console.log('\nobject destructuring'.toUpperCase());
const myObj = { name: 'Michael Jackson', isAlive: false, job: 'singer', code: 23145 };
// let { name, isAlive, ...rest } = myObj;
// console.log(name);
// console.log(isAlive);
// console.log(rest);

// Default Valued Destructuring
console.log('\ndefault valued object destructuring'.toUpperCase());
// let { nickname = 'None', name = 'Harry', isAlive, undefinedValue } = myObj;
let(({ nickname = 'None', name = 'Harry', isAlive } = myObj));
console.log(nickname, name, isAlive, undefinedValue);
