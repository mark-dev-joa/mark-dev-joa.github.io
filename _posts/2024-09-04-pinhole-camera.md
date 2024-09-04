---
title: 핀홀 카메라 캘리브레이션
description: 카메라 모델 변환 정리
author: mark
categories: [mathmatic, computer-vision]
tags: [three.js]
math: true
mermaid: true
---

## 카메라 투영 모델

![eq2](/assets/posts/20240904/image.png)

3차원 공간의 좌표 $P_{w}$ 를 2차원 이미지 공간의 좌표 $P_{img}$ 로 행렬을 통해 선형 변환

$P_w$ = World Coordinate

$P_c$ = Camera Coordinate

$P_n$ = Normalized Image Coordinate

$P_{nd}$ = Distortion Normalized Image Coordinate

$P_{img}$ = Distortion Normalized Image Coordinate

$$
s
\begin{bmatrix}
  x \\ 
  y \\ 
  1 \\
\end{bmatrix}
=
\begin{bmatrix}
  f_x & skew_c * f_x & c_x \\
  0 & f_y & c_y \\
  0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
r_{11} & r_{12} & r_{13} & t_1 \\
r_{21} & r_{22} & r_{23} & t_2 \\
r_{31} & r_{32} & r_{33} & t_3 \\
\end{bmatrix}
\begin{bmatrix}
x_{w0} \\
Y_{w0} \\
Z_{w0} \\
1
\end{bmatrix}
$$

<br>

## Extransic Parameter를 이용한 Normalized Image Coordinate(정규 이미지 좌표) 변환

3차원 공간의 좌표 $P_{w}$ 를 2차원 정규화된 이미지 좌표 $P_{n}$ 로 행렬을 통해 선형 변환

$$
s
\begin{bmatrix}
  u_n \\ 
  v_n \\ 
  1 \\
\end{bmatrix}
=
\begin{bmatrix}
r_{11} & r_{12} & r_{13} & t_1 \\
r_{21} & r_{22} & r_{23} & t_2 \\
r_{31} & r_{32} & r_{33} & t_3 \\
\end{bmatrix}
\begin{bmatrix}
x_{w0} \\
Y_{w0} \\
Z_{w0} \\
1
\end{bmatrix}
=
\begin{bmatrix}
r_{11} * x_{w0} + r_{12} * Y_{w0} + r_{13} * Z_{w0} + t_1 \\
r_{21} * x_{w0} + r_{22} * Y_{w0} + r_{23} * Z_{w0} + t_2 \\
r_{31} * x_{w0} + r_{32} * Y_{w0} + r_{33} * Z_{w0} + t_3 \\
\end{bmatrix}
$$

카메라 좌표계 $P_c$ 계산

$$
P_c = 
\begin{bmatrix}
  x_c \\ 
  y_c \\ 
  z_c \\
\end{bmatrix}
=
\begin{bmatrix}
r_{11} * x_{w0} + r_{12} * Y_{w0} + r_{13} * Z_{w0} + t_1 \\
r_{21} * x_{w0} + r_{22} * Y_{w0} + r_{23} * Z_{w0} + t_2 \\
r_{31} * x_{w0} + r_{32} * Y_{w0} + r_{33} * Z_{w0} + t_3 \\
\end{bmatrix}
$$

Homogeneous Devide 수행

$$
\begin{bmatrix}
  u_n \\ 
  v_n \\ 
  1 \\
\end{bmatrix}
=
\begin{bmatrix}
  x_c / z_c \\ 
  y_c / z_c \\ 
  z_c / z_c \\
\end{bmatrix} 
=
\begin{bmatrix}
  x_c \\ 
  y_c \\ 
  z_c \\
\end{bmatrix}
$$

### Normalzed Image Coordinate 에서 왜곡 보정

#### 방사 왜곡(Ridial Distortion)

$k_n$은 Radial Distortion Coefficient

$$
\begin{align}
r^2 = u_n^2 + v_n^2 \\
r = \sqrt{u_n^2 + v_n^2}
\end{align}
$$

$$
P_{nd} =
\begin{cases}
u_{nd} = u_n(1 + k_1r^2 + k_2r^4 + k_3r^6) \\
v_{nd} = v_n(1 + k_1r^2 + k_2r^4 + k_3r^6)
\end{cases}
$$

<br>

#### Tangential Distortion

$p_n$은 Tangential Distortion Coefficient

$$
\begin{align}
r^2 = u_n^2 + v_n^2 \\
r = \sqrt{u_n^2 + v_n^2}
\end{align}
$$

$$
P_{nd} =
\begin{cases}
u_{nd} = u_n + [2p_1u_nv_n + p_2(r^2 + 2u_n^2)] \\
v_{nd} = v_n + [p_1(r^2 + 2v_n^2) + 2p_2u_nv_n] \\
\end{cases}
$$

#### 최종 왜곡 보정

$$
P_{nd} =
\begin{cases}
u_{nd} = u_n(1 + k_1r^2 + k_2r^4 + k_3r^6) + [2p_1u_nv_n + p_2(r^2 + 2u_n^2)] \\
v_{nd} = v_n(1 + k_1r^2 + k_2r^4 + k_3r^6) + [p_1(r^2 + 2v_n^2) + 2p_2u_nv_n] \\
\end{cases}
$$

<br>

## Instrinsic Parameter를 이용한 Image Coordinate(이미지 공간 좌표) 변환



<br>

초점 거리 $f_x, f_y$,  주점 $c_x, _cy$, 이미지 센서의 y축 방향 기울기를 나타내는 $skew_cf_x$

$$
Instrinsic Parameter = 
\begin{bmatrix}
  f_x & skew_cf_x & c_x \\
  0 & f_y & c_y \\
  0 & 0 & 1
\end{bmatrix}
$$

$$
\begin{bmatrix}
  x_{img} \\ 
  y_{img} \\ 
  1 \\
\end{bmatrix}
=
\begin{bmatrix}
  f_x & skew_cf_x & c_x \\
  0 & f_y & c_y \\
  0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
  u_{nd} \\ 
  v_{nd} \\ 
  1 \\
\end{bmatrix}
$$


## Reference

