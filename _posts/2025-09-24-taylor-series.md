---
title: 테일러 급수(Taylor Series)
description: 아는데로 정리하는 테일러 급수
permalink: /math/taylor/
author: saint-crab
categories: [math, calculus]
tags: [three.js]
math: true
mermaid: true
---

# 테일러 급수(Taylor Series)

---

테일러 급수란 어떤 함수 $f(x)$가 한점 $a$에서 미분 가능하다면 함수 $f(x)$를 $a$ 근처에서 다항식으로 전개할 수 있다. 

쉽게 말해 테일러 급수란 어떤 함수 $f(x)$ 를 다항함수로 표현하는 것이라고 한다. 응??

$sin(x)$ 등의 초월 함수를 $f(x) = a_0x^0 + a_1x^1 + a_2x^2 + a_3x^3 + a_4x^4 + a_5x^5 + a_6x^6 + ... + a_nx^n$ 표현 할 수 있다. 응??

왜 $sin(x)$ 를 그냥 사용하면 되지 왜 굳이 다항식으로 표현해서 사용할까?

일단, 테일러 급수를 먼저 유도해보자.

##### $f(x)$ 를 다항식 형태로 표현하고

$$
f(x) = a_0x^0 + a_1x^1 + a_2x^2 + a_3x^3 + a_4x^4 + a_5x^5 + a_6x^6 + ... + a_nx^n \\
$$

##### $f(x)$ 를 미분하자

$$
\begin{align}
f(x) &= a_0x^0 + a_1x^1 + a_2x^2 + a_3x^3 + a_4x^4 + a_5x^5 + a_6x^6 + ... + a_nx^n \\
f'(x) &= 1 \cdot a_1x^0 + 2 \cdot a_2x^1 + 3 \cdot a_3x^2 + 4 \cdot a_4x^3 + 5 \cdot a_5x^4 + 6 \cdot a_6x^5 + ...  \\
f''(x) &= 1 \cdot 2 \cdot a_2x^0 + 2 \cdot 3 \cdot a_3x^1 + 3 \cdot 4 \cdot a_4x^2 + 4 \cdot 5 \cdot a_5x^3 + 5 \cdot 6 \cdot a_6x^4 + ...  \\
f^{(3)}(x) &= 1 \cdot 2 \cdot 3 \cdot a_3x^0 + 2 \cdot 3 \cdot 4 \cdot a_4x^1 + 3 \cdot 4 \cdot 5 \cdot a_5x^2 + 4 \cdot 5 \cdot 6 \cdot a_6x^3 + ...  \\
f^{(4)}(x) &= 1 \cdot 2 \cdot 3 \cdot 4 \cdot a_4x^0 + 2 \cdot 3 \cdot 4 \cdot 5 \cdot a_5x^1 + 3 \cdot 4 \cdot 5 \cdot 6 \cdot a_6x^2 + ...  \\
\end{align}
$$

##### 이해하기 쉽도록 $f(x)$ 에서 $x$ 가 0이라는 가정하에 유도, $x$ 에 0을 대입하는 이유는 {$a_1, a_2, a_3, ..., a_n$} 를 구해야 하기 때문

$$
\begin{align}
f(0) &= a_0 \\
f'(0) &= 1 \cdot a_1 \\
f''(0) &= 1 \cdot 2 \cdot a_2 \\
f^{(3)}(0) &= 1 \cdot 2 \cdot 3 \cdot a_3 \\
f^{(4)}(0) &= 1 \cdot 2 \cdot 3 \cdot 4 \cdot a_4
\end{align}
$$

##### $f(x)$ 부터 미분된 $f^{(n)}(x)$ 함수에 $x = 0$ 을 넣으면 다음과 같이 {$a_1, a_2, a_3, ..., a_n$} 를 구할 수 있다.

$$
\begin{align}
a_0 &= {f(0) \over 0!} \\
a_1 &= {f'(0) \over 1!} \\
a_2 &= {f''(0) \over 2!} \\
a_3 &= {f^{(3)}(0) \over 3!} \\
a_4 &= {f^{(4)}(0) \over 4!} \\
\end{align}
$$

##### 구해둔 {$a_1, a_2, a_3, ..., a_n$}를 $f(x)$ 함수의 항들을 치환하면 어디서 많이 본 형태의 함수를 볼 수 있다.

$$
\begin{align}
f(x) &= {f(0) \over 0!}x^0 + {f'(0) \over 1!}x^1 + {f''(0) \over 2!}x^2 + {f^{(3)}(0) \over 3!}x^3 + {f^{(4)}(0) \over 4!}x^4 + ... + {f^{(n)}(0) \over n!}x^n \\
f(x) &= f(0) + f'(0)x^1 + {f''(0) \over 2!}x^2 + {f^{(3)}(0) \over 3!}x^3 + {f^{(4)}(0) \over 4!}x^4 + ... + {f^{(n)}(0) \over n!}x^n
\end{align}
$$


#### 테일러 급수 중 함수 $f(x)$ 에서 초기값 $x=0$ 으로 두어 전개한 것을 맥클로린 급수(Maclaurin Series)라고 한다.

정리하면

$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(0)}{n!} x^n
$$

## 함수 $f(x)$ 의 초기값이 $x = 0$ 이 아닌 $ x = \alpha $ 일때 테일러 급수(Taylor Series)를 유도해보자

---

##### 어떤 함수 $f(x)$ 의 초기값 $ \alpha $

$$
f(x) = a_0(x-\alpha)^0 + a_1(x-\alpha)^1 + a_2(x-\alpha)^2 + a_3(x-\alpha)^3 + a_4(x-\alpha)^4 + a_5(x-\alpha)^5 + a_6(x-\alpha)^6 + ... + a_n(x-\alpha)^n \\
$$

##### $f(x)$ 를 미분하자

$$
\begin{align}
f(x) &= a_0(x-\alpha)^0 + a_1(x-\alpha)^1 + a_2(x-\alpha)^2 + a_3(x-\alpha)^3 + a_4(x-\alpha)^4 + a_5(x-\alpha)^5 + a_6(x-\alpha)^6 + ... + a_n(x-\alpha)^n \\
f'(x) &= 1 \cdot a_1(x-\alpha)^0 + 2 \cdot a_2(x-\alpha)^1 + 3 \cdot a_3(x-\alpha)^2 + 4 \cdot a_4(x-\alpha)^3 + 5 \cdot a_5(x-\alpha)^4 + 6 \cdot a_6(x-\alpha)^5 + ...  \\
f''(x) &= 1 \cdot 2 \cdot a_2(x-\alpha)^0 + 2 \cdot 3 \cdot a_3(x-\alpha)^1 + 3 \cdot 4 \cdot a_4(x-\alpha)^2 + 4 \cdot 5 \cdot a_5(x-\alpha)^3 + 5 \cdot 6 \cdot a_6(x-\alpha)^4 + ...  \\
f^{(3)}(x) &= 1 \cdot 2 \cdot 3 \cdot a_3(x-\alpha)^0 + 2 \cdot 3 \cdot 4 \cdot a_4(x-\alpha)^1 + 3 \cdot 4 \cdot 5 \cdot a_5(x-\alpha)^2 + 4 \cdot 5 \cdot 6 \cdot a_6(x-\alpha)^3 + ...  \\
f^{(4)}(x) &= 1 \cdot 2 \cdot 3 \cdot 4 \cdot a_4(x-\alpha)^0 + 2 \cdot 3 \cdot 4 \cdot 5 \cdot a_5(x-\alpha)^1 + 3 \cdot 4 \cdot 5 \cdot 6 \cdot a_6(x-\alpha)^2 + ...  \\
\end{align}
$$

##### $ x = \alpha $ 를 대입하면 $ (x^n - \alpha) $ 항은 0이 되어 $ x = 0 $ 을 넣은것과 같이 미분후 $a$ 항만 남기고 소거 가능

##### a항만 남는 이유 -> $ a_0 \cdot 0^0 = a_0 \cdot 1 = a_0 $

$$
\begin{align}
f(\alpha) &= a_0 \\
f'(\alpha) &= 1 \cdot a_1 \\
f''(\alpha) &= 1 \cdot 2 \cdot a_2 \\
f^{(3)}(\alpha) &= 1 \cdot 2 \cdot 3 \cdot a_3 \\
f^{(4)}(\alpha) &= 1 \cdot 2 \cdot 3 \cdot 4 \cdot a_4
\end{align}
$$

##### $ a_1, a_2, a_3, ... , a_n $

$$
\begin{align}
a_0 &= {f(\alpha) \over 0!} \\
a_1 &= {f'(\alpha) \over 1!} \\
a_2 &= {f''(\alpha) \over 2!} \\
a_3 &= {f^{(3)}(\alpha) \over 3!} \\
a_4 &= {f^{(4)}(\alpha) \over 4!} \\
\end{align}
$$

#### $a_1, a_2, a_3, ..., a_n$ 치환

$$
\begin{align}
f(x) = f(\alpha) + f'(\alpha)(x - \alpha) + {f''(\alpha) \over 2!}(x - \alpha)^2 + {f^{(3)}(\alpha) \over 3!}(x - \alpha)^3 + {f^{(4)}(\alpha) \over 4!}(x  - \alpha)^4+ ... + {f^{(n)}(\alpha) \over n!}(x - \alpha)^n
\end{align}
$$

정리하면

$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(\alpha)}{n!} (x-\alpha)^n
$$



## 다양한 형태의 함수를 테일러 급수로 정의

---

### 다항식(Polynomial)

![다항식]( /assets/images/20250925_1.png )

함수 $f(x) = 3x^2 - 2x + 1$

#### 미분

$$
\begin{align}
f(x) &= 3x^2 - 2x + 1 \\
f'(x) &= 6x - 2 \\
f''(x) &= 6
\end{align}
$$

#### $f(x)$ 에서 $x = 0$ 을 넣는다.

$$
\begin{align}
f(0) &= 1 \\
f'(0) &= -2 \\
f''(0) &= 6
\end{align}
$$

#### 맥클로린 급수 전개해보면, 원래 함수와 동일한 형태가 된다.

$$
\begin{align}
f(x) &= {f(0) \over 0!} + {f'(0) \over 1!}x + {f''(0) \over 2!}x^2 \\
&= f(0) + f'(0)x + {f''(0)x^2 \over 2} \\
&= 1 - 2x + 3x^2 \\
&= 3x^2 - 2x + 1
\end{align}
$$

### 유리함수(Rational function)

---

![유리함수]( /assets/images/taylor.gif )


$$
f(x) = \frac{1}{x+1}
$$

함수 $f(x)$ 를 테일로 급수로 전개하여 1~20차까지 근사하면 차수에 따라 본래 함수의 얼마나 근접하는지 확인 할 수 있다.


##### 미분

$$
f(x) = \frac{1}{x+1}
$$

$$
f'(x) = {d \over dx}((x+1)^{-1}) = -1(x+1)^{-2} = -\frac{1}{(x+1)^2}
$$

$$
f''(x) = -{d \over dx}(-(x+1)^{-2}) = -1 \cdot -2(x+1)^{-3} = \frac{2}{(x+1)^3}
$$

$$
f^{(3)}(x) = {d \over dx}(2(x+1)^{-3}) = -3 \cdot 2(x+1)^{-4} =-\frac{6}{(x+1)^4}
$$

$$
f^{(4)}(x) = \frac{24}{(x+1)^5}
$$


##### 맥클로린 급수로 전개를 위해 $f(x)$ 에서 $x = 0$ 을 넣는다.

$$
\begin{align}
f(0) &= 1 \\
f'(0) &= -1 \\
f''(0) &= 2 \\
f^{(3)}(0) &= -6 \\
f^{(4)}(0) &= 24
\end{align}
$$

##### 맥클로린 급수 전개

$$
f(x) = f(0) + f'(0)x^1 + {f''(0) \over 2!}x^2 + {f^{(3)}(0) \over 3!}x^3 + {f^{(4)}(0) \over 4!}x^4 + ... + {f^{(n)}(0) \over n!}x^n
$$

$$
f(x) = 1 -x + x^2 - x^3 + x^4 - x^5 + ... + x^n
$$

### 초월함수(Transendental function)

---

![테일러]( /assets/images/exp_taylor.gif )

초기값 0에서 1~10차 테일러 근사

$$
f(x) = e^x
$$

##### 미분($e^x$는 미분해도 $e^x$)

$$
\begin{align}
f(x) &= e^x \\
f'(x) &= e^x \\
f''(x) &= e^x \\
f^{(3)}(x) &= e^x \\
f^{(4)}(x) &= e^x
\end{align}
$$

##### 맥클로린 급수로 전개를 위해 $f(x)$ 에서 $x = 0$ 을 넣는다.

$$
\begin{align}
f(0) &= e^0 = 1 \\
f'(0) &= e^0 = 1 \\
f''(0) &= e^0 = 1 \\
f^{(3)}(0) &= e^0 = 1 \\
f^{(4)}(0) &= e^0 = 1
\end{align}
$$

$$
f(x) = {f(0) \over 0!}x^0 + {f'(0) \over 1!}x^1 + {f''(0) \over 2!}x^2 + {f^{(3)}(0) \over 3!}x^3 + {f^{(4)}(0) \over 4!}x^4 + ... + {f^{(n)}(0) \over n!}x^n
$$

$$
f(x) = {1 \over 0!}x^0 + {1 \over 1!}x^1 + {1 \over 2!}x^2 + {1 \over 3!}x^3 + {1 \over 4!}x^4 + ... + {1 \over n!}x^n
$$

$$
f(x) = e^x = \sum_{n=0}^{\infty} \frac{1}{n!}x^n
$$


##### 초기값 $x=2$ 에서 테일러 급수 전개

![테일러]( /assets/images/exp_taylor_at2.gif )

테일러 전개로 초기값 2에서 1~10차 근사

e 지수 법칙

$$
e^x = e^2*e^{x-2} = e^{2 + x -2} = e^x
$$

테일러 전개

$$
f(x) = {f(2) \over 0!}(x-2)^0 + {f'(2) \over 1!}(x - 2) + {f''(2) \over 2!}(x - 2)^2 + {f^{(3)}(2) \over 3!}(x - 2)^3 + {f^{(4)}(2) \over 4!}(x  - 2)^4+ ... + {f^{(n)}(2) \over n!}(x - 2)^n
$$

$$
f(x) = {e^2 \over 0!}(x-2)^0 + {e^2 \over 1!}(x - 2) + {e^2 \over 2!}(x - 2)^2 + {e^2 \over 3!}(x - 2)^3 + {e^2 \over 4!}(x  - 2)^4+ ... + {e^2 \over n!}(x - 2)^n
$$

$$
f(x) = e^x = \sum_{n=0}^{\infty} \frac{e^2}{n!}(x-2)^n = e^2\sum_{n=0}^{\infty} \frac{(x-2)^n}{n!}
$$

### 오일러 공식(Euler's formula) 
#### $ e^{ix} = cosx + isinx $

#### 1) 함수 $e^{ix}$ 를 테일러 급수로 전개

---

함수 $f(x)$ 가 $e^{ix}$ 일때, 앞서 유도한 테일러 급수(맥클로린 급수) 가져온다.

$$
f(x) = {f(0) \over 0!}x^0 + {f'(0) \over 1!}x^1 + {f''(0) \over 2!}x^2 + {f^{(3)}(0) \over 3!}x^3 + {f^{(4)}(0) \over 4!}x^4 + ... + {f^{(n)}(0) \over n!}x^n
$$

$$
e^{ix} = {e^{i0} \over 0!}x^0 + {(e^{i0})' \over 1!}x^1 + {(e^{i0})'' \over 2!}x^2 + {(e^{i0})^{(3)} \over 3!}x^3 + {(e^{i0})^{(4)} \over 4!}x^4 + ... + {(e^{i0})^{(n)} \over n!}x^n
$$

$$
e^{ix} = {1 \over 0!}x^0 + {i \over 1!}x^1 + {-1 \over 2!}x^2 + {-i \over 3!}x^3 + { 1 \over 4!}x^4 + { i \over 5!}x^5 +  ... + {(e^{i0})^{(n)} \over n!}x^n
$$

$$
e^{ix} = 1 + {i \over 1!}x^1 + {-1 \over 2!}x^2 + {-i \over 3!}x^3 + { 1 \over 4!}x^4 + { i \over 5!}x^5 +  ... + {(e^{i0})^{(n)} \over n!}x^n
$$


$e^{i0}$ 을 n번 미분하면 $1, i, -1, -1, 1, i, ...$ 순으로 4번 씩 반복되는 패턴으로 나타나고, 식을 $i$ 텀 기준으로 묶는다.

따라서 정리된 식은 다음과 같다.

$$
e^{ix} = (1 - {1 \over 2!}x^2 + {1 \over 4!}x^4 - {1 \over 6!}x^6 + {1 \over 8!}x^8 + ...) + i({1 \over 1!}x^1 - {1 \over 3!}x^3 + {1 \over 5!}x^5 - {1 \over 7!}x^7 + ...)
$$


#### 2) $cosx$ 를 테일러 급수로 전개

--- 

함수 $f(x) = cosx$ 일때

$$
\begin{align}
f(x) = {f(0) \over 0!}x^0 + {f'(0) \over 1!}x^1 + {f''(0) \over 2!}x^2 + {f^{(3)}(0) \over 3!}x^3 + {f^{(4)}(0) \over 4!}x^4 + ... + {f^{(n)}(0) \over n!}x^n
\end{align}
$$

$cosx$의 미분

| 미분 함수 | 0에서의 미분값|
|------|----------------|
| $f(x)=cosx$ | $f'(0) = 1$ |
| $f'(x)=-sinx$ | $f''(0) = 0$ |
| $f''(x)=-cosx$ | $f''(0) = -1$ |
| $f^{(3)}(x)=sinx$ | $f''(0) = 0$ |
| $f^{(4)}(x)=cosx$ | $f''(0) = 1$ |

$cosx$ 를 미분하면 0차부터 n차까지 미분하면 $cosx, -sinx, -cosx, sinx, cosx, -sinx, -cosx, ...$ 4번 씩 패턴이 반복된다.

식(59) 에 $f(0) = cos(0)$ 대입하면 테일러 급수를 유도할 수 있다.

$$
\begin{align}
cosx &= {cos(0) \over 0!}x^0 + {-sin(0) \over 1!}x^1 + {-cos(0) \over 2!}x^2 + {sin(0) \over 3!}x^3 + {cos(0) \over 4!}x^4 + ... \\
cosx &= {1 \over 0!}x^0 + {0 \over 1!}x^1 + {-1 \over 2!}x^2 + {0 \over 3!}x^3 + {1 \over 4!}x^4 + ... \\
cosx &= 1 - {1 \over 2!}x^2 + {1 \over 4!}x^4 - {1 \over 6!}x^6 + {1 \over 8!}x^8 + ...
\end{align}
$$

#### 3) $sinx$ 를 테일러 급수로 전개

---

$$
\begin{align}
f(x) = {f(0) \over 0!}x^0 + {f'(0) \over 1!}x^1 + {f''(0) \over 2!}x^2 + {f^{(3)}(0) \over 3!}x^3 + {f^{(4)}(0) \over 4!}x^4 + ... + {f^{(n)}(0) \over n!}x^n
\end{align}
$$

$sinx$의 미분

| 미분 함수 | 0에서의 미분값|
|------|----------------|
| $f(x)=sinx$ | $f'(0) = 0$ |
| $f'(x)=cos$ | $f''(0) = 1$ |
| $f''(x)=-sin$ | $f''(0) = 0$ |
| $f^{(3)}(x)=-cos$ | $f''(0) = -1$ |
| $f^{(4)}(x)=sin$ | $f''(0) = 0$ |

$sinx$ 를 미분하면 0차부터 n차까지 미분하면 $sinx, cosx, -sinx, -cosx, sinx, cosx, ...$ 4번 씩 패턴이 반복된다.

식(63) 에 $f(0) = sin(0)$ 대입하면 테일러 급수를 유도할 수 있다.

$$
\begin{align}
sinx &= {sin(0) \over 0!}x^0 + {cos(0) \over 1!}x^1 + {-sin(0) \over 2!}x^2 + {-cos(0) \over 3!}x^3 + {sin(0) \over 4!}x^4 + ... \\
sinx &= {0 \over 0!}x^0 + {1 \over 1!}x^1 + {0 \over 2!}x^2 + {-1 \over 3!}x^3 + {0 \over 4!}x^4 + ... \\
sinx &= {1 \over 1!}x^1 - {1 \over 3!}x^3 + {1 \over 5!}x^5 - {1 \over 7!}x^7 + {1 \over 9!}x^9 - ...
\end{align}
$$

#### 4) 오일러 공식 유도

---

##### $e^{ix}$ 의 테일러 급수 정의

$$
e^{ix} = \textcolor{green}{(1 - {1 \over 2!}x^2 + {1 \over 4!}x^4 - {1 \over 6!}x^6 + {1 \over 8!}x^8 + ...)} + i \textcolor{red}{({1 \over 1!}x^1 - {1 \over 3!}x^3 + {1 \over 5!}x^5 - {1 \over 7!}x^7 + ...)}
$$

##### $cosx$ 의 테일러 급수 정의

$$
cosx = \textcolor{green}{1 - {1 \over 2!}x^2 + {1 \over 4!}x^4 - {1 \over 6!}x^6 + {1 \over 8!}x^8 + ...}
$$

##### $sinx$ 의 테일러 급수 정의

{% raw %}
$$
sinx = \textcolor{red}{{1 \over 1!}x^1 - {1 \over 3!}x^3 + {1 \over 5!}x^5 - {1 \over 7!}x^7 + ...}
$$
{% endraw %}

##### $e^{ix}$ 정의의 초록식과 빨간식을 잘보면 $cosx, sinx$ 와 같다는 것을 알수 있다.


$$
e^{ix} = \textcolor{green}{cosx} + \textcolor{red}{isinx}
$$

여기서 $x = \pi$ 를 대입하면 오일러 항등식(Euler's Identity)을 유도할 수 있다.(수학에서 가장 아름다운 공식이라고 불린다고하는데 뭐..)

$$
cos\pi = -1, sin\pi = 0 \\
e^{i\pi} = cos\pi + isin\pi \\
e^{i\pi} = -1
$$

즉

$$
e^{i\pi} + 1 = 0
$$




## 자연상수 e 체인룰

---

##### 합성함수 미분 = 겉미분 * 속미분

$$
{d \over dx}e^{u(x)} = e^{u(x)} \cdot u'(x)
$$

#### (a) $e^{x-2}$

- $u(x) = x - 1$
- ${d \over dx}u(x) = 1$

 $$
 {d \over dx}e^{x-2} = e^{x-2} * 1 = e^{x-2}
 $$

#### (b) $e^{2x}$

- $u(x) = 2x$
- ${d \over dx}u(x) = 2$
  
$$
{d \over dx}e^{2x} = e^{2x} \cdot 2 = 2 \cdot e^{2x}
$$