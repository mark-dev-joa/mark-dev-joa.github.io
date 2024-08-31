---
title: 영상 픽셀을 이용해 물체 모션 추정하기
description: optical flow
author: mark
categories: [mathmatic, optical-flow, least-square]
tags: [three.js]
math: true
mermaid: true
---

## 영상 픽셀 들의 변환 행렬(Similarity transformation) 계산하기

기하학적 변환 중 Similarity transformation 평행이동, 회전, 스케일을 보존한다.

Similarity transformation 는 크기를 결정하는 $s$, 회전각 $\theta$, $x,y$ 축의 평행 이동을 나타내는 $t_x, t_y$ 를 합하여 총 4개 파라미터로 구성된다.

원본 영상의 픽셀$(x, y)$ 가 변환된 영상의 픽셀$(u, v)$ 의 대응된다면 다음과 같은 관계식을 만족한다.

$$
\begin{align}
u = s\cos(\theta)x - s\sin(\theta)y + t_x \\
v = s\sin(\theta)x + s\cos(\theta)y + t_y
\end{align}
$$


행렬식으로 표현


$$
\begin{bmatrix}
s\cos(\theta) & -s\sin(\theta) & t_x \\ 
s\sin(\theta) & s\cos(\theta) & t_y \\ 
\end{bmatrix}
\begin{bmatrix}
x \\ 
y \\
1
\end{bmatrix}
=
\begin{bmatrix}
u \\ 
v
\end{bmatrix}
$$

$ a = s\cos(\theta), b = s\sin(\theta), c = t_x, d = t_y $ 로 치환하고 Similarity transformation을 구성하는 파라미터 4개 $a,b,c,d$ 구해보자



$$
\begin{bmatrix}
a & -b & c \\ 
b & a & d \\ 
\end{bmatrix}
\begin{bmatrix}
x \\ 
y \\
1
\end{bmatrix}
=
\begin{bmatrix}
u \\ 
v \\
\end{bmatrix}
$$

$$
\begin{align}
ax - by + c = u \\
bx + ay + d = v
\end{align}
$$

행렬식을 만들기 위해 두개의 식 $x * (3) + y * (4), x * (4) - y * (3) $ 을 추가한다.

$$
eq1
=
\begin{cases}
x(ax - by + c) &= xu \\
y(bx + ay + d) &= yv \\
x(ax - by + c) + y(bx + ay + d) &= xu + yv \\
ax^2 - bxy + cx + bxy + ay^2 +dy &= xu + yv \\
ax^2 + ay^2 + cx + dy &= xu + yv \\
a(x^2 + y^2) + cx + dy &= xu + yv \\
\end{cases}
$$


$$
eq2
=
\begin{cases}
x(bx + ay + d) &= xv \\
y(ax - by + c) &= yu \\
x(bx + ay + d) - y(ax - by + c) &= xv - yu \\
bx^2 + axy + dx - axy + by^2 -cy &= xv - yu \\
bx^2 + by^2 -cy + dx &= xv - yu \\
b(x^2 + y^2) -cy + dx &= xv - yu \\
\end{cases}
$$


정리된 식을 연립하여 행렬식을 만든다. Least Square를 이용해 $a,b,c,d$ 를 구할수 있지만

여기선 정방행렬(4x4) 만들고 역행렬을 취하여 $a,b,c,d$ 를 구한다.


$$
\begin{align}
a(x^2 + y^2) + cx + dy &= xu + yv \\
b(x^2 + y^2) -cy + dx &= xv - yu \\
ax - by + c &= u \\
bx + ay + d &= v
\end{align}
$$

$$
\begin{bmatrix}
x^2 + y^2 & 0 & x & y \\ 
0 & x^2 + y^2 & -y & x \\ 
x & y & 1 & 0 \\ 
y & x & 0 & 1 \\ 
\end{bmatrix}
\begin{bmatrix}
a \\ 
b \\
c \\
d
\end{bmatrix}
=
\begin{bmatrix}
xu + yv \\ 
xv - yu \\ 
u \\
v
\end{bmatrix}
$$

하나의 매칭되는 픽셀의 대응되는 행렬식을 얻었으니 이제 전체 픽셀 합의 대응되는 행렬식을 유도한다.

$$
\begin{bmatrix}
\sum\limits_{i=1}^n(x_i^2 + y_i^2) & 0 & \sum\limits_{i=1}^n x_i & \sum\limits_{i=1}^n y_i \\ 
0 & \sum\limits_{i=1}^n(x^2 + y^2) & \sum\limits_{i=1}^n -y_i & \sum\limits_{i=1}^n x_i \\ 
\sum\limits_{i=1}^n x_i & \sum\limits_{i=1}^n y_i & n & 0 \\ 
\sum\limits_{i=1}^n y_i & \sum\limits_{i=1}^n x_i & 0 & n \\ 
\end{bmatrix}
\begin{bmatrix}
a \\ 
b \\
c \\
d
\end{bmatrix}
=
\begin{bmatrix}
\sum\limits_{i=1}^n(x_iu_i + y_iv_i) \\ 
\sum\limits_{i=1}^n(x_iv_i - y_iu_i) \\ 
\sum\limits_{i=1}^n u_i \\
\sum\limits_{i=1}^n v_i
\end{bmatrix}
$$

Least Squre 의 해를 구하기 위해 pseudo inverse 를 계산할 필요 없이 역행렬을 구할 수 있다.

$$
\begin{bmatrix}
a \\ 
b \\
c \\
d
\end{bmatrix}
=
\begin{bmatrix}
\sum\limits_{i=1}^n(x_i^2 + y_i^2) & 0 & \sum\limits_{i=1}^n x_i & \sum\limits_{i=1}^n y_i \\ 
0 & \sum\limits_{i=1}^n(x^2 + y^2) & \sum\limits_{i=1}^n -y_i & \sum\limits_{i=1}^n x_i \\ 
\sum\limits_{i=1}^n x_i & \sum\limits_{i=1}^n y_i & n & 0 \\ 
\sum\limits_{i=1}^n y_i & \sum\limits_{i=1}^n x_i & 0 & n \\ 
\end{bmatrix}^{-1}
\begin{bmatrix}
\sum\limits_{i=1}^n(x_iu_i + y_iv_i) \\ 
\sum\limits_{i=1}^n(x_iv_i - y_iu_i) \\ 
\sum\limits_{i=1}^n u_i \\
\sum\limits_{i=1}^n v_i
\end{bmatrix}
$$

## Reference

[[다크 프로그래머] 최소자승법 이해와 다양한 활용예(Least Square Method)](https://darkpgmr.tistory.com/56)  
