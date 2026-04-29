---
title: Part 1·1 선형 최소제곱과 정규방정식
description: 세 직선의 교점이 없을 때, 가장 잘 맞는 점 찾기. Ax=b 부터 정규방정식 유도까지 단계별로
author: mark
date: 2026-04-25
categories: [math, optimization, linear-algebra]
tags: [least-squares, normal-equations, linear-system, linear-regression]
math: true
---

# 좌표평면 위의 세 직선

## 직선 방정식

> **문제**: $(w_1, w_2)$ 평면 위의 **세 직선의 교점** 을 구하기.

$$L_1: \quad w_1 + w_2 = 2$$

$$L_2: \quad w_1 + 2 w_2 = 3$$

$$L_3: \quad w_1 + 3 w_2 = 5$$

각 방정식은 **2차원 평면 위의 직선 한 개** 를 정의:

- 직선 위의 모든 점 $(w_1, w_2)$ 는 그 방정식을 정확히 만족
- 세 직선 **공통 교점** 이 있다면 → 세 방정식 동시 만족하는 해

## 시각화

![세 직선](/assets/img/posts/three_lines_simple.svg)

> ⚠️ **세 직선을 모두 만족하는 교점은 없음** (그림에서 확인: 세 직선이 한 점에서 안 만남).
>
> $L_1 \cap L_2 = (1, 1)$ 은 $L_3$ 위에 없음 ($1 + 3 \cdot 1 = 4 \neq 5$).
>
> → **정확한 해 없음** → **최소제곱** 으로 "가장 잘 맞는" 점 찾아야 함.

---

## $A\mathbf{x} = \mathbf{b}$ 선형시스템 식 세우기

### Step 1. 세 방정식을 나란히 정렬

각 방정식의 **계수**들을 정렬:

$$\begin{aligned}
\mathbf{1} \cdot w_1 \;+\; \mathbf{1} \cdot w_2 \;&=\; 2 \\
\mathbf{1} \cdot w_1 \;+\; \mathbf{2} \cdot w_2 \;&=\; 3 \\
\mathbf{1} \cdot w_1 \;+\; \mathbf{3} \cdot w_2 \;&=\; 5
\end{aligned}$$

### Step 2. 계수 행렬 $A$ 만들기

$w_1, w_2$ 의 계수들을 한 표로 모음:

$$A = \begin{bmatrix}
\mathbf{1} & \mathbf{1} \\
\mathbf{1} & \mathbf{2} \\
\mathbf{1} & \mathbf{3}
\end{bmatrix}_{3 \times 2}$$

- **3 행** = 방정식 3개 (직선 3개)
- **2 열** = 미지수 2개 ($w_1, w_2$)

### Step 3. 미지수 벡터 $\mathbf{x}$ 와 우변 $\mathbf{b}$

$$\mathbf{x} = \begin{bmatrix} w_1 \\ w_2 \end{bmatrix} \quad (2 \times 1)$$

$$\mathbf{b} = \begin{bmatrix} 2 \\ 3 \\ 5 \end{bmatrix} \quad (3 \times 1)$$

### Step 4. 행렬 형태

$$\boxed{A\mathbf{x} = \mathbf{b}}$$

$$\begin{bmatrix}
1 & 1 \\
1 & 2 \\
1 & 3
\end{bmatrix}
\begin{bmatrix} w_1 \\ w_2 \end{bmatrix}
=
\begin{bmatrix} 2 \\ 3 \\ 5 \end{bmatrix}$$

### 차원 확인

| 객체 | 모양 | 차원 |
|---|---|---|
| $A$ | $3 \times 2$ | (행렬) |
| $\mathbf{x}$ | $2 \times 1$ | $\mathbb{R}^2$ |
| $A\mathbf{x}$ | $3 \times 1$ | $\mathbb{R}^3$ |
| $\mathbf{b}$ | $3 \times 1$ | $\mathbb{R}^3$ |

차원 매칭: $(3 \times 2) \cdot (2 \times 1) = (3 \times 1)$ ✓

### 행렬 곱 검증

$$A\mathbf{x} = \begin{bmatrix}
1 \cdot w_1 + 1 \cdot w_2 \\
1 \cdot w_1 + 2 \cdot w_2 \\
1 \cdot w_1 + 3 \cdot w_2
\end{bmatrix} = \begin{bmatrix} 2 \\ 3 \\ 5 \end{bmatrix}$$

→ 원래 세 방정식과 **완전히 같음**.

---

## 직선과 행렬의 대응

| 직선 | 방정식 | 대응 행 |
|---|---|---|
| $L_1$ | $w_1 + w_2 = 2$ | $A$ 의 1행: $[1, 1]$, $\mathbf{b}$ 의 1성분: $2$ |
| $L_2$ | $w_1 + 2w_2 = 3$ | $A$ 의 2행: $[1, 2]$, $\mathbf{b}$ 의 2성분: $3$ |
| $L_3$ | $w_1 + 3w_2 = 5$ | $A$ 의 3행: $[1, 3]$, $\mathbf{b}$ 의 3성분: $5$ |

→ **$A$ 의 한 행 + $\mathbf{b}$ 의 한 성분 = 직선 한 개**.

---

## 풀이하기

### Step 1. 두 직선의 교점 찾기 (먼저 시도)

$L_1$ 과 $L_2$ 만 풀어봄:

$$\begin{aligned} (L_1): \quad w_1 + w_2 &= 2 \\ (L_2): \quad w_1 + 2w_2 &= 3 \end{aligned}$$

$(L_2) - (L_1)$:

$$w_2 = 1$$

$(L_1)$ 대입:

$$w_1 + 1 = 2 \;\Rightarrow\; w_1 = 1$$

→ **교점**: $(w_1, w_2) = (1, 1)$.

### Step 2. 세 번째 직선도 만족하나?

$(1, 1)$ 을 $L_3$ 에 대입:

$$L_3: w_1 + 3 w_2 = 5$$

$$1 + 3 \cdot 1 = 4 \;\neq\; 5$$

❌ 성립 안 함.

→ **$L_3$ 는 $(1, 1)$ 을 안 지남**. **세 직선이 한 점에서 안 만남**.

### Step 3. 정확한 해 없음 → 최소제곱 → 정규방정식 유도

세 직선이 한 점에서 안 만나므로 $A\mathbf{x} = \mathbf{b}$ 의 **정확 해 없음**.

대신 **잔차 제곱합 (SSE) 을 최소화**:

$$\text{SSE}(\mathbf{x}) = \|\mathbf{b} - A\mathbf{x}\|^2$$

$$\min_\mathbf{x} \;\text{SSE}(\mathbf{x})$$

#### (a) 노름 제곱을 내적으로 풀기

**규칙**: $\|\mathbf{v}\|^2 = \mathbf{v}^T \mathbf{v}$

$\mathbf{v} = \mathbf{b} - A\mathbf{x}$ 대입:

$$\text{SSE}(\mathbf{x}) = (\mathbf{b} - A\mathbf{x})^T (\mathbf{b} - A\mathbf{x})$$

#### (b) 전치 분배

**규칙**: $(A + B)^T = A^T + B^T$, $(AB)^T = B^T A^T$

좌측 괄호 전치:

$$(\mathbf{b} - A\mathbf{x})^T = \mathbf{b}^T - (A\mathbf{x})^T = \mathbf{b}^T - \mathbf{x}^T A^T$$

#### (c) 네 항으로 전개

$$\text{SSE} = (\mathbf{b}^T - \mathbf{x}^T A^T)(\mathbf{b} - A\mathbf{x})$$

분배:

$$\text{SSE} = \mathbf{b}^T \mathbf{b} - \mathbf{b}^T A \mathbf{x} - \mathbf{x}^T A^T \mathbf{b} + \mathbf{x}^T A^T A \mathbf{x}$$

각 항 번호:
- **(1)** $\mathbf{b}^T \mathbf{b}$
- **(2)** $-\mathbf{b}^T A \mathbf{x}$
- **(3)** $-\mathbf{x}^T A^T \mathbf{b}$
- **(4)** $\mathbf{x}^T A^T A \mathbf{x}$

#### (d) (2), (3) 은 같은 스칼라 (전치해도 동일)

$\mathbf{x}^T A^T \mathbf{b}$ 는 스칼라 ($1 \times 1$) → **자기 전치 = 자기자신**:

$$\mathbf{x}^T A^T \mathbf{b} = (\mathbf{x}^T A^T \mathbf{b})^T = \mathbf{b}^T A \mathbf{x}$$

따라서 (2) + (3) = $-2 \mathbf{b}^T A \mathbf{x}$:

$$\text{SSE}(\mathbf{x}) = \mathbf{b}^T\mathbf{b} - 2 \mathbf{b}^T A\mathbf{x} + \mathbf{x}^T A^T A \mathbf{x}$$

각 항의 성질:
- $\mathbf{b}^T\mathbf{b}$ — **상수** ($\mathbf{x}$ 무관)
- $-2 \mathbf{b}^T A\mathbf{x}$ — $\mathbf{x}$ 의 **1차**
- $\mathbf{x}^T A^T A \mathbf{x}$ — $\mathbf{x}$ 의 **2차**

→ **$\mathbf{x}$ 에 대한 이차함수** (상수 + 1차 + 2차 항).

#### (e) $\mathbf{x}$ 로 미분 (각 항별)

**행렬 미분 규칙**:

| 형태 | 미분 결과 | 1D 대응 |
|---|---|---|
| 상수 | $\mathbf{0}$ | $\frac{d}{dx} c = 0$ |
| $\mathbf{c}^T \mathbf{x}$ (선형) | $\mathbf{c}$ | $\frac{d}{dx}(cx) = c$ |
| $\mathbf{x}^T M \mathbf{x}$ (이차, $M$ 대칭) | $2 M \mathbf{x}$ | $\frac{d}{dx}(ax^2) = 2ax$ |

각 항에 적용:

| 항 | $\mathbf{x}$ 로 미분 |
|---|---|
| $\mathbf{b}^T\mathbf{b}$ | $\mathbf{0}$ (상수) |
| $-2 \mathbf{b}^T A\mathbf{x}$ | $-2 A^T \mathbf{b}$ (선형 계수 $-2A^T\mathbf{b}$) |
| $\mathbf{x}^T A^T A \mathbf{x}$ | $2 A^T A \mathbf{x}$ ($A^TA$ 대칭) |

합:

$$\frac{\partial \text{SSE}}{\partial \mathbf{x}} = -2 A^T \mathbf{b} + 2 A^T A \mathbf{x}$$

#### (f) 극값 조건: 미분 = 0

$$-2 A^T \mathbf{b} + 2 A^T A \mathbf{x} = 0$$

양변 $2$ 로 나누기:

$$A^T A \mathbf{x} - A^T \mathbf{b} = 0$$

#### (g) 정규방정식 (Normal Equation)

$$\boxed{A^T A \mathbf{x} = A^T \mathbf{b}}$$

→ **"$\mathbf{x}$ 에 대한 선형 연립방정식"**. 이제 풀면 됨.

##### 🔍 왜 이름이 "정규(수직) 방정식" 인가?

위 식을 살짝 변형하면 **기하적 의미**가 드러남:

$$A^T A \mathbf{x} - A^T \mathbf{b} = 0$$

$$A^T (A\mathbf{x} - \mathbf{b}) = 0$$

$$A^T (-\mathbf{e}) = 0 \quad\Rightarrow\quad \boxed{A^T \mathbf{e} = 0}$$

($\mathbf{e} = \mathbf{b} - A\mathbf{x}$ 는 잔차)

**$A^T \mathbf{e}$ 가 무엇인지** 풀어보면:

$$A^T \mathbf{e} = \begin{bmatrix} \text{col}_1 \cdot \mathbf{e} \\ \text{col}_2 \cdot \mathbf{e} \\ \vdots \\ \text{col}_k \cdot \mathbf{e} \end{bmatrix} = \mathbf{0}$$

→ 각 성분 $\text{col}_i \cdot \mathbf{e} = 0$ → **잔차 $\mathbf{e}$ 가 $A$ 의 모든 열과 내적 0**.

##### 의미: 잔차 ⊥ 열공간

$$\boxed{\mathbf{e} \perp C(A)}$$

잔차 벡터가 $A$ 의 **모든 열 벡터에 수직** = **열공간 전체에 수직**.

##### 이름의 유래

- 영어 **"Normal"** = "수직, 직교" (법선)
- → **"Normal equation" = "수직 조건으로부터 나온 방정식"**
- 한국어 "정규방정식" 의 "정규" 는 사실 **"수직(법선)"** 의미

##### 기하 직관

```
    y
     \
      \
       \  e (잔차, 수직)
        \
         ●──────── C(A) 열공간
         Ax*       (모델이 표현 가능한 영역)
                                                 
   최단거리 = 수직 투영                          
   → 잔차가 열공간에 수직일 때 ‖e‖² 최소        
```

**결론**:
- **대수로**: $A^T A \mathbf{x} = A^T \mathbf{b}$ ("미분 = 0" 풀이 결과)
- **기하로**: 잔차가 열공간에 수직 ("최단거리" 조건)
- **두 관점이 완전히 동치** → 그래서 이름이 **"수직(정규) 방정식"**

#### 🗺️ 유도 흐름 요약

```
SSE(x) = ‖b - Ax‖²
     │
     │ 내적으로 풀기
     ↓
(b - Ax)ᵀ(b - Ax)
     │
     │ 전개 (4 항 → 3 항)
     ↓
bᵀb  -  2bᵀAx  +  xᵀAᵀAx
(상수)   (1차)     (2차)
     │
     │ x 로 미분
     ↓
0  -  2Aᵀb  +  2AᵀAx
     │
     │ = 0 (극값 조건)
     ↓
AᵀA x = Aᵀb    ← 정규방정식 ★
```

#### ⚠️ 관찰

- **$\mathbf{b}^T\mathbf{b}$ 는 상수** → 미분에서 사라짐 → 정규방정식에 안 보임
- **$A^T A$ 는 항상 대칭** ($(A^TA)^T = A^TA$) → 이차 형식 미분 깔끔
- **$A^T A$ 는 항상 양반정치** ($\mathbf{v}^T A^TA \mathbf{v} = \|A\mathbf{v}\|^2 \geq 0$) → SSE 가 convex (최저점만 존재)

### Step 4. $A^T A$ 계산

$$A^T = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 3 \end{bmatrix}_{2 \times 3}$$

$$A^T A = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 3 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ 1 & 2 \\ 1 & 3 \end{bmatrix}$$

각 성분:
- $(1,1)$: $1 \cdot 1 + 1 \cdot 1 + 1 \cdot 1 = 3$
- $(1,2)$: $1 \cdot 1 + 1 \cdot 2 + 1 \cdot 3 = 6$
- $(2,1)$: $1 \cdot 1 + 2 \cdot 1 + 3 \cdot 1 = 6$
- $(2,2)$: $1 \cdot 1 + 2 \cdot 2 + 3 \cdot 3 = 14$

$$A^T A = \begin{bmatrix} 3 & 6 \\ 6 & 14 \end{bmatrix}_{2 \times 2}$$

### Step 5. $A^T \mathbf{b}$ 계산

$$A^T \mathbf{b} = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 3 \end{bmatrix} \begin{bmatrix} 2 \\ 3 \\ 5 \end{bmatrix}$$

- 1성분: $1 \cdot 2 + 1 \cdot 3 + 1 \cdot 5 = 10$
- 2성분: $1 \cdot 2 + 2 \cdot 3 + 3 \cdot 5 = 23$

$$A^T \mathbf{b} = \begin{bmatrix} 10 \\ 23 \end{bmatrix}$$

### Step 6. 정규방정식 세우기

$$\begin{bmatrix} 3 & 6 \\ 6 & 14 \end{bmatrix} \begin{bmatrix} w_1 \\ w_2 \end{bmatrix} = \begin{bmatrix} 10 \\ 23 \end{bmatrix}$$

풀어쓰면:

$$\begin{cases} 3 w_1 + 6 w_2 = 10 \\ 6 w_1 + 14 w_2 = 23 \end{cases}$$

### Step 7. 연립 풀기

첫 식 $\times 2$:

$$6 w_1 + 12 w_2 = 20$$

두 번째 식에서 빼기:

$$(6 w_1 + 14 w_2) - (6 w_1 + 12 w_2) = 23 - 20$$

$$2 w_2 = 3 \;\Rightarrow\; w_2 = \frac{3}{2}$$

첫 식 대입:

$$3 w_1 + 6 \cdot \frac{3}{2} = 10$$

$$3 w_1 + 9 = 10$$

$$w_1 = \frac{1}{3}$$

### Step 8. 최소제곱 해

$$\boxed{\mathbf{x}^* = \begin{bmatrix} w_1 \\ w_2 \end{bmatrix} = \begin{bmatrix} 1/3 \\ 3/2 \end{bmatrix} \approx \begin{bmatrix} 0.33 \\ 1.5 \end{bmatrix}}$$

### Step 9. 잔차 확인

$$A\mathbf{x}^* = \begin{bmatrix} 1 & 1 \\ 1 & 2 \\ 1 & 3 \end{bmatrix} \begin{bmatrix} 1/3 \\ 3/2 \end{bmatrix} = \begin{bmatrix} 1/3 + 3/2 \\ 1/3 + 3 \\ 1/3 + 9/2 \end{bmatrix} = \begin{bmatrix} 11/6 \\ 10/3 \\ 29/6 \end{bmatrix} \approx \begin{bmatrix} 1.83 \\ 3.33 \\ 4.83 \end{bmatrix}$$

잔차:

$$\mathbf{e} = \mathbf{b} - A\mathbf{x}^* = \begin{bmatrix} 2 \\ 3 \\ 5 \end{bmatrix} - \begin{bmatrix} 11/6 \\ 10/3 \\ 29/6 \end{bmatrix} = \begin{bmatrix} 1/6 \\ -1/3 \\ 1/6 \end{bmatrix} \approx \begin{bmatrix} 0.17 \\ -0.33 \\ 0.17 \end{bmatrix}$$

$$\|\mathbf{e}\|^2 = \left(\frac{1}{6}\right)^2 + \left(\frac{1}{3}\right)^2 + \left(\frac{1}{6}\right)^2 = \frac{1}{36} + \frac{4}{36} + \frac{1}{36} = \frac{6}{36} = \frac{1}{6} \approx 0.167$$

### Step 10. 직교 조건 확인 (정규방정식의 기하적 의미)

잔차가 **$A$ 의 모든 열에 수직**?

$$A^T \mathbf{e} = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 3 \end{bmatrix} \begin{bmatrix} 1/6 \\ -1/3 \\ 1/6 \end{bmatrix}$$

- 1성분: $\frac{1}{6} - \frac{1}{3} + \frac{1}{6} = \frac{1 - 2 + 1}{6} = 0$ ✓
- 2성분: $\frac{1}{6} - \frac{2}{3} + \frac{3}{6} = \frac{1 - 4 + 3}{6} = 0$ ✓

$$A^T \mathbf{e} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$

✓ 확인.

→ **정확히 0**. 잔차가 열공간에 수직 = 정규방정식 만족 = 최소제곱 해 검증 완료.

---

## 풀이 요약

| Step | 결과 |
|---|---|
| 1. $L_1 \cap L_2$ | $(1, 1)$ |
| 2. $L_3$ 만족? | ❌ ($1+3=4 \neq 5$) |
| 3. 정확 해 없음 | → 정규방정식 적용 |
| 4. $A^T A$ | $\begin{bmatrix} 3 & 6 \\ 6 & 14 \end{bmatrix}$ |
| 5. $A^T \mathbf{b}$ | $\begin{bmatrix} 10 \\ 23 \end{bmatrix}$ |
| 6-7. 연립 풀이 | $w_1 = 1/3, w_2 = 3/2$ |
| 8. **최소제곱 해** | $\mathbf{x}^* = (1/3, 3/2)$ |
| 9. 잔차 | $\mathbf{e} = (1/6, -1/3, 1/6)$, $\|\mathbf{e}\|^2 = 1/6$ |
| 10. 직교 검증 | $A^T \mathbf{e} = \mathbf{0}$ ✓ |

---

## 유사역행렬 (Pseudoinverse) 로 한 번에

### 왜 유사역행렬?

$A$ 가 정사각이 아님 ($3 \times 2$) → **일반 역행렬 $A^{-1}$ 없음**.

대신 **유사역행렬 (Moore-Penrose pseudoinverse) $A^+$** 사용:

$$\boxed{A^+ = (A^T A)^{-1} A^T}$$

이걸로 최소제곱 해를 한 줄로:

$$\boxed{\mathbf{x}^* = A^+ \mathbf{b}}$$

### Step 1. $(A^T A)^{-1}$ 계산

$A^T A = \begin{bmatrix} 3 & 6 \\ 6 & 14 \end{bmatrix}$ 의 역행렬.

$2 \times 2$ 역행렬 공식:

$$\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1} = \frac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$$

행렬식:

$$\det(A^T A) = 3 \cdot 14 - 6 \cdot 6 = 42 - 36 = 6$$

$$\det \neq 0 \;\Rightarrow\; A^T A \text{ 가역} \;\Rightarrow\; A^+ \text{ 존재}$$

역행렬:

$$(A^T A)^{-1} = \frac{1}{6} \begin{bmatrix} 14 & -6 \\ -6 & 3 \end{bmatrix} = \begin{bmatrix} 14/6 & -1 \\ -1 & 1/2 \end{bmatrix} = \begin{bmatrix} 7/3 & -1 \\ -1 & 1/2 \end{bmatrix}$$

### Step 2. $A^+ = (A^T A)^{-1} A^T$ 계산

$$A^+ = \begin{bmatrix} 7/3 & -1 \\ -1 & 1/2 \end{bmatrix} \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 3 \end{bmatrix}$$

각 성분 계산:

| 위치 | 계산 | 값 |
|---|---|---|
| $(1,1)$ | $7/3 \cdot 1 + (-1) \cdot 1$ | $7/3 - 1 = 4/3$ |
| $(1,2)$ | $7/3 \cdot 1 + (-1) \cdot 2$ | $7/3 - 2 = 1/3$ |
| $(1,3)$ | $7/3 \cdot 1 + (-1) \cdot 3$ | $7/3 - 3 = -2/3$ |
| $(2,1)$ | $-1 \cdot 1 + 1/2 \cdot 1$ | $-1 + 1/2 = -1/2$ |
| $(2,2)$ | $-1 \cdot 1 + 1/2 \cdot 2$ | $-1 + 1 = 0$ |
| $(2,3)$ | $-1 \cdot 1 + 1/2 \cdot 3$ | $-1 + 3/2 = 1/2$ |

$$\boxed{A^+ = \begin{bmatrix} 4/3 & 1/3 & -2/3 \\ -1/2 & 0 & 1/2 \end{bmatrix}_{2 \times 3}}$$

### Step 3. $\mathbf{x}^* = A^+ \mathbf{b}$

$$\mathbf{x}^* = \begin{bmatrix} 4/3 & 1/3 & -2/3 \\ -1/2 & 0 & 1/2 \end{bmatrix} \begin{bmatrix} 2 \\ 3 \\ 5 \end{bmatrix}$$

각 성분:

- $w_1 = 4/3 \cdot 2 + 1/3 \cdot 3 + (-2/3) \cdot 5 = 8/3 + 3/3 - 10/3 = 1/3$
- $w_2 = (-1/2) \cdot 2 + 0 \cdot 3 + 1/2 \cdot 5 = -1 + 5/2 = 3/2$

$$\boxed{\mathbf{x}^* = \begin{bmatrix} 1/3 \\ 3/2 \end{bmatrix}}$$

→ **정규방정식 풀이와 정확히 같은 결과** ✓

### 차원 확인

$$A^+ \cdot \mathbf{b} = \mathbf{x}^*$$

차원: $A^+$ 는 $2 \times 3$, $\mathbf{b}$ 는 $3 \times 1$, $\mathbf{x}^*$ 는 $2 \times 1$.

$(2 \times 3)(3 \times 1) = (2 \times 1)$ ✓

### 일반 역행렬과 비교

| | 정사각 행렬 ($n \times n$) | 직사각 ($n \times k$, $n > k$) |
|---|---|---|
| 가역? | $\det \neq 0$ 이면 $A^{-1}$ | $A^{-1}$ **없음** |
| 해법 | $\mathbf{x} = A^{-1} \mathbf{b}$ | $\mathbf{x}^* = A^+ \mathbf{b}$ (최소제곱) |
| 의미 | 정확한 해 | 가장 가까운 근사 해 |

→ **유사역행렬은 직사각 행렬의 "사실상 역행렬"** 역할.

### 핵심 공식 한눈에

$$\boxed{A^+ = (A^T A)^{-1} A^T \quad (n > k, \text{열 독립일 때})}$$

$$\boxed{\mathbf{x}^* = A^+ \mathbf{b} = (A^T A)^{-1} A^T \mathbf{b}}$$

**정규방정식과 같은 식**, 표기만 짧음:

$$A^T A \mathbf{x}^{\ast} = A^T \mathbf{b} \quad\Leftrightarrow\quad \mathbf{x}^{\ast} = (A^T A)^{-1} A^T \mathbf{b} = A^+ \mathbf{b}$$

### Python 한 줄

```python
import numpy as np

A = np.array([[1, 1], [1, 2], [1, 3]])
b = np.array([2, 3, 5])

# 방법 1: 유사역행렬 직접
A_pinv = np.linalg.pinv(A)
x = A_pinv @ b
# → [0.333, 1.5]

# 방법 2: 정규방정식 (수치적 권장)
x = np.linalg.solve(A.T @ A, A.T @ b)
# → [0.333, 1.5]

# 방법 3: lstsq (가장 안정적)
x, *_ = np.linalg.lstsq(A, b, rcond=None)
# → [0.333, 1.5]
```

세 방법 **모두 같은 결과** $(1/3, 3/2)$.

### 의미 정리

> **유사역행렬 $A^+$ 는 직사각 행렬에서 "역행렬 역할"** 을 함:
>
> - 정확 해 있으면 → 그 해 반환
> - 정확 해 없으면 → **최소제곱 해** 반환
> - 무한 해 있으면 → **최소 norm 해** 반환
>
> 한 줄 공식 $\mathbf{x}^{\ast} = A^+ \mathbf{b}$ 가 **모든 경우** 를 처리.
