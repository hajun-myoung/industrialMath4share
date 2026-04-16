# Class contents

1. Object and Method

1. Prototype, Prototyping

1. Object.setPrototype
   - Set prototype -> can use built-in method of specific prototype
   1. Question: set prototype을 하지 않으면, 기본 Object가 프로토타입으로 지정되어 있는가? 아니면 null 또는 Undefiend 인가?
      - 새로운 Object의 경우 Object.Prototype을 기본으로 가짐
   1. 새로운 객체의 프로퍼티(Manually)와 프로토타입의 프로퍼티가 겹치면?
      - 스스로의 프로퍼티가 우선(추정)
   1. Class와 다르게 prototype을 사후설정하는 것 같은데, 맞나?
      - 맞네, 프로토타입을 "추후 연결하는" 형태

1. Prototype of Prototype

1. Array has "Array prototype", and this one has "Object" Prototype

1. "Object" has no prototype, this one's prototype is null <- we can call this root prototype

1. slot is not a property

1. Property chaining: find at prototype, find at prototype of prototype, error

1. this keyword(caller concept)

1. cyclic proto value(error)

1. change of "this"

1. constructor
   - Upper Character starting is not required

1. prototype of Empty prototype

1. function has prototype, empty object
