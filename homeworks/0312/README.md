# 03월 12일 과제

03월 12일에 assign 된 과제입니다

## 1번

> 유니코드와 문자 인코딩에 대해서 조사하고, 설명해보세요.

### 유니코드

유니코드는 "문자를 컴퓨터에서 어떻게 처리할 것인가"에 대해,
세계적으로 합의한 규격입니다.  
즉, 세계 각국에서 사용하는 문자들을 "표준화된 코드"로 일대일 대응시키고,
컴퓨터에서 이러한 코드를 바탕으로 사용자에게 "문자"로 보여주게 됩니다.  
이러한 유니코드는 "Unicord Consortium(유니코드 컨소시엄)"
에서 정의하고, 배포하고 있습니다.

다만, 사람이 만드는 체계이기 때문에 "모든 문자"를 담아내지는 못합니다.  
새로운 기호나 이모지가 만들어지는 경우, 유니코드에 반영되기까지 시간이 필요하며,
특수한 경우(예: 이체자와 같이 희귀한 문자, 고대 언어로 쓰여진 문자)에는 포함되지 않고 있습니다.

### 인코딩

<!-- <div style="
        border-left:4px solid green;
        padding:10px;
        background:#fff8e6;
        color: black;
        margin-bottom: 8px;
    "
>
    <strong>
        A transmitter operates on the message to produce a signal suitable for transmission
    </strong>
    <br />
    <div style="text-align: right">
        - Shannon, A Mathematical Theory of Communication (1948)
    </div>
</div> -->

> 📚 **Reference**
>
> A transmitter operates on the message to produce a signal suitable for transmission  
> Shannon, A Mathematical Theory of Communication (1948)

미국의 수학자이자 전기공학자, 암호학자인 Clause Shannon은 그의 저서
"A Mathematical Theory of Communication"를 통해
"송신기(transmitter)는 메시지에 어떤 처리를 가하여
전송(transmission)에 적합한 신호를 만들어낸다"고
설명합니다.

여기서 "송신기"가 현대의 "인코더"를 의미하는 것으로서,  
인코딩은 "특정한 데이터를 알맞은 전자 신호(=코드)로의 변환"을 의미합니다.

### 문자 인코딩

<!-- <div style="
        border-left:4px solid green;
        padding:10px;
        background:#fff8e6;
        color: black;
        margin-bottom: 8px;
    "
>
    <strong>
        The Unicode Standard assigns each character a unique numeric value
    </strong>
    <br />
    <div style="text-align: right">
        - Unicode Consortium
        <br />
        The Unicode® Standard: A Technical Introduction
    </div>
</div> -->

> 📚 **Reference**
>
> The Unicode Standard assigns each character a unique numeric value  
> Unicode Consortium, The Unicode® Standard: A Technical Introduction

한편, 유니코드를 정의하고 배포하는 "Unicode Consortium"에서는
"유니코드는 각각의 문자를 고유한 숫자로 대응시킨다"고 설명합니다.

상술한 [인코딩](#인코딩)과 이를 연결하여 생각해보면,
문자 인코딩이란 "문자를 인코더(컴퓨터)를 통해, 컴퓨터가 이해할 수 있는
숫자 데이터로 변환하는 것"이라 할 수 있습니다.

#### UTF

> 이 내용은 과제에 직접적으로 요구되지 않았습니다

UTF는 Unicode Transformation Format의 약자입니다.  
유니코드를 사용해 문자를 인코딩하는 체계입니다.

이러한 UTF에는 UTF-8, UTF-16과 같은 표준이 있는데,
둘 모두 "유니코드를 사용하는 것"은 같고,
"컴퓨터의 얼마나 많은 메모리를 사용할 것인지"가 다릅니다.

예를 들어, 같은 문자 "A" 또는 "가"를 두 체계는 다음과 같이 저장합니다:

| 문자 | 유니코드 |  UTF-8   | UTF-16 |
| :--: | :------: | :------: | :----: |
|  A   |  U+0041  |    41    |  0041  |
|  가  |  U+AC00  | EA B0 80 |  AC00  |

이 때, 세계적인 "웹 표준"은 UTF-8을 채택합니다.  
그런데, Windows OS는 내부적으로 UTF-16을 사용하는 경우가 많고,
따라서 윈도우에서 웹을 개발하게 되면
[여러가지 눈물을 머금는 상황](https://hajun-myoung.github.io/until/tech/blog/vuepress/rfv_errors.html#텍스트-깨짐-문제-인코딩-문제)
들을 마주하게 됩니다.

## 2번

> 문자열 메소드 5개를 찾아서 설명하고 문자열 "my industrial math class is great."에 적용해보세요.

메소드를 찾기 위해 참고한 자료는
[MDN의 String 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
입니다.

### at

String.prototype.at(index) 메서드는
매개변수로 주어진 index 번째에 있는 문자를 반환합니다:

```js
> myStr = "my industrial math class is great."
'my industrial math class is great.'
> myStr.at(4)
'n'
```

### charCodeAt

String.prototype.charCodeAt(index) 메서드는
매개변수로 주어진 index 번째에 있는 문자*의 유니코드*를 반환합니다:

```js
> myStr.charCodeAt(4)
110
```

이 때, UTF-16 규칙을 따릅니다

### includes

String.prototype.includes(searchingString [, position]) 메서드는
매개변수로 주어진 `searchingString`을 포함하는지를 반환합니다

```js
> myStr.includes("great")
true
> myStr.includes("pizza")
false
```

### endsWidth

String.prototype.endsWidth(searchingString [, length]) 메서드는
매개변수로 주어진 `searchingString` 으로 "끝나는지"를 반환합니다

```js
> myStr.endsWith("great")
false
> myStr.endsWith("great.")
true
```

### slice

String.prototype.split([sep [, limit]]) 메서드는
서브스트링 `sep`을 기준으로 원래의 문자열을 분리합니다.  
이 때, 반환은 List 타입으로 이루어지며, 모든 매개변수가 optional 입니다

```js
> myStr.split()
[ 'my industrial math class is great.' ]
> myStr.split("math")
[ 'my industrial ', ' class is great.' ]
> myStr.split(" ")
[ 'my', 'industrial', 'math', 'class', 'is', 'great.' ]
```

위 예시 코드에서, 세 번째 `String.split(" ")`는 다양한 상황에서
특히 많이 쓰이는 패턴입니다.  
공백을 기준으로 분리하므로, 단어들을 떼어내 사용할 수 있습니다.

## 3번

> 아래 코드에서와 같이...

```js
const price = 199_900;
const quantity = 3;
console.log(`총합은 ${price * quantity}원 입니다.`);
```

### result

```js
> console.log(`총합은 ${price * quantity}원 입니다.`);
총합은 599700원 입니다.
```

## 4번

> 프로퍼티 이름이...

```js
const user = {
  name: 'Hajun Myoung',
  student_id: 2022270033,
};

console.log(user);
```

### result

```js
{ name: 'Hajun Myoung', student_id: 2022270033 }
```

## 5번

> 계산된 객체 프로퍼티...

```js
const username = 'username';
const email = 'email';
const myObj = {
  username,
  email,
};
console.log(myObj);
```

### result

```js
{ username: 'username', email: 'email' }
```
