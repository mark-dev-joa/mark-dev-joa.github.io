---
title: 좌표평면에서 원과 직선의 교차 및 교점
description: 연립방정식, 이차방정식의 근의 공식, 판별식
author: mark
categories: [mathmatic]
tags: [three.js]
math: true
mermaid: true
---

## 직선의 정의

### 좌표평면 위의 서로 다른 두점 $A(x_1, y_1)$, $B(x_2, y_2)$를 지나는 모든점의 집합

#### 직선의 방정식

$$
\begin{align}
y = mx + n
\end{align}
$$

기울기 $m = {(y_1 - y_2) \over (x_1 - x_2)}$

y절편 $n = y_1 - mx_1$

## 원의 정의

### 좌표평면 위의 원의 중심을 기준으로 반지름 r만큼 떨어진 모든점의 집합

#### 원의 방정식

$$
\begin{align}
r^2 &= x^2+y^2 \\
r &= \sqrt{x^2+y^2}
\end{align}
$$

#### 원의 중심이 $C(C_x, C_y)$ 인 원의 방정식

$$
\begin{align}
r^2 &= (x-c_x)^2+(y-c_y)^2 \\
r &= \sqrt{(x-c_x)^2+(y-c_y)^2}
\end{align}
$$


## 직선의 방정식과 원의 방정식을 연립

$$
\begin{align}
y &= mx + n \\
r^2 &= (x-c_x)^2+(y-c_y)^2 \\
\end{align}
$$

### 식(7)을 전개하고 식을 연립

$$
\textcolor{red}{(x-c_x)^2 = x^2 - 2c_xx + c_x^2} \\
$$

$$
\begin{cases}
\textcolor{green}{(y-c_y)^2 = y^2 - 2c_yy + c_y^2} \\
\textcolor{green}{(y-c_y)^2 = (mx+n)^2 - 2c_y(mx+n)+c_y^2} \\
\textcolor{green}{(y-c_y)^2 = m^2x^2 + 2mnx + n^2 - 2c_ymx - 2c_yn + c_y^2} \\
\end{cases}
$$

### 식을 합치고

$$
\begin{align}
r^2 &= \textcolor{red}{x^2 - 2c_xx + c_x^2} + \textcolor{green}{m^2x^2 + 2mnx + n^2 - 2c_ymx - 2c_yn + c_y^2} \\
r^2 &= \textcolor{red}{x^2} - \textcolor{purple}{2c_xx} + \textcolor{blue}{c_x^2} + \textcolor{red}{m^2x^2} + \textcolor{purple}{2mnx} + \textcolor{blue}{n^2} - \textcolor{purple}{2c_ymx} - \textcolor{blue}{2c_yn + c_y^2} \\
r^2 &= \textcolor{red}{(1+m^2)x^2} + \textcolor{purple}{2(- c_x + mn - c_ym)x} + \textcolor{blue}{c_x^2 + n^2 -2c_yn + c_y^2}
\end{align}
$$

### 최종

$$
\begin{align}
\textcolor{red}{(1+m^2)x^2} + \textcolor{purple}{2(- c_x + mn - c_ym)x} + \textcolor{blue}{c_x^2 + n^2 -2c_yn + c_y^2 - r^2} = 0
\end{align}
$$

### 2차 방정식의 해 구하기

#### 먼저 판별식으로 근을 확인

$$
\begin{align}
a &= 1 + m^2 \\
b &= 2(- c_x + mn - c_ym) \\
c &= c_x^2 + n^2 -2c_yn + c_y^2 - r^2 \\
D &= b^2 - 4ac
\end{align}
$$

#### D >= 0, 근이 존재

D 가 0일 때 한점에서 교차, 교차점 $P(p_x, p_y)$ 는 근의 공식으로 구할 수 있다.


근의 공식

$$ 
x = {-b \pm \sqrt{b^2-4ac} \over 2a} 
$$

교차점 $P$

$$
\begin{align}
p_x &= {-b - \sqrt{D} \over 2a} \\
p_y &= mp_x + n
\end{align}
$$

D 가 0보다 클때 두점에서 교차, 교차점 $P1(p1_x, p1_y), P2(p2_x, p2_y)$

교차점 $P1, P2$

$$
\begin{align}
p1_x &= {-b - \sqrt{D} \over 2a} \\
p1_y &= mp1_x + n \\
p2_x &= {-b + \sqrt{D} \over 2a} \\
p2_y &= mp2_x + n
\end{align}
$$


## 실행 코드

### 한점에서 교차

![alt text](/assets/posts/20241010/image-1.png)

### 두점에서 교차

![alt text](/assets/posts/20241010/image.png)

<!-- code -->
<link rel="stylesheet" href="/assets/three/style.css">
<script type="module" src='/assets/posts/2024-10-01-intersection-between-sphere-ray.js'></script>
<br>

## 구현 코드

```python

import matplotlib.pyplot as plt
import numpy as np
import math

# center of circle
cx = 5
cy = 5
r = 3

# the line
x1 = 0
y1 = 8
x2 = 1
y2 = 8

# slope, y - intercept
m = (y1 - y2) / (x1 - x2)
n = y1 - m * x1

x = np.linspace(-10, 10, 400)
y = m * x + n

#
a = 1 + m*m
b = 2 * (m*n - cx - m*cy)
c = cx*cx + n*n + cy*cy - r*r - 2 * cy * n

# Discriminant
D = b*b - 4*a*c
print(D)

# Create a figure and axis
fig, ax = plt.subplots()

if D > 0:
    px = (-b - math.sqrt(D)) / (2*a)
    py = m * px + n
    
    # Plot the points on the graph
    plt.scatter(px, py, color='blue', label='Points on the line', zorder=5)
    print(px, py)
    
    px = (-b + math.sqrt(D)) / (2*a)
    py = m * px + n
    
    # Plot the points on the graph
    plt.scatter(px, py, color='blue', label='Points on the line', zorder=5)
    print(px, py)
elif D == 0:
    
    px = (-b - math.sqrt(D)) / (2*a)
    py = m * px + n
    
    # Plot the points on the graph
    plt.scatter(px, py, color='blue', label='Points on the line', zorder=5)
    print(px, py)
    
else:
    print('No intersection')


# Define circle parameters
circle = plt.Circle((cx, cy), r, color='blue', fill=False)

# Create the plot
plt.plot(x, y, label=f'y = {m}x + {n}', color='red')

# Add circle to the plot
ax.add_artist(circle)

# Set axis limits to ensure the circle is properly centered
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)

# Keep the aspect ratio equal to ensure the circle is not distorted
ax.set_aspect('equal')

# Display the plot
plt.title('Circle')
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.grid()
plt.show()
```

## Reference


