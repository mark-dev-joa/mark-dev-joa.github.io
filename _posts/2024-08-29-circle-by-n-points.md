---
title: n 개의 점을 이용한 원 그리기
description: 해가 존재하지 않는 선형연립방정식 Ax=b 에서 근사해 구하기
author: mark
categories: [mathmatic, optical-flow, least-square]
tags: [three.js]
math: true
mermaid: true
---

## 원의 방정식

### 원점을 중점으로 하는 원의 방정식

$$
x^2 + y^2 = r^2
$$

$$
y^2 = r^2 - x^2
$$

$$
y = \sqrt{r^2 - x^2}
$$

### $x, y$ 축으로 $a, b$ 만큼 평행 이동한 원의 방정식

$$
(x-a)^2 + (y-b)^2 = r^2
$$

$$
(y-b)^2 = r^2 - (x-a)^2
$$

$$
y = \sqrt{r^2 - (x-a)^2} + b
$$

### 원의 방정식의 일반형

$$
\begin{align}
(x-a)^2 + (y-b)^2 &= r^2 \\
(x-a)^2 + (y-b)^2 - r^2 &= 0 \\
x^2 + y^2 - 2ax - 2by + a^2 + b^2 - r^2 &= 0
\end{align}
$$

$a, b, r$ 은 상수로 취급하고 $A = -2a, B = -2b, C = a^2 + b^2 - r^2$ 로 치환하면

$$
\begin{align}
x^2 + y^2 + Ax + By + C &= 0
\end{align}
$$

원의 중심

$$
{-{A \over 2}, -{B \over 2}}
$$

반지름

$$
r = {\sqrt{A^2 + B^2 - 4C} \over 2}
$$

$ x^2 + y^2 + Ax + By + C = 0 $ 식이 성립하려면 다음과 같은 조건을 만족해야 한다.

$$
{A^2 + B^2} \over 4 > C
$$

### 3점을 지나는 원의 방정식 유도

(-2,2), (4, -6), (5,-5) 를 지나는 원의 중점과 반지름 구하기

$$
x^2 + y^2 + Ax + By + C = 0
$$

x, y를 대입하여 식을 3개 만든다.

$$
eq1
=
\begin{cases}
(-2)^2 + 2^2 -2A + 2B + C &= 0 \\
8 -2A + 2B + C &= 0 \\
-2A + 2B + C &= -8
\end{cases}
$$

$$
eq2
=
\begin{cases}
4^2 + (-6)^2 +4A - 6B + C &= 0 \\
52 + 4A - 6B + C &= 0 \\
4A - 6B + C &= -52
\end{cases}
$$

$$
eq3
=
\begin{cases}
5^2 + (-5)^2 +5A - 5B + C &= 0 \\
50 +5A - 5B + C &= 0 \\
5A - 5B + C &= -50
\end{cases}
$$

$$
\begin{align}
-2A + 2B + C &= -8 \\
4A - 6B + C &= -52 \\
5A - 5B + C &= -50
\end{align}
$$

식을 연립하여 행렬식 구성

$$
\begin{bmatrix}
2 & -2 & 1 \\ 
4 & -6 & 1 \\ 
5 & -5 & 1 \\ 
\end{bmatrix}
\begin{bmatrix}
A \\ 
B \\
C
\end{bmatrix}
=
\begin{bmatrix}
- 8 \\
- 52 \\
- 50
\end{bmatrix}
$$

$$
\begin{bmatrix}
A \\ 
B \\
C
\end{bmatrix}
=
\begin{bmatrix}
2 & -2 & 1 \\ 
4 & -6 & 1 \\ 
5 & -5 & 1 \\ 
\end{bmatrix}^{-1}
\begin{bmatrix}
- 8 \\
- 52 \\
- 50
\end{bmatrix}
$$

결과

$$
A, B, C = [-2, 4, -20]
$$

원의 중심

$$
{-{-2 \over 2} = 1, -{4 \over 2} = -2}
$$

반지름

$$
r = {\sqrt{A^2 + B^2 - 4C} \over 2} = {\sqrt{(-2)^2 + 4^2 - 4*-20} \over 2} = {\sqrt{4 + 16 + 80} \over 2} = 5
$$

$ x^2 + y^2 + Ax + By + C = 0 $ 식 성립 조건

$$
{ {A^2 + B^2} \over 4 } > C
$$

$$
{ {(-2)^2 + 4^2} \over 4 } > -20, 5 > -20
$$

## 실행 화면

![eq2](/assets/posts/20240829/circle-3p.png)

## 구현 코드

```python
import matplotlib.pyplot as plt
import numpy as np

# 3x3 행렬 생성
A = np.array([[-2, 2, 1],
                   [4, -6, 1],
                   [5, -5, 1]])

# 역행렬 계산
try:
    invA = np.linalg.inv(A)
    print("\nInverse Matrix:")
    print(invA)
except np.linalg.LinAlgError:
    print("\nThis matrix is singular and does not have an inverse.")


b = np.array([-8, -52, -50])

# 행렬과 벡터의 곱
x = np.dot(invA, b)
print("\nSolution X :\n", x)

center = np.array([-x[0] * 0.5, -x[1] * 0.5])

# 원의 중심과 반지름
center_x = center[0]  # 중심의 x 좌표
center_y = center[1]  # 중심의 y 좌표
radius = np.sqrt(x[0]**2 + x[1]**2 - (4*x[2])) * 0.5    # 반지름

# 원을 그리기 위한 각도 범위
theta = np.linspace(0, 2 * np.pi, 100)

# 원의 x와 y 좌표 계산
x = center_x + radius * np.cos(theta)
y = center_y + radius * np.sin(theta)

# 원 그리기
plt.figure(figsize=(10,10))
plt.plot(x, y, label=f'Circle with radius {radius}')
plt.scatter(center_x, center_y, color='red')  # 원의 중심 표시

# 3점 출력
plt.scatter(-2, 2, color='green')
plt.scatter(4, -6, color='green')
plt.scatter(5, -5, color='green')


# 축의 범위 설정 (x, y 축을 동일한 비율로)
plt.xlim(center_x - radius - 1, center_x + radius + 1)
plt.ylim(center_y - radius - 1, center_y + radius + 1)
plt.gca().set_aspect('equal', adjustable='box')

# 그리드와 제목 설정
plt.grid(True)
plt.title('Circle in the Coordinate Plane')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.show()
```
