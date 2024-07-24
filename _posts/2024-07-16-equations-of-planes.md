---
title: 평면의 방정식(equations of planes)
author: mark
categories: [mathmatic, linear algebra, cross product]
tags: [three.js]
math: true
---

## 평면의 방정식 정의

평면의 방정식은 3차원 공간에서 주어진 점과 법선 벡터를 사용하여 평면을 정의하는 방정식입니다.



### 두 벡터로 평면 정의하기

#### 원점을 지나는 두 벡터 $ \vec u = (u_1, u_2, u_3) $ 와 $ \vec v = (v_1, v_2, v_3) $ 로 이루어진 평면위의 한점 $\mathbf{p}$ 는 $ \vec u $, $ \vec v $ 의 선형결합(Linear Combination)으로 표현할 수 있습니다.

$$ 
  \mathbf{p} = a\vec u + b\vec v
$$`

#### 두 벡터 $ \vec u $, $ \vec v $를 열벡터(Column Vector) $ \vec {u^t} $, $ \vec {v^t} $ 로 표현하고 행렬 $\mathbf{A}$를 정의합니다.


$$
\mathbf{A} = 
\begin{vmatrix}
\vec {u^t} & \vec {v^t} \\
\end{vmatrix} =
\begin{vmatrix}
u_1 & v_1 \\
u_2 & v_2  \\
u_3 & v_3  \\
\end{vmatrix}
$$

#### 평면위의 한점 $\mathbf{p}$ 는 선형 변환(Linear Transform)으로 구할 수 있습니다.
$$
\mathbf{A}x = \mathbf{p}
$$

$$
\begin{vmatrix}
u_1 & v_1 \\
u_2 & v_2  \\
u_3 & v_3  \\
\end{vmatrix}
\begin{vmatrix}
a \\
b  \\
\end{vmatrix} =
\begin{vmatrix}
p_1 \\
p_2  \\
p_3  \\
\end{vmatrix}
$$


<!-- Spinning Cube Demo -->
<div class='threejs'>
    <div id='canvas'></div>
</div>



<!-- code -->
<link rel="stylesheet" href="/assets/three/style.css">
<script type="module" src='/assets/posts/2024-07-16-equations-of-planes.js'></script>
