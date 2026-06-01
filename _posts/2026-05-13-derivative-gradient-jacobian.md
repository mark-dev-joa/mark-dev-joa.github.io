---
title: 도함수, 그라디언트, 자코비안
description: 1 차 미분이 입력과 출력의 차원에 따라 형태를 바꾸는 흐름. 도함수에서 출발해 편미분, 그라디언트, 자코비안까지 단계별로 정리하고 1 차 테일러 근사가 어떻게 일관되게 일반화되는지 본다.
author: mark
date: 2026-05-13 09:00:00 +0900
categories: [math, calculus]
tags: [derivative, gradient, jacobian, partial-derivative, taylor-approximation, multivariable-calculus]
math: true
---



함수의 1 차 미분은 입력과 출력의 차원에 따라 형태가 달라진다. 1 변수 함수의 도함수가 가장 단순하고, 다변수 입력에 스칼라 출력이면 그라디언트, 다변수 입력에 다변수 출력이면 자코비안이 된다. 셋 모두 같은 1 차 미분의 일반화이며, IK 와 최적화에서 등장하는 자코비안도 이 흐름의 끝에 있다.

---

## 1. 한눈에 보기

### 1.1 — 차원에 따른 미분의 이름

입력과 출력의 차원이 미분의 형태를 결정한다.

| 입력 | 출력 | 미분의 이름 | 기호 | 모양 |
|---|---|---|---|---|
| 스칼라 | 스칼라 | 도함수 | $f'(x)$ | 스칼라 |
| 벡터 ($\mathbb{R}^n$) | 스칼라 | 그라디언트 | $\nabla f(\mathbf{x})$ | 벡터 ($\mathbb{R}^n$) |
| 벡터 ($\mathbb{R}^n$) | 벡터 ($\mathbb{R}^m$) | 자코비안 | $J(\mathbf{x})$ | 행렬 ($\mathbb{R}^{m \times n}$) |

이름은 다르지만 본질은 같다. 모두 "함수의 입력이 살짝 변할 때 출력이 어떻게 변하는지" 를 1 차로 기술하는 양이다.

### 1.2 — 1 차 테일러 근사 비교

세 경우 모두 같은 형태로 통일된다.

$$f(x + \Delta x) \approx f(x) + f'(x) \cdot \Delta x$$

$$f(\mathbf{x} + \Delta \mathbf{x}) \approx f(\mathbf{x}) + \nabla f(\mathbf{x})^T \Delta \mathbf{x}$$

$$\mathbf{f}(\mathbf{x} + \Delta \mathbf{x}) \approx \mathbf{f}(\mathbf{x}) + J(\mathbf{x}) \Delta \mathbf{x}$$

곱셈의 형태만 차원에 맞게 바뀐다. 첫 식은 스칼라 곱, 둘째는 두 벡터의 점곱, 셋째는 행렬과 벡터의 곱이다. "현재 값 + 미분 × 변화량" 이라는 골격은 모두 동일하다.

---

## 2. 도함수 — 1 변수 미분

### 2.1 — 정의

함수 $f: \mathbb{R} \to \mathbb{R}$ 의 점 $x$ 에서의 도함수는 입력의 작은 변화에 대한 출력 변화의 비의 극한으로 정의된다.

$$f'(x) = \lim_{\Delta x \to 0} \frac{f(x + \Delta x) - f(x)}{\Delta x}$$

분자는 출력 변화량, 분모는 입력 변화량이다. 이 비는 입력이 한 단위 움직일 때 출력이 평균적으로 얼마나 움직이는지를 나타내는 양이며, $\Delta x$ 를 0 으로 보내면 그 점에서의 순간 변화율이 된다.

### 2.2 — 예제 — $f(x) = x^2$

정의에 직접 대입해서 도함수를 구한다.

$$f'(x) = \lim_{\Delta x \to 0} \frac{(x + \Delta x)^2 - x^2}{\Delta x}$$

분자를 전개한다.

$$(x + \Delta x)^2 - x^2 = x^2 + 2x \Delta x + (\Delta x)^2 - x^2 = 2x \Delta x + (\Delta x)^2$$

분모로 나누고 정리한다.

$$\frac{2x \Delta x + (\Delta x)^2}{\Delta x} = 2x + \Delta x$$

극한을 취하면:

$$f'(x) = \lim_{\Delta x \to 0} (2x + \Delta x) = 2x$$

따라서 $f(x) = x^2$ 의 도함수는 $f'(x) = 2x$ 이다. 점 $x = 1$ 에서 $f'(1) = 2$, $x = 3$ 에서 $f'(3) = 6$ 같은 식으로 위치마다 다른 값을 가진다.

### 2.3 — 1 차 테일러 근사

도함수의 정의식을 변형하면 작은 변화에 대한 함숫값의 근사식이 얻어진다. 정의에서 극한을 떼고 등호를 근사로 바꾸면:

$$\frac{f(x + \Delta x) - f(x)}{\Delta x} \approx f'(x)$$

양변에 $\Delta x$ 를 곱하고 $f(x)$ 를 옮기면:

$$f(x + \Delta x) \approx f(x) + f'(x) \cdot \Delta x$$

이것이 1 차 테일러 근사이다. "현재 값 + 기울기 × 변화량" 으로 함수의 작은 변화를 직선으로 근사한다.

### 2.4 — 수치 검증

$f(x) = x^2$, 점 $x = 1$, 변화 $\Delta x = 0.1$ 로 근사식과 진짜 값을 비교한다.

근사값:

$$f(1.1) \approx f(1) + f'(1) \cdot 0.1 = 1 + 2 \cdot 0.1 = 1.2$$

진짜 값:

$$f(1.1) = (1.1)^2 = 1.21$$

차이는 $0.01$ 이다. 변화량 $\Delta x$ 가 작을수록 근사가 잘 맞으며, 큰 변화에서는 2 차 항 ($(\Delta x)^2$) 의 기여가 커져 오차가 늘어난다.

| $\Delta x$ | 근사값 | 진짜 값 | 오차 |
|---|---|---|---|
| 0.01 | 1.02 | 1.0201 | 0.0001 |
| 0.1 | 1.2 | 1.21 | 0.01 |
| 0.5 | 2.0 | 2.25 | 0.25 |
| 1.0 | 3.0 | 4.0 | 1.0 |

오차가 $(\Delta x)^2$ 비율로 줄어드는 게 1 차 근사의 특성이다. $\Delta x$ 를 10 배 줄이면 오차는 100 배 줄어든다.

---

## 3. 그라디언트 — 다변수 입력, 스칼라 출력

### 3.1 — 편미분 정의

함수 $f: \mathbb{R}^n \to \mathbb{R}$ 의 편미분은 다른 변수들을 모두 상수 취급하고 한 변수에 대해서만 미분한 결과이다. 변수 $x_k$ 에 대한 편미분은 다음과 같이 정의된다.

$$\frac{\partial f}{\partial x_k}(\mathbf{x}) = \lim_{\Delta x \to 0} \frac{f(\mathbf{x} + \Delta x \cdot \mathbf{e}_k) - f(\mathbf{x})}{\Delta x}$$

여기서 $\mathbf{e}_k$ 는 $k$ 번째 표준 단위벡터로, 입력 변화의 방향을 지정한다. 1 변수 도함수의 정의와 같은 형태이며, 다변수에서는 변화량 $\Delta x$ 의 방향만 $\mathbf{e}_k$ 로 명시한다는 차이만 있다.

### 3.2 — 그라디언트 정의

함수 $f: \mathbb{R}^n \to \mathbb{R}$ 의 그라디언트는 모든 변수에 대한 편미분을 세로 벡터로 묶은 것이다.

$$\nabla f(\mathbf{x}) = \begin{bmatrix} \dfrac{\partial f}{\partial x_1} \\\\ \dfrac{\partial f}{\partial x_2} \\\\ \vdots \\\\ \dfrac{\partial f}{\partial x_n} \end{bmatrix} \in \mathbb{R}^n$$

입력이 $n$ 차원이면 그라디언트도 $n$ 차원 벡터가 된다. 각 성분이 그 변수 방향으로의 순간 변화율을 담고 있어, 함수가 어느 방향으로 증가하는지를 한 벡터로 압축한다.

이 묶음은 표기 약속일 뿐이며 풀어 쓰면 편미분들의 합과 같다. 점곱의 정의 $\mathbf{a}^T \mathbf{b} = \sum_k a_k b_k$ 에 의해

$$\nabla f^T \Delta \mathbf{x} = \begin{bmatrix} \dfrac{\partial f}{\partial x_1} & \cdots & \dfrac{\partial f}{\partial x_n} \end{bmatrix} \begin{bmatrix} \Delta x_1 \\\\ \vdots \\\\ \Delta x_n \end{bmatrix} = \frac{\partial f}{\partial x_1} \Delta x_1 + \cdots + \frac{\partial f}{\partial x_n} \Delta x_n$$

좌변의 벡터 표기와 우변의 합 표기가 같은 식이다. 변수 개수가 많아져도 한 줄로 일관된 형태를 유지한다는 것이 묶음의 표기상의 이점이다.

### 3.3 — 1 차 테일러 근사

여러 변수가 동시에 작은 변화를 가질 때, 함수의 전체 변화량은 각 변수의 변화가 만드는 기여를 모두 더한 것으로 1 차 근사된다. 두 단계로 쪼개서 보면 직관적이다. 점 $\mathbf{x} = (x_1, \ldots, x_n)$ 에서 출발해 한 변수씩 차례로 변화시키면, 매 단계마다 그 변수의 편미분 × 변화량 만큼 함수값이 변한다.

$n$ 개의 변수 각각에 대한 변화 기여를 모두 합치면 전체 변화량이 된다.

$$f(\mathbf{x} + \Delta \mathbf{x}) \approx f(\mathbf{x}) + \frac{\partial f}{\partial x_1} \Delta x_1 + \frac{\partial f}{\partial x_2} \Delta x_2 + \cdots + \frac{\partial f}{\partial x_n} \Delta x_n$$

이 합을 그라디언트와 변화량 벡터의 점곱으로 묶으면 콤팩트한 형태가 된다.

$$f(\mathbf{x} + \Delta \mathbf{x}) \approx f(\mathbf{x}) + \nabla f(\mathbf{x})^T \Delta \mathbf{x}$$

$\nabla f$ 가 세로 벡터이므로 transpose 를 취해 가로 벡터로 만든 뒤 $\Delta \mathbf{x}$ 와 곱하면 스칼라가 나온다. 두 표기는 §3.2 에서 본 대로 동일한 식이며, 변수 개수와 무관하게 같은 형태로 표현된다.

### 3.4 — 예제 — $f(x, y) = x^2 + y^2$

원점에서 멀어질수록 값이 커지는 그릇 (paraboloid) 모양 함수이다. 두 편미분을 차례로 구한다.

$x$ 에 대한 편미분 ($y$ 는 상수 취급):

$$\frac{\partial f}{\partial x} = \frac{\partial}{\partial x}(x^2 + y^2) = 2x + 0 = 2x$$

$y$ 에 대한 편미분 ($x$ 는 상수 취급):

$$\frac{\partial f}{\partial y} = \frac{\partial}{\partial y}(x^2 + y^2) = 0 + 2y = 2y$$

두 편미분을 벡터로 묶어 그라디언트를 만든다.

$$\nabla f(x, y) = \begin{bmatrix} 2x \\\\ 2y \end{bmatrix}$$

점 $(1, 2)$ 에서 수치를 계산하면:

$$\nabla f(1, 2) = \begin{bmatrix} 2 \cdot 1 \\\\ 2 \cdot 2 \end{bmatrix} = \begin{bmatrix} 2 \\\\ 4 \end{bmatrix}$$

이 점에서 함숫값을 가장 빠르게 키우는 방향이 $(2, 4)$ 방향이며, 그 방향으로의 변화율의 크기는 $\|\nabla f\| = \sqrt{4 + 16} = \sqrt{20} \approx 4.47$ 이다.

### 3.5 — 수치 검증

$f(x, y) = x^2 + y^2$, 점 $(1, 2)$, 변화 $\Delta \mathbf{x} = (0.1, 0.1)^T$ 로 근사값과 진짜 값을 비교한다.

근사값:

$$f(1.1, 2.1) \approx f(1, 2) + \nabla f(1, 2)^T \begin{bmatrix} 0.1 \\\\ 0.1 \end{bmatrix}$$

$f(1, 2) = 1 + 4 = 5$, $\nabla f(1, 2) = (2, 4)^T$ 를 대입하면:

$$\approx 5 + \begin{bmatrix} 2 & 4 \end{bmatrix} \begin{bmatrix} 0.1 \\\\ 0.1 \end{bmatrix} = 5 + (2 \cdot 0.1 + 4 \cdot 0.1) = 5 + 0.6 = 5.6$$

진짜 값:

$$f(1.1, 2.1) = 1.1^2 + 2.1^2 = 1.21 + 4.41 = 5.62$$

차이는 $0.02$ 이다. 변화량을 줄여가면서 오차의 변화를 보면:

| $\Delta \mathbf{x}$ | 근사값 | 진짜 값 | 오차 |
|---|---|---|---|
| $(0.01, 0.01)$ | 5.06 | 5.0602 | 0.0002 |
| $(0.1, 0.1)$ | 5.6 | 5.62 | 0.02 |
| $(0.5, 0.5)$ | 8.0 | 8.5 | 0.5 |
| $(1.0, 1.0)$ | 11.0 | 13.0 | 2.0 |

1 변수 경우와 마찬가지로 $\Delta \mathbf{x}$ 가 작을수록 오차가 빠르게 줄어든다. 작은 변화 영역에서는 곡면이 평면으로 잘 근사된다.

---

## 4. 자코비안 — 다변수 입력, 다변수 출력

### 4.1 — 정의

함수 $\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$ 의 자코비안은 모든 출력 성분의 모든 입력 변수에 대한 편미분을 행렬로 정리한 것이다. 출력 한 성분마다 그라디언트가 하나씩 있고, 이를 가로로 눕혀 위에서 아래로 쌓는다.

$$J(\mathbf{x}) = \begin{bmatrix} \nabla f_1(\mathbf{x})^T \\\\ \nabla f_2(\mathbf{x})^T \\\\ \vdots \\\\ \nabla f_m(\mathbf{x})^T \end{bmatrix} = \begin{bmatrix} \dfrac{\partial f_1}{\partial x_1} & \dfrac{\partial f_1}{\partial x_2} & \cdots & \dfrac{\partial f_1}{\partial x_n} \\\\ \dfrac{\partial f_2}{\partial x_1} & \dfrac{\partial f_2}{\partial x_2} & \cdots & \dfrac{\partial f_2}{\partial x_n} \\\\ \vdots & \vdots & \ddots & \vdots \\\\ \dfrac{\partial f_m}{\partial x_1} & \dfrac{\partial f_m}{\partial x_2} & \cdots & \dfrac{\partial f_m}{\partial x_n} \end{bmatrix} \in \mathbb{R}^{m \times n}$$

세로 (행, $m$ 개) 는 출력 차원, 가로 (열, $n$ 개) 는 입력 차원이다. 출력이 1 차원이면 ($m = 1$) 행이 하나뿐이므로 자코비안은 그라디언트의 transpose 형태로 줄어든다.

### 4.2 — 그라디언트와의 관계

자코비안의 각 행은 출력 한 성분의 그라디언트를 가로로 눕힌 것이다.

$$J(\mathbf{x})[k, :] = \nabla f_k(\mathbf{x})^T$$

각 열은 한 입력 변수가 모든 출력 성분에 미치는 영향을 모은 것이다.

$$J(\mathbf{x})[:, k] = \frac{\partial \mathbf{f}}{\partial x_k}$$

행으로 보면 출력별 그라디언트들의 묶음, 열로 보면 입력별 영향의 묶음이다. 그라디언트가 다변수 입력을 한 출력으로 매핑하는 함수의 1 차 미분이라면, 자코비안은 다변수 입력을 다변수 출력으로 매핑하는 함수의 1 차 미분이다.

### 4.3 — 1 차 테일러 근사

다변수 벡터 함수의 1 차 테일러 근사는 자코비안과 변화량 벡터의 행렬 곱으로 표현된다.

$$\mathbf{f}(\mathbf{x} + \Delta \mathbf{x}) \approx \mathbf{f}(\mathbf{x}) + J(\mathbf{x}) \Delta \mathbf{x}$$

차원을 확인하면 $J \in \mathbb{R}^{m \times n}$, $\Delta \mathbf{x} \in \mathbb{R}^n$ 이므로 곱은 $\mathbb{R}^m$ 의 벡터가 되어 $\mathbf{f}(\mathbf{x}) \in \mathbb{R}^m$ 와 차원이 일치한다.

이 행렬 식은 출력 함수 개수만큼의 식을 한 줄로 묶은 표기이다. 식에 등장하는 세 양 — $\mathbf{f}(\mathbf{x})$, $\mathbf{f}(\mathbf{x} + \Delta \mathbf{x})$, $J(\mathbf{x})$ — 모두 정의에 따라 성분별로 풀어 쓸 수 있다.

벡터 함수의 정의는 성분 함수들을 세로 벡터로 묶은 것이다.

$$\mathbf{f}(\mathbf{x}) = \begin{bmatrix} f_1(\mathbf{x}) \\\\ f_2(\mathbf{x}) \\\\ \vdots \\\\ f_m(\mathbf{x}) \end{bmatrix}, \qquad \mathbf{f}(\mathbf{x} + \Delta \mathbf{x}) = \begin{bmatrix} f_1(\mathbf{x} + \Delta \mathbf{x}) \\\\ f_2(\mathbf{x} + \Delta \mathbf{x}) \\\\ \vdots \\\\ f_m(\mathbf{x} + \Delta \mathbf{x}) \end{bmatrix}$$

자코비안은 §4.1 의 정의에 따라 각 행이 출력 한 성분의 그라디언트의 transpose 이다.

$$J(\mathbf{x}) = \begin{bmatrix} \nabla f_1(\mathbf{x})^T \\\\ \nabla f_2(\mathbf{x})^T \\\\ \vdots \\\\ \nabla f_m(\mathbf{x})^T \end{bmatrix}$$

변화량 벡터도 $n$ 개의 성분을 세로로 묶은 형태이다.

$$\Delta \mathbf{x} = \begin{bmatrix} \Delta x_1 \\\\ \Delta x_2 \\\\ \vdots \\\\ \Delta x_n \end{bmatrix}$$

$J(\mathbf{x}) \Delta \mathbf{x}$ 는 $m \times n$ 행렬과 $n \times 1$ 벡터의 곱이며, 결과는 $m \times 1$ 벡터가 된다. $J$ 의 각 행을 편미분 성분으로 풀고 $\Delta \mathbf{x}$ 와 곱하면 행마다 편미분과 변화량의 곱들이 합쳐진 형태가 나온다.

$$J(\mathbf{x}) \Delta \mathbf{x} = \begin{bmatrix} \dfrac{\partial f_1}{\partial x_1} & \dfrac{\partial f_1}{\partial x_2} & \cdots & \dfrac{\partial f_1}{\partial x_n} \\\\ \dfrac{\partial f_2}{\partial x_1} & \dfrac{\partial f_2}{\partial x_2} & \cdots & \dfrac{\partial f_2}{\partial x_n} \\\\ \vdots & \vdots & \ddots & \vdots \\\\ \dfrac{\partial f_m}{\partial x_1} & \dfrac{\partial f_m}{\partial x_2} & \cdots & \dfrac{\partial f_m}{\partial x_n} \end{bmatrix} \begin{bmatrix} \Delta x_1 \\\\ \Delta x_2 \\\\ \vdots \\\\ \Delta x_n \end{bmatrix} = \begin{bmatrix} \dfrac{\partial f_1}{\partial x_1} \Delta x_1 + \dfrac{\partial f_1}{\partial x_2} \Delta x_2 + \cdots + \dfrac{\partial f_1}{\partial x_n} \Delta x_n \\\\ \dfrac{\partial f_2}{\partial x_1} \Delta x_1 + \dfrac{\partial f_2}{\partial x_2} \Delta x_2 + \cdots + \dfrac{\partial f_2}{\partial x_n} \Delta x_n \\\\ \vdots \\\\ \dfrac{\partial f_m}{\partial x_1} \Delta x_1 + \dfrac{\partial f_m}{\partial x_2} \Delta x_2 + \cdots + \dfrac{\partial f_m}{\partial x_n} \Delta x_n \end{bmatrix}$$

각 행이 $\nabla f_k^T \Delta \mathbf{x} = \sum_j (\partial f_k / \partial x_j) \Delta x_j$ 형태로, §3 의 그라디언트 점곱 정의 그대로이다.

세 정의를 행렬 식에 대입하면 성분별 근사식이 그대로 드러난다.

$$\begin{bmatrix} f_1(\mathbf{x} + \Delta \mathbf{x}) \\\\ f_2(\mathbf{x} + \Delta \mathbf{x}) \\\\ \vdots \\\\ f_m(\mathbf{x} + \Delta \mathbf{x}) \end{bmatrix} \approx \begin{bmatrix} f_1(\mathbf{x}) \\\\ f_2(\mathbf{x}) \\\\ \vdots \\\\ f_m(\mathbf{x}) \end{bmatrix} + \begin{bmatrix} \nabla f_1(\mathbf{x})^T \Delta \mathbf{x} \\\\ \nabla f_2(\mathbf{x})^T \Delta \mathbf{x} \\\\ \vdots \\\\ \nabla f_m(\mathbf{x})^T \Delta \mathbf{x} \end{bmatrix}$$

이를 한 줄씩 떼어 보면 각 출력 성분에 대해 §3 의 그라디언트 근사가 그대로 적용된다.

$$f_k(\mathbf{x} + \Delta \mathbf{x}) \approx f_k(\mathbf{x}) + \nabla f_k(\mathbf{x})^T \Delta \mathbf{x} \qquad (k = 1, \ldots, m)$$

행렬 형태 $\mathbf{f} + J \Delta \mathbf{x}$ 와 풀어 쓴 $m$ 개의 그라디언트 근사식은 글자 그대로 같은 식이다. 자코비안은 그 $m$ 개의 근사를 한 행렬 식으로 압축한 표기이며, §3 의 점곱 묶음 (편미분 합 → 그라디언트 점곱) 이 출력 차원으로 한 단계 더 진행한 형태로 볼 수 있다. 자코비안과 변화량의 행렬 곱이 출력 변화를 1 차로 근사하는 이 형태는 IK 의 한 step (관절 변화 → end-effector 변화) 에서 그대로 사용되며, 구체적인 로봇 팔 자코비안의 계산은 FK / IK 문서에서 다룬다.
