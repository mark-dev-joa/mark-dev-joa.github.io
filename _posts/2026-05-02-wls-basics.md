---
title: Part 2·3 가중 최소제곱 (WLS)
description: Stage 2 의 가정 (모든 점이 같은 노이즈) 을 풀어준 자연스러운 다음 단계. 점마다 다른 σᵢ 인정하면 가중 SSE 가 자연 등장.
author: mark
date: 2026-05-01 23:00:00 +0900
categories: [math, optimization]
tags: [wls, weighted-least-squares, mle, gaussian, sigma, outlier, sensor-fusion]
math: true
---

# WLS — 가중 최소제곱 (Weighted Least Squares)

> Stage 2 의 가정 ("모든 점이 같은 노이즈") 을 풀어준 자연스러운 다음 단계.
>
> "**점마다 다른 노이즈 신뢰도**" 를 인정하면 → 자연히 **가중 SSE** 등장.

---

## 📋 WLS 풀이 — MLE 7단계의 자연 확장

| # | 단계 | OLS (Stage 2) | **WLS (이 글)** |
|---|---|---|---|
| 1 | 모델 정의 | $\hat{y}_i = f(t_i; w)$ | (동일) |
| 2 | **확률 가정** | $y_i \sim \mathcal{N}(\hat{y}_i, \sigma^2)$ — 모두 같음 | $y_i \sim \mathcal{N}(\hat{y}_i, \sigma_i^2)$ — **점마다 다름** ★ |
| 3 | Likelihood | $L = \prod_i P(y_i \mid w)$ | (동일, σ → σᵢ) |
| 4 | log 적용 | $\ell = \log L$ | (동일) |
| 5 | **손실 함수 도출** | $\text{SSE} = \sum r_i^2$ | $\text{WLS} = \sum w_i r_i^2$, $w_i = 1/\sigma_i^2$ ★ |
| 6 | 알고리즘 | $(J^T J)\Delta w = -J^T \mathbf{e}$ | $(J^T \mathbf{W} J)\Delta w = -J^T \mathbf{W} \mathbf{e}$ ★ |
| 7 | **다리 등식** | $\arg\max \ell = \arg\min \text{SSE}$ | $\arg\max \ell = \arg\min \text{WLS}$ |

> **변하는 건 단계 2, 5, 6 의 가중치 $w_i$ 추가** 만.
> 나머지 단계 (1, 3, 4, 7) 는 OLS 와 완전히 동일.
>
> $\sigma_i$ 모두 같으면 자동으로 OLS 로 환원 (특수 케이스).

핵심 등식:

$$\ell(w) = C - \frac{1}{2}\sum_i \frac{r_i^2}{\sigma_i^2}$$

→ ℓ 최대화 = **가중 SSE 최소화** = WLS

---

## 1. 출발점 — Stage 2 의 가정 다시 보기

지난 글 (MLE = SSE) 의 설정을 복습:

**모델** (1D 비선형 회귀):

$$\hat{y}_i = \hat{y}(t_i; w) = e^{-w t_i}$$

→ 모델이 $t_i$ 에서 예측하는 값. 파라미터 $w$ 의 함수.

**노이즈 가정** (Stage 2):

$$y_i = \hat{y}_i + \epsilon_i, \quad \epsilon_i \sim \mathcal{N}(0, \sigma^2) \quad\text{(모든 } i \text{ 동일)}$$

또는 같은 말로:

$$y_i \sim \mathcal{N}(\hat{y}_i, \sigma^2)$$

→ MLE 풀이 결과: **SSE 최소화** = $\sum (y_i - \hat{y}_i)^2$

### 이 가정의 한계

실제 측정에서 자주 깨지는 가정:

- **여러 다른 센서** 를 섞은 경우 — 각각 정밀도 다름
- **시간이 지나며 측정 환경 변화** — 어떤 시점은 정확, 어떤 시점은 부정확
- **outlier (이상치)** 한두 점 — 같은 가중치 주면 안 됨

→ "모든 점 평등" 이 항상 맞지 않음.

---

## 2. 새 가정 — 점마다 다른 σᵢ

**Heteroscedasticity** (이질분산):

$$y_i \sim \mathcal{N}(\hat{y}_i, \sigma_i^2)$$

> **where** $\hat{y}_i = e^{-w t_i}$ (모델 예측값, 분포의 평균)

각 점마다 자기만의 분산 $\sigma_i^2$.

| 점 | 의미 |
|---|---|
| $\sigma_i$ 작음 | 정밀한 측정 — **신뢰** |
| $\sigma_i$ 큼 | 부정확한 측정 — **덜 신뢰** |

### 시각적

```
y                                                  
│                                                  
│   ╭╮  ← 작은 σ₁ (좁은 종, 정확한 측정)         
│   ●                                              
│                                                  
│       ╭───╮  ← 큰 σ₂ (넓은 종, 부정확)           
│       ╱   ╲                                      
│       ●                                          
│                                                  
│           ╭╮  ← 작은 σ₃                          
│           ●                                      
└────────────→ t                                  
```

각 점 위의 **종 크기 (= 1/신뢰도)** 가 점마다 다름.

---

## 3. Likelihood 와 log-likelihood

### 출발 — 한 점의 가우시안 PDF

$$P(y_i \mid w) = \frac{1}{\sqrt{2\pi\sigma_i^2}} \cdot \exp\!\left(-\frac{r_i^2}{2\sigma_i^2}\right)$$

**두 부분의 곱**:
- $\dfrac{1}{\sqrt{2\pi\sigma_i^2}}$ — **정규화 항** ($\sigma$ 만 의존, $w$ 무관)
- $\exp\!\left(-\dfrac{r_i^2}{2\sigma_i^2}\right)$ — **지수 항** (잔차 $r_i$ 통해 $w$ 에 의존)

> **where**
> - $y_i$: 관측값 ($i$ 번째 데이터)
> - $\hat{y}_i = e^{-w t_i}$: 모델 예측값 ($w$ 의 함수)
> - $r_i = y_i - \hat{y}_i$: 잔차
> - $\sigma_i$: $i$ 번째 점의 노이즈 표준편차 (점마다 다름)

→ 가우시안 PDF 는 **두 부분의 곱**.

### 전체 데이터 likelihood — 곱

각 점 독립이라 곱:

$$L(w) = \prod_i P(y_i \mid w) = \prod_i \frac{1}{\sqrt{2\pi\sigma_i^2}} \cdot \exp\!\left(-\frac{r_i^2}{2\sigma_i^2}\right)$$

곱 분리 (정규화 항들의 곱 × 지수 항들의 곱):

$$L(w) = \left[\prod_i \frac{1}{\sqrt{2\pi\sigma_i^2}}\right] \cdot \left[\prod_i \exp\!\left(-\frac{r_i^2}{2\sigma_i^2}\right)\right]$$

→ 좌측 = **정규화 부분** (모든 $\sigma_i$ 정규화 항의 곱)
→ 우측 = **지수 부분** (모든 잔차 지수의 곱)

### log 취하기 — "곱 → 합"

$$\ell(w) = \log L(w) = \log\!\left[\prod_i \frac{1}{\sqrt{2\pi\sigma_i^2}}\right] + \log\!\left[\prod_i \exp\!\left(-\frac{r_i^2}{2\sigma_i^2}\right)\right]$$

#### 정규화 부분 정리

곱의 log = log 의 합:

$$\log\prod_i \frac{1}{\sqrt{2\pi\sigma_i^2}} = \sum_i \log\frac{1}{\sqrt{2\pi\sigma_i^2}} = \sum_i \left[-\frac{1}{2}\log(2\pi\sigma_i^2)\right]$$

$$= -\frac{1}{2}\sum_i \log(2\pi\sigma_i^2) \;\;\Leftarrow\;\;\boxed{C}$$

→ **C = 가우시안 정규화 항의 log 합**, $\sigma_i$ 만 의존, $w$ 와 무관.

#### 지수 부분 정리

$\log e^x = x$ 그대로:

$$\log\prod_i \exp\!\left(-\frac{r_i^2}{2\sigma_i^2}\right) = \sum_i \left(-\frac{r_i^2}{2\sigma_i^2}\right) = -\frac{1}{2}\sum_i \frac{r_i^2}{\sigma_i^2}$$

→ **데이터 부분** = $w$ 따라 변함 (잔차 $r_i$ 가 $w$ 의 함수).

### 합치기

$$\ell(w) = -\frac{1}{2}\sum_i \log(2\pi\sigma_i^2) \;\;-\;\; \frac{1}{2}\sum_i \frac{r_i^2}{\sigma_i^2}$$

→ 첫 항 = **C** ($w$ 무관 상수)
→ 둘째 항 = **데이터에 의존** (잔차 합)

자연스러운 분리.

$$\boxed{\ell(w) = C - \frac{1}{2}\sum_i \frac{r_i^2}{\sigma_i^2}}$$

> **where**
> - $r_i = y_i - \hat{y}_i$: $i$ 번째 잔차
> - $C = -\frac{1}{2}\sum_i \log(2\pi\sigma_i^2)$: $w$ 와 무관한 상수 (최적화에서 무시 가능)

### C 의 의미 — ℓ(w) 의 이론적 천장

위 식 구조 분석:

| 잔차 상태 | 두 번째 항 ($-\frac{1}{2}\sum r_i^2/\sigma_i^2$) | $\ell(w)$ |
|---|---|---|
| 모든 $r_i = 0$ (완벽 fit) | $0$ | **$C$** (최댓값 ★) |
| 잔차 작음 (좋은 fit) | 작은 음수 | $C$ 보다 살짝 작음 |
| 잔차 큼 (나쁜 fit) | 큰 음수 | $C$ 보다 훨씬 작음 |

**두 번째 항은 항상 $\leq 0$** (제곱들의 양의 합 × $-\frac{1}{2}$).

→ $\ell(w) \leq C$ **항상 성립**, 등호는 모든 잔차 = 0 일 때만.

![C 천장 시각화](/assets/img/posts/wls_c_ceiling.svg)

→ **C = "잔차 모두 0 이면 받는 점수"** = 함수가 도달 가능한 **최댓값**
→ 실제 정점은 C 바로 아래 (노이즈가 만드는 불가피한 거리)
→ MLE 풀이에는 영향 없음 — $w$ 와 무관해서 무시됨

---

## 4. 가중 SSE 등장 ★

ℓ 최대화 = 두 번째 항 최소화 → **가중 SSE**:

$$\boxed{\text{WLS}(w) = \sum_i \frac{r_i^2}{\sigma_i^2} = \sum_i w_i \cdot r_i^2, \qquad w_i = \frac{1}{\sigma_i^2}}$$

→ "각 잔차를 **분산의 역수** 로 가중".

### 직관

- $\sigma_i$ **작음** → $w_i = 1/\sigma_i^2$ **큼** → 그 점의 잔차 영향 **큼** → 모델이 그 점 더 신경 씀
- $\sigma_i$ **큼** → $w_i$ **작음** → 그 점의 잔차 영향 **작음** → 모델이 그 점 덜 신경 씀

> "**정밀한 측정에 더 가중치, 부정확한 측정에 덜 가중치**" 의 자연스러운 수학적 표현.

---

## 5. 정규방정식 유도 — 가중 버전

OLS 정규방정식 유도와 같은 흐름:
잔차 1차 테일러 근사 → 가중 SSE 에 대입 → 미분 → = 0.

### Step 1. 잔차 1차 테일러 근사

비선형 잔차 $e_i(w)$ 를 현재 $w_n$ 근처에서 직선으로 근사:

$$e_i(w_n + \Delta w) \approx e_i(w_n) + J_i(w_n) \cdot \Delta w$$

> **where**
> - $e_i(w_n)$: 현재 잔차 (상수)
> - $J_i = \dfrac{de_i}{dw}$: 자코비안 (현재 점에서 상수)
> - $\Delta w$: 변수 (얼마나 움직일까)

→ **$\Delta w$ 의 1차 함수** = 직선 (선형).

### Step 2. 가중 SSE 에 대입

선형화된 잔차를 가중 SSE 에 넣음 ($w_i = 1/\sigma_i^2$):

$$\widetilde{\text{WLS}}(\Delta w) = \sum_i w_i \cdot [e_i + J_i \Delta w]^2$$

### Step 3. 전개

각 항 제곱 풀어쓰기:

$$\widetilde{\text{WLS}} = \sum_i w_i \left[e_i^2 + 2 e_i J_i \Delta w + J_i^2 \Delta w^2\right]$$

세 부분으로 분리:

$$\widetilde{\text{WLS}} = \tilde{a} + 2\tilde{b}\cdot\Delta w + \tilde{c}\cdot\Delta w^2$$

여기서:

$$\tilde{a} = \sum_i w_i e_i^2, \qquad \tilde{b} = \sum_i w_i e_i J_i, \qquad \tilde{c} = \sum_i w_i J_i^2$$

→ $\Delta w$ 의 이차함수.

> **OLS 와 비교**
> - OLS: $a = \sum e_i^2$, $b = \sum e_i J_i$, $c = \sum J_i^2$
> - WLS: 모든 합 안에 **가중치 $w_i$ 추가**

### Step 4. $\Delta w$ 로 미분

$$\frac{d\widetilde{\text{WLS}}}{d(\Delta w)} = 2\tilde{b} + 2\tilde{c}\cdot\Delta w$$

### Step 5. = 0 (포물선 바닥)

$$2\tilde{b} + 2\tilde{c}\cdot\Delta w = 0$$

$$\tilde{c}\cdot\Delta w = -\tilde{b}$$

### Step 6. 풀기

$$\Delta w = -\frac{\tilde{b}}{\tilde{c}} = -\frac{\sum_i w_i e_i J_i}{\sum_i w_i J_i^2}$$

→ **각 합 안에 $w_i$ 가중치만 들어감**, 나머지는 OLS 와 동일.

#### 📘 Step 6.5 — 분수 형태에서 행렬 형태로

Step 6 의 **분수** 를 Step 7 의 **행렬 곱** 으로 변환하는 중간 과정:

##### (a) 분모를 좌변으로 (양변에 $\tilde{c}$ 곱)

$$\tilde{c} \cdot \Delta w = -\tilde{b}$$

합 표기로 풀어쓰면:

$$\left(\sum_i w_i J_i^2\right) \cdot \Delta w = -\sum_i w_i e_i J_i$$

→ 합 형태의 정규방정식.

##### (b) 합을 행렬 곱으로 변환

이전 (Step 7 박스) 에서 본 패턴:

$$\sum_i w_i J_i^2 = J^T W J, \qquad \sum_i w_i e_i J_i = J^T W \mathbf{e}$$

##### (c) 대입

$$\boxed{(J^T W J) \cdot \Delta w = -J^T W \mathbf{e}}$$

##### 세 형태 비교

| 형태 | 식 | 적용 |
|---|---|---|
| 분수 | $\Delta w = -\tilde{b}/\tilde{c}$ | 1D 만, 한 줄 풀이 |
| 합 | $\tilde{c}\Delta w = -\tilde{b}$ | 1D, 분리해서 보기 |
| 행렬 | $(J^T W J)\Delta w = -J^T W \mathbf{e}$ | **차원 자유** ★ |

##### 다변수에서는 행렬 형태 필수

$w$ 가 $n$ 차원이면 $\tilde{c}$ 가 $n \times n$ 행렬 → 나눗셈 불가 → **역행렬**:

$$\Delta \mathbf{w} = -(J^T W J)^{-1} \cdot J^T W \mathbf{e}$$

→ **1D 의 분수 → 다변수의 역행렬** 로 자연 일반화.

---

### Step 7. 행렬 표기

가중 대각 행렬 $W$:

$$W = \begin{bmatrix} w_1 & & \\ & w_2 & \\ & & \ddots \end{bmatrix} = \text{diag}\left(\frac{1}{\sigma_1^2}, \frac{1}{\sigma_2^2}, \ldots\right)$$

WLS 정규방정식:

$$\boxed{(J^T W J) \cdot \Delta w = -J^T W \mathbf{e}}$$

> **where**
> - $J^T W J = \tilde{c} = \sum_i w_i J_i^2$ — 가중 헤시안 (스칼라 1D / 행렬 다변수)
> - $J^T W \mathbf{e} = \tilde{b} = \sum_i w_i e_i J_i$ — 가중 그래디언트 절반

#### 📘 유도 — Step 6 의 합 → Step 7 의 행렬

3점 예 ($N=3$) 로 명시:

**잔차 벡터** ($N \times 1$), **자코비안 벡터** ($N \times 1$), **가중 행렬** ($N \times N$ 대각):

$$\mathbf{e} = \begin{bmatrix} e_1 \\ e_2 \\ e_3 \end{bmatrix}, \quad \mathbf{J} = \begin{bmatrix} J_1 \\ J_2 \\ J_3 \end{bmatrix}, \quad W = \begin{bmatrix} w_1 & 0 & 0 \\ 0 & w_2 & 0 \\ 0 & 0 & w_3 \end{bmatrix}$$

##### 변환 1: $J^T W \mathbf{e}$ → 합 형태

(a) $W \mathbf{e}$ 먼저 (대각이라 단순 곱):

$$W \mathbf{e} = \begin{bmatrix} w_1 e_1 \\ w_2 e_2 \\ w_3 e_3 \end{bmatrix}$$

(b) $J^T$ 와 내적 ($1 \times N$ × $N \times 1$ = 스칼라):

$$J^T (W \mathbf{e}) = \begin{bmatrix} J_1 & J_2 & J_3 \end{bmatrix} \begin{bmatrix} w_1 e_1 \\ w_2 e_2 \\ w_3 e_3 \end{bmatrix} = J_1 w_1 e_1 + J_2 w_2 e_2 + J_3 w_3 e_3$$

순서 정리:

$$= \sum_i w_i e_i J_i \;\checkmark$$

##### 변환 2: $J^T W J$ → 합 형태

(a) $W J$:

$$W J = \begin{bmatrix} w_1 J_1 \\ w_2 J_2 \\ w_3 J_3 \end{bmatrix}$$

(b) $J^T$ 와 내적:

$$J^T (W J) = J_1 w_1 J_1 + J_2 w_2 J_2 + J_3 w_3 J_3 = \sum_i w_i J_i^2 \;\checkmark$$

##### 핵심 패턴

$\sum_i a_i b_i$ 형태 = **벡터 내적** $\mathbf{a}^T \mathbf{b}$.

가중치 추가:

$$\sum_i w_i a_i b_i = \mathbf{a}^T W \mathbf{b}, \quad W = \text{diag}(w_i)$$

→ "**합 안에 곱이 있으면 행렬로 압축 가능**".

##### 차원 직관

$$J^T \cdot W \cdot \mathbf{e} = \text{스칼라}$$

각 항 차원:

| 항 | 차원 |
|---|---|
| $J^T$ | $1 \times N$ (행벡터) |
| $W$ | $N \times N$ (대각) |
| $\mathbf{e}$ | $N \times 1$ (열벡터) |
| 결과 | $1 \times 1$ (스칼라) |

→ "$W$ 가 가운데 — **가중 후 내적**" 구조.

##### 다변수로 확장

$w$ 가 $n$ 차원 벡터면:
- $J$: $N \times n$ 행렬 (Jacobian)
- $J^T W J$: $n \times n$ 행렬 (가중 헤시안)
- $J^T W \mathbf{e}$: $n \times 1$ 벡터 (가중 그래디언트)

→ **식 형태 그대로**, 차원만 확장. 이게 행렬 표기의 위력.

### OLS 와 비교

| | OLS | WLS |
|---|---|---|
| 정규방정식 | $(J^T J)\Delta w = -J^T \mathbf{e}$ | $(J^T \mathbf{W} J)\Delta w = -J^T \mathbf{W} \mathbf{e}$ |
| 헤시안 | $\sum J_i^2$ | $\sum w_i J_i^2$ |
| 그래디언트 절반 | $\sum e_i J_i$ | $\sum w_i e_i J_i$ |
| Δw | $-\dfrac{\sum e_i J_i}{\sum J_i^2}$ | $-\dfrac{\sum w_i e_i J_i}{\sum w_i J_i^2}$ |

→ **모든 합 안에 $w_i$ 만 끼워넣음**.
→ $W = I$ (모두 같은 가중치) 이면 자동으로 OLS.

### 한 줄 통찰

> **OLS = WLS 의 특수 케이스** (W = I).
>
> 유도 흐름은 **완전히 동일** — 가중치 $w_i$ 만 모든 합에 끼워넣음.

---

## 6. 우리 데이터에 적용 — 한 점에 outlier 가정

기존 5점 데이터:

| $t_i$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $y_i$ | 1.05 | 0.55 | 0.41 | **5.0** ⚠ | 0.19 |

$y_3 = 5.0$ 이 outlier (원래 0.22 인데 측정 오류).

### OLS (모든 가중치 같음)

$\sigma_i = 0.1$ 가정 (모두):

$$\text{SSE}(0.5) = (0.05)^2 + (-0.06)^2 + (0.04)^2 + (4.55)^2 + (0.05)^2 \approx 20.7$$

→ outlier 한 점 $(4.55)^2 = 20.7$ 가 SSE 의 대부분 차지.

→ outlier 한 점이 SSE 의 **99% 차지** → 모델 fit 그쪽으로 끌림.

### WLS (outlier 에 큰 σ)

$\sigma_3 = 5.0$ (outlier 알고 있음), 나머지 $\sigma_i = 0.05$:

| 점 | $r_i^2$ | $\sigma_i^2$ | $r_i^2/\sigma_i^2$ |
|---|---|---|---|
| 1 | 0.0025 | 0.0025 | 1.0 |
| 2 | 0.0036 | 0.0025 | 1.4 |
| 3 | 0.0016 | 0.0025 | 0.6 |
| 4 (outlier) | **20.7** | **25** | **0.83** |
| 5 | 0.0030 | 0.0025 | 1.2 |

→ outlier 의 기여가 **0.83** 으로 다른 점들과 비슷한 수준 → **모델이 끌리지 않음**.

→ outlier 영향 **자동 무력화**.

---

## 7. σᵢ 는 어디서 알아내나?

WLS 풀려면 **각 σᵢ 알고 있어야** 함. 실무 방법들:

### 방법 1. **센서 스펙시트**
- 다른 센서 섞을 때: 각 센서 정밀도 정의됨
- 예: GPS σ ≈ 5m, IMU 가속도 σ ≈ 0.1 m/s²

### 방법 2. **사전 측정**
- 같은 환경에서 여러 번 재서 표준편차 직접 측정
- $\sigma_i = \text{stddev}(\text{재측정 결과})$

### 방법 3. **잔차로부터 추정** (반복법)
1. OLS 로 일단 풀이
2. 잔차 $r_i$ 살펴봄
3. 큰 잔차 → 큰 σᵢ 라고 가정
4. WLS 로 다시 풀이
5. 반복

→ **IRLS (Iteratively Reweighted Least Squares)** — robust regression 의 기반.

### 방법 4. **모델링** (heteroscedastic regression)
- $\sigma_i$ 가 $t_i$ 의 함수라고 가정 (예: $\sigma_i = a + b \cdot t_i$)
- 별도 모델로 $\sigma$ 추정

---

## 8. 응용 1 — Outlier 처리 (Robust Regression)

**문제**: outlier 한 점이 OLS 답을 크게 왜곡.

**WLS 해결**:
- outlier 식별 → 큰 σᵢ 부여 → WLS
- 또는 IRLS 로 자동 식별

**다른 robust 손실들** (사실 모두 WLS 의 일종):

| 손실 | 가중치 함수 | 특징 |
|---|---|---|
| **OLS** | $w_i = 1$ | outlier 에 약함 |
| **Huber** | $w_i = 1$ if $|r| < c$, else $c/|r|$ | 작은 잔차 = OLS, 큰 잔차 = LAD |
| **Tukey biweight** | $w_i = (1 - (r/c)^2)^2$ if $|r| < c$, else 0 | 큰 outlier 완전 무시 |
| **L1 / LAD** | $w_i = 1/|r_i|$ | 라플라스 노이즈 가정의 MLE |

→ **모두 IRLS 로 풀이 가능** — 가중치만 다른 WLS.

---

## 9. 응용 2 — 센서 퓨전

여러 센서 결합 시 자연스러운 framework:

### 예: 위치 추정 (GPS + IMU)

| 센서 | 측정값 | σ |
|---|---|---|
| GPS | 위치 (5초 간격) | 5m |
| IMU | 가속도 (0.01초 간격) | 0.1 m/s² → 적분하면 위치 σ 시간에 따라 증가 |

### WLS 융합

GPS 측정에 대한 잔차 합 + IMU 측정에 대한 잔차 합:

$$\text{Total cost} = \sum_{i \in \text{GPS}} w_i^G (y_i - \hat{y}_i)^2 + \sum_{j \in \text{IMU}} w_j^I (y_j - \hat{y}_j)^2$$

> **where**
> - $w_i^G = 1/\sigma_G^2$ — GPS 가중치 (작음, 큰 σ)
> - $w_j^I = 1/\sigma_I^2(t)$ — IMU 가중치 (시간 따라 변함)

→ 정확한 GPS 측정에 큰 가중치, 누적 오차 큰 IMU 에 작은 가중치.

→ **칼만 필터** 의 핵심도 이거 (가중치가 시간에 따라 변하는 WLS).

---

## 10. 인터랙티브 데모

<div id="wls-demo"></div>
<script src="/assets/posts/2026-04-29-wls-basics.js"></script>

### 보이는 것

| 색상 | 의미 |
|---|---|
| 🔵 데이터 점 | 5 점 + outlier 옵션 |
| 점 위 종 모양 | 각 점의 $\sigma_i$ (가중치 시각) |
| 🔴 OLS fit | 모든 점 같은 가중치 |
| 🟢 WLS fit | σᵢ 적용한 가중 |

### 조작
- **각 점의 σᵢ 슬라이더** — 가중치 직접 조정
- **outlier 토글** — y₄ = 5.0 으로 만들어보기
- **OLS vs WLS 비교** — 한 화면에 두 곡선

### 실험 추천
1. outlier 추가 → OLS 가 그쪽으로 휘는 것
2. outlier 점의 σ 키움 → WLS 는 무시 → 다른 점들에 잘 맞춤
3. 모든 σ 같게 → WLS = OLS (확인)

---

## 11. MLE 위계 다시 보기

```
 확률 모델 가정                     MLE 결과 손실 함수            
                                                               
 가우시안 (모두 같은 σ)            →  SSE (OLS)                  
                                                               
 가우시안 (점마다 다른 σᵢ)         →  가중 SSE (WLS) ★ 지금 글  
                                                               
 라플라스                          →  ∑|r| (LAD)                
                                                               
 베르누이                          →  Cross-entropy             
                                                               
 가우시안 + 가우시안 prior         →  L2 정칙화 (다음 글)        
```

→ **WLS 는 MLE 위계의 자연스러운 확장**, 가정만 약간 풀어준 결과.

---

## 12. 핵심 한 줄

> **"모든 점이 같은 신뢰도가 아니라면 → 분산의 역수로 가중" → WLS**.
>
> 가우시안 가정은 그대로, σ 만 점마다 다르게.
>
> $$\ell(w) = C - \frac{1}{2}\sum_i \frac{r_i^2}{\sigma_i^2}$$
>
> 다리 등식 (Stage 2 의 일반화).

---

## 13. 다음 단계 — Stage 4 (MAP / Regularization)

WLS 는 "**관측 데이터의 신뢰도**" 를 모델에 반영하는 것.

다음 단계는 "**파라미터 자체에 대한 사전 지식**" 을 추가:

- **Prior** $P(w)$ 도입 → **MAP** (Maximum A Posteriori)
- 가우시안 prior → **L2 정칙화** 자연 등장
- **LM 의 $\lambda$ 가 사실 prior 의 강도** ★

→ "**관측 + 사전 지식**" 결합한 베이지안 추론으로 진화.
