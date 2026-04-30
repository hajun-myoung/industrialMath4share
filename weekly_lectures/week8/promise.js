const p = new Promise((res, rej) => {
  console.log(1);
  if (Math.floor(Math.random() * 2) > 0) {
    res(2);
  } else {
    rej(-2);
  }
});

console.log(3);

p.then((val) => {
  console.log(4);
  console.log(`val: ${val}`);
}).catch((val) => {
  console.log(4);
  console.log(`rejected: ${val}`);
});

console.log(5);
