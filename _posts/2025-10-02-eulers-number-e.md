---
title: 자연상수 e
description: 기억하려고 정리하는 자연상수 e
author: saint-crab
categories: [math, calculus]
tags: [derivative, chain-rule, taylor]
math: true
mermaid: true
---

## 자연상수 e

---

2와 3사이의 어떤수(2.718...)

## $e^x$

---

함수 $f(x) = e^x$ 와 함수를 미분한 $f'(x) = e^x$ 는 같다. 미분해도 같다.

$e^x$ 에 $x$ 는 무엇이든 다 넣을 수 있다.

| $x$ | $f(x)$ |
|------|----------------|
| $x = 1$ | $e^1$ |
| $x = i$ | $e^i$ |
| $x = \mathbf{A}$ | $e^{\mathbf(A)}$ |
| $x = \varepsilon{d \over dx}$ | $e^{\varepsilon{d \over dx}}$ |
| $x = Z$ | $re^{i\theta}$ |

## 미분을 이용해 $e$의 출생의 비밀을 밝히기

---

### 미분 정의 5가지

$$
\begin{align}
f'(x) &= \lim_{\Delta x \to 0} \frac{f(x+\Delta x) - f(x)}{\Delta x} \\
f'(x) &=\lim_{h \to 0} \frac{f(x+h) - f(x)}{h} \\
f'(x) &=\lim_{2h \to 0} \frac{f(x_{n+1}) - f(x_{n-1})}{h} \\
f'(x) &=\lim_{h \to x} \frac{f(x) - f(x-h)}{x - h} \\
f'(x) &=\lim_{h \to 0} \frac{A(x+h) - A(h)}{h}
\end{align}
$$

### 미분 정의 식(1)을 이용

$$
f'(x) = \lim_{\Delta x \to 0} \frac{f(x+\Delta x) - f(x)}{\Delta x}
$$

$ \lim_{} $ 기호 생략

$$
f'(x) = \frac{f(x+\Delta x) - f(x)}{\Delta x}
$$


$ {\Delta x} $ 좌변으로 이동

$$
f'(x){\Delta x} = {f(x+\Delta x) - f(x)}
$$

$f(x+\Delta x)$ 로 식 정리

$$
{f(x+\Delta x)} = f(x) + f'(x){\Delta x}
$$

$e$ 의 정의에 따라 $ e'^x = e^x $ 따라서 $f'(x) = f(x)$ 로 가정

$f'(x)$의 $f(x)$ 를 대입

$$
{f(x+\Delta x)} = f(x) + f(x){\Delta x} \\
{f(x+\Delta x)} = (1 + \Delta x)f(x)
$$

$x$ 에 0을 넣어보자

(정확하겐 모르지만 테일러 시리즈에서 맥클로린 급수를 구할때 $f(0)$ 넣어 구하기때문에)

그리고 $f(0) = 1$ 이라고 가정

(이것도 테일러 시리즈 전개할 때 $f(x)$ 의 0을 넣으면 그 값이 1이기 때문에)

<figure style="text-align:center;">
  <img 
    src="/assets/images/eulers-number-e-f0-1.png" 
    alt="f(0)=1"
    style="width:50%; border:1px solid #ccc; border-radius:8px; padding:4px;"
  >
  <figcaption style="font-size:0.9em; color:#666; margin-top:0.4em;">
    참고 이미지: f(0)=1
  </figcaption>
</figure>

[테일러 급수 정리 보기](/math/taylor/)



$$
\begin{align}
{f(\Delta x)} = (1 + \Delta x) \cdot 1
\end{align}
$$

이번엔 $x$ 에 $\Delta x$를 넣고 식(6)을 대입하면

$$
\begin{align}
{f(x+\Delta x)} &= (1 + \Delta x)f(x) \\
{f(\Delta x+\Delta x)} &= (1 + \Delta x)f(\Delta x) \\
{f(\Delta x+\Delta x)} &= (1 + \Delta x)(1 + \Delta x) \\
{f(2\Delta x)} &= (1 + \Delta x)^2
\end{align}
$$

이번엔 $x$ 에 $2\Delta x$를 넣고 식(10)을 대입하면

$$
\begin{align}
{f(2\Delta x + \Delta x)} &= (1 + \Delta x)f(2\Delta x) \\
{f(3\Delta x)} &= (1 + \Delta x)(1 + \Delta x)^2 \\
{f(3\Delta x)} &= (1 + \Delta x)^3
\end{align}
$$

이번엔 $x$ 에 $(n-1)\Delta x$를 넣어보자

$$
\begin{align}
{f((n-1)\Delta x + \Delta x)} &= (1 + \Delta x)f[(n-1)\Delta x] \\
{f(n\Delta x - \Delta x + \Delta x)} &= (1 + \Delta x)f[(n-1)\Delta x]
\end{align}
$$

식(10), 식(13)에서의 규칙대로 적용하면 $ f(n \Delta x) = (1 + \Delta x)^n $


$n = (n-1)$ 이라면 $ f((n-1) \Delta x) = (1 + \Delta x)^{n-1} $ 이 된다.

따라서

$$
\begin{align}
{f(n\Delta x - \Delta x + \Delta x)} &= (1 + \Delta x)(1 + \Delta x)^{n-1} \\
{f(n\Delta x)} &= (1 + \Delta x)^n
\end{align}
$$

$n\Delta x = x$ 로 두면 $ \Delta x = \frac{x}{n}$ 가 되고 식에 다시 대입해보면

$$
\begin{align}
f(x) &= (1 + \frac{x}{n})^n \\
f(x) &= \lim_{\Delta n \to \infin} (1 + \frac{x}{n})^n
\end{align}
$$

즉 $e^x$ 는

$$
\begin{align}
e^x &= \lim_{\Delta n \to \infin} (1 + \frac{x}{n})^n \\
e^1 &= \lim_{\Delta n \to \infin} (1 + \frac{1}{n})^n \\
\end{align}
$$

#### $e^1$ 의 정의

$$
\begin{align}
e^1 &= \lim_{\Delta n \to \infin} (1 + \frac{1}{n})^n \\
e^x &= e^1 = {1 \over 0!}1^0 + {1 \over 1!}1^1 + {1 \over 2!}1^2 + {1 \over 3!}1^3 + {1 \over 4!}1^4 + ... + {1 \over n!}1^n \\
e^1 &= \sum_{n=0}^{\infty} \frac{1}{n!} \\
{\int_{1}^{e}\frac{1}{x}dx} &= 1
\end{align}
$$

#### $e^{ix}$ 의 정의

$$
\begin{align}
e^{ix} &= \lim_{\Delta n \to \infin} (1 + \frac{ix}{n})^n = cosx + isinx \\
e^{i} &= \lim_{\Delta n \to \infin} (1 + \frac{i}{n})^n \\
\end{align}
$$

#### $e^{\mathbf{A}}$ 의 정의

$e^x$ 에서 $x$ 에 무었이든 집어넣어 테일러 시리즈로 표현이 가능하다.

$[1, i \mathbf{A}, \varepsilon \frac{d}{dx}, re^{i\theta}]$


행렬 $\mathbf{A}$

$$
\mathbf{A} = 
\begin{bmatrix}
3 & -5 \\ 
2 & 7 \\
\end{bmatrix}
$$

?? $e = 2.718...$ 를 의미하는 하나의 상수인데 ...

$e$의 지수로 $\mathbf{A}$를 넣은 $e^{\mathbf{A}}$ 가 도대체 의미하는 바가 무었일까?

$$
e^{\mathbf{A}} = e^{
\begin{bmatrix}
3 & -5 \\ 
2 & 7 \\
\end{bmatrix}}
$$

무엇인지 모르겠지만 일단 테일러 시리즈를 통해 전개해보자

$$
\begin{align}
e^{\mathbf{A}} &= e^1 = {1 \over 0!}\mathbf{A}^0 + {1 \over 1!}\mathbf{A}^1 + {1 \over 2!}\mathbf{A}^2 + {1 \over 3!}\mathbf{A}^3 + {1 \over 4!}\mathbf{A}^4 + ... + {1 \over n!}\mathbf{A}^n \\
e^\mathbf{A} &= \sum_{n=0}^{\infty} \frac{1}{n!}\mathbf{A}^n \\
\mathbf{A} &= \begin{bmatrix}
\alpha & 0 \\
0 & \beta
\end{bmatrix} \\
e^{\mathbf{A}}
&= \begin{bmatrix}
1 & 0 \\
0 & 1
\end{bmatrix} +
\begin{bmatrix}
\alpha & 0 \\
0 & \beta
\end{bmatrix} + 
\frac{1}{2!} \begin{bmatrix}
\alpha^2 & 0 \\
0 & \beta^2
\end{bmatrix} + 
\frac{1}{3!} \begin{bmatrix}
\alpha^3 & 0 \\
0 & \beta^3
\end{bmatrix} + 
\frac{1}{n!} \begin{bmatrix}
\alpha^n & 0 \\
0 & \beta^n
\end{bmatrix} \\
e^{\mathbf{A}} &= 
\begin{bmatrix}
{1 + \alpha + \frac{1}{2!}\alpha^2 + \frac{1}{3!}\alpha^3 + ...} & 0 \\
0 & {1 + \beta + \frac{1}{2!}\beta^2 + \frac{1}{3!}\beta^3 + ...}
\end{bmatrix} =
\begin{bmatrix}
e^\alpha & 0 \\
0 & e^\beta
\end{bmatrix}
\end{align}
$$

> $\mathbf{A} = 
\begin{bmatrix}
3 & -5 \\ 
2 & 7 \\
\end{bmatrix}$ 이면 $\mathbf{A}^2$ 의 계산이 복잡해진다. 그래서 보통은 행렬을 대각화 해서 사용한다.

$e^{\mathbf{A}}$ -> $e$ 에 지수로 행렬이 표현 가능하다.

#### $e^{\varepsilon{d \over dx}}$ 의 정의

$e$ 의 지수에 미분을 넣는것도 가능하다. $x = {\varepsilon{d \over dx}}f(x) = f(x+\varepsilon)$

$f(x) = mx + b$ 일때

$$
\begin{align}
e^{\varepsilon{d \over dx}}f(x) &= {1 \over 0!}({\varepsilon{d \over dx}})^0 + {1 \over 1!}({\varepsilon{d \over dx}})^1 + {1 \over 2!}({\varepsilon{d \over dx}})^2 + {1 \over 3!}({\varepsilon{d \over dx}})^3 + {1 \over 4!}({\varepsilon{d \over dx}})^4 + ... + {1 \over n!}({\varepsilon{d \over dx}})^n \\
&= ({1 \over 0!}({\varepsilon{d \over dx}})^0 + {1 \over 1!}({\varepsilon{d \over dx}})^1 + {1 \over 2!}({\varepsilon{d \over dx}})^2 + {1 \over 3!}({\varepsilon{d \over dx}})^3)f(x) \\
&= ({1 \over 0!}({\varepsilon{d \over dx}})^0 + {1 \over 1!}({\varepsilon{d \over dx}})^1 + {1 \over 2!}({\varepsilon{d \over dx}})^2 + {1 \over 3!}({\varepsilon{d \over dx}})^3)(mx + b) \\
&= (mx + b) + \varepsilon m + 0 + 0 \\
&= mx + b + \varepsilon m \\
&= m(x + \varepsilon) + b
\end{align}
$$

> 함수 $f(x) = mx + b$ 의 1차 미분은 $m$ 이후 n차 미분은 $0$ 이 된다.
> $e^{\varepsilon{d \over dx}}$ 는 결국 $x$ 축으로 $-\varepsilon$ 만큼 평행 이동한 것과 같다.

- 모멘텀 -> 공간 이동

$$
\begin{align}
e^{\frac{i}{\hbar}(P_x - E_t)} \\
e^{\frac{i}{\hbar}P_x} &= e^{\frac{i}{\hbar}P(x - \varepsilon)} \\
e^{-\varepsilon \frac{d}{dx}}f(x) &= f(x + \varepsilon) \\
e^{-\frac{i}{\hbar}P\varepsilon} &= e^{-\varepsilon \frac{d}{dx}} \\
\frac{i}{\hbar}P\varepsilon &= \varepsilon \frac{d}{dx} \\
\frac{i}{\hbar}P &= \frac{d}{dx} \\
\hat{P} &= \frac{\hbar}{i} \cdot \frac{d}{dx} \\
\end{align}
$$

#### 행렬

- 행렬은 도형이다.
- 미분은 행렬이다.

<figure style="text-align:center;">
  <img 
    src="/assets/images/eulers-number-matrix-2h.png" 
    alt="f(0)=1"
    style="width:20%; border:1px solid #ccc; border-radius:8px; padding:4px;"
  >
  <figcaption style="font-size:0.9em; color:#666; margin-top:0.4em;">
    참고 이미지: f(0)=1
  </figcaption>
</figure>


$$
f'(x_n) = \lim_{2h \to 0} \frac{f(x_{n+1}) - f(x_{n-1})}{2h}
$$

$$
f'(x_{n+2}) = \frac{f(x_{n+3}) - f(x_{n+1})}{2h}
$$

$$
f'(x_{n+1}) = \frac{f(x_{n+2}) - f(x_{n})}{2h}
$$

$$
f'(x_{n}) = \frac{f(x_{n+1}) - f(x_{n-1})}{2h}
$$

$$
f'(x_{n-1}) = \frac{f(x_{n}) - f(x_{n-2})}{2h}
$$

$$
f'(x_{n-2}) = \frac{f(x_{n-1}) - f(x_{n-3})}{2h}
$$

미분을 행렬로 모아놓는다.

$$
\begin{aligned}
\begin{bmatrix}
f'(x_{n+2}) \\[4pt]
f'(x_{n+1}) \\[4pt]
f'(x_{n}) \\[4pt]
f'(x_{n-1}) \\[4pt]
f'(x_{n-2})
\end{bmatrix}
&=
\frac{1}{2h}
\begin{bmatrix}
0 & -1 & 0 & 0 & 0 \\[4pt]
1 & 0 & -1 & 0 & 0 \\[4pt]
0 & 1 & 0 & -1 & 0 \\[4pt]
0 & 0 & 1 & 0 & -1 \\[4pt]
0 & 0 & 0 & 1 & 0
\end{bmatrix}
\begin{bmatrix}
f(x_{n+2}) \\[4pt]
f(x_{n+1}) \\[4pt]
f(x_{n}) \\[4pt]
f(x_{n-1}) \\[4pt]
f(x_{n-2})
\end{bmatrix}
\end{aligned}
$$

> 1D 일경우 미분 행렬(derivative matrix) Operator
> 다변수 함수일때 Gradient Operator