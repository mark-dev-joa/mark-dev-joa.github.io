---
title: 테일러 급수(Taylor Series)
description: 급수
author: saint-crab
categories: [math]
tags: [three.js]
math: true
mermaid: true
---

# 테일러 급수(Taylor Series)

```
어떤 함수 $f(x)$가 한점 $a$에서 미분 가능하다면 함수 $f(x)$를 $a$ 근처에서 다항식으로 전개할 수 있다. 
이 다항식을 테일러 급수 라고 한다.
```
 

## 맥클로린 급수

``` markdown 
함수 $f(x)$ 에서 초기값 $x_0=0$ 으로 두어 전개한 것을 맥클로린 급수라고 한다.
```

1. 함수 $f(x)$ 를 미분해 도함수를 구한다.

$$
\begin{align}
f(x) &= a_0x^0 + a_1x^1 + a_2x^2 + a_3x^3 + a_4x^4 + a_5x^5 + a_6x^6 + ... + a_nx^n \\
f'(x) &= 1 \cdot a_1x^0 + 2 \cdot a_2x^1 + 3 \cdot a_3x^2 + 4 \cdot a_4x^3 + 5 \cdot a_5x^4 + 6 \cdot a_6x^5 + ...  \\
f''(x) &= 1 \cdot 2 \cdot a_2x^0 + 2 \cdot 3 \cdot a_3x^1 + 3 \cdot 4 \cdot a_4x^2 + 4 \cdot 5 \cdot a_5x^3 + 5 \cdot 6 \cdot a_6x^4 + ...  \\
f'''(x) &= 1 \cdot 2 \cdot 3 \cdot a_3x^0 + 2 \cdot 3 \cdot 4 \cdot a_4x^1 + 3 \cdot 4 \cdot 5 \cdot a_5x^2 + 4 \cdot 5 \cdot 6 \cdot a_6x^3 + ...  \\
f''''(x) &= 1 \cdot 2 \cdot 3 \cdot 4 \cdot a_4x^0 + 2 \cdot 3 \cdot 4 \cdot 5 \cdot a_5x^1 + 3 \cdot 4 \cdot 5 \cdot 6 \cdot a_6x^2 + ...  \\
\end{align}
$$

2. $f(x)$ 에서 $x=0$ 을 대입한다.

$$
\begin{align}
f(0) &= a_0 \\
f'(0) &= 1 \cdot a_1 \\
f''(0) &= 1 \cdot 2 \cdot a_2 \\
f'''(0) &= 1 \cdot 2 \cdot 3 \cdot a_3 \\
f''''(0) &= 1 \cdot 2 \cdot 3 \cdot 4 \cdot a_4
\end{align}
$$

3. {$a_1, a_2, a_3, ..., a_n$} 를 구한다.

$$
\begin{align}
a_0 = {f(0) \over 0!} \\
a_1 = {f'(0) \over 1!} \\
a_2 = {f''(0) \over 2!} \\
a_3 = {f'''(0) \over 3!} \\
a_4 = {f''''(0) \over 4!} \\
\end{align}
$$

4. $ f(x) = a_0x^0 + a_1x^1 + a_2x^2 + a_3x^3 + a_4x^4 + a_5x^5 + a_6x^6 + ... + a_nx^n$ 에 구해놓은 {$a_1, a_2, a_3, ..., a_n$} 를 대입한다.

