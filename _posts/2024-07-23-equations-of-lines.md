---
title: 직선의 방정식(Equations of Lines)
description: 일반 방정식, 벡터 방정식, 대칭 방정식
author: mark
date: 2019-08-08 11:33:00 +0800
categories: [mathmatic, geometry]
tags: [three.js]
math: true
mermaid: true
---


## **좌표평면에서 직선의 방정식**

$$
y = mx + n \tag{1}
$$

$$
ax + by + c = 0 \tag{2}
$$

$$
{x - x_1 \over x_2 - x_1} = {y - y_1 \over y_2 - y_1} \tag{3}
$$

$$
\mathbf{P} = \vec{a} + k\vec{u} \tag{4}
$$
 

### 한 점 $A(x_1, y_1)$를 지나고 기울기가 $m$인 직선 $l$의 직선의 방정식

![eq1](/assets/posts/20240724/image-1.png)

#### 직선 $l$의 기울기 m 을 구하고 $x, y$ 의 관계식 유도하기

$$
m = {y-y_1 \over x-x_1}
$$

$$
m(x-x_1) = y - y_1
$$

$$
y = m(x - x_1) + y_1
$$

#### EX. 한 점 $A(-1, -1)$을 지나고 기울기가 2 인 직선
![eq2](/assets/posts/20240724/image-3.png)

$$
y = m(x - x_1) + y_1
$$

$$
y = 2(x + 1) - 1
$$

$$
y = 2x + 2 - 1
$$

$$
y = 2x + 1
$$


##### 방향벡터 $ \vec u $ 는 $y = mx + n$ 방정식의 기울기 $m = 2$ 를 이용해 구하기

$$y=2x$$

$$x = 1, y = 2$$

$$ \vec u = \begin{bmatrix}1 & 2 \end{bmatrix} $$
  
##### 방향 벡터 $ \vec u $를 구하면 직선의 벡터 방정식을 유도하기

원점에서 $A$ 까지의 벡터 $\vec a$, 원점에서 $P$ 까지의 벡터 $\vec p$, 방향벡터 $\vec u = \vec p - \vec a$  

$ \mathbf P $ 점은 $ \vec a $ 점까지 이동하고 $\vec u $의 $k$ 배의 합으로 구할 수 있다.  

$$ \mathbf P(x, y) = \vec{a} + k\vec{u} $$

$$ \vec{a} = \begin{bmatrix}x_1 \\ y_1 \end{bmatrix}, \vec{u} = \begin{bmatrix}a \\ b \end{bmatrix} $$

$$ \mathbf P(x, y) = \begin{bmatrix}x_1 \\ y_1 \end{bmatrix} + k\begin{bmatrix}a \\ b \end{bmatrix} $$

$$ \mathbf P(x, y) = \begin{bmatrix}-1 \\ -1 \end{bmatrix} + k\begin{bmatrix}1 \\ 2 \end{bmatrix} $$

$$ 
\mathbf P(x, y) = 
  \begin{cases} 
    x = -1 + k & k = {x + 1 \over 1}\\
    y = -1 + 2k & k = {y + 1 \over 2}
  \end{cases} 
$$

$$ 
\mathbf P(x, y) = 
  \begin{cases}   
    k = -1 & \Rightarrow & (-1 + (-1), -1 + (-2)) & (-2, -3) \\
    k = 0 & \Rightarrow & (-1 + (0), -1 + (0)) & (-1, -1) \\
    k = 1 & \Rightarrow & (-1 + (1), -1 + (2)) & (0, 1) \\
    k = 2 & \Rightarrow & (-1 + (2), -1 + (4)) & (0, 3) \\
    k = 3 & \Rightarrow & (-1 + (3), -1 + (6)) & (0, 5) \\
  \end{cases} 
$$

##### 대칭 방정식 유도하기

$$
k = {x + 1 \over 1} = {y + 1 \over 2}
$$

$$
{x + 1 \over 1} = {y + 1 \over 2}
$$

$$ 
\mathbf P(x, y) = 
  \begin{cases}   
    x = -2 & y = -3 & \Rightarrow & {-2 + 1 \over 1} = {-3 + 1 \over 2} = -1 \\
    x = -1 & y = -1 & \Rightarrow & {-1 + 1 \over 1} = {-1 + 1 \over 2} = 0 \\
    x = 0 & y = 1 & \Rightarrow & {0 + 1 \over 1} = {1 + 1 \over 2} = 1 \\
    x = 1 & y = 3 & \Rightarrow & {1 + 1 \over 1} = {3 + 1 \over 2} = 2 \\
    x = 2 & y = 5 & \Rightarrow & {2 + 1 \over 1} = {5 + 1 \over 2} = 3
  \end{cases} 
$$

### 두 점 $A(x_1, y_1), B(X_2, y_2)$를 지나는 직선 $l$의 직선의 방정식

![eq3](/assets/posts/20240724/image-4.png)

#### 기울기 m을 구하고 직선의 방정식 유도하기

벡터 $\vec b$ 에서 벡터 $\vec a$ 를 빼면 방향벡터 $\vec u$를 구할 수 있다.

$$
\vec u = \vec b - \vec a = (x_2, y_2) - (x_1, y_1)
$$

$$
\vec u = \begin{bmatrix}x_2 - x_1 \\ y_2 - y_1 \end{bmatrix}
$$

직선 $l$의 기울기 $m$은 방향벡터 $\vec u$의 $y$ 나누기 $x$ 로 구할 수 있다.  

$$
m = {y_2 - y_1 \over x_2 - x_1}
$$

$y = m(x - x_1) + y_1$ 식에 $m$을 대입

$$
y = ({y_2 - y_1 \over x_2 - x_1})(x-x_1) + y_1 \tag{1}
$$

#### EX. $A(-1,-1), B(5,3)$ 을 지나는 직선

![eq5](/assets/posts/20240724/image-5.png)

두 점 $A(-1,-1), B(5,3)$ 를 $y = ({y_2 - y_1 \over x_2 - x_1})(x-x_1) + y_1$ 에 대입

$$
y = ({y_2 - y_1 \over x_2 - x_1})(x-x_1) + y_1
$$

$$
y = ({3 -(-1) \over 5 - (-1)})(x-(-1)) + (-1) = {2 \over 3}(x+1)-1
$$

$$
y = {2 \over 3}x - {1 \over 3}
$$

방향벡터 $\vec u$ 는 $x$에 1을 넣으면 분수값이 이 나오니 3을 대입해보자

$$ \vec u = \begin{bmatrix}3 & 2 \end{bmatrix} $$


##### 벡터 방정식

$$ \mathbf P(x, y) = \vec{a} + k\vec{u} $$

$$ \vec{a} = \begin{bmatrix}x_1 \\ y_1 \end{bmatrix}, \vec{u} = \begin{bmatrix}a \\ b \end{bmatrix} $$

$$ \mathbf P(x, y) = \begin{bmatrix}x_1 \\ y_1 \end{bmatrix} + k\begin{bmatrix}a \\ b \end{bmatrix} $$

$$ \mathbf P(x, y) = \begin{bmatrix}-1 \\ -1 \end{bmatrix} + k\begin{bmatrix}3 \\ 2 \end{bmatrix} $$

$$ 
\mathbf P(x, y) = 
  \begin{cases} 
    x = -1 + 3k & k = {x + 1 \over 3}\\
    y = -1 + 2k & k = {y + 1 \over 2}
  \end{cases} 
$$

##### 대칭 방정식

$$
k = {x + 1 \over 3} = {y + 1 \over 2}
$$

$$
{x + 1 \over 3} = {y + 1 \over 2}
$$

좌표평면에서 직선 위의 점 $\mathbf P(x, y)$를 구할 수 있다.


### 한 점과 법선벡터

방향벡터 $ \vec u = \vec p - \vec a $ 로 구한다.
 
법선벡터 $\vec n$과 방향벡터 $\vec n$은 수직 $\vec u \perp \vec n$ 

두 벡터의 내적값은 0 

$$\vec u \cdot \vec n = 0$$

$$(x - x_1, y-y_1) \cdot (a, b) = 0$$

$$a(x - x_1) + b(y-y_1) = 0$$

$$ax + by - ax_1 - by_1 = 0 $$

#### 한 점 $A=(-2,1)$을 지나고 법선벡터 $\vec n(3,-2)$ 일때 직선의 방정식

$$ (\vec p - \vec a) \cdot \vec n = 0 $$

$$ (x+2, y-1) \cdot (3,2) = 0 $$

$$ 3(x+2) - 2(y-1) = 0 $$

$$ 3x + 6 - 2y + 2 = 0 $$

$$ 3x - 2y + 8 = 0 $$

$$ 2y = 3x + 8 $$

$$ y = {3 \over 2}x + 4 $$

## AAAA

<!-- code -->
<link rel="stylesheet" href="/assets/three/style.css">

<!-- Spinning Cube Demo -->
<div class='threejs'>
    <div id='canvas'></div>
</div>

<!-- Including the JavaScript module -->
<script type="module">
  import { Grid2DHelper } from '/assets/three/grid2d.helper.js';
  var helper = new Grid2DHelper(document.getElementById("canvas"));

  function init() {
    helper.init();
  }

  function animate() {
    requestAnimationFrame(animate);

    helper.update();
  }  
  init();
  animate();
</script>


