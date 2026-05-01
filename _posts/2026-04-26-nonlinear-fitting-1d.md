---
title: Part 1·2 비선형 최소제곱 — 4가지 알고리즘 비교
description: 파라미터 1개로 비선형 최소제곱의 모든 핵심 알고리즘을 한 그래프에 시각화. 인터랙티브 데모로 수렴 / 발산 / 거꾸로 가기까지 직접 체험.
author: mark
date: 2026-04-26
categories: [math, optimization]
tags: [mle, gauss-newton, levenberg-marquardt, newton, dogleg, jacobian]
math: true
---

# 비선형 피팅 1D — 한 변수로 직관 잡기

> **파라미터 1개** 인 가장 단순한 비선형 피팅으로 **모든 핵심 개념** 을 한 그래프에 시각화.
>
> 다변수로 가기 전 **반드시 먼저** 이 그림을 머리에 박아두기.

---

## 📋 Gauss-Newton 풀이 — 10단계 표준 흐름

| # | 단계 | 식 |
|---|---|---|
| 1 | 모델 정의 | $\hat{y}_i = f(t_i; w)$ |
| 2 | 잔차 (오차 함수) 정의 | $e_i = y_i - \hat{y}_i$ |
| 3 | SSE 정의 (최소화 목표) | $E(w) = \sum_i e_i^2$ |
| 4 | 잔차 1차 테일러 근사 | $e_i(w_n + \Delta w) \approx e_i(w_n) + J_i \Delta w$ |
| 5 | SSE 에 대입 → 이차식 | $\tilde{E}(\Delta w) = \sum (e_i + J_i \Delta w)^2$ |
| 6 | $\Delta w$ 로 미분 = 0 | 포물선 바닥 조건 |
| 7 | 정규방정식 | $(J^T J)\Delta w = -J^T \mathbf{e}$ |
| 8 | $\Delta w$ 풀기 | $\Delta w = -G/H$ |
| 9 | 업데이트 | $w_{n+1} = w_n + \Delta w$ |
| 10 | 반복 (수렴까지) | 새 $w_n$ 에서 4번부터 다시 |

> **이 10단계가 GN 의 본질**.
>
> LM, Newton, Dogleg 는 **8번 (Δw 풀기)** 의 변형 — 분모에 $\lambda$ 더하거나 (LM), 진짜 헤시안 쓰거나 (Newton), 거리 자르거나 (Dogleg).
>
> 아래 본문은 이 10단계를 우리 데이터로 단계별 검증 + 4가지 알고리즘 비교.

---

## 1. 모델 설정 — 1 변수만

$$\hat{y}(t; w) = e^{-w t}$$

- **파라미터**: $w$ **하나**
- **진짜 값**: $w^* = 0.5$
- **데이터 5개점** (노이즈 포함):

| $t_i$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $y_i$ | 1.05 | 0.55 | 0.41 | 0.22 | 0.19 |

---

## 2. 잔차 (오차 함수) 정의

각 데이터 점에서의 **관측 − 예측**:

$$e_i(w) = y_i - \hat{y}(t_i; w) = y_i - e^{-w t_i}$$

- **$y_i$**: $i$ 번째 관측값
- **$\hat{y}(t_i; w) = e^{-w t_i}$**: $i$ 번째 시점의 모델 예측
- **$e_i(w)$**: 잔차 — **$w$ 의 함수** (각 데이터마다 하나, 총 5개)

벡터로 모음:

$$\mathbf{e}(w) = \begin{bmatrix} e_1 \\ e_2 \\ e_3 \\ e_4 \\ e_5 \end{bmatrix}$$

---

## 3. SSE 정의

잔차의 제곱합:

$$E(w) = \|\mathbf{e}(w)\|^2 = \sum_i e_i(w)^2 = \sum_i \left(y_i - e^{-w t_i}\right)^2$$

→ **$w$ 하나의 함수** = **1D 곡선**!

- $w$ 작으면 (감쇠 약함) → 모델이 데이터보다 큼 → SSE 큼
- $w$ 너무 크면 (감쇠 강함) → 모델 너무 빨리 0 → SSE 큼
- $w \approx w^*$ → SSE 최소

---

## 4. 자코비안 $J$ — 잔차의 미분

### 정의

$$J_i(w) = \frac{d e_i}{dw}$$

→ **각 잔차를 $w$ 로 미분** — 데이터 하나당 하나씩 (총 5개).

### 유도

$e_i = y_i - e^{-w t_i}$ 에서 $w$ 로 미분:

#### Step 1. $y_i$ 는 상수 ($w$ 와 무관)

$$\frac{d y_i}{dw} = 0$$

#### Step 2. 지수 항 미분 (연쇄법칙)

$$\frac{d}{dw}\left[e^{-w t_i}\right] = e^{-w t_i} \cdot \underbrace{(-t_i)}_{\text{지수 안 미분}} = -t_i \cdot e^{-w t_i}$$

#### Step 3. 합치기

$$\frac{d e_i}{dw} = 0 - (-t_i \cdot e^{-w t_i}) = t_i \cdot e^{-w t_i}$$

$$\boxed{J_i(w) = t_i \cdot e^{-w t_i}}$$

### 벡터로

$$\mathbf{J}(w) = \begin{bmatrix} J_1 \\ J_2 \\ J_3 \\ J_4 \\ J_5 \end{bmatrix} = \begin{bmatrix} 0 \\ e^{-w} \\ 2 e^{-2w} \\ 3 e^{-3w} \\ 4 e^{-4w} \end{bmatrix}$$

→ **각 시점에서 잔차의 변화율** (모델 곡선의 $w$ 민감도).

### 의미

> "$w$ 를 살짝 바꾸면 잔차 $e_i$ 가 얼마나 변하나?" 의 **민감도**.

| $J_i$ 큼 | $w$ 변화 → 잔차 크게 변함 (정보 풍부) |
|---|---|
| $J_i \approx 0$ | $w$ 변화 → 잔차 거의 안 변함 (정보 빈약) |

→ **$J_i$ 가 GN 알고리즘의 핵심 재료**.

---

## 5. 잔차의 1차 테일러 근사

> 비선형 잔차 $e_i(w)$ 를 **현재 $w_n$ 근처에서 직선 (1차)으로 근사** — Gauss-Newton 의 핵심 발상.

### 식

$$e_i(w_n + \Delta w) \approx e_i(w_n) + J_i(w_n) \cdot \Delta w$$

- **$e_i(w_n)$**: 현재 잔차값 (상수)
- **$J_i(w_n)$**: 현재 자코비안 (상수)
- **$\Delta w$**: 변수 (얼마나 움직일까)

→ **$\Delta w$ 의 1차 함수** = **직선 (선형)**.

### 1D 비유

```
잔차 e_i(w):   ╲                                
                ╲                                
                 ╲___                            
                     ╲                          
                                                
1차 테일러:    ━━━━━━━━━ ← w_n 에서의 접선     
                                                
   w_n 근처에서만 곡선 ≈ 직선                  
   멀어지면 차이 벌어짐                        
```

### 왜 이렇게 하나

| 원본 잔차 $e_i(w)$ | 1차 테일러 $e_i(w_n) + J_i \cdot \Delta w$ |
|---|---|
| 비선형 (지수) | **선형** ($\Delta w$ 의 1차) |
| 직접 풀이 불가 | **풀이 가능** (선형 최소제곱) |

→ 비선형 → **국소 선형화** → 풀이 가능 → 한 걸음 → 반복.

### 벡터로

$$\mathbf{e}(w_n + \Delta w) \approx \mathbf{e}(w_n) + \mathbf{J}(w_n) \cdot \Delta w$$

$$= \begin{bmatrix} e_1 \\ e_2 \\ \vdots \\ e_5 \end{bmatrix} + \begin{bmatrix} J_1 \\ J_2 \\ \vdots \\ J_5 \end{bmatrix} \cdot \Delta w$$

→ **5개 잔차 모두 동시에 선형화**.

### 다음 단계 (예고)

이 선형 형태를 **제곱하면 SSE 의 이차근사 (포물선)** → 미분 = 0 → 정규방정식 → $\Delta w$ 풀이.

---

## 6. SSE 에 대입 → 미분 → 정규방정식 → $\Delta w$

### Step 1. 선형화된 잔차를 SSE 에 대입

선형화된 SSE 를 $\tilde{E}(\Delta w)$ 로 표기:

$$\tilde{E}(\Delta w) = \sum_i \big[e_i(w_n) + J_i \cdot \Delta w\big]^2$$

→ **$\Delta w$ 의 이차함수** (1차 + 제곱 = 2차).

### Step 2. 전개

$$\tilde{E}(\Delta w) = \sum_i \left[ e_i^2 + 2 e_i J_i \Delta w + J_i^2 \Delta w^2 \right]$$

3 항으로 정리:

$$\tilde{E}(\Delta w) = a + 2 b \cdot \Delta w + c \cdot \Delta w^2$$

여기서:

$$a = \sum_i e_i^2, \qquad b = \sum_i e_i J_i, \qquad c = \sum_i J_i^2$$

| 계수 | 식 | 의미 |
|---|---|---|
| $a$ | $\sum e_i^2$ | 현재 SSE = $E(w_n)$ (상수) |
| $b$ | $\sum e_i J_i$ | 그래디언트 절반 ($G = 2b$) |
| $c$ | $\sum J_i^2$ | 헤시안 절반 ($H = 2c$, GN 근사) |

### Step 3. $\Delta w$ 로 미분

$$\frac{d \tilde{E}}{d (\Delta w)} = 2 b + 2 c \cdot \Delta w$$

### Step 4. = 0 (극값 조건, 포물선 바닥)

$$2 b + 2 c \cdot \Delta w = 0$$

→ **정규방정식**:

$$\boxed{c \cdot \Delta w = -b}$$

또는 $G, H$ 표기로:

$$H \cdot \Delta w = -G$$

### Step 5. $\Delta w$ 풀기

$$\boxed{\Delta w = -\frac{b}{c} = -\frac{G}{H}}$$

→ **포물선 바닥의 위치** = 한 걸음의 크기/방향.

### Step 6. 업데이트

$$w_{n+1} = w_n + \Delta w = w_n - \frac{G}{H}$$

→ **다음 위치**.

### 우리 데이터로 ($w_n = 1.5$)

| 양 | 값 |
|---|---|
| $a = \sum e_i^2$ | 0.302 |
| $b = \sum e_i J_i$ | 0.116 |
| $c = \sum J_i^2$ | 0.0608 |
| $\Delta w = -b/c$ | $-1.91$ |
| $w_{n+1} = 1.5 + (-1.91)$ | $-0.41$ |

→ **이게 보라 점의 위치**.

### 흐름도

```
잔차 1차 테일러 (Section 5)
        e(w_n + Δw) ≈ e(w_n) + J·Δw
                ↓
        SSE 에 대입 ([·]² 합)
                ↓
        a + 2b·Δw + c·Δw²  (Δw 의 이차함수)
                ↓
        미분: 2b + 2c·Δw
                ↓
        = 0 (포물선 바닥 조건)
                ↓
        Δw = -b/c = -G/H  ★ 한 걸음
                ↓
        w_{n+1} = w_n + Δw
                ↓
        반복 (새 w_n 에서 처음부터)
```

### 보충: 두 가지 표기 — 원소별 합 vs 벡터 내적

위의 $a, b, c$ 는 **원소별 합** 으로 썼지만, 같은 식을 **벡터 내적** 으로도 쓸 수 있음. 다변수로 갈 때 자연스러운 일반화 형태.

#### 잔차 / 자코비안 벡터

$$\mathbf{e} = \begin{bmatrix} e_1 \\ e_2 \\ \vdots \\ e_N \end{bmatrix}, \qquad \mathbf{J} = \begin{bmatrix} J_1 \\ J_2 \\ \vdots \\ J_N \end{bmatrix}$$

#### 같은 식, 두 표기

| 양 | 원소별 합 | 벡터 내적 |
|---|---|---|
| $a$ | $\sum_i e_i^2$ | $\mathbf{e}^T \mathbf{e} = \|\mathbf{e}\|^2$ |
| $b$ | $\sum_i e_i J_i$ | $\mathbf{e}^T \mathbf{J}$ |
| $c$ | $\sum_i J_i^2$ | $\mathbf{J}^T \mathbf{J} = \|\mathbf{J}\|^2$ |

→ **수학적으로 완전히 동일**, 단지 표기 방식 차이.

#### 왜 같은가 — 내적 정의 펼쳐보기

$$\mathbf{e}^T \mathbf{e} = \begin{bmatrix} e_1 & e_2 & \cdots & e_N \end{bmatrix} \begin{bmatrix} e_1 \\ e_2 \\ \vdots \\ e_N \end{bmatrix} = e_1^2 + e_2^2 + \cdots + e_N^2 = \sum_i e_i^2$$

→ 행렬곱 $(1 \times N) \times (N \times 1) = (1 \times 1)$ 정의 그대로.

#### 어느 걸 쓸까

| | 원소별 (loop) | 벡터 내적 |
|---|---|---|
| 코드 (JS for 루프) | 자연스러움 | 라이브러리 필요 |
| 코드 (numpy) | 느림 | **`e @ e` 한 줄** (빠름, 벡터화) |
| 다변수 확장 | 합 기호 늘어남 | **그대로 행렬로 일반화** ★ |

#### 우리 데모 코드 — 원소별 (방식 A)

```js
function sse(ww) {
  return residual(ww).reduce((s, e) => s + e * e, 0);
}
```

#### numpy 라면 — 벡터 내적 (방식 B)

```python
def sse(w):
    e = residual(w)         # numpy 배열
    return e @ e            # = np.dot(e, e) = np.sum(e**2)
```

#### 정규방정식의 벡터 표현

1D 의 정규방정식 $c \cdot \Delta w = -b$ 를 벡터로:

$$\boxed{(\mathbf{J}^T \mathbf{J}) \cdot \Delta w = -\mathbf{J}^T \mathbf{e}}$$

$w$ 가 벡터 $\mathbf{w}$ 가 되어도 **이 형태 그대로 작동**:

$$(\mathbf{J}^T \mathbf{J}) \cdot \Delta \mathbf{w} = -\mathbf{J}^T \mathbf{e}$$

→ **벡터 표기는 차원 확장에 자동 일반화**.

---

## 7. Newton 메서드 — E 를 직접 두 번 미분

> Gauss-Newton 의 $H = 2 \sum J_i^2$ 는 사실 **진짜 헤시안의 근사**.
>
> 진짜 2차 미분으로 갈 수도 있는데, 그게 **Newton 메서드**. 결과는 종종 비슷하지만 **위험성이 다름**.

### 진짜 헤시안 유도 — 단계별

#### 출발

$$E(w) = \sum_i e_i(w)^2$$

목표: $E'(w)$ (그래디언트), $E''(w)$ (헤시안) 를 직접 구하기.

---

#### 1차 미분 $E'(w)$

##### Step 1-1. 합 미분 (선형성)

$$E'(w) = \frac{d}{dw}\sum_i e_i^2 = \sum_i \frac{d}{dw}\left[e_i^2\right]$$

**보충: 왜 $\sum$ 을 미분 안으로 (또는 밖으로) 옮길 수 있나?**

미분의 **선형성** (linearity) 때문. 두 가지 기본 성질:

- **합 분리**: $(f + g)' = f' + g'$
- **상수 빼기**: $(c \cdot f)' = c \cdot f'$

합은 결국 여러 항의 더하기 → 위 규칙을 반복 적용:

$$\frac{d}{dw}\sum_i f_i(w) = \sum_i \frac{d}{dw} f_i(w) = \sum_i f_i'(w)$$

→ "**유한합과 미분은 서로 통과 가능**". 표기 편한 쪽으로 쓰면 됨.

##### Step 1-2. $\square^2$ 미분 (연쇄법칙)

$$\frac{d}{dw}\left[e_i^2\right] = 2 e_i \cdot \frac{d e_i}{dw} = 2 e_i \cdot J_i$$

여기서 $J_i = \dfrac{d e_i}{dw}$ — 우리가 Section 4 에서 구한 자코비안.

##### Step 1-3. 합치기

$$\boxed{E'(w) = 2 \sum_i e_i \cdot J_i = G}$$

→ Section 10 의 그래디언트와 동일. **이미 구한 결과**.

---

#### 2차 미분 $E''(w)$

$E'(w) = 2 \sum_i e_i \cdot J_i$ 를 한 번 더 $w$ 로 미분.

##### Step 2-1. 합 + 상수 분리

$$E''(w) = \frac{d}{dw}\left[2 \sum_i e_i \cdot J_i\right] = 2 \sum_i \frac{d}{dw}\left[e_i \cdot J_i\right]$$

##### Step 2-2. 곱 미분 규칙 (product rule)

각 항이 **두 함수의 곱** ($e_i$ 와 $J_i$) → 곱 미분 적용:

$$\frac{d}{dw}\left[e_i \cdot J_i\right] = \underbrace{\frac{d e_i}{dw}}_{= J_i} \cdot J_i + e_i \cdot \underbrace{\frac{d J_i}{dw}}_{= J_i'}$$

$$= J_i \cdot J_i + e_i \cdot J_i' = J_i^2 + e_i \cdot J_i'$$

여기서:
- $\dfrac{d e_i}{dw} = J_i$ (자코비안 정의)
- $J_i' = \dfrac{d J_i}{dw} = \dfrac{d^2 e_i}{dw^2}$ — **잔차의 2차 미분** (새 양!)

##### Step 2-3. 합치기

$$E''(w) = 2 \sum_i \left[ J_i^2 + e_i \cdot J_i' \right]$$

##### Step 2-4. 두 항으로 분리

$$\boxed{E''(w) = 2 \sum_i J_i^2 \;+\; 2 \sum_i e_i \cdot J_i'}$$

또는 라벨 붙여서:

$$E''(w) = \underbrace{2 \sum_i J_i^2}_{H_{\text{GN}} \text{ (GN 이 쓰는 부분)}} \;+\; \underbrace{2 \sum_i e_i \cdot J_i'}_{\text{GN 이 버리는 부분}}$$

---

#### 흐름 요약

```
E(w) = Σ eᵢ²
        ↓ d/dw (Step 1)
E'(w) = 2·Σ eᵢ·Jᵢ                    ← 그래디언트 G
        ↓ d/dw (Step 2)
        곱 미분: (eᵢ)'·Jᵢ + eᵢ·(Jᵢ)'
        = Jᵢ·Jᵢ + eᵢ·Jᵢ'
        ↓
E''(w) = 2·Σ Jᵢ² + 2·Σ eᵢ·Jᵢ'        ← 진짜 헤시안 H_true
        │           │
        └─ GN 사용  └─ GN 버림
```

### Newton vs Gauss-Newton

| | Newton | Gauss-Newton |
|---|---|---|
| $H$ | $E''(w)$ — **진짜 2차 미분** | $2 \sum J_i^2$ — **근사** |
| 추가 계산 | $J_i' = \frac{d^2 e_i}{dw^2}$ 필요 | $J_i$ 만 필요 |
| $H$ 부호 | **음수 가능** → 발산 위험 | **항상 양수** ($\sum J_i^2 \geq 0$) ✓ |
| 수렴 속도 | 빠름 (정확) | 거의 같음 (잔차 작을 때) |

### 우리 모델로 ($e_i = y_i - e^{-w t_i}$)

- $J_i = t_i e^{-w t_i}$
- $J_i' = -t_i^2 e^{-w t_i}$

진짜 헤시안:

$$E''(w) = 2 \sum_i t_i^2 e^{-2 w t_i} - 2 \sum_i e_i \cdot t_i^2 e^{-w t_i}$$

### 두 방법이 결과가 비슷한 이유 ★

> **잔차 $e_i$ 가 작으면** ($w$ 가 정답 근처) → 버린 항 ($\sum e_i \cdot J_i'$) 이 거의 0 → **Newton ≈ GN**.

| 상황 | $e_i$ | 버린 항 | Newton vs GN |
|---|---|---|---|
| **수렴 근처** | 작음 | ≈ 0 | **거의 동일** |
| **멀리 있음** | 큼 | 무시 못 함 | 차이 남 |
| **큰 잔차 문제** (모델이 데이터 못 맞춤) | 큼 (수렴해도) | 항상 큼 | GN 부정확 |

### 그럼 왜 GN 을 쓰나?

1. **$J_i'$ 계산 비쌈** — 모델이 복잡할수록 2차 미분은 폭발적
2. **$H$ 양수 보장** — $\sum J_i^2 \geq 0$ 이라 항상 내리막 (안전)
3. **Newton 의 음수 $H$** → 잘못된 방향으로 점프 (max 찾는 셈) → **발산**

> "**Gauss-Newton 은 Newton 보다 종종 더 잘 작동한다**" — 정확함을 약간 포기하고 안전성을 얻는 영리한 트릭.

### 의사 코드 (Newton)

```
INPUT:  데이터, 초기 w₀
PARAMS: max_iter

w ← w₀

for iter = 1 to max_iter:
    e_i  ← y_i − f(t_i; w)
    J_i  ← ∂f/∂w │_w
    J'_i ← ∂²f/∂w² │_w        // 추가 — 2차 미분

    G ← 2 · Σ e_i · J_i                       // 그래디언트
    H ← 2 · Σ J_i² + 2 · Σ e_i · J'_i         // 진짜 헤시안

    if H < 0:
        ⚠ 음수! 발산 위험 — 그래도 강행 (또는 break)

    Δw ← −G / H
    w  ← w + Δw

return w
```

### 데모로 확인

데모에서 알고리즘을 **Newton** 으로 선택하면:
- $w_n$ 가 정답 0.5 근처 → GN 과 거의 같은 점프
- $w_n = 5$ 같은 멀리 → **$H$ 가 음수가 될 수 있음** → 잘못된 방향 점프 → **발산**
- GN 은 분모 양수라 항상 옳은 방향 → 더 안전

→ "**왜 GN 을 쓰는가**" 가 시각적으로 한 번에 이해됨.

---

## 8. Levenberg-Marquardt (LM) — GN 의 안정 버전

### 왜 LM 이 필요한가

Section 6 의 Gauss-Newton 은 **초기값에 매우 민감**:
- $w_n$ 이 정답에서 멀면 → $J^TJ$ 작음 → $\Delta w$ 폭발 → 발산
- 우리 모델 ($e^{-wt}$) 의 경우 $w \geq 1.5$ 부터 위험

**해결**: $J^TJ$ 분모에 $\lambda$ 추가.

### LM 식

$$\boxed{\Delta w = -\frac{G}{H + \lambda} = -\frac{2 \sum e_i J_i}{2 \sum J_i^2 + \lambda}}$$

또는 더 간단히 (스케일 무시):

$$\Delta w = -\frac{\sum e_i J_i}{\sum J_i^2 + \lambda}$$

### $\lambda$ 의 효과

| $\lambda$ 값 | 동작 |
|---|---|
| **$\lambda = 0$** | 순수 GN (큰 점프, 위험) |
| **작음 ($\sim 10^{-4}$)** | 거의 GN (빠름) |
| **보통 ($\sim 1$)** | GN + GD 혼합 (안정) |
| **큼 ($\sim 100$)** | 거의 GD (작은 점프, 매우 안전) |
| **$\lambda \to \infty$** | 점프 = 0 (정지) |

→ **$\lambda$ 클수록 분모 큼 → 작은 점프 → 안전**.

### 적응형 $\lambda$ — 핵심 규칙

매 step 후 SSE 변화 평가:

```
시도: w_try = w_n + Δw  (현재 λ 로 계산)
                                         
       ↓                                  
                                          
SSE_after vs SSE_before 비교             
                                          
   ↓                    ↓                
 감소 (좋음)         증가 (나쁨)          
   ↓                    ↓                
 점프 수락 +         점프 거부 +          
 λ ÷ 10              λ × 10              
 ("GN 처럼 빨리")    ("GD 처럼 안전히")  
   ↓                    ↓                
 다음 iter           같은 w 유지          
```

### 의사 코드

```
INPUT:  데이터 (t_i, y_i), 모델 f(t; w), 초기 w₀
PARAMS: λ_init = 0.01, factor = 10, max_iter = 50, tol = 1e-8

w ← w₀
λ ← λ_init

for iter = 1 to max_iter:
    e_i ← y_i − f(t_i; w)              // 잔차
    J_i ← ∂f/∂w │_w                    // 자코비안
    
    G ← 2 · Σ e_i · J_i                 // 그래디언트
    H ← 2 · Σ J_i²                      // 헤시안 (GN 근사)
    
    Δw ← −G / (H + λ)                   // LM step
    w_try ← w + Δw                      // 시도값
    
    sse_before ← Σ e_i²
    sse_after  ← Σ (y_i − f(t_i; w_try))²
    
    if sse_after < sse_before:           // 좋아짐
        w ← w_try                       // 수락
        λ ← max(λ / factor, λ_min)      // 더 빨리
    else:                                // 나빠짐
        // w 유지 (거부)
        λ ← min(λ × factor, λ_max)      // 더 안전히
    
    if |Δw| < tol:
        break                            // 수렴

return w
```

### 우리 데모 코드 (실제)

```js
function gaussNewtonStep() {
  const result = computeNext(w);  // Δw = -G/(H+λ)
  const wTry = result.wNext;
  const sseBefore = sse(w);
  const sseAfter = sse(wTry);
  
  if (useLM) {
    if (sseAfter < sseBefore) {
      w = wTry;                          // 수락
      lambda = Math.max(lambda / 10, 1e-7);
    } else {
      // 거부 (w 유지)
      lambda = Math.min(lambda * 10, 1e10);
    }
  } else {
    // GN: 무조건 점프
    w = wTry;
  }
}
```

### 왜 이 규칙이 좋나

> "**잘 되면 더 빨리, 안 되면 더 조심**" 의 자동 메타-학습.

- **GN 빠름** + **GD 안전성** **자동 균형**
- 사용자가 $\lambda$ 손볼 필요 없음
- 거의 모든 비선형 최소제곱에 작동

### LM = 비선형 최소제곱의 표준

| 알고리즘 | 사용 빈도 (실무) |
|---|---|
| **LM** | **80%** ★ |
| Trust Region | 10% |
| GN | 5% (잔차 작을 때) |
| Newton (직접) | 1% (헤시안 비쌈) |
| 기타 | 4% |

→ **scipy.optimize.curve_fit, MATLAB lsqnonlin, OpenCV solvePnP** 등 모두 LM.

### 데모 활용법

브라우저에서:
1. **알고리즘 → "LM" 선택**
2. 슬라이더 → $w = 2.0$ (GN 으로는 발산하던 값)
3. ▶ 1 Step → 안전한 점프 + $\lambda$ 자동 조절 확인
4. ⏵ Auto → 수렴 보장

→ "**$w = 2$ 부터도 수렴**" 직접 체험.

### 50년 표준 (Marquardt 1963)

> Donald Marquardt, "An algorithm for least-squares estimation of nonlinear parameters" (1963)
>
> 60년 넘게 사실상 표준 알고리즘 — 거의 모든 비선형 fitting 라이브러리의 기본.

---

## 9. Dogleg — Trust Region 방식

### 발상

LM 과 같은 동기 (GN 의 큰 점프 길들이기) 지만 다른 접근:

> **"한 step 에 못 가는 최대 거리 $\Delta$ 를 정해놓고, 그 안에서만 움직여라"**

이 영역을 **신뢰 영역 (Trust Region)** 이라 부름 — 2차 근사 (포물선) 를 **얼마나 신뢰할 수 있는지** 의 범위.

```
        포물선 근사 (wₙ 근처에서만 정확)
         ___
        /   \
   ____/     \____   ← 실제 SSE
        ↑
     wₙ ± Δ
   ←─────────→
   신뢰할 수 있는 영역
```

### 1D 에서의 단순화

원래 Dogleg 는 GN 방향 ($-H^{-1}G$) 과 Cauchy 방향 ($-G$) 을 **꺾어서** 잇는 곡선 (개 다리 모양) 이지만, **1D 에서는 두 방향이 같은 직선**. 따라서:

$$\Delta w = \begin{cases} -G/H & \text{if } |{-G/H}| \leq \Delta \quad\text{(GN 그대로)} \\ \pm \Delta & \text{otherwise} \quad\text{(반경 끝까지만)} \end{cases}$$

→ "**GN 스텝을 신뢰 반경으로 자르기**".

### $\Delta$ 적응 — 핵심 규칙

매 step 후 **신뢰도 비율** $\rho$ 측정:

$$\rho = \frac{\text{실제 SSE 감소}}{\text{2차 근사가 예측한 감소}} = \frac{E(w_n) - E(w_n + \Delta w)}{Q(0) - Q(\Delta w)}$$

| $\rho$ 값 | 의미 | $\Delta$ 갱신 |
|---|---|---|
| $\rho > 0.75$ | 예측 잘 맞음 | $\Delta \times 2$ (더 과감하게) |
| $0.25 \leq \rho \leq 0.75$ | 그럭저럭 | $\Delta$ 유지 |
| $\rho < 0.25$ | 예측 빗나감 | $\Delta \div 4$ (보수적으로) |
| $\rho \leq 0$ | SSE 증가 | **스텝 거부** + $\Delta \div 4$ |

→ "**잘 맞으면 더 믿어도 됨, 빗나가면 영역 좁히기**".

### 의사 코드

```
INPUT:  데이터 (t_i, y_i), 모델 f, 초기 w₀
PARAMS: Δ_init = 1.0, max_iter = 50

w ← w₀
Δ ← Δ_init

for iter = 1 to max_iter:
    e_i ← y_i − f(t_i; w)
    J_i ← ∂f/∂w │_w
    G ← 2 · Σ e_i · J_i
    H ← 2 · Σ J_i²

    Δw_GN ← −G / H                         // 순수 GN 후보

    if |Δw_GN| ≤ Δ:
        Δw ← Δw_GN                          // 안전 영역 안 → 그대로
    else:
        Δw ← sign(Δw_GN) · Δ                // 반경 끝까지만

    w_try ← w + Δw

    // 신뢰도 측정
    actual    ← SSE(w) − SSE(w_try)
    predicted ← Q(0)  − Q(Δw)               // 2차 근사 예측
    ρ ← actual / predicted

    // Δ 갱신
    if ρ > 0.75:  Δ ← min(Δ × 2, Δ_max)
    elif ρ < 0.25: Δ ← max(Δ / 4, Δ_min)

    // 스텝 채택 여부
    if ρ > 0:
        w ← w_try                           // 수락
    // else: 거부 (w 유지)
```

### LM vs Dogleg — 같은 목표, 다른 방법

| | **LM** | **Dogleg** |
|---|---|---|
| 어떻게 막나 | Hessian 에 $\lambda$ 더해 분모 키움 | $\Delta w$ 거리 자르기 |
| 파라미터 | $\lambda$ (damping) | $\Delta$ (trust radius) |
| 적응 신호 | SSE ↑/↓ → $\lambda \times 10 / \div 10$ | $\rho$ → $\Delta \times 2 / \div 4$ |
| 수식 | $\Delta w = -G/(H + \lambda)$ | $\Delta w = \text{clip}(-G/H, \pm \Delta)$ |
| 직관 | "Hessian 보강" | "신뢰 영역 안에서만" |
| 개발 | Marquardt 1963 | Powell 1970 |

결과는 거의 같음. **trust region 의 "영역" 개념이 더 직관적** 이라 교과서에서 자주 사용.

### 데모 활용법

브라우저에서:
1. **알고리즘 → "Dogleg" 선택**
2. 슬라이더 → $w = 5.0$ (GN 발산하던 값)
3. 하단 캔버스에 **청록색 띠** = $[w_n - \Delta, w_n + \Delta]$ 신뢰 영역
4. ▶ 1 Step → **빨간 점은 띠 안에서만 보라 점으로 이동**
5. $\rho$ 값과 $\Delta$ 변화 ("ρ=0.92 > 0.75 → Δ ×2") 확인
6. 띠가 점점 커지며 가속 수렴 관찰

### 어디서 쓰이나

- `scipy.optimize.minimize(method='dogleg')`
- `scipy.optimize.least_squares(method='dogbox')` — bounds 있는 버전
- 일부 SLAM/번들조정 솔버

LM 과 동급의 robustness, 구현은 살짝 더 복잡 (예측 감소량 계산 필요).

---

## 10. 그래디언트 G — 보충 설명

### 정의

$$G = \frac{dE}{dw} = E'(w)$$

→ **SSE 함수를 $w$ 로 한 번 미분** = 그 점의 **기울기**.

### 유도 (연쇄법칙 + 위에서 구한 $J$)

#### Step 1. 합 미분

$$\frac{dE}{dw} = \sum_i \frac{d}{dw}\left[e_i^2\right]$$

#### Step 2. $\square^2$ 미분 (연쇄법칙) — "2" 가 등장하는 이유

$$\frac{d}{dw}\left[e_i^2\right] = 2 e_i \cdot \frac{d e_i}{dw} = 2 e_i \cdot J_i$$

→ **앞서 구한 $J_i$ 사용**.

#### Step 3. 합치기

$$\boxed{G = 2 \sum_i e_i \cdot J_i = 2 \sum_i e_i \cdot t_i \cdot e^{-w t_i}}$$

### 의미

| $G$ 부호 | 의미 | 다음 행동 |
|---|---|---|
| **$G > 0$** | 우측으로 갈수록 SSE 증가 | $w$ **줄이기** |
| **$G < 0$** | 좌측으로 갈수록 SSE 증가 | $w$ **늘리기** |
| **$G \approx 0$** | 거의 평평 | **이미 최저점** ✓ |

### 어디 쓰이나

| 용도 | 식 |
|---|---|
| **접선** (시각화) | $y = E(w_n) + G \cdot (w - w_n)$ |
| **포물선 1차 항** | $Q(w) = E(w_n) + G \cdot \Delta w + \tfrac{1}{2} H \cdot \Delta w^2$ |
| **Gauss-Newton 한 걸음** | $\Delta w = -G/H$ |
| **수렴 판정** | $G \approx 0$ 이면 멈춤 |

### 코드 (간단)

```js
function sseGradient(w) {
  const e = residual(w);   // 잔차 5개
  const J = jacobian(w);   // 자코비안 5개 (= tᵢ·e^(-w·tᵢ))
  let g = 0;
  for (let i = 0; i < J.length; i++) g += e[i] * J[i];
  return 2 * g;            // G = 2·Σ eᵢ·Jᵢ
}
```

→ 위 데모의 🟧 **접선 기울기** = 이 $G$ 값.

---

## 11. 인터랙티브 데모

<div id="nonlinear-fitting-1d-demo"></div>
<script src="/assets/posts/2026-04-29-nonlinear-fitting-1d.js"></script>

### 보이는 것 (위 그래프 — t, y)

**모델 식**:

$$\hat{y}(t) = e^{-w \cdot t}$$

| 색상 | 의미 | 식 |
|---|---|---|
| 🔵 데이터 점 | 노이즈 포함 관측값 | yᵢ |
| 🔴 **현재 곡선** | 현재 wₙ 으로 그린 모델 | y = e^(−wₙ·t) |
| 🟢 **다음 곡선** | 한 걸음 후 wₙ₊₁ 의 모델 | y = e^(−wₙ₊₁·t) |
| 🟧/🟦 잔차 점선 | 데이터 − 예측 | eᵢ = yᵢ − e^(−w·tᵢ) |

### 보이는 것 (아래 그래프 — w, SSE) ★ 핵심

| 색상 | 의미 |
|---|---|
| 🔵 **실제 SSE(w) 곡선** | 비선형 (전체 풍경) |
| 🟧 **접선** | 현재 wₙ 에서의 그래디언트 (기울기) |
| 🟣 **이차근사 포물선** | wₙ 기준 Taylor 1차의 SSE 형태 |
| 🟣 **보라 점** | 포물선 바닥 = wₙ₊₁ (∂Q/∂w = 0 인 점) |
| 🟢 작은 점 | 그 위치의 실제 SSE (비교) |
| 🔵 **화살표** | Δw — 한 걸음의 방향 + 크기 |

### 조작

- **w 슬라이더**: 초기값 설정
- **▶ 1 Step**: Gauss-Newton 한 번
- **⏵ Auto**: 수렴까지 자동 반복
- **↻ Reset**: 슬라이더 값으로 복귀
- **아래 그래프 클릭**: 그 위치로 reset

---

## 12. 한 그래프에서 보이는 것 — 모든 핵심 개념

```
SSE(w) 곡선 (🔵 실제, 비선형)              
     │                                      
     │ ╲                                    
     │  ╲                                   
     │   ╲      ╱                           
     │    ╲    ╱                            
     │     ╲══╱  ← 🟣 이차근사 포물선        
     │      ╳                                
     │     ╱│╲                              
     │    ╱ │ ╲                             
     │   ╱  │  ●  ← 🟣 보라 점 (= 포물선 바닥)
     │  ╱   │ ╱                             
     │ ╱    │╱                              
     │╱     ●  ← 🔴 현재 wₙ                  
     │      │   ↘ 🟧 접선 (기울기 = G)      
     │      │                                
     └──────────→ w                         
            ↑                               
        wₙ → wₙ₊₁                           
        (Δw 만큼 점프)                       
```

### 모든 개념이 한 그래프에:

1. **🔵 실제 SSE(w)** — 비선형 풍경
2. **🔴 현재 wₙ** — 시작점
3. **🟧 접선** — 그래디언트 시각화
4. **🟣 이차근사 포물선** — Gauss-Newton 의 시야
5. **🟣 보라 점** — **미분 = 0 인 점** = 포물선 바닥 = $w_{n+1}$
6. **🔵 화살표** — 한 걸음 (Δw)

---

## 13. 핵심 직관 — 미분 = 0

### 파라볼라 식 (이차근사)

$w_n$ 에서:

$$Q(w) = E(w_n) + G \cdot (w - w_n) + \frac{1}{2} H \cdot (w - w_n)^2$$

- $G = E'(w_n)$ — 접선 기울기
- $H \approx \sum J_i^2$ — 곡률 (Gauss-Newton 근사)

### 미분 = 0

$$\frac{dQ}{dw} = G + H \cdot (w - w_n) = 0$$

$$\Rightarrow \;\; w_{n+1} = w_n - \frac{G}{H}$$

→ **$\Delta w = -G/H$** = "기울기 / 곡률" 만큼 이동.

### 시각적

```
포물선 ∪                                    
   ╲      ╱                                  
    ╲    ╱  ← 어디든 미분 ≠ 0                
     ╲  ╱                                    
      ╲╱                                     
       ●  ← 미분 = 0 (수평 접선)             
       ↑                                     
       바닥 = wₙ₊₁                            
```

---

## 14. 1D vs 다변수 — 같은 원리

| | 1D (지금) | 다변수 |
|---|---|---|
| 변수 | $w$ 1개 | $\mathbf{w}$ 벡터 |
| SSE | 1D 곡선 | 그릇 (다차원) |
| 이차근사 | 포물선 | 포물면 |
| 미분=0 점 | 한 점 ($w_{n+1}$) | 한 점 ($\mathbf{w}_{n+1}$) |
| Δw | 숫자 | 벡터 |
| 정규방정식 | $H \Delta w = -G$ (스칼라) | $J^T J \Delta\mathbf{w} = -J^T \mathbf{e}$ (행렬) |

→ **본질 동일**, 차원만 확장.

---

## 15. 실험 추천

브라우저에서:

### 실험 1: 가까운 곳에서 시작
- 슬라이더 0.7 → "1 Step"
- 🟣 (이차근사) 와 🔵 (실제) 거의 일치
- 한 걸음에 거의 정답 도달

### 실험 2: 멀리서 시작
- 슬라이더 2.0 → "1 Step"
- 🟣 와 🔵 차이 보임 (비선형)
- 여러 iter 필요

### 실험 3: 매우 작은 값
- 슬라이더 0.1 → "Auto"
- $w$ 가 0 근처 → 수렴 어려움 (자코비안 약함)

### 실험 4: 클릭으로 시작점 바꾸기
- 아래 그래프 어디든 클릭 → 그 $w$ 로 reset
- 다양한 시작점에서 수렴 비교

---

## 16. 다음 단계

이 1D 직관이 잡히면 → [2D (다변수) 데모](nonlinear_fitting_visualization.md) 로 확장.

핵심 차이:
- 1D: 곡선 + 포물선 (한 평면)
- 2D: 그릇 + 포물면 (3D 공간 또는 2D 등고선)

**원리는 같음**: 현재 위치에서 이차근사 → 그 바닥으로 점프 → 반복.
