const user = {
  username: 'kildong',
  address: {
    street: 'Jochiwon',
    phone: '010-1234-5678',
  },
};

console.log(user?.password?.code);
console.log(user?.password.code);
console.log(3 + 2)