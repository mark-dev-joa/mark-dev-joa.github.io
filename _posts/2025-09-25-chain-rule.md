---
title: 연쇄법칙(Chain Rule) 정리
description: 필요해서 정리하는 체인룰
author: saint-crab
categories: [math, calculus]
tags: [derivative, chain-rule, taylor]
math: true
mermaid: true
---

## 정의

$$
\frac{d}{dx}\,f\!\big(g(x)\big) \;=\; f'\!\big(g(x)\big)\cdot g'(x)
$$

- \(g\)가 \(x\)에서 미분 가능이고, \(f\)가 \(u=g(x)\)에서 미분 가능이면 성립합니다.

---

## 직관
합성함수 \(f(g(x))\)의 변화율은  
**바깥 변화율** \(f'(g(x))\) × **안쪽 변화율** \(g'(x)\) 의 곱.

---

## 기본 예시

1. \(f(u)=e^{u},\; g(x)=2x\)
   $$
   \frac{d}{dx}e^{2x} = e^{2x}\cdot 2 = 2e^{2x}.
   $$

2. \(f(u)=u^5,\; g(x)=x^2-1\)
   $$
   \frac{d}{dx}(x^2-1)^5 = 5(x^2-1)^4\cdot 2x = 10x(x^2-1)^4.
   $$

3. \(f(u)=\ln u,\; g(x)=x^2+1\)
   $$
   \frac{d}{dx}\ln(x^2+1) = \frac{1}{x^2+1}\cdot 2x = \frac{2x}{x^2+1}.
   $$

---

## 자주 쓰는 형태 요약

- 지수: \(\displaystyle \frac{d}{dx}e^{ax+b}=a\,e^{ax+b}\)
- 거듭제곱: \(\displaystyle \frac{d}{dx}[g(x)]^n = n[g(x)]^{n-1}g'(x)\)
- 로그: \(\displaystyle \frac{d}{dx}\ln g(x)=\frac{g'(x)}{g(x)}\)
- 삼각함수:
  \[
  \frac{d}{dx}\sin g(x)=\cos g(x)\,g'(x),\quad
  \frac{d}{dx}\cos g(x)=-\sin g(x)\,g'(x)
  \]

---

## 벡터/다변수 일반화 (참고)

- \(g:\mathbb{R}\to\mathbb{R}^m,\; f:\mathbb{R}^m\to\mathbb{R}\):
  $$
  \frac{d}{dx}\,f(g(x)) \;=\; \nabla f\!\big(g(x)\big)\cdot g'(x).
  $$

- 야코비안 표기:
  $$
  D(f\circ g)(x) \;=\; Df\!\big(g(x)\big)\;Dg(x).
  $$

---

## 미니 연습
1) \(\dfrac{d}{dx}\,e^{3x-1}\)  
2) \(\dfrac{d}{dx}\,\sqrt{\,1+2x^3\,}\)  
3) \(\dfrac{d}{dx}\,\arctan(5x)\)

<sub>풀이 힌트: 각각 \(u(x)=3x-1,\; u(x)=1+2x^3,\; u(x)=5x\)로 두고 체인 룰 적용.</sub>
