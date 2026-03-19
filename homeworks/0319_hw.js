/**
 * # 1번
 * > optional chaining 연산자 ?.에 대해서 설명하고 다음 코드를 실행 결과를 보고 각각 이유를 적어 보세요
 *
 * ## optional chaining이 없다면
 *
 * optional chaining ?. 는 "참조하고자 하는 대상이 읽을 수 없는 경우"를 대비하기 위해 만들어졌습니다.
 * 이 문법의 경우, 비교적 최근(ECMA2020)에 추가된 문법이기 때문에,
 * 레거시 코드에서는 잘 보이지 않는 패턴이며, 그 이전 버전의 브라우저의 경우에는 업데이트가 필요할 수 있습니다.
 *
 * 웬만한 경우에서 오류를 반환하지 않는 것이 Vanila JS의 특징이지만,
 * "존재하지 않는(참조할 수 없는)" 대상을 읽어와서 참조하라는 명령은, 오류를 발생시킵니다.
 *
 * 예를 들어, user가 정의되어있지 않은 상태에서
 *
 * ```js
 * // submit function은 정의되어 있다고 가정
 * submit(user.address) // 주소를 제출하는 임의의 과정
 * ```
 *
 * 위와 같은 함수를 실행한다고 하면, 존재하지 않는 user를 참고하고자 하였으므로
 *
 * > 🚨 Error
 * > TypeError: undefined is not an object
 * > (또는, 상황에 따라서 null is not an object)
 *
 * 와 같은 오류를 맞게 됩니다.
 *
 * 이러한 오류는, "Runtime Error(런타임 에러)"에 속하고 있으므로,
 * JS로 동작하는 서버가 겪는다면, 서버가 뻗어버릴 수 있는 중대한 문제를 일으킵니다.
 *
 * 따라서 "참조할 수 없는 대상을 참조하더라도, 오류는 발생시키지 않는 문법"이 필요합니다.
 *
 * ## optional chaining 연산자의 동작
 *
 * optional chaining 연산자는, "참조하고자 하는 대상"이 "undefined"나 "null"인 경우,
 * 참조를 진행하지 않고, 무조건 undefined를 반환합니다.
 *
 * 이렇게, "로딩되지 않은 DOM Element", "데이터가 존재하지 않는 객체", "임의의 오류"들을 대응하여,
 * JS가 Runtime Error을 발생시키지 않고 ***안전하게*** 동작할 수 있습니다.
 */

const user = {
  username: 'kildong',
  address: {
    street: 'Jochiwon',
    phone: '010-1234-5678',
  },
};
// a)
console.log(user?.address?.street);
/** Result: Jochiwon
 * user object가 정의되어 있고,
 * user.address가 {street: "Jochiwon", phone: "010-1234-5678"} 의 Object로 정의되어 있습니다.
 *
 * 따라서 준비된 Object들을 참조하여(읽어), user의 address의 street를 출력합니다
 */

// b)
console.log(user?.address?.code);
/** Result: undefined
 * user, user.address는 1번과 같이 잘 정의되어 있으나
 * user.address에는 "code"라는 property가 존재하지 않습니다.
 *
 * 따라서 undefined를 출력합니다
 */

// c)
console.log(user?.password?.code);
/** Result: undefined
 * user 객체는 존재하지만, 이 객체에는 password 라는 property가 없습니다.
 * 따라서, `password?.`의 optional chaining `?.`가 동작합니다.
 *
 * 즉, user?.password가 undefined이므로, ".code"를 판단하지 않고,
 * 바로 undefined를 반환해 이것을 출력합니다
 */

// d)
try {
  console.log(user?.password.code);
  /** TypeError: Cannot read properties of undefined (reading 'code')
   * user object에는 password property가 없는데, `.code`로 이것을 참조하고 있습니다.
   * 따라서 Runtime Error "undefined의 property를 읽으려고 하고 있다"는 오류가 발생합니다
   */
} catch (err) {
  console.log(err);
}

// e)
try {
  console.log(person?.contact?.phone);
  /** Result: ReferenceError: person is not defined
   * optional chaining을 이용하여 `person?.` 으로 참조했음에도, Runtime Error가 발생합니다.
   * 이는, 참조를 시작하는 "최초 대상"은 선언되어 있어야 하기 때문입니다.
   *
   * person은 선언조차 된 적이 없으므로, 에러가 발생합니다.
   */
} catch (err) {
  console.log(err);
}

/**
 * # 2번
 * > 다음 `for in`, `for of` 코드 실행 결과를 보고 이유를 적어보세요
 */

const arr = [1, 2, 3];
arr.lucky = 'guy!';
arr[10] = 10;

for (const key in arr) {
  console.log(`arr[${key}] = ${arr[key]}`);
}
/**
 * for ... in 루프는, "iterable의 key를 가지고 도는 루프" 입니다
 * 따라서 이 루프에서 key는 매 회차에서 arr의 키 값들을 가지고 있게 됩니다.
 *
 * arr[0] = 1
 * arr[1] = 2
 * arr[2] = 3
 *
 * 여기까지는 사전에 정의된 값들입니다.
 * 즉, const arr = [1, 2, 3]로 선언하면서 key 0에 value 1, key 1에 value 2,...이 대응되었고,
 * 따라서 arr[0] = 1 꼴의 결과가 출력되었습니다
 *
 * arr[10] = 10
 * 이후, arr[10] = 10을 통해 key 10에 대해서 value 10이 추가되었습니다.
 * 따라서 이 값이 출력됩니다.
 *
 * arr[lucky] = guy!
 * arr은 Array type 이고, JS에서 Array는 Object이므로, 임의의 property를 추가 가능합니다.
 * arr.lucky = "guy!"는 정확하게 이에 해당하는 선언문으로서,
 * Array arr에 lucky라는 key를 가진 property를 추가하고, 그 value를 "guy!" 라고 하고 있습니다.
 * 따라서 이것이 출력되었습니다.
 */

for (const elm of arr) {
  console.log(`${elm}`);
}
/**
 * 1
 * 2
 * 3
 * undefined
 * undefined
 * undefined
 * undefined
 * undefined
 * undefined
 * undefined
 * 10
 *
 * arr은 Array type의 Object 이므로, "자연수인 키 값"들을 가집니다.
 * 그런데 최초 선언된 [1, 2, 3] 외에, "인덱스가 10인 값 10"이 추가로 선언되었습니다.
 *
 * 따라서 최초 선언된 인덱스 0, 1, 2와 추가 선언된 인덱스 10 사이를 메꾸어,
 * 인덱스 3, 4, 5, 6, 7, 8, 9 에 해당하는 값들이 undefined로 할당되었습니다.
 *
 * for ... of 루프는 for ... in 루프와 다르게 "iterable의 value를 가지고 도는 루프"이기에,
 * 이들 값, 곧 [1, 2, 3, undefined, ..., undefined, 10] 을 순서대로 가져가며, 이것이 출력되었습니다.
 */

/**
 * # 3번
 * > switch 문에 대해서 알아보고 다음 코드 출력 결과에 대한 이유를 설명하시오
 */

let fruit = 'apple';
let result = '';

switch (fruit) {
  case 'banana':
    result += '바나나 ';
  case 'apple':
    result += '사과 ';
  case 'orange':
    result += '오렌지 ';
    break;
  case 'grape':
    result += '포도 ';
  default:
    result += '과일 ';
}

/**
 * switch 문은 "여러 개의 if 비교문을 한 번에 나열하여 수행하는" 문법입니다.
 * switch(x) {
 *  case 'val1':
 *  statement...
 *  case 'val2':
 *  statement...
 *  default:
 *  statement...
 * }
 *
 * 위와 같은 코드는, 각각의 case마다 x == val<n>인지를 점검하는 것과 같습니다.
 * 즉, x == val1, x == val2를 점검하게 되며,
 * 어떤 case 에서도 "일치하는 값"이 없는 경우 Default 문이 기본적으로 실행됩니다.
 *
 * 이 때, "해당되는 case"가 발생하면, 거기서부터 아래로 쭉 코드를 실행하므로, break로 끝을 표시해야 합니다
 */

console.log(result);
/** Result: "사과 오렌지 "
 * fruit == apple 이므로, case "apple" 문이 실행되었습니다.
 * 따라서 result = result + "사과 "가 동작하고
 * "" + "사과 "와 같은 "문자열의 합"은 "문자열들을 concat" 하므로 "사과 "가 됩니다.
 *
 * 이후, break가 없으므로 case "orange" 문이 연속 실행됩니다.
 * 따라서 "사과 " + "오렌지 " 가 실행되어 "사과 오렌지 "가 완성됩니다.
 * 이 케이스에는 break가 있으므로, 실행이 중단됩니다.
 *
 * 그리고 이것이 출력되었습니다.
 */
