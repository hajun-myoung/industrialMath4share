console.log('this, ', this);
console.log(this.name);

let obj = {
  name: 'Obj',
  getName: function () {
    return this.name;
  },
};
console.log(obj);
console.log(obj.getName());
