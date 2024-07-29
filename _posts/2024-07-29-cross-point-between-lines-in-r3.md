---
title: 공간에서 직선과 직선의 교차점
description: 직선과 직선의 교차점 구하기
author: mark
categories: [mathmatic, geometry]
tags: [three.js]
pin: true
math: true
mermaid: true
---

## 동일한 두 벡터와 외적은 0 이다.

$$ \vec a \times \vec a = 0 $$

<br>

## 외적의 성질

1. 반교환 법칙(Anti-commutative Law):

$$ a \times b = -(b \times a) $$

2. 분배 법칙(Distributive Law)

$$ a \times (b + c) = (a \times b) + (a \times c) $$

3. 상수항과 결합 법칙

$$ k(a \times b) = (ka) \times b = a \times (kb) $$

<br>

## 직선의 교점 방정식 유도

s, t 는 scalar

o1, o2는 직선위의 한점

d1, d2는 방향 벡터

<br>

### 두 직선의 벡터 방정식

$$ 
\begin{align}
r_1 = o_1 + sd_1 \\
r_2 = o_2 + td_2
\end{align}
$$

<br>

### 두 직선의 교점 구하기

$$
\begin{align}
r_1(s) &= r_2(t) \\
o_1 + sd_1 &=  o_2 + td_2
\end{align}
$$

$sd_1$과 $sd_2$ 항으로 정리

$$
\begin{align}
sd_1 = o_2 - o_1 + td_2 \\
td_2 = o_1 - o_2 + sd_1
\end{align}
$$

<br>

오른쪽에 $td_2, sd_1$ 항을 제거 하기 위해 양변에 $d_2, d_1$ 으로 외적을 취한다.

$$ 
\begin{align}
sd_1 \times d_2 &= (o_2 - o_1 + td_2) \times d_2 \\
sd_1 \times d_2 &= (o_2 - o_1) \times d_2 + td2 \times d_2\\
sd_1 \times d_2 &= (o_2 - o_1) \times d_2 \\
\end{align}
$$

$$
\begin{align}
td_2 \times d_1 &= (o_1 - o_2 + sd_1) \times d_1 \\
td_2 \times d_1 &= (o_1 - o_2) \times d_1 + sd1 \times d_1\\
td_2 \times d_1 &= (o_1 - o_2) \times d_1 \\
\end{align}
$$
<br>

$s, t$ 항을 구하기 위해 양변에 $ (d_1 \times d_2), (d_2 \times d_1 ) $ 으로 내적을 취한다.

$$ 
\begin{align}
s(d_1 \times d_2) \cdot (d_1 \times d_2) &= ((o_2 - o_1) \times d_2) \cdot (d_1 \times d_2) \\
s &= {((o_2 - o_1) \times d_2) \cdot (d_1 \times d_2) \over (d_1 \times d_2) \cdot (d_1 \times d_2)} \\
s &= {((o_2 - o_1) \times d_2) \cdot (d_1 \times d_2) \over \|d_1 \times d_2\|^2} \\
s &= {det(o_2-o_1, d_2, d_1 \times d_2) \over \|d_1 \times d_2\|^2} \\
\end{align}
$$

$$ 
\begin{align}
t(d_2 \times d_1) \cdot (d_2 \times d_1) &= ((o_1 - o_2) \times d_1) \cdot (d_2 \times d_1) \\
t &= {((o_1 - o_2) \times d_1) \cdot (d_2 \times d_1) \over (d_2 \times d_1) \cdot (d_2 \times d_1)} \\
t &= {((o_1 - o_2) \times d_1) \cdot (d_2 \times d_1) \over \|d_2 \times d_1\|^2} \\
t &= {det(o_1-o_2, d_2, d_2 \times d_1) \over \|d_2 \times d_1\|^2} \\
\end{align}
$$

(13) 외적의 결합법칙, $kd_1 \times d_2 = d_1 \times kd_2 = k(d_1 \times d_2)$  
(15) 동일 벡터의 내적, $\|\mathbf{a}\|^2 = \vec a \cdot \vec a = a_1a_1 + a_2a_2$  
(16) 유도 과정  
내적의 교환법칙, $ \vec a \cdot \vec b = \vec b \cdot \vec a $  
스칼라 삼중곱, $ \vec a \cdot ( \vec b \times \vec c) = \vec b \cdot ( \vec c \times \vec a) = \vec c \cdot ( \vec a \times \vec b) = det( \vec a, \vec b, \vec c)$  
$ ((o_2 - o_1) \times d_2) \cdot (d_1 \times d_2) $  
$ \vec a = o_2 - o_1 $  
$ \vec b = d2 $  
$ \vec c=(d_1 \times d_2)$  
$ (\vec a \times \vec b) \cdot \vec c = \vec c \cdot ( \vec a \times \vec b) = \vec a \cdot (\vec b \times \vec c)$  
$ (o_2 - o_1) \cdot (d_2 \times (d_1 \times d_2))$  
$ (o_2 - o_1) \cdot (d_2 \times (d_1 \times d_2)) = det(o_2 - o_1, d_2, d_1 \times d_2)$


<div class='threejs'>
    <div id='canvas'></div>
</div>

<!-- code -->
<link rel="stylesheet" href="/assets/three/style.css">
<script type="module" src='/assets/posts/2024-07-29-cross-point-between-lines-in-r3.js'></script>

## Reference

[오다기리 박의 알고리즘 노트: 직선과 직선의 교차점 구하기](https://wjdgh283.tistory.com/entry/%EC%A7%81%EC%84%A0%EA%B3%BC-%EC%A7%81%EC%84%A0%EC%9D%98-%EA%B5%90%EC%B0%A8%EC%A0%90-%EA%B5%AC%ED%95%98%EA%B8%B0)

[jebae's dev blog: 벡터의 외적과 삼중곱](https://jebae.github.io/vector-cross-product)
