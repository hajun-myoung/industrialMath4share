/**
 * # 1번
 * > 유니코드와 문자 인코딩에 대해서 조사하고, 설명해보세요.
 * 
 * ## 유니코드
 * 
 * 유니코드는 "문자를 컴퓨터에서 어떻게 처리할 것인가"에 대해,
 * 세계적으로 합의한 규격입니다.
 * 즉, 세계 각국에서 사용하는 문자들을 "표준화된 코드"로 일대일 대응시키고,
 * 컴퓨터에서 이러한 코드를 바탕으로 사용자에게 "문자"로 보여주게 됩니다.
 * 이러한 유니코드는 "Unicode Consortium(유니코드 컨소시엄)"
 * 에서 정의하고, 배포하고 있습니다.
 * 
 * 다만, 사람이 만드는 체계이기 때문에 "모든 문자"를 담아내지는 못합니다.
 * 새로운 기호나 이모지가 만들어지는 경우, 유니코드에 반영되기까지 시간이 필요하며,
 * 특수한 경우(예: 이체자와 같이 희귀한 문자, 고대 언어로 쓰여진 문자)에는 포함되지 않고 있습니다.
 * 
 * ## 인코딩
 *  
 * > 📚 **Reference**
 * >
 * > A transmitter operates on the message to produce a signal suitable for transmission
 * > Shannon, A Mathematical Theory of Communication (1948)
 * 
 * 미국의 수학자이자 전기공학자, 암호학자인 Clause Shannon은 그의 저서
 * "A Mathematical Theory of Communication"를 통해
 * "송신기(transmitter)는 메시지에 어떤 처리를 가하여
 * 전송(transmission)에 적합한 신호를 만들어낸다"고
 * 설명합니다.
 * 
 * 여기서 송신기(transmitter)는 메시지를 전송 가능한 신호로 변환하는 장치이며,
 * 현대 정보이론에서 이를 "encoding 과정"으로 이해할 수 있습니다.
 * 
 * ## 문자 인코딩
 * 
 * > 📚 **Reference**
 * >
 * > The Unicode Standard assigns each character a unique numeric value
 * > Unicode Consortium, The Unicode® Standard: A Technical Introduction
 * 
 * 한편, 유니코드를 정의하고 배포하는 "Unicode Consortium"에서는
 * "유니코드는 각각의 문자를 고유한 숫자로 대응시킨다"고 설명합니다.
 * 
 * 상술한 [인코딩](#인코딩)과 이를 연결하여 생각해보면,

 * 숫자 데이터로 변환하는 것"이라 할 수 있습니다.
 * 문자 인코딩이란 "문자를 인코더(컴퓨터)를 통해, 컴퓨터가 이해할 수 있는
 * #### UTF
 * 
 * > 이 내용은 과제에 직접적으로 요구되지 않았습니다
 * 
 * UTF는 Unicode Transformation Format의 약자입니다.
 * 
 * 
 * 유니코드를 사용해 문자를 인코딩하는 체계입니다.
 * 둘 모두 "유니코드를 사용하는 것"은 같고,
 * 이러한 UTF에는 UTF-8, UTF-16과 같은 표준이 있는데,
 * 
 * "컴퓨터의 얼마나 많은 메모리를 사용할 것인지"가 다릅니다.
 * 
 * 예를 들어, 같은 문자 "A" 또는 "가"를 두 체계는 다음과 같이 저장합니다:
 * | :--: | :------: | :------: | :----: |
 * | 문자 | 유니코드 |  UTF-8   | UTF-16 |
 * |  가  |  U+AC00  | EA B0 80 |  AC00  |
 * |  A   |  U+0041  |    41    |  0041  |
 * 이 때, 세계적인 "웹 표준"은 UTF-8을 채택합니다.
 * 
 * 따라서 윈도우에서 웹을 개발하게 되면
 * 그런데, Windows OS는 내부적으로 UTF-16을 사용하는 경우가 많고,
 * 들을 마주하게 됩니다.
 * [여러가지 눈물을 머금는 상황](https://hajun-myoung.github.io/until/tech/blog/vuepress/rfv_errors.html#텍스트-깨짐-문제-인코딩-문제)
 */

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
