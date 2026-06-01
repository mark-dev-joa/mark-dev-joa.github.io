---
title: Part 1·2 비선형 최소제곱
description: 파라미터 1 개로 비선형 최소제곱의 핵심 알고리즘 (Gauss-Newton, Newton, Levenberg-Marquardt) 을 한 그래프에서 정리한다. 인터랙티브 데모로 수렴과 발산을 확인한다.
author: mark
date: 2026-04-26
categories: [math, optimization]
tags: [mle, gauss-newton, levenberg-marquardt, newton, dogleg, jacobian]
math: true
---


파라미터가 하나뿐인 가장 단순한 비선형 피팅은 잔차, 자코비안, 테일러 근사, 정규방정식, 한 걸음의 점프라는 핵심 개념을 모두 한 그래프 안에 담을 수 있다. 다변수 문제로 넘어가기 전에 이 1차원 그림을 먼저 정리해 두면, 차원이 늘어나도 동일한 구조가 반복된다는 점을 쉽게 받아들일 수 있다.

## Gauss-Newton 풀이의 표준 흐름

Gauss-Newton 절차는 다음 열 단계로 정리된다. 모델을 정의하고 잔차와 SSE 를 세운 뒤, 잔차를 1차 테일러로 근사해 SSE 를 이차식으로 만들고, 미분이 0 인 조건에서 정규방정식을 풀어 한 걸음을 정한 다음, 수렴할 때까지 반복하는 구조다.

| # | 단계 | 식 |
|---|---|---|
| 1 | 모델 정의 | $\hat{y}_i = f(t_i; w)$ |
| 2 | 잔차 (오차 함수) 정의 | $e_i = y_i - \hat{y}_i$ |
| 3 | SSE 정의 (최소화 목표) | $E(w) = \sum_i e_i^2$ |
| 4 | 잔차 1차 테일러 근사 | $e_i(w_n + \Delta w) \approx e_i(w_n) + J_i \Delta w$ |
| 5 | SSE 에 대입 (이차식) | $\tilde{E}(\Delta w) = \sum (e_i + J_i \Delta w)^2$ |
| 6 | $\Delta w$ 로 미분 = 0 | 포물선 바닥 조건 |
| 7 | 정규방정식 | $(J^T J)\Delta w = -J^T \mathbf{e}$ |
| 8 | $\Delta w$ 풀기 | $\Delta w = -G/H$ |
| 9 | 업데이트 | $w_{n+1} = w_n + \Delta w$ |
| 10 | 반복 (수렴까지) | 새 $w_n$ 에서 4번부터 다시 |

이 열 단계가 Gauss-Newton 의 본질이며, LM, Newton, Dogleg 는 모두 8번 단계, 곧 $\Delta w$ 를 푸는 방식만 바꾼 변형이다. LM 은 분모에 $\lambda$ 를 더하고, Newton 은 근사 대신 진짜 헤시안을 쓰며, Dogleg 은 한 걸음의 거리를 잘라낸다. 아래 본문은 이 흐름을 예제 데이터로 단계별 검증하고 네 가지 알고리즘을 비교한다.

---

## 1. 모델 설정

모델은 파라미터 하나 $w$ 만 갖는 지수 감쇠로 둔다.

$$\hat{y}(t; w) = e^{-w t}$$

데이터를 생성한 참값은 $w^* = 0.5$ 이며, 여기에 노이즈를 더한 다섯 개의 관측점을 사용한다.

| $t_i$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $y_i$ | 1.05 | 0.55 | 0.41 | 0.22 | 0.19 |

---

## 2. 잔차 (오차 함수) 정의

각 데이터 점에서 관측값과 모델 예측의 차이를 잔차로 정의한다.

$$e_i(w) = y_i - \hat{y}(t_i; w) = y_i - e^{-w t_i}$$

여기서 $y_i$ 는 $i$ 번째 관측값이고, $\hat{y}(t_i; w) = e^{-w t_i}$ 는 같은 시점의 모델 예측이다. 잔차 $e_i(w)$ 는 $w$ 의 함수이며, 데이터마다 하나씩 모두 다섯 개가 생긴다. 이를 한 벡터로 모은다.

$$\mathbf{e}(w) = \begin{bmatrix} e_1 \\\\ e_2 \\\\ e_3 \\\\ e_4 \\\\ e_5 \end{bmatrix}$$

---

## 3. SSE 정의

최소화 목표는 잔차의 제곱합 (SSE) 이다.

$$E(w) = \|\mathbf{e}(w)\|^2 = \sum_i e_i(w)^2 = \sum_i \left(y_i - e^{-w t_i}\right)^2$$

$E$ 는 $w$ 하나만의 함수이므로 1차원 곡선이 된다. $w$ 가 너무 작으면 감쇠가 약해 모델이 데이터보다 크게 나오고, 너무 크면 모델이 빠르게 0 으로 떨어져 데이터를 따라가지 못하므로, 두 경우 모두 SSE 가 커진다. $w$ 가 참값 $w^*$ 근처일 때 SSE 가 최소가 된다.

---

## 4. 자코비안 — 잔차의 미분

자코비안은 각 잔차를 $w$ 로 미분한 값이며, 데이터 하나당 하나씩 모두 다섯 개가 나온다.

$$J_i(w) = \frac{d e_i}{dw}$$

### 유도

$e_i = y_i - e^{-w t_i}$ 를 $w$ 로 미분한다. 관측값 $y_i$ 는 $w$ 와 무관한 상수이므로 그 미분은 0 이다.

$$\frac{d y_i}{dw} = 0$$

지수 항은 연쇄법칙으로 미분한다.

$$\frac{d}{dw}\left[e^{-w t_i}\right] = e^{-w t_i} \cdot \underbrace{(-t_i)}_{\text{지수 안 미분}} = -t_i \cdot e^{-w t_i}$$

두 결과를 합치면 자코비안이 나온다.

$$\frac{d e_i}{dw} = 0 - (-t_i \cdot e^{-w t_i}) = t_i \cdot e^{-w t_i}$$

$$\boxed{J_i(w) = t_i \cdot e^{-w t_i}}$$

다섯 개를 벡터로 모으면 다음과 같다.

$$\mathbf{J}(w) = \begin{bmatrix} J_1 \\\\ J_2 \\\\ J_3 \\\\ J_4 \\\\ J_5 \end{bmatrix} = \begin{bmatrix} 0 \\\\ e^{-w} \\\\ 2 e^{-2w} \\\\ 3 e^{-3w} \\\\ 4 e^{-4w} \end{bmatrix}$$

### 의미

자코비안 $J_i$ 는 $w$ 를 조금 바꿀 때 잔차 $e_i$ 가 얼마나 변하는지를 나타내는 민감도다. $J_i$ 가 크면 같은 $w$ 변화에도 잔차가 크게 움직여 그 데이터가 많은 정보를 담고 있고, $J_i$ 가 0 에 가까우면 잔차가 거의 변하지 않아 정보가 빈약하다. 첫 번째 점 ($t_1 = 0$) 의 자코비안이 0 인 것은 $t = 0$ 에서 모델값이 $w$ 와 무관하게 항상 1 이기 때문이다. 이 자코비안이 이후 Gauss-Newton 계산의 핵심 재료가 된다.

---

## 5. 잔차의 1차 테일러 근사

비선형 잔차 $e_i(w)$ 를 현재 위치 $w_n$ 근처에서 직선으로 근사하는 것이 Gauss-Newton 의 핵심 발상이다. 1차 테일러 전개는 다음과 같이 쓴다.

$$e_i(w_n + \Delta w) \approx e_i(w_n) + J_i(w_n) \cdot \Delta w$$

이 식에서 현재 잔차값 $e_i(w_n)$ 과 현재 자코비안 $J_i(w_n)$ 은 모두 상수이고, 변수는 얼마나 움직일지를 나타내는 $\Delta w$ 하나뿐이다. 따라서 우변은 $\Delta w$ 에 대한 1차 함수, 곧 직선이 된다.

### 1D 비유

<svg viewBox="0 0 600 270" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="600" height="270" fill="#ffffff"/>
  <text x="300" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="600">잔차 곡선과 그 접선 (1차 테일러)</text>
  <line x1="70" y1="230" x2="560" y2="230" stroke="#ccc" stroke-width="1"/>
  <line x1="90" y1="50" x2="90" y2="230" stroke="#ccc" stroke-width="1"/>
  <text x="82" y="58" text-anchor="end" fill="#999" font-size="11">e</text>
  <text x="556" y="248" text-anchor="end" fill="#999" font-size="11">w</text>
  <polyline fill="none" stroke="#3a6ea5" stroke-width="2.2" points="90.0,74.6 101.2,85.4 112.5,95.4 123.8,104.7 135.0,113.4 146.2,121.5 157.5,129.0 168.8,136.0 180.0,142.4 191.2,148.5 202.5,154.1 213.8,159.3 225.0,164.2 236.2,168.7 247.5,172.9 258.8,176.8 270.0,180.4 281.2,183.8 292.5,186.9 303.8,189.9 315.0,192.6 326.2,195.1 337.5,197.5 348.8,199.7 360.0,201.7 371.2,203.6 382.5,205.3 393.8,207.0 405.0,208.5 416.3,209.9 427.5,211.2 438.8,212.5 450.0,213.6 461.2,214.7 472.5,215.6 483.8,216.6 495.0,217.4 506.2,218.2 517.5,218.9 528.8,219.6 540.0,220.3"/>
  <text x="455" y="212" fill="#3a6ea5" font-size="12">잔차 e(w)</text>
  <line x1="97.8" y1="97.6" x2="337" y2="228" stroke="#b0392b" stroke-width="1.6" stroke-dasharray="6,4"/>
  <text x="250" y="135" fill="#b0392b" font-size="12">접선 (1차 테일러)</text>
  <circle cx="183.1" cy="144.2" r="4" fill="#b0392b"/>
  <text x="183.1" y="135" text-anchor="middle" fill="#333" font-size="11">w_n</text>
  <text x="300" y="258" text-anchor="middle" fill="#777" font-size="11">w_n 에서 곡선과 접선이 맞닿고, 멀어질수록 벌어진다</text>
</svg>

### 왜 이렇게 하나

원본 잔차 $e_i(w)$ 는 지수 함수라 비선형이어서 직접 최소화하기 어렵지만, 1차 테일러 근사 $e_i(w_n) + J_i \cdot \Delta w$ 는 $\Delta w$ 에 대해 선형이라 선형 최소제곱으로 풀 수 있다. 비선형 문제를 현재 위치에서 국소적으로 선형화한 뒤 한 걸음을 풀고, 그 자리에서 다시 선형화하는 반복이 전체 알고리즘의 골격이다.

다섯 개 잔차를 한꺼번에 선형화하면 벡터 형태가 된다.

$$\mathbf{e}(w_n + \Delta w) \approx \mathbf{e}(w_n) + \mathbf{J}(w_n) \cdot \Delta w$$

$$= \begin{bmatrix} e_1 \\\\ e_2 \\\\ \vdots \\\\ e_5 \end{bmatrix} + \begin{bmatrix} J_1 \\\\ J_2 \\\\ \vdots \\\\ J_5 \end{bmatrix} \cdot \Delta w$$

이 선형 형태를 제곱해 더하면 SSE 의 이차근사 (포물선) 가 되고, 그것을 미분해 0 으로 두면 정규방정식이 나와 $\Delta w$ 를 풀 수 있다. 다음 절에서 이 과정을 따라간다.

---

## 6. SSE 에 대입하고 미분해 정규방정식 풀기

### 선형화된 잔차를 SSE 에 대입

선형화된 잔차를 SSE 식에 넣어 $\tilde{E}(\Delta w)$ 로 표기한다.

$$\tilde{E}(\Delta w) = \sum_i \big[e_i(w_n) + J_i \cdot \Delta w\big]^2$$

1차 식을 제곱했으므로 $\tilde{E}$ 는 $\Delta w$ 에 대한 이차함수다. 전개하면 세 항으로 정리된다.

$$\tilde{E}(\Delta w) = \sum_i \left[ e_i^2 + 2 e_i J_i \Delta w + J_i^2 \Delta w^2 \right]$$

$$\tilde{E}(\Delta w) = a + 2 b \cdot \Delta w + c \cdot \Delta w^2$$

각 계수는 다음과 같이 정의된다.

$$a = \sum_i e_i^2, \qquad b = \sum_i e_i J_i, \qquad c = \sum_i J_i^2$$

| 계수 | 식 | 의미 |
|---|---|---|
| $a$ | $\sum e_i^2$ | 현재 SSE $= E(w_n)$ (상수) |
| $b$ | $\sum e_i J_i$ | 그래디언트의 절반 ($G = 2b$) |
| $c$ | $\sum J_i^2$ | 헤시안의 절반 ($H = 2c$, GN 근사) |

### 미분해 0 으로 두기

이차함수의 최소는 미분이 0 인 곳에 있다. $\Delta w$ 로 미분하면 다음과 같다.

$$\frac{d \tilde{E}}{d (\Delta w)} = 2 b + 2 c \cdot \Delta w$$

이를 0 으로 두면 포물선의 바닥 조건이 되고, 정리하면 정규방정식이 나온다.

$$2 b + 2 c \cdot \Delta w = 0 \quad\Longrightarrow\quad \boxed{c \cdot \Delta w = -b}$$

$G, H$ 표기로는 $H \cdot \Delta w = -G$ 이다. $\Delta w$ 에 대해 풀면 한 걸음의 크기와 방향이 정해진다.

$$\boxed{\Delta w = -\frac{b}{c} = -\frac{G}{H}}$$

이 값이 포물선 바닥의 위치이며, 현재 위치에 더하면 다음 위치가 된다.

$$w_{n+1} = w_n + \Delta w = w_n - \frac{G}{H}$$

### 예제 데이터 적용 ($w_n = 1.5$)

$w_n = 1.5$ 에서 세 계수를 계산하면 다음과 같고, 한 걸음의 크기 $\Delta w = -b/c$ 가 나온다.

| 양 | 값 |
|---|---|
| $a = \sum e_i^2$ | 0.302 |
| $b = \sum e_i J_i$ | 0.116 |
| $c = \sum J_i^2$ | 0.0608 |
| $\Delta w = -b/c$ | $-1.91$ |
| $w_{n+1} = 1.5 + (-1.91)$ | $-0.41$ |

이 $w_{n+1}$ 이 데모 아래 그래프에서 포물선 바닥에 찍히는 점에 해당한다. 시작 위치가 멀어 한 걸음이 음수 영역까지 크게 넘어가는데, 이런 과대 점프가 뒤에 다룰 LM 과 Dogleg 의 동기가 된다.

### 흐름도

<svg viewBox="0 0 560 470" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:560px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="560" height="470" fill="#ffffff"/>
  <text x="280" y="24" text-anchor="middle" fill="#333" font-size="13" font-weight="600">Gauss-Newton 한 걸음의 유도 흐름</text>
  <rect x="130" y="40" width="300" height="40" rx="3" fill="#f5f5f5" stroke="#bbb" stroke-width="1"/>
  <text x="280" y="65" text-anchor="middle" fill="#333" font-size="12">잔차 1차 테일러: e(w_n+Δw) ≈ e(w_n) + J·Δw</text>
  <rect x="160" y="98" width="240" height="34" rx="3" fill="#ffffff" stroke="#ccc" stroke-width="1"/>
  <text x="280" y="120" text-anchor="middle" fill="#333" font-size="12">SSE 에 대입 ([·]² 합)</text>
  <rect x="130" y="150" width="300" height="34" rx="3" fill="#ffffff" stroke="#ccc" stroke-width="1"/>
  <text x="280" y="172" text-anchor="middle" fill="#333" font-size="12">a + 2b·Δw + c·Δw² (Δw 의 이차함수)</text>
  <rect x="180" y="202" width="200" height="34" rx="3" fill="#ffffff" stroke="#ccc" stroke-width="1"/>
  <text x="280" y="224" text-anchor="middle" fill="#333" font-size="12">미분: 2b + 2c·Δw</text>
  <rect x="170" y="254" width="220" height="34" rx="3" fill="#ffffff" stroke="#ccc" stroke-width="1"/>
  <text x="280" y="276" text-anchor="middle" fill="#333" font-size="12">= 0 (포물선 바닥 조건)</text>
  <rect x="160" y="306" width="240" height="40" rx="3" fill="#eeeeee" stroke="#555" stroke-width="1.4"/>
  <text x="280" y="331" text-anchor="middle" fill="#222" font-size="13" font-weight="600">Δw = −b/c = −G/H (한 걸음)</text>
  <rect x="175" y="364" width="210" height="34" rx="3" fill="#ffffff" stroke="#ccc" stroke-width="1"/>
  <text x="280" y="386" text-anchor="middle" fill="#333" font-size="12">w_{n+1} = w_n + Δw</text>
  <rect x="180" y="416" width="200" height="34" rx="3" fill="#ffffff" stroke="#ccc" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="280" y="438" text-anchor="middle" fill="#333" font-size="12">반복 (새 w_n 에서 처음부터)</text>
  <g stroke="#aaa" stroke-width="1.2">
    <line x1="280" y1="80" x2="280" y2="98" marker-end="url(#nfa)"/>
    <line x1="280" y1="132" x2="280" y2="150" marker-end="url(#nfa)"/>
    <line x1="280" y1="184" x2="280" y2="202" marker-end="url(#nfa)"/>
    <line x1="280" y1="236" x2="280" y2="254" marker-end="url(#nfa)"/>
    <line x1="280" y1="288" x2="280" y2="306" marker-end="url(#nfa)"/>
    <line x1="280" y1="346" x2="280" y2="364" marker-end="url(#nfa)"/>
    <line x1="280" y1="398" x2="280" y2="416" marker-end="url(#nfa)"/>
  </g>
  <defs>
    <marker id="nfa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#aaa"/>
    </marker>
  </defs>
</svg>

### 보충: 원소별 합과 벡터 내적

위에서 $a, b, c$ 를 원소별 합으로 썼지만, 같은 식을 벡터 내적으로도 표현할 수 있다. 잔차와 자코비안을 벡터로 두면 다변수로 넘어갈 때 자연스러운 일반화 형태가 된다.

$$\mathbf{e} = \begin{bmatrix} e_1 \\\\ e_2 \\\\ \vdots \\\\ e_N \end{bmatrix}, \qquad \mathbf{J} = \begin{bmatrix} J_1 \\\\ J_2 \\\\ \vdots \\\\ J_N \end{bmatrix}$$

두 표기는 수학적으로 완전히 같으며, 차이는 표현 방식뿐이다.

| 양 | 원소별 합 | 벡터 내적 |
|---|---|---|
| $a$ | $\sum_i e_i^2$ | $\mathbf{e}^T \mathbf{e} = \|\mathbf{e}\|^2$ |
| $b$ | $\sum_i e_i J_i$ | $\mathbf{e}^T \mathbf{J}$ |
| $c$ | $\sum_i J_i^2$ | $\mathbf{J}^T \mathbf{J} = \|\mathbf{J}\|^2$ |

두 표기가 같은 이유는 내적의 정의를 펼쳐 보면 분명하다. 행렬곱 $(1 \times N) \times (N \times 1)$ 은 곧 원소 제곱의 합이다.

$$\mathbf{e}^T \mathbf{e} = \begin{bmatrix} e_1 & e_2 & \cdots & e_N \end{bmatrix} \begin{bmatrix} e_1 \\\\ e_2 \\\\ \vdots \\\\ e_N \end{bmatrix} = e_1^2 + e_2^2 + \cdots + e_N^2 = \sum_i e_i^2$$

실제 코드에서는 둘 중 편한 쪽을 고른다. 자바스크립트의 for 루프에서는 원소별 합이 자연스럽고, numpy 처럼 벡터화가 되는 환경에서는 내적 한 줄이 빠르다. 무엇보다 벡터 내적 표기는 변수가 늘어나도 그대로 행렬로 일반화된다는 장점이 있다.

예제 데모는 원소별 합으로 SSE 를 계산한다.

```js
function sse(ww) {
  return residual(ww).reduce((s, e) => s + e * e, 0);
}
```

numpy 라면 같은 계산을 내적으로 쓴다.

```python
def sse(w):
    e = residual(w)         # numpy 배열
    return e @ e            # = np.dot(e, e) = np.sum(e**2)
```

1차원 정규방정식 $c \cdot \Delta w = -b$ 도 벡터로 쓰면 다음과 같다.

$$\boxed{(\mathbf{J}^T \mathbf{J}) \cdot \Delta w = -\mathbf{J}^T \mathbf{e}}$$

$w$ 가 벡터 $\mathbf{w}$ 로 바뀌어도 이 형태는 그대로 유지된다.

$$(\mathbf{J}^T \mathbf{J}) \cdot \Delta \mathbf{w} = -\mathbf{J}^T \mathbf{e}$$

벡터 표기가 차원 확장에 자동으로 일반화된다는 점이 이 형태를 표준으로 쓰는 이유다.

---

## 7. Newton 메서드 — E 를 직접 두 번 미분

Gauss-Newton 이 쓰는 $H = 2 \sum J_i^2$ 는 진짜 헤시안의 근사다. 근사 대신 SSE 를 직접 두 번 미분한 진짜 2차 미분을 쓰는 방법이 Newton 메서드이며, 두 방법의 결과는 종종 비슷하지만 안정성에서 차이가 난다. 이 절은 진짜 헤시안을 단계별로 유도하고 Gauss-Newton 과 비교한다.

### 진짜 헤시안 유도

출발점은 SSE 정의다.

$$E(w) = \sum_i e_i(w)^2$$

목표는 그래디언트 $E'(w)$ 와 헤시안 $E''(w)$ 를 직접 구하는 것이다.

#### 1차 미분

합의 미분은 미분의 선형성에 따라 각 항의 미분으로 분리된다.

$$E'(w) = \frac{d}{dw}\sum_i e_i^2 = \sum_i \frac{d}{dw}\left[e_i^2\right]$$

합을 미분 안팎으로 옮길 수 있는 근거는 미분의 선형성이다. 합 분리 $(f + g)' = f' + g'$ 와 상수배 $(c \cdot f)' = c \cdot f'$ 라는 두 성질을 여러 항의 더하기에 반복 적용하면 다음이 성립한다.

$$\frac{d}{dw}\sum_i f_i(w) = \sum_i \frac{d}{dw} f_i(w) = \sum_i f_i'(w)$$

유한합과 미분은 서로 순서를 바꿔도 되므로 표기가 편한 쪽으로 쓰면 된다. 각 항 $e_i^2$ 은 연쇄법칙으로 미분한다.

$$\frac{d}{dw}\left[e_i^2\right] = 2 e_i \cdot \frac{d e_i}{dw} = 2 e_i \cdot J_i$$

여기서 $J_i = \dfrac{d e_i}{dw}$ 는 §4 에서 구한 자코비안이다. 합치면 그래디언트가 나온다.

$$\boxed{E'(w) = 2 \sum_i e_i \cdot J_i = G}$$

이 결과는 §10 의 그래디언트와 동일하다.

#### 2차 미분

$E'(w) = 2 \sum_i e_i \cdot J_i$ 를 한 번 더 $w$ 로 미분한다. 선형성으로 합과 상수를 밖으로 빼낸다.

$$E''(w) = \frac{d}{dw}\left[2 \sum_i e_i \cdot J_i\right] = 2 \sum_i \frac{d}{dw}\left[e_i \cdot J_i\right]$$

각 항은 두 함수 $e_i$ 와 $J_i$ 의 곱이므로 곱 미분 규칙을 적용한다.

$$\frac{d}{dw}\left[e_i \cdot J_i\right] = \frac{d e_i}{dw} \cdot J_i + e_i \cdot \frac{d J_i}{dw}$$

$$= J_i \cdot J_i + e_i \cdot J_i' = J_i^2 + e_i \cdot J_i'$$

여기서 $\dfrac{d e_i}{dw} = J_i$ 는 자코비안의 정의이고, $J_i' = \dfrac{d J_i}{dw} = \dfrac{d^2 e_i}{dw^2}$ 는 잔차의 2차 미분으로 새로 등장하는 양이다. 합치면 진짜 헤시안이 두 항으로 분리된다.

$$E''(w) = 2 \sum_i \left[ J_i^2 + e_i \cdot J_i' \right]$$

$$\boxed{E''(w) = 2 \sum_i J_i^2 \;+\; 2 \sum_i e_i \cdot J_i'}$$

앞 항 $2 \sum_i J_i^2$ 은 Gauss-Newton 이 헤시안으로 쓰는 부분 ($H_{\text{GN}}$) 이고, 뒤 항 $2 \sum_i e_i \cdot J_i'$ 은 Gauss-Newton 이 버리는 부분이다. 두 항의 분해를 그림으로 정리하면 다음과 같다.

#### 흐름 요약

<svg viewBox="0 0 620 320" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:620px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="620" height="320" fill="#ffffff"/>
  <text x="310" y="24" text-anchor="middle" fill="#333" font-size="13" font-weight="600">SSE 의 두 번 미분 — 진짜 헤시안의 두 항</text>
  <rect x="220" y="40" width="180" height="34" rx="3" fill="#f5f5f5" stroke="#bbb" stroke-width="1"/>
  <text x="310" y="62" text-anchor="middle" fill="#333" font-size="13">E(w) = Σ eᵢ²</text>
  <text x="330" y="92" fill="#999" font-size="10">d/dw (Step 1)</text>
  <rect x="180" y="100" width="260" height="34" rx="3" fill="#ffffff" stroke="#ccc" stroke-width="1"/>
  <text x="310" y="122" text-anchor="middle" fill="#333" font-size="12">E'(w) = 2·Σ eᵢ·Jᵢ  (그래디언트 G)</text>
  <text x="330" y="152" fill="#999" font-size="10">d/dw (Step 2, 곱미분)</text>
  <rect x="150" y="160" width="320" height="40" rx="3" fill="#ffffff" stroke="#ccc" stroke-width="1"/>
  <text x="310" y="185" text-anchor="middle" fill="#333" font-size="12">E''(w) = 2·Σ Jᵢ² + 2·Σ eᵢ·Jᵢ'  (진짜 헤시안)</text>
  <rect x="120" y="240" width="220" height="50" rx="3" fill="#eeeeee" stroke="#555" stroke-width="1.3"/>
  <text x="230" y="262" text-anchor="middle" fill="#222" font-size="12" font-weight="600">2·Σ Jᵢ² 항</text>
  <text x="230" y="280" text-anchor="middle" fill="#444" font-size="11">GN 이 사용 (1차 정보)</text>
  <rect x="360" y="240" width="220" height="50" rx="3" fill="#ffffff" stroke="#bbb" stroke-width="1" stroke-dasharray="5,3"/>
  <text x="470" y="262" text-anchor="middle" fill="#999" font-size="12">2·Σ eᵢ·Jᵢ' 항</text>
  <text x="470" y="280" text-anchor="middle" fill="#aaa" font-size="11">GN 이 버림 (2차 미분)</text>
  <g stroke="#aaa" stroke-width="1.2">
    <line x1="310" y1="74" x2="310" y2="100" marker-end="url(#nha)"/>
    <line x1="310" y1="134" x2="310" y2="160" marker-end="url(#nha)"/>
    <line x1="310" y1="200" x2="230" y2="240" marker-end="url(#nha)"/>
    <line x1="310" y1="200" x2="470" y2="240" marker-end="url(#nha)"/>
  </g>
  <defs>
    <marker id="nha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#aaa"/>
    </marker>
  </defs>
</svg>

### Newton 과 Gauss-Newton 의 차이

두 방법의 차이는 헤시안을 어떻게 잡느냐에 있다. Newton 은 진짜 2차 미분 $E''(w)$ 를 쓰는 대신 잔차의 2차 미분 $J_i'$ 까지 계산해야 하고, Gauss-Newton 은 $2 \sum J_i^2$ 라는 근사를 쓰는 대신 자코비안만 있으면 된다. 결정적인 차이는 헤시안의 부호다. Newton 의 헤시안은 음수가 될 수 있어 발산 위험을 안고 있지만, Gauss-Newton 의 헤시안은 $\sum J_i^2 \geq 0$ 이라 항상 양수다. 수렴 속도는 잔차가 작을 때 두 방법이 거의 같다.

| | Newton | Gauss-Newton |
|---|---|---|
| $H$ | $E''(w)$ (진짜 2차 미분) | $2 \sum J_i^2$ (근사) |
| 추가 계산 | $J_i' = \frac{d^2 e_i}{dw^2}$ 필요 | $J_i$ 만 필요 |
| $H$ 부호 | 음수 가능 (발산 위험) | 항상 양수 ($\sum J_i^2 \geq 0$) |
| 수렴 속도 | 빠름 (정확) | 거의 같음 (잔차 작을 때) |

예제 모델 $e_i = y_i - e^{-w t_i}$ 에서는 $J_i = t_i e^{-w t_i}$, $J_i' = -t_i^2 e^{-w t_i}$ 이므로 진짜 헤시안은 다음과 같다.

$$E''(w) = 2 \sum_i t_i^2 e^{-2 w t_i} - 2 \sum_i e_i \cdot t_i^2 e^{-w t_i}$$

### 두 방법의 결과가 비슷한 이유

잔차 $e_i$ 가 작을 때, 곧 $w$ 가 정답 근처일 때는 Gauss-Newton 이 버린 항 $\sum e_i \cdot J_i'$ 이 거의 0 이 되어 Newton 과 Gauss-Newton 이 거의 같아진다. 반대로 현재 위치가 정답에서 멀거나, 모델이 데이터를 끝까지 잘 맞추지 못해 수렴 후에도 잔차가 큰 경우에는 버린 항을 무시할 수 없어 두 방법의 차이가 드러난다.

| 상황 | $e_i$ | 버린 항 | Newton 과 GN |
|---|---|---|---|
| 수렴 근처 | 작음 | $\approx 0$ | 거의 동일 |
| 멀리 있음 | 큼 | 무시 못 함 | 차이 남 |
| 큰 잔차 문제 (모델이 데이터 못 맞춤) | 큼 (수렴해도) | 항상 큼 | GN 부정확 |

### Gauss-Newton 을 쓰는 이유

근사임에도 Gauss-Newton 을 선호하는 데는 세 가지 이유가 있다. 첫째, 모델이 복잡할수록 2차 미분 $J_i'$ 의 계산 비용이 급격히 커진다. 둘째, 헤시안이 $\sum J_i^2 \geq 0$ 으로 항상 양수라 언제나 내리막 방향이 보장된다. 셋째, Newton 은 헤시안이 음수가 되면 최댓값을 찾는 방향으로 점프해 발산할 수 있다. 정확도를 조금 양보하는 대신 안정성을 얻는 선택이며, 실무에서 Gauss-Newton 이 Newton 보다 잘 작동하는 경우가 잦은 것도 이 때문이다.

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

데모에서 알고리즘을 Newton 으로 선택하면 두 방법의 차이를 직접 볼 수 있다. $w_n$ 이 정답 0.5 근처일 때는 Gauss-Newton 과 거의 같은 점프를 보이지만, $w_n = 5$ 처럼 멀리서 시작하면 헤시안이 음수가 되어 잘못된 방향으로 점프하며 발산할 수 있다. Gauss-Newton 은 분모가 항상 양수라 언제나 옳은 방향으로 움직이므로, 두 알고리즘을 번갈아 실행하면 왜 Gauss-Newton 을 쓰는지가 한눈에 드러난다.

---

## 8. Levenberg-Marquardt (LM) — GN 의 안정 버전

### 왜 LM 이 필요한가

§6 의 Gauss-Newton 은 초기값에 매우 민감하다. 현재 위치가 정답에서 멀면 $J^T J$ 가 작아져 $\Delta w$ 가 폭발하고 발산하는데, 예제 모델 $e^{-wt}$ 에서는 $w \geq 1.5$ 부터 이런 위험이 나타난다. Levenberg-Marquardt 는 이 분모에 $\lambda$ 를 더해 한 걸음을 길들인다.

$$\boxed{\Delta w = -\frac{G}{H + \lambda} = -\frac{2 \sum e_i J_i}{2 \sum J_i^2 + \lambda}}$$

스케일을 무시하면 더 간단히 쓸 수 있다.

$$\Delta w = -\frac{\sum e_i J_i}{\sum J_i^2 + \lambda}$$

$\lambda$ 가 0 이면 순수 Gauss-Newton 이라 점프가 크고 위험하며, $\lambda$ 가 커질수록 분모가 커져 점프가 작아지고 안전해진다. $\lambda$ 가 $10^{-4}$ 수준이면 거의 Gauss-Newton 처럼 빠르고, 1 안팎이면 Gauss-Newton 과 경사하강을 섞은 듯 안정적이며, 100 이상이면 거의 경사하강처럼 보수적으로 움직인다. $\lambda$ 가 무한대로 가면 점프가 0 이 되어 멈춘다.

| $\lambda$ 값 | 동작 |
|---|---|
| $\lambda = 0$ | 순수 GN (큰 점프, 위험) |
| 작음 ($\sim 10^{-4}$) | 거의 GN (빠름) |
| 보통 ($\sim 1$) | GN 과 GD 혼합 (안정) |
| 큼 ($\sim 100$) | 거의 GD (작은 점프, 매우 안전) |
| $\lambda \to \infty$ | 점프 = 0 (정지) |

### 적응형 $\lambda$

LM 의 핵심은 $\lambda$ 를 고정하지 않고 매 단계 SSE 변화에 따라 조절하는 데 있다. 한 걸음을 시도해 SSE 가 줄면 그 걸음을 받아들이고 $\lambda$ 를 10 으로 나눠 다음 걸음을 더 과감하게 잡고, SSE 가 늘면 걸음을 거부하고 $\lambda$ 에 10 을 곱해 더 보수적으로 만든다.

<svg viewBox="0 0 620 360" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:620px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="620" height="360" fill="#ffffff"/>
  <text x="310" y="24" text-anchor="middle" fill="#333" font-size="13" font-weight="600">LM 적응형 λ — SSE 변화에 따른 수락 / 거부</text>
  <rect x="200" y="40" width="220" height="40" rx="3" fill="#f5f5f5" stroke="#bbb" stroke-width="1"/>
  <text x="310" y="60" text-anchor="middle" fill="#333" font-size="12">시도: w_try = w_n + Δw</text>
  <text x="310" y="74" text-anchor="middle" fill="#777" font-size="11">(현재 λ 로 계산)</text>
  <rect x="195" y="100" width="230" height="34" rx="3" fill="#ffffff" stroke="#ccc" stroke-width="1"/>
  <text x="310" y="122" text-anchor="middle" fill="#333" font-size="12">SSE_after vs SSE_before</text>
  <rect x="70" y="180" width="230" height="50" rx="3" fill="#eeeeee" stroke="#555" stroke-width="1.3"/>
  <text x="185" y="202" text-anchor="middle" fill="#222" font-size="12" font-weight="600">감소: 점프 수락</text>
  <text x="185" y="220" text-anchor="middle" fill="#444" font-size="11">λ ÷ 10 (GN 처럼 빠르게)</text>
  <rect x="320" y="180" width="230" height="50" rx="3" fill="#ffffff" stroke="#999" stroke-width="1.2"/>
  <text x="435" y="202" text-anchor="middle" fill="#333" font-size="12" font-weight="600">증가: 점프 거부</text>
  <text x="435" y="220" text-anchor="middle" fill="#666" font-size="11">λ × 10 (GD 처럼 안전하게)</text>
  <rect x="85" y="270" width="200" height="34" rx="3" fill="#ffffff" stroke="#ccc" stroke-width="1"/>
  <text x="185" y="292" text-anchor="middle" fill="#333" font-size="12">다음 iteration</text>
  <rect x="335" y="270" width="200" height="34" rx="3" fill="#ffffff" stroke="#ccc" stroke-width="1"/>
  <text x="435" y="292" text-anchor="middle" fill="#333" font-size="12">같은 w 유지, 재시도</text>
  <g stroke="#aaa" stroke-width="1.2">
    <line x1="310" y1="80" x2="310" y2="100" marker-end="url(#nla)"/>
    <line x1="290" y1="134" x2="185" y2="180" marker-end="url(#nla)"/>
    <line x1="330" y1="134" x2="435" y2="180" marker-end="url(#nla)"/>
    <line x1="185" y1="230" x2="185" y2="270" marker-end="url(#nla)"/>
    <line x1="435" y1="230" x2="435" y2="270" marker-end="url(#nla)"/>
  </g>
  <defs>
    <marker id="nla" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#aaa"/>
    </marker>
  </defs>
</svg>

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

이 규칙은 잘 되면 더 빨리, 안 되면 더 조심하는 식으로 $\lambda$ 를 자동 조절한다. Gauss-Newton 의 빠른 수렴과 경사하강의 안전성이 한 알고리즘 안에서 자동으로 균형을 이루므로 $\lambda$ 를 직접 손볼 필요가 없고, 거의 모든 비선형 최소제곱 문제에 무난히 작동한다.

이런 안정성 덕분에 Levenberg-Marquardt 는 비선형 최소제곱의 사실상 표준 알고리즘으로 자리 잡았다. 실무에서 쓰이는 비중을 대략 가늠하면 다음과 같다.

| 알고리즘 | 사용 빈도 (실무) |
|---|---|
| LM | 80% |
| Trust Region | 10% |
| GN | 5% (잔차 작을 때) |
| Newton (직접) | 1% (헤시안 비쌈) |
| 기타 | 4% |

scipy 의 `curve_fit`, MATLAB 의 `lsqnonlin`, OpenCV 의 `solvePnP` 가 모두 내부적으로 LM 을 쓴다.

### 데모 활용법

브라우저에서 알고리즘을 LM 으로 선택하고 슬라이더를 $w = 2.0$ 으로 둔다. 이 값은 순수 Gauss-Newton 으로는 발산하던 위치다. 1 Step 을 누르면 안전한 크기의 점프와 함께 $\lambda$ 가 자동으로 조절되는 것을 확인할 수 있고, Auto 로 돌리면 수렴까지 진행된다. Gauss-Newton 이 실패하던 시작점에서도 LM 이 수렴하는 것을 직접 체험할 수 있다.

이 알고리즘은 Donald Marquardt 가 1963년 논문 "An algorithm for least-squares estimation of nonlinear parameters" 에서 제시한 이래 60년 넘게 거의 모든 비선형 피팅 라이브러리의 기본으로 쓰이고 있다.

---

## 9. Dogleg — Trust Region 방식

### 발상

Dogleg 은 Gauss-Newton 의 큰 점프를 길들인다는 점에서 LM 과 동기가 같지만 접근이 다르다. 한 걸음에 넘어갈 수 있는 최대 거리 $\Delta$ 를 미리 정해 두고 그 안에서만 움직이는 방식이다. 이 영역을 신뢰 영역 (Trust Region) 이라 부르는데, 2차 근사인 포물선을 얼마나 믿을 수 있는지의 범위를 뜻한다.

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

원래 Dogleg 은 Gauss-Newton 방향 $-H^{-1}G$ 와 Cauchy 방향 $-G$ 를 꺾어서 잇는 개 다리 모양의 곡선이다. 1차원에서는 두 방향이 같은 직선이므로 절차가 단순해진다. Gauss-Newton 한 걸음이 신뢰 반경 안에 들면 그대로 쓰고, 벗어나면 반경 끝까지만 움직인다.

$$\Delta w = \begin{cases} -G/H & \text{if } |{-G/H}| \leq \Delta \quad\text{(GN 그대로)} \\\\ \pm \Delta & \text{otherwise} \quad\text{(반경 끝까지만)} \end{cases}$$

곧 Gauss-Newton 한 걸음을 신뢰 반경으로 잘라내는 것이다.

### $\Delta$ 적응

신뢰 반경 $\Delta$ 도 매 단계 조절한다. 한 걸음 뒤에 신뢰도 비율 $\rho$ 를 측정하는데, 2차 근사가 예측한 감소량 대비 실제 SSE 감소량의 비율이다.

$$\rho = \frac{\text{실제 SSE 감소}}{\text{2차 근사가 예측한 감소}} = \frac{E(w_n) - E(w_n + \Delta w)}{Q(0) - Q(\Delta w)}$$

$\rho$ 가 0.75 를 넘으면 예측이 잘 맞은 것이므로 반경을 두 배로 늘려 더 과감하게 가고, 0.25 미만이면 예측이 빗나간 것이므로 반경을 4 분의 1 로 줄여 보수적으로 잡는다. 그 사이 값이면 반경을 유지하고, $\rho$ 가 0 이하라 SSE 가 오히려 늘었으면 걸음을 거부한 뒤 반경을 4 분의 1 로 줄인다.

| $\rho$ 값 | 의미 | $\Delta$ 갱신 |
|---|---|---|
| $\rho > 0.75$ | 예측 잘 맞음 | $\Delta \times 2$ (더 과감하게) |
| $0.25 \leq \rho \leq 0.75$ | 그럭저럭 | $\Delta$ 유지 |
| $\rho < 0.25$ | 예측 빗나감 | $\Delta \div 4$ (보수적으로) |
| $\rho \leq 0$ | SSE 증가 | 스텝 거부 + $\Delta \div 4$ |

예측이 잘 맞을수록 영역을 넓혀 믿고, 빗나가면 영역을 좁히는 구조다.

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

### LM 과 Dogleg 의 비교

두 방법은 같은 목표를 다른 방식으로 달성한다. LM 은 헤시안에 $\lambda$ 를 더해 분모를 키우는 방식으로 점프를 줄이고, Dogleg 은 한 걸음의 거리 자체를 신뢰 반경으로 잘라낸다. 적응 신호도 다르다. LM 은 SSE 의 증감에 따라 $\lambda$ 에 10 을 곱하거나 나누고, Dogleg 은 신뢰도 비율 $\rho$ 에 따라 반경을 두 배로 늘리거나 4 분의 1 로 줄인다.

| | LM | Dogleg |
|---|---|---|
| 어떻게 막나 | 헤시안에 $\lambda$ 더해 분모 키움 | $\Delta w$ 거리 자르기 |
| 파라미터 | $\lambda$ (damping) | $\Delta$ (trust radius) |
| 적응 신호 | SSE 증감에 따라 $\lambda \times 10 / \div 10$ | $\rho$ 에 따라 $\Delta \times 2 / \div 4$ |
| 수식 | $\Delta w = -G/(H + \lambda)$ | $\Delta w = \text{clip}(-G/H, \pm \Delta)$ |
| 직관 | 헤시안 보강 | 신뢰 영역 안에서만 |
| 개발 | Marquardt 1963 | Powell 1970 |

결과는 거의 같지만, 신뢰 영역이라는 범위 개념이 더 직관적이라 교과서에서 Dogleg 을 자주 다룬다.

### 데모 활용법

브라우저에서 알고리즘을 Dogleg 으로 선택하고 슬라이더를 $w = 5.0$ 에 둔다. Gauss-Newton 이 발산하던 위치다. 하단 캔버스에는 신뢰 영역 $[w_n - \Delta, w_n + \Delta]$ 가 청록색 띠로 표시되며, 1 Step 을 누르면 현재 위치를 나타내는 점이 이 띠 안에서만 다음 위치로 이동한다. 단계마다 $\rho$ 값과 $\Delta$ 의 변화를 확인할 수 있고, 띠가 점점 커지면서 수렴이 가속되는 것을 관찰할 수 있다.

Dogleg 은 scipy 의 `minimize(method='dogleg')` 와 경계 조건을 다루는 `least_squares(method='dogbox')`, 그리고 일부 SLAM 및 번들 조정 솔버에서 쓰인다. LM 과 동급의 안정성을 갖지만 예측 감소량을 따로 계산해야 해 구현이 조금 더 복잡하다.

---

## 10. 그래디언트 G — 보충 설명

그래디언트는 SSE 함수를 $w$ 로 한 번 미분한 값, 곧 그 점에서의 기울기다.

$$G = \frac{dE}{dw} = E'(w)$$

### 유도

합의 미분을 각 항으로 분리한 뒤 연쇄법칙을 적용한다. 앞서 구한 자코비안 $J_i$ 가 그대로 등장한다.

$$\frac{dE}{dw} = \sum_i \frac{d}{dw}\left[e_i^2\right]$$

$$\frac{d}{dw}\left[e_i^2\right] = 2 e_i \cdot \frac{d e_i}{dw} = 2 e_i \cdot J_i$$

$$\boxed{G = 2 \sum_i e_i \cdot J_i = 2 \sum_i e_i \cdot t_i \cdot e^{-w t_i}}$$

### 의미

그래디언트의 부호는 다음에 어느 쪽으로 움직여야 하는지를 알려 준다. $G > 0$ 이면 오른쪽으로 갈수록 SSE 가 커지므로 $w$ 를 줄여야 하고, $G < 0$ 이면 반대로 $w$ 를 늘려야 한다. $G$ 가 0 에 가까우면 거의 평평한 지점, 곧 최저점에 도달한 것이다.

| $G$ 부호 | 의미 | 다음 행동 |
|---|---|---|
| $G > 0$ | 우측으로 갈수록 SSE 증가 | $w$ 줄이기 |
| $G < 0$ | 좌측으로 갈수록 SSE 증가 | $w$ 늘리기 |
| $G \approx 0$ | 거의 평평 | 이미 최저점 |

같은 $G$ 가 여러 곳에서 재사용된다. 시각화의 접선 $y = E(w_n) + G \cdot (w - w_n)$, 포물선의 1차 항, Gauss-Newton 한 걸음 $\Delta w = -G/H$, 그리고 $G \approx 0$ 으로 멈추는 수렴 판정이 모두 같은 값을 쓴다.

| 용도 | 식 |
|---|---|
| 접선 (시각화) | $y = E(w_n) + G \cdot (w - w_n)$ |
| 포물선 1차 항 | $Q(w) = E(w_n) + G \cdot \Delta w + \tfrac{1}{2} H \cdot \Delta w^2$ |
| Gauss-Newton 한 걸음 | $\Delta w = -G/H$ |
| 수렴 판정 | $G \approx 0$ 이면 멈춤 |

코드로는 잔차와 자코비안의 곱을 더한 뒤 2 를 곱하면 된다.

```js
function sseGradient(w) {
  const e = residual(w);   // 잔차 5개
  const J = jacobian(w);   // 자코비안 5개 (= tᵢ·e^(-w·tᵢ))
  let g = 0;
  for (let i = 0; i < J.length; i++) g += e[i] * J[i];
  return 2 * g;            // G = 2·Σ eᵢ·Jᵢ
}
```

데모 아래 그래프에서 접선의 기울기로 보이는 값이 바로 이 $G$ 다.

---

## 11. 인터랙티브 데모

<div id="nonlinear-fitting-1d-demo"></div>
<script src="/assets/posts/2026-04-29-nonlinear-fitting-1d.js"></script>

### 위 그래프 (t, y)

위 그래프는 모델 식 $\hat{y}(t) = e^{-w \cdot t}$ 의 곡선과 데이터를 보여 준다. 파란 점은 노이즈가 섞인 관측값이고, 빨간 곡선은 현재 $w_n$ 으로 그린 모델, 초록 곡선은 한 걸음 뒤 $w_{n+1}$ 의 모델이다. 점선은 각 데이터에서의 잔차 $e_i = y_i - e^{-w t_i}$ 를 나타낸다.

| 색상 | 의미 | 식 |
|---|---|---|
| 파랑 데이터 점 | 노이즈 포함 관측값 | yᵢ |
| 빨강 현재 곡선 | 현재 wₙ 으로 그린 모델 | y = e^(−wₙ·t) |
| 초록 다음 곡선 | 한 걸음 후 wₙ₊₁ 의 모델 | y = e^(−wₙ₊₁·t) |
| 잔차 점선 | 데이터 − 예측 | eᵢ = yᵢ − e^(−w·tᵢ) |

### 아래 그래프 (w, SSE)

아래 그래프가 이 데모의 핵심이다. 파란 곡선은 비선형 SSE 전체 풍경, 주황 직선은 현재 위치의 그래디언트를 나타내는 접선, 보라 포물선은 $w_n$ 기준 1차 테일러에서 나온 SSE 의 이차근사다. 포물선 바닥의 보라 점이 미분이 0 인 다음 위치 $w_{n+1}$ 이고, 그 자리의 실제 SSE 가 작은 점으로 함께 찍힌다. 화살표는 한 걸음의 방향과 크기 $\Delta w$ 를 보여 준다.

| 색상 | 의미 |
|---|---|
| 파랑 실제 SSE(w) 곡선 | 비선형 (전체 풍경) |
| 주황 접선 | 현재 wₙ 에서의 그래디언트 (기울기) |
| 보라 이차근사 포물선 | wₙ 기준 Taylor 1차의 SSE 형태 |
| 보라 점 | 포물선 바닥 = wₙ₊₁ (∂Q/∂w = 0 인 점) |
| 작은 점 | 그 위치의 실제 SSE (비교) |
| 화살표 | Δw — 한 걸음의 방향과 크기 |

조작은 다음과 같다. w 슬라이더로 초기값을 정하고, 1 Step 으로 Gauss-Newton 한 걸음을 진행하며, Auto 로 수렴까지 자동 반복한다. Reset 은 슬라이더 값으로 되돌리고, 아래 그래프를 클릭하면 그 위치로 다시 시작한다.

---

## 12. 한 그래프에서 보이는 모든 핵심 개념

<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:640px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="640" height="360" fill="#ffffff"/>
  <text x="320" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="600">한 그래프에 담은 개념 — SSE, 접선(G), 이차근사, 한 걸음</text>
  <line x1="70" y1="300" x2="600" y2="300" stroke="#ccc" stroke-width="1"/>
  <line x1="90" y1="55" x2="90" y2="300" stroke="#ccc" stroke-width="1"/>
  <text x="82" y="64" text-anchor="end" fill="#999" font-size="11">SSE</text>
  <text x="596" y="318" text-anchor="end" fill="#999" font-size="11">w</text>
  <polyline fill="none" stroke="#3a6ea5" stroke-width="2.2" points="90.0,80.8 101.8,99.4 113.5,117.3 125.2,134.6 137.0,151.1 148.8,166.8 160.5,181.6 172.2,195.7 184.0,208.8 195.8,220.9 207.5,232.1 219.2,242.2 231.0,251.2 242.8,259.2 254.5,266.0 266.2,271.7 278.0,276.3 289.8,279.6 301.5,281.8 313.2,282.8 325.0,282.6 336.8,281.3 348.5,278.8 360.2,275.2 372.0,270.5 383.8,264.7 395.5,258.0 407.2,250.2 419.0,241.5 430.8,231.9 442.5,221.4 454.2,210.1 466.0,198.0 477.8,185.2 489.5,171.6 501.2,157.4 513.0,142.6 524.8,127.1 536.5,111.0 548.2,94.4 560.0,77.1"/>
  <text x="476" y="120" fill="#3a6ea5" font-size="12">실제 SSE (비선형)</text>
  <polyline fill="none" stroke="#8a7aa8" stroke-width="1.8" stroke-dasharray="6,4" points="101.8,88.4 111.7,106.5 121.7,123.6 131.7,139.7 141.7,154.9 151.7,169.2 161.7,182.5 171.7,194.9 181.7,206.3 191.7,216.8 201.7,226.3 211.7,234.9 221.7,242.6 231.7,249.3 241.7,255.1 251.7,259.9 261.7,263.8 271.7,266.7 281.7,268.7 291.7,269.8 298.4,269.9 308.4,269.4 318.4,268.0 328.4,265.6 338.4,262.2 348.4,257.9 358.4,252.7 368.4,246.5"/>
  <text x="372" y="240" fill="#8a7aa8" font-size="12">이차근사 (GN)</text>
  <line x1="113.5" y1="133.0" x2="255" y2="285.1" stroke="#b0392b" stroke-width="1.6"/>
  <text x="110" y="150" fill="#b0392b" font-size="12">접선 = G</text>
  <circle cx="184.0" cy="208.8" r="4" fill="#b0392b"/>
  <text x="176" y="200" text-anchor="end" fill="#333" font-size="11">w_n</text>
  <circle cx="297.9" cy="269.9" r="4" fill="#2e6b4f"/>
  <text x="308" y="264" fill="#2e6b4f" font-size="11">w_{n+1}</text>
  <line x1="184.0" y1="208.8" x2="184.0" y2="300" stroke="#ccc" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="297.9" y1="269.9" x2="297.9" y2="300" stroke="#ccc" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="184.0" y1="330" x2="297.9" y2="330" stroke="#2e6b4f" stroke-width="1.8" marker-end="url(#nca)"/>
  <text x="241" y="348" text-anchor="middle" fill="#2e6b4f" font-size="11">Δw 만큼 이동</text>
  <defs>
    <marker id="nca" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#2e6b4f"/>
    </marker>
  </defs>
</svg>

이 한 장에 모든 개념이 들어 있다. 비선형 SSE 풍경 위에 현재 위치 $w_n$ 이 시작점으로 찍히고, 그 점의 접선이 그래디언트를, 이차근사 포물선이 Gauss-Newton 의 시야를 나타낸다. 포물선 바닥의 보라 점이 미분이 0 인 점이자 다음 위치 $w_{n+1}$ 이며, 화살표가 그 한 걸음 $\Delta w$ 를 가리킨다.

---

## 13. 핵심 직관 — 미분 = 0

현재 위치 $w_n$ 에서 SSE 를 이차근사한 포물선은 다음과 같다.

$$Q(w) = E(w_n) + G \cdot (w - w_n) + \frac{1}{2} H \cdot (w - w_n)^2$$

여기서 $G = E'(w_n)$ 은 접선 기울기, $H \approx \sum J_i^2$ 은 곡률에 해당하는 Gauss-Newton 근사다. 이 포물선의 최소는 미분이 0 인 곳에 있으므로 다음 위치를 직접 풀 수 있다.

$$\frac{dQ}{dw} = G + H \cdot (w - w_n) = 0$$

$$\Rightarrow \;\; w_{n+1} = w_n - \frac{G}{H}$$

한 걸음의 크기 $\Delta w = -G/H$ 는 기울기를 곡률로 나눈 만큼의 이동이다.

### 시각적

<svg viewBox="0 0 560 270" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:560px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="560" height="270" fill="#ffffff"/>
  <text x="280" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="600">SSE 이차근사 포물선 — 미분 = 0 인 바닥</text>
  <line x1="70" y1="220" x2="500" y2="220" stroke="#ccc" stroke-width="1"/>
  <line x1="90" y1="55" x2="90" y2="220" stroke="#ccc" stroke-width="1"/>
  <text x="496" y="238" text-anchor="end" fill="#999" font-size="11">w</text>
  <text x="82" y="63" text-anchor="end" fill="#999" font-size="11">SSE</text>
  <polyline fill="none" stroke="#3a6ea5" stroke-width="2.2" points="90.0,74.2 105.2,96.6 120.4,117.1 135.6,135.8 150.8,152.6 166.0,167.5 181.2,180.6 196.4,191.8 211.6,201.1 226.8,208.6 242.0,214.2 257.2,217.9 272.4,219.8 287.6,219.8 302.8,217.9 318.0,214.2 333.2,208.6 348.4,201.1 363.6,191.8 378.8,180.6 394.0,167.5 409.2,152.6 424.4,135.8 439.6,117.1 454.8,96.6 470.0,74.2"/>
  <line x1="240" y1="220" x2="320" y2="220" stroke="#b0392b" stroke-width="2"/>
  <circle cx="280" cy="220" r="5" fill="#b0392b"/>
  <text x="280" y="208" text-anchor="middle" fill="#b0392b" font-size="11">미분 = 0 (수평 접선)</text>
  <line x1="280" y1="220" x2="280" y2="238" stroke="#bbb" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="280" y="252" text-anchor="middle" fill="#333" font-size="11">바닥 = w_{n+1}</text>
  <circle cx="181.2" cy="180.6" r="3" fill="#888"/>
  <text x="150" y="172" text-anchor="middle" fill="#777" font-size="10">기울기 ≠ 0</text>
  <circle cx="378.8" cy="180.6" r="3" fill="#888"/>
  <text x="410" y="172" text-anchor="middle" fill="#777" font-size="10">기울기 ≠ 0</text>
</svg>

---

## 14. 1D 와 다변수 — 같은 원리

차원이 늘어나도 구조는 그대로다. 1차원에서 곡선이던 SSE 는 다변수에서 다차원 그릇이 되고, 포물선은 포물면으로, 한 숫자이던 $\Delta w$ 는 벡터로 바뀐다. 미분이 0 인 점을 찾아 그곳으로 점프한다는 본질은 같고, 정규방정식도 스칼라 $H \Delta w = -G$ 가 행렬 $J^T J \Delta\mathbf{w} = -J^T \mathbf{e}$ 로 확장될 뿐이다.

| | 1D (지금) | 다변수 |
|---|---|---|
| 변수 | $w$ 1개 | $\mathbf{w}$ 벡터 |
| SSE | 1D 곡선 | 그릇 (다차원) |
| 이차근사 | 포물선 | 포물면 |
| 미분=0 점 | 한 점 ($w_{n+1}$) | 한 점 ($\mathbf{w}_{n+1}$) |
| Δw | 숫자 | 벡터 |
| 정규방정식 | $H \Delta w = -G$ (스칼라) | $J^T J \Delta\mathbf{w} = -J^T \mathbf{e}$ (행렬) |

---

## 15. 실험 추천

데모로 몇 가지 상황을 직접 확인해 볼 수 있다. 슬라이더를 0.7 에 두고 한 걸음을 진행하면 이차근사 포물선과 실제 SSE 곡선이 거의 일치해 한 걸음에 정답에 가까이 도달한다. 슬라이더를 2.0 으로 멀리 두면 두 곡선의 차이가 드러나면서 여러 번의 반복이 필요해진다. 0.1 처럼 매우 작은 값에서 Auto 를 돌리면 $w$ 가 0 근처라 자코비안이 약해 수렴이 더디다. 아래 그래프의 임의 지점을 클릭해 시작점을 바꾸면 여러 위치에서의 수렴 양상을 비교할 수 있다.

---

## 16. 다음 단계

이 1차원 직관이 잡히면 [2D 다변수 데모](nonlinear_fitting_visualization.md) 로 확장한다. 1차원에서 곡선과 포물선이 한 평면에 그려졌다면, 2차원에서는 그릇과 포물면이 3차원 공간이나 등고선으로 나타난다. 현재 위치에서 이차근사를 세우고 그 바닥으로 점프해 반복한다는 원리는 동일하다.
