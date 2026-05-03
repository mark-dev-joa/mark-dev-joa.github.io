---
title: Part 2·4 MAP — 사전 지식 추가, LM 의 λ 정체
description: MLE 위에 prior 를 추가한 MAP. 가우시안 prior 가 어떻게 L2 정칙화로 자연 도출되는지, LM 의 λ 가 사실 prior 강도임을 밝히는 글.
author: mark
date: 2026-05-02 12:00:00 +0900
categories: [math, optimization]
tags: [map, prior, regularization, ridge, lasso, lm, dls, bayesian]
math: true
---

# MAP — 사전 지식 추가, LM 의 λ 정체 밝히기

> Stage 3 (WLS) 가 "**관측 데이터의 신뢰도**" 를 인정한 거라면,
> Stage 4 (MAP) 는 "**파라미터 자체에 대한 사전 지식**" 을 인정.
>
> 결과: **L2 정칙화 자연 등장 + LM 의 $\lambda$ 정체 = 가우시안 prior 의 강도**.

---

## 📋 MAP 풀이 — MLE 의 자연 확장

| # | 단계 | MLE (Stage 2) | **MAP (이 글)** |
|---|---|---|---|
| 1 | 모델 정의 | $\hat{y} = f(t; w)$ | (동일) |
| 2 | likelihood | $L(w) = \prod P(y_i \mid w)$ | (동일) |
| 3 | **사전 지식** | (없음, 무지 가정) | $P(w) = \mathcal{N}(0, \tau^2)$ ★ |
| 4 | posterior | — | $P(w \mid D) \propto L(w) \cdot P(w)$ ★ |
| 5 | log → 손실 도출 | $\text{SSE}/2\sigma^2$ | $\text{SSE}/2\sigma^2 + \|w\|^2/2\tau^2$ ★ |
| 6 | 최적화 | $(J^T J)\Delta w = -J^T \mathbf{e}$ | $(J^T J + \lambda I)\Delta w = -J^T \mathbf{e}$ ★ |
| 7 | **LM 의 λ 정체** | (LM 은 임의 트릭) | $\lambda = \sigma^2/\tau^2$ = **prior 강도** ★★ |

> **LM 의 $\lambda$ 가 사실 prior 정밀도 (역분산)** 라는 깨달음 ★

핵심 등식:

$$\text{Loss}_{\text{MAP}} = \text{SSE}(w) + \lambda \|w\|^2$$

> **where**
> - 첫 항 $\text{SSE}(w)$ — **데이터 적합도** (잔차 제곱합)
> - 둘째 항 $\lambda \|w\|^2$ — **사전 지식** (정칙화, $w$ 너무 크지 않게)
> - $\lambda = \sigma^2/\tau^2$ — 두 항의 무게 추 (= LM 의 λ)

---

## 1. 출발점 — MLE 의 한계

지난 글들에서 본 MLE / SSE 풀이는 **데이터만** 가지고 $w$ 추정:

$$w_{\text{MLE}} = \arg\max_w L(w) = \arg\min_w \text{SSE}(w)$$

### 한계

| 상황 | MLE 결과 |
|---|---|
| 데이터 충분 + 노이즈 가정 맞음 | ✓ 정답에 수렴 |
| 데이터 적음 | ✗ overfitting (외운 듯) |
| $w$ 가 다중공선성 (여러 $w$ 조합이 같은 fit) | ✗ 풀이 불안정 |
| 잘못된 초기값 | ✗ 발산 (LM 의 λ 가 도와줘야) |

→ **데이터만으로는 부족**. 종종 **사전 지식** 이 도움.

### 예 — 회귀에서 overfitting

5점 데이터로 4차 다항식 fit → 5개 계수가 잡음까지 정확히 맞춤 → 새 데이터에서 망함.

해결: "**계수가 너무 크지 않을 것이다**" 라는 사전 가정을 모델에 넣어주기.

### 인터랙티브 데모 — MLE 의 한계 직접 보기

<div id="map-overfitting-demo"></div>
<script src="/assets/posts/2026-05-02-map-basics.js"></script>

| 색상 | 의미 |
|---|---|
| ⚪ 회색 점선 | 진짜 함수 $y = \sin(2t)$ |
| 🔵 파란 점 | 노이즈 있는 관측 데이터 |
| 🔴 빨간 점선 | **MLE fit** ($\lambda \to 0$) — 데이터만 |
| 🟣 보라 실선 | **MAP fit** ($\lambda > 0$) — prior 추가 |

#### 실험 추천

1. **"Overfit 시나리오" 버튼** 클릭 (N=10, 5점, λ=0)
   → MLE 가 미친 듯이 흔들림, 계수 폭발
   → 아래 막대에서 빨간 막대들 매우 큼 (수만 단위)

2. **"MAP 살림" 버튼** 클릭 (같은 조건, λ=0.01)
   → 같은 차수, 같은 데이터인데 MAP 는 부드러운 fit
   → 보라 막대는 작은 값 유지

3. **데이터 점 수 슬라이더** 늘림 (5 → 30)
   → 데이터 충분하면 MLE 도 안정 → 두 fit 가까워짐

4. **λ 슬라이더** 너무 키우면 ($\lambda > 1$)
   → 둘 다 거의 직선으로 (under-fit)
   → "정칙화 너무 강하면 데이터 무시"

---

## 2. 사전 지식 (Prior) 추가

데이터 보기 **전에** $w$ 에 대한 가정 = **사전 분포 (prior)**:

$$P(w) \;\;\;=\;\;\; \text{prior 분포}$$

### 단어 의미 — "사전" / "종합"

| 단어 | 의미 |
|---|---|
| **사전 (prior)** | "**미리, 먼저**" — 데이터 보기 **전** 에 가진 정보 |
| **사후 (posterior)** | "**나중, 후**" — 데이터 본 **후** 의 분포 |
| **종합 / 결합** | 사전 + 데이터를 **같이 보는** 행위 |

→ "**사전 지식 종합**" = "미리 알던 정보와 새 데이터를 같이 보기".

### 흔한 prior 종류

| Prior | 형태 | 의미 | 결과 정칙화 |
|---|---|---|---|
| **균일 (uniform)** | 모든 $w$ 같은 확률 | "아무것도 모름" | 정칙화 없음 (= MLE) |
| **가우시안** | $\mathcal{N}(0, \tau^2)$ | "$w$ 는 0 근처일 것" | **L2 (Ridge)** |
| **라플라스** | $\propto e^{-\|w\|/b}$ | "$w$ 정확히 0 인 경우 많음" | **L1 (LASSO, sparsity)** |
| **혼합** | 둘 다 | balanced | Elastic Net |

→ **prior 형태 선택 = 어떤 정칙화 쓸지 결정**.

### 우리 선택 — 가우시안 prior

이 글에서는 **가우시안** 으로 진행:

$$P(w) = \frac{1}{\sqrt{2\pi\tau^2}} \exp\!\left(-\frac{w^2}{2\tau^2}\right)$$

> **where**
> - $\mu_p = 0$: prior 평균 (관행, "0 근처일 것")
> - $\tau^2$: prior 의 분산 (얼마나 강하게 믿는지)
> - $\tau$ **작음**: "**강한** 사전 지식" — $w$ 거의 0 확신
> - $\tau$ **큼**: "**약한** 사전 지식" — 거의 무지

#### 왜 가우시안을 선택했나

| 이유 | 설명 |
|---|---|
| 1. **자연스러움** | "0 근처일 것" 의 가장 단순한 표현 |
| 2. **수학 편의** | 가우시안 likelihood 와 conjugate → posterior 도 가우시안 (closed form) |
| 3. **L2 정칙화 자동** | log 하면 $w^2$ 페널티 자연 등장 → **Ridge** |
| 4. **표준 디폴트** | 머신러닝/통계에서 가장 흔한 시작점 |

→ **"$w$ 가 작을 거 + 수학 편함"** 이 핵심 이유.

#### 가우시안 → L2 의 자연 도출

가우시안 prior 의 log:

$$\log P(w) = C - \frac{w^2}{2\tau^2}$$

→ 정확히 $w^2$ 페널티 등장 → **Ridge 정칙화 ($\lambda \|w\|^2$)** 그대로.

(Section 6 에서 자세히.)

### 결정할 것 — 사실상 $\lambda$ 한 개

가우시안 prior 는 두 요소 (평균 $\mu_p$, 분산 $\tau^2$) 인데:

| 요소 | 우리 케이스 |
|---|---|
| **평균 $\mu_p$** | **0 으로 고정** (표준 Ridge 관행) |
| **분산 $\tau^2$** | $\sigma^2$ 와 함께 $\lambda = \sigma^2/\tau^2$ 로 통합 |

→ 실무에서는 **$\lambda$ 한 개만 결정** (CV / 적응형 / 도메인 지식).

> 정교한 응용 (Kalman, Bayesian DL 등) 에서는 $\mu_p$ 도 의미 가짐 (예: Kalman 의 $\mu_p$ = 이전 추정값).
> 표준 Ridge / MAP 은 $\mu_p = 0$ 고정.

### Prior 는 "객관적 사실" 이 아닌 "모델 가정"

> **가우시안 prior 는 우리가 부과하는 가정**. 객관적 진실 X.
>
> 데이터/문제마다 더 좋은 prior 가 있을 수도:
> - **Sparsity** 원하면 → 라플라스 (LASSO)
> - **양수 제약** → log-normal
> - **이전 추정값** → Kalman 의 prior
>
> 가우시안은 가장 흔한 디폴트지만 **반드시는 아님**.

---

## 3. 베이지안 정리 — Posterior

데이터 본 **후** 의 $w$ 분포:

$$P(w \mid D) = \frac{P(D \mid w) \cdot P(w)}{P(D)}$$

> **where**
> - $P(w \mid D)$: **posterior** (사후 분포) — 데이터 본 후 $w$ 의 분포
> - $P(D \mid w) = L(w)$: **likelihood** — "$w$ 가 정해졌을 때 데이터가 나올 확률"
> - $P(w)$: **prior** (사전 분포)
> - $P(D)$: **evidence** (정규화 상수, $w$ 무관)

#### 📘 참고 — $P(D \mid w)$ 의 정확한 정의

$P(D \mid w)$ = "**파라미터 $w$ 가 주어졌을 때 데이터 $D$ 가 관측될 확률**" (= **likelihood**).

가우시안 노이즈 가정 ($N$ 개 점, 독립):

$$P(D \mid w) = \prod_{i=1}^{N} P(y_i \mid w) = \prod_i \frac{1}{\sqrt{2\pi\sigma^2}} \exp\!\left(-\frac{(y_i - \hat{y}_i)^2}{2\sigma^2}\right)$$

> **where**
> - $D = \{(t_1, y_1), \ldots, (t_N, y_N)\}$: 전체 데이터셋
> - $\hat{y}_i = \hat{y}(t_i; w)$: 모델 예측 ($w$ 의 함수)
> - 각 점 독립이라 곱

**MLE / MAP / Bayesian 모두 공통**:
- MLE: $\arg\max_w P(D \mid w)$
- MAP: $\arg\max_w P(D \mid w) \cdot P(w)$
- Bayesian: 전체 분포 $P(w \mid D)$

→ **$P(D \mid w)$ 는 모든 추정의 출발점** — 우리가 지난 글들에서 본 likelihood 와 같음.

핵심:

$$\boxed{P(w \mid D) \propto L(w) \cdot P(w)}$$

> **where**
> - $P(w \mid D)$: **posterior** — 데이터 본 후 $w$ 의 분포 (찾고 싶은 것)
> - $L(w) = P(D \mid w)$: **likelihood** — 데이터 적합도
> - $P(w)$: **prior** — 사전 지식
> - 분모 $P(D)$ 생략 (정규화 상수, $w$ 무관)

→ "**데이터 + 사전 지식 → 업데이트된 분포**" 의 기본 식.

#### 📘 참고 — 왜 $P(D)$ 를 무시할 수 있나

$P(D)$ 는 **$w$ 와 무관한 상수** (모든 $w$ 에 대해 likelihood × prior 를 적분한 양):

$$P(D) = \int P(D \mid w) \cdot P(w) \, dw$$

→ 적분 후라 $w$ 가 사라져있음 → **$w$ 의 함수 아님**.

##### argmax 의 핵심 성질

> **양의 상수로 나누기, 상수 더하기 → 정점 위치 안 변함**.

$$\arg\max_w \frac{f(w)}{P(D)} = \arg\max_w f(w) \quad (\text{단, } P(D) > 0)$$

따라서 MAP 의 정점 위치 (= $w_\text{MAP}$) 는 $P(D)$ 를 나누든 안 나누든 같음:

$$\arg\max_w P(w \mid D) = \arg\max_w \frac{P(D \mid w) P(w)}{P(D)} = \arg\max_w \big[P(D \mid w) P(w)\big]$$

→ **$P(D)$ 는 정점 위치 안 바꾸므로 풀이에서 무시**.

##### 시각적

```
P(w|D) = (L · P(w)) / P(D)                        
                                                   
   분자만:           ╭─╮                          
                  ╱     ╲    ← 정점 위치 = w_MAP  
                 ╱       ╲                         
              __╱         ╲__                     
                                                   
   ÷ P(D) 후:        ╭─╮                          
                  ╱     ╲     높이만 1/P(D)        
                 ╱       ╲    정점 위치 같음 ★    
              __╱         ╲__                     
```

##### 비례 기호 표기

이 이유로 베이지안 식을 자주 비례 기호로:

$$P(w \mid D) \;\;\propto\;\; L(w) \cdot P(w)$$

→ "$P(w \mid D)$ 는 $L(w) \cdot P(w)$ 에 **비례**" — 정확한 비례 상수 ($1/P(D)$) 는 풀이에 무관.

##### $P(D)$ 가 필요한 경우 (참고)

| 상황 | $P(D)$ 필요? |
|---|---|
| **MAP** (정점 위치만) | ❌ 무시 가능 |
| **신뢰구간 / 분산** | ✅ 정확한 확률값 필요 |
| **모델 비교** (Bayes factor) | ✅ 필요 |
| **Full Bayesian** (전체 분포) | ✅ 필요 |

→ 점 추정 (MAP) 에선 무시, **분포 추정** 단계 (Stage 5) 에선 직면.

---

## 4. MAP 정의

posterior 의 **최댓값** 위치:

$$w_{\text{MAP}} = \arg\max_w P(w \mid D) = \arg\max_w \big[L(w) \cdot P(w)\big]$$

### MLE 와 비교

| | MLE | MAP |
|---|---|---|
| 최대화 대상 | $L(w)$ | $L(w) \cdot P(w)$ |
| 사전 지식 | 무시 | 활용 |
| 결과 | "데이터 가장 그럴듯하게" | "데이터 + 사전 지식 종합 그럴듯하게" |

### 균일 prior 면 MLE 와 같음

$P(w) = $ 상수 면:

$$\arg\max_w \big[L(w) \cdot \text{상수}\big] = \arg\max_w L(w) = w_{\text{MLE}}$$

→ **MLE = MAP 의 특수 케이스** (균일 prior).

→ MAP 가 더 일반적, MLE 는 "사전 지식 없음" 가정.

---

## 5. log-posterior 유도

likelihood 와 prior 모두 가우시안이라 **곱 → 합 → log** 변환:

### Step 1. log 적용

$$\log P(w \mid D) = \log L(w) + \log P(w) - \log P(D)$$

마지막 항 ($-\log P(D)$) 은 $w$ 무관 → 상수.

### Step 2. likelihood log (지난 글 결과)

가우시안 노이즈 가정 — 여기서는 Stage 2 케이스 ($\sigma$ 동일) 로 시작:

$$\log L(w) = C_1 - \frac{\text{SSE}(w)}{2\sigma^2}$$

> WLS (점마다 다른 σᵢ) 도 같은 흐름 — Section 9 에서 결합 다룸.

### Step 3. prior log (가우시안 prior)

$$\log P(w) = \log\frac{1}{\sqrt{2\pi\tau^2}} - \frac{w^2}{2\tau^2} = C_2 - \frac{w^2}{2\tau^2}$$

### Step 4. 합치기

$$\log P(w \mid D) = (C_1 + C_2 - \log P(D)) - \frac{\text{SSE}(w)}{2\sigma^2} - \frac{w^2}{2\tau^2}$$

상수 묶어서:

$$\boxed{\log P(w \mid D) = C - \frac{\text{SSE}(w)}{2\sigma^2} - \frac{w^2}{2\tau^2}}$$

> **where**
> - $C$ — $w$ 무관 상수 (정규화 항들의 합, 최적화에서 무시)
> - $\sigma^2$ — 노이즈 분산 (가우시안 노이즈 가정)
> - $\tau^2$ — prior 분산 ($w$ 가 0 근처라는 사전 신뢰도)
> - $\text{SSE}/2\sigma^2$ — **데이터 항** (잔차)
> - $w^2/2\tau^2$ — **사전 항** (prior 페널티)

→ **데이터 항 + 사전 항** 의 분리.

---

## 6. L2 정칙화 등장 ★

posterior 최대화 = (음수 항) 최소화:

$$\arg\max_w \log P(w \mid D) = \arg\min_w \left[\frac{\text{SSE}(w)}{2\sigma^2} + \frac{w^2}{2\tau^2}\right]$$

> **여기서 $w^2$ 등장 이유**: prior 평균 $\mu_p = 0$ 가정 (Section 2). 일반 형태는 $(w - \mu_p)^2$ 인데 $\mu_p=0$ 이라 $w^2$.

양변에 $2\sigma^2$ 곱 (양의 상수, arg min 답 같음):

$$= \arg\min_w \left[\text{SSE}(w) + \frac{\sigma^2}{\tau^2} \cdot w^2\right]$$

여기서 $\lambda = \sigma^2/\tau^2$ 정의:

$$\boxed{\text{Loss}_{\text{MAP}}(w) = \text{SSE}(w) + \lambda \cdot w^2}$$

> **where**
> - $\text{SSE}(w) = \sum_i (y_i - \hat{y}_i)^2$ — 데이터 항
> - $\lambda \cdot w^2$ — 정칙화 페널티
> - $\lambda = \sigma^2/\tau^2$ — 두 항의 무게 추 (= LM 의 λ ★)

→ **L2 정칙화** (Ridge regression) 자연 등장.

| 항 | 의미 |
|---|---|
| $\text{SSE}(w)$ | 데이터 적합도 (낮을수록 데이터 잘 맞춤) |
| $\lambda \cdot w^2$ | **정칙화 페널티** (낮을수록 $w$ 가 작음) |

→ MAP 는 **두 항의 합 최소화** = "데이터 잘 맞추되, $w$ 너무 크지 않게".

---

## 7. 다른 Prior → 다른 정칙화

prior 가정만 바꾸면 다른 정칙화 자동 도출:

| Prior | log P(w) | 정칙화 항 | 이름 |
|---|---|---|---|
| **균일** | 상수 | (없음) | **OLS / MLE** |
| **가우시안** $\mathcal{N}(0, \tau^2)$ | $-w^2/2\tau^2$ | $\lambda \|w\|^2$ | **L2 / Ridge** |
| **라플라스** $\propto e^{-\|w\|/b}$ | $-\|w\|/b$ | $\lambda \|w\|_1$ | **L1 / LASSO** |
| **가우시안 + 라플라스** | 혼합 | $\alpha \|w\|^2 + \beta \|w\|_1$ | **Elastic Net** |

→ **모든 정칙화 = 어떤 prior 의 MAP 도출**.

### L1 vs L2 직관

```
L2 (Ridge):                       L1 (LASSO):                 
                                                              
  최적 w 가 0 근처지만             최적 w 들 일부가 정확히 0   
  완전히 0 은 아님                 (sparsity 유도)            
                                                              
  부드러운 정칙화                  딱 자르는 정칙화            
                                                              
  가우시안 prior                  라플라스 prior              
  → 종 모양 (0 근처 ok)           → 첨두형 (정확히 0 좋음)    
```

→ Feature selection 같은 작업에 L1 (LASSO) 자주 쓰임. 일반 회귀는 L2 (Ridge) 표준.

→ 이 글은 **가우시안 prior → L2** 케이스로 진행. 다음 섹션에서 LM 과 연결.

---

## 8. LM 의 λ 정체 밝히기 ★★

기억하시죠? LM (Levenberg-Marquardt) 의 정규방정식:

$$(J^T J + \lambda I) \Delta w = -J^T \mathbf{e}$$

> **where**
> - $J^T J$ — 가우스-뉴턴 헤시안 (데이터 항의 곡률)
> - $\lambda I$ — **정칙화 항** (안전장치 / prior)
> - $J^T \mathbf{e}$ — 그래디언트 (잔차 × 자코비안)

이게 사실 **MAP + 가우시안 prior 의 정규방정식** 과 정확히 같은 형태.

### 유도 — 단계별

GN 풀이와 같은 흐름: **잔차 1차 테일러 → MAP loss 에 대입 → 미분 → = 0**.

#### Step 1. MAP loss 정의

$$\text{Loss}(w) = \text{SSE}(w) + \lambda \|w\|^2 = \sum_i e_i^2 + \lambda \|w\|^2$$

#### Step 2. 잔차 1차 테일러 근사

현재 $w_n$ 근처:

$$e_i(w_n + \Delta w) \approx e_i(w_n) + J_i \cdot \Delta w$$

> **where**
> - $e_i$, $J_i$: 현재 $w_n$ 에서 계산된 상수
> - $\Delta w$: 변수 (얼마나 움직일까)

$\|w\|^2$ 는 직접 적용 (선형화 필요 X):

$$\|w_n + \Delta w\|^2 = w_n^2 + 2 w_n \Delta w + \Delta w^2$$

(또는 다변수 시 $\|w + \Delta w\|^2 = \|w\|^2 + 2 w^T \Delta w + \|\Delta w\|^2$.)

#### Step 3. MAP loss 에 대입

$$\widetilde{\text{Loss}}(\Delta w) = \sum_i [e_i + J_i \Delta w]^2 + \lambda (w_n + \Delta w)^2$$

#### Step 4. 전개

**SSE 부분** (Section 6 GN 유도와 동일):

$$\sum_i [e_i + J_i \Delta w]^2 = \sum_i e_i^2 + 2 \sum_i e_i J_i \cdot \Delta w + \sum_i J_i^2 \cdot \Delta w^2$$

**정칙화 부분**:

$$\lambda (w_n + \Delta w)^2 = \lambda w_n^2 + 2\lambda w_n \cdot \Delta w + \lambda \Delta w^2$$

**합치기** (Δw 의 이차함수):

$$\widetilde{\text{Loss}} = \tilde{a} + 2 \tilde{b} \Delta w + \tilde{c} \Delta w^2$$

여기서:

$$\tilde{a} = \sum_i e_i^2 + \lambda w_n^2 \quad (\text{상수})$$

$$\tilde{b} = \sum_i e_i J_i + \lambda w_n$$

$$\tilde{c} = \sum_i J_i^2 + \lambda$$

> **OLS / GN 과 비교**
> - GN: $a = \sum e_i^2$, $b = \sum e_i J_i$, $c = \sum J_i^2$
> - MAP: 정칙화 항 ($\lambda w_n^2$, $\lambda w_n$, $\lambda$) **추가**

#### Step 5. $\Delta w$ 로 미분

$$\frac{d \widetilde{\text{Loss}}}{d (\Delta w)} = 2\tilde{b} + 2\tilde{c} \Delta w$$

#### Step 6. = 0 (포물선 바닥)

$$2\tilde{b} + 2\tilde{c} \Delta w = 0$$

$$\tilde{c} \Delta w = -\tilde{b}$$

#### Step 7. 풀기 — 합 형태

$$\Delta w = -\frac{\tilde{b}}{\tilde{c}} = -\frac{\sum_i e_i J_i + \lambda w_n}{\sum_i J_i^2 + \lambda}$$

#### Step 8. 행렬 형태

벡터/행렬로:

- $\sum_i e_i J_i = J^T \mathbf{e}$ — 그래디언트 절반
- $\sum_i J_i^2 = J^T J$ — GN 헤시안
- $\lambda w_n = \lambda I \cdot w_n$ — 다변수 시 $\lambda I \cdot \mathbf{w}_n$

대입:

$$(J^T J + \lambda I) \Delta w = -(J^T \mathbf{e} + \lambda \mathbf{w}_n)$$

#### Step 9. 두 가지 형태 — MAP 정확형 vs LM 표준형

**MAP 정확형** (위에서 도출한 정확한 식):

$$\boxed{(J^T J + \lambda I) \Delta w = -J^T \mathbf{e} - \lambda \mathbf{w}_n}$$

→ 우변에 $-\lambda \mathbf{w}_n$ 까지 포함. "$\Delta w$ 가 정칙화도 반영" → **결과 $w$ 가 0 으로 끌림**.

**LM 표준형** (Marquardt 1963 의 원래 형태):

$$\boxed{(J^T J + \lambda I) \Delta w = -J^T \mathbf{e}}$$

→ $-\lambda \mathbf{w}_n$ 항 제거. "$\Delta w$ 자체의 안정성" 만 강조 (수치 트릭 시점).

→ **두 형태 모두 헤시안 $J^T J + \lambda I$ 동일**, 우변만 다름.

### $\lambda I$ 가 어디서 왔나

| 항 | 출처 |
|---|---|
| $J^T J$ | SSE 의 GN 헤시안 |
| **$\lambda I$** | **$\|w\|^2$ 의 2차 미분** (= $\lambda \cdot 2$) |
| $J^T \mathbf{e}$ | SSE 의 그래디언트 |

→ "$\|w\|^2$ 의 곡률 = 단위행렬 × $\lambda$" → **헤시안에 $\lambda I$ 자연 등장**.

→ **LM 의 정규방정식과 동일** ★

### LM vs MAP 시점 비교

| LM 시점 | MAP 시점 |
|---|---|
| "$\lambda$ 가 stuck 일 때 $J^T J$ 보강" | "$\lambda = \sigma^2/\tau^2$, prior 의 강도" |
| 임의의 트릭 (Marquardt 1963) | **확률적 정당화** ★ |
| $\lambda$ 적응형 (SSE 변화로 조정) | $\tau$ 가 결정 (사전 지식의 신뢰도) |

→ **LM 은 MAP 풀이의 한 형태**. $\lambda$ 의 진짜 의미 = **"$w$ 사전 정밀도"** ($1/\tau^2$ 의 스케일된 형태).

→ IK 의 DLS 도 같은 식 — Section 12 응용에서 자세히.

---

## 9. WLS + MAP 결합 — 실무 표준 ★

지금까지 본 두 흐름:

- **WLS** (Stage 3): 점마다 다른 σᵢ → 가중 SSE → $(J^T W J)\Delta w = -J^T W \mathbf{e}$
- **MAP** (Stage 4): 파라미터 prior → SSE + $\lambda \|w\|^2$ → $(J^T J + \lambda I)\Delta w = -J^T \mathbf{e}$

**둘 다** 적용하면:

$$\text{Loss} = \underbrace{\sum_i w_i r_i^2}_{\text{WLS — 점별}} + \underbrace{\lambda \|w\|^2}_{\text{MAP — 파라미터 prior}}$$

### 정규방정식

$$\boxed{(J^T W J + \lambda I) \Delta w = -J^T W \mathbf{e}}$$

→ 헤시안에 **$W$** (가중치) **+** **$\lambda I$** (정칙화) 둘 다.

### 두 가지 분포가 다른 차원에서 작동

| | 무엇이 가우시안? | 차원 |
|---|---|---|
| **WLS 가정** | 관측 $y_i$ (점마다 σᵢ) | 관측 공간 |
| **MAP 가정** | 파라미터 $w$ | 파라미터 공간 |

→ **두 가우시안이 다른 정보** — 합쳐서 종합 추정.

### 실무 예 — 모두 같은 식

| 응용 | $W$ 의미 | $\lambda I$ 의미 |
|---|---|---|
| **Bundle Adjustment** | reprojection error 별 정밀도 | 카메라/점 변화 작게 |
| **ICP + Robust** | 매칭 거리/법선 가중 | 변환 안정성 |
| **Kalman Filter** | 센서 측정 분산 ($R^{-1}$) | 이전 추정값 prior ($P^{-1}$) |
| **IK + 센서 융합** | 위치/방향 별 정밀도 | 관절 변화 작게 (DLS) |
| **Ridge + sample weight** | 데이터 점 신뢰도 | 계수 작게 |

→ **현대 추정 프레임워크의 척추** = WLS + MAP.

### 한 줄

> $(J^T W J + \lambda I) \Delta w = -J^T W \mathbf{e}$
>
> "가중 데이터 + 파라미터 prior" 둘 다 반영. Kalman, BA, ICP, IK 의 표준.

---

## 10. Prior 강도 직관

$\lambda = \sigma^2 / \tau^2$ 의 의미:

| Prior 분산 $\tau^2$ | $\lambda$ | 의미 | 결과 |
|---|---|---|---|
| **매우 큼** ($\tau \to \infty$) | 매우 작음 (≈ 0) | "사전 지식 없음" | **MLE 와 동일** |
| 큼 | 작음 | "약한 prior" | MLE 에 가까움 |
| 중간 | 중간 | "보통 prior" | balanced |
| 작음 | 큼 | "강한 prior" | $w$ 가 0 으로 끌림 |
| **매우 작음** ($\tau \to 0$) | 매우 큼 (∞) | "$w$ = 0 확신" | $w \to 0$ |

### 시각적

```
λ = 0 (MLE):                                       
   loss landscape = SSE 그대로                     
   → 데이터에 100% fit                             
                                                   
λ 작음:                                            
   loss = SSE + (작은) w²                          
   → 데이터 fit, w 살짝 작아짐                      
                                                   
λ 큼:                                              
   loss = SSE + (큰) w²                            
   → w² 페널티가 지배 → w 0 근처로 끌림            
   → 데이터에 덜 맞춤 (under-fit)                   
                                                   
λ → ∞:                                             
   loss ≈ ∞·w²                                     
   → w = 0 강제                                    
   → 데이터 무시                                    
```

→ **λ 가 "데이터 vs 사전 지식" 사이의 무게 추**.

---

## 11. λ 어떻게 결정하나

실무에서 가장 어려운 부분 — 상황별로 다른 방법:

### 1. **Cross-Validation (CV)** ⭐ 가장 흔함

데이터를 train / validation 나눠서 여러 λ 시도:

```
λ 후보: [1e-6, 1e-4, 1e-2, 1, 100]
   ↓ 각 λ 마다
   train 으로 학습 → validation 에러 측정
   ↓
가장 낮은 validation 에러의 λ 선택
```

→ k-fold CV (보통 k=5) 가 표준. `sklearn.linear_model.RidgeCV` 가 자동.

### 2. **적응형 (LM 의 Marquardt 규칙)** ⭐ 비선형

매 iteration 마다 SSE 변화로 λ 조정:
- SSE 감소 → λ ÷ 10 (정칙화 약화, GN 처럼)
- SSE 증가 → λ × 10 (정칙화 강화, GD 처럼)

→ 우리 LM 데모에서 본 것. **비선형 최적화의 표준**.

### 3. **도메인 지식**

| 도메인 | 일반적 λ |
|---|---|
| Ridge regression | $10^{-3} \sim 1$ |
| LM 비선형 | $10^{-4} \sim 10^{2}$ (적응) |
| IK DLS | $10^{-3} \sim 10^{-1}$ |
| Kalman ($Q$) | 시스템 모델로부터 |

### 4. **L-Curve**

$\log\|\mathbf{r}\|^2$ vs $\log\|w\|^2$ 곡선의 무릎 (corner) 점.

### 5. **Empirical Bayes / Hierarchical**

λ 자체를 데이터로 추정 (marginal likelihood 최대화). 수학적으로 옳지만 복잡.

### 실무 추천 표

| 상황 | 방법 |
|---|---|
| 선형 회귀 (Ridge/LASSO) | **CV** |
| 비선형 회귀 (GN/LM) | **적응형 (Marquardt)** |
| IK DLS | 적응형 또는 도메인 fixed |
| Kalman | $Q$ (process noise) — 시스템 모델 |
| 데이터 매우 적음 | L-Curve / Bayesian |

→ **CV** + **적응형** 이 90% 케이스 커버.

---

## 12. 응용 — Overfitting / DLS / Bayesian 입문

### 12-1. Overfitting 방지 (머신러닝)

데이터 적은 경우 ($N=5$) + 복잡한 모델 (4차 다항):
- MLE 는 데이터 5개를 외움 (잡음까지) → 새 데이터에서 망함

**MAP 해결**: 가우시안 prior + 적절한 $\lambda$
→ 계수가 너무 크지 않도록 제약
→ 새 데이터에서도 잘 맞음 (generalization 향상)

→ **머신러닝 정칙화의 표준 기법**.

### 12-2. IK 의 DLS (Damped Least Squares)

IK 에서 자코비안 $J$ 가 **특이점 근처** 에서 거의 singular:
- $J^T J$ 행렬이 거의 0 → 역행렬 매우 큼
- $\Delta\theta$ 폭발 → 관절이 미친 듯이 움직임

**DLS 해결**:

$$\Delta\theta = (J^T J + \lambda I)^{-1} J^T \mathbf{e}$$

> **where**
> - $\Delta\theta$ — 관절 변화량
> - $J$ — 자코비안 ($\partial \text{end-effector}/\partial \theta$)
> - $\mathbf{e}$ — end-effector 위치/방향 오차
> - $\lambda I$ — 안정성 항 (= "관절 변화 작게" prior)

→ $\lambda I$ 추가로 $J^T J$ 가 항상 invertible + 안정.

**MAP 해석**: "$\theta$ 변화가 작은 게 사전적으로 그럴듯" prior.

→ **로보틱스 IK 의 표준 안전장치 = MAP + 가우시안 prior** ★

### 12-3. 베이지안 회귀 입문

MAP 는 **점 추정** (one $w_{\text{MAP}}$).
**Full Bayesian** 은 **분포 추정** (전체 $P(w \mid D)$):
- $w$ 의 평균, 분산, 신뢰구간 등 모두
- 의사결정에 불확실성 반영
- **Stage 5 (Kalman, MCMC, VI) 의 주제**

→ MAP 는 베이지안 추론으로 가는 디딤돌.

---

## 13. 핵심 통찰

> **MLE = "데이터만"**
> **MAP = "데이터 + 사전 지식"**
>
> Loss = $\text{SSE}$ (데이터 적합) + $\lambda \|w\|^2$ (사전 지식 = 정칙화)
>
> $\lambda$ 가 두 항의 무게 추 — **LM 의 $\lambda$ 가 사실 이거** ★

### 위계 다시 보기

```
 확률 모델 가정                MLE 결과 (데이터만)              
                                                                
 가우시안 (모두 같은 σ)        OLS / MSE                        
 가우시안 (점마다 σᵢ)          WLS                              
 라플라스                      LAD                              
 베르누이                      Cross-entropy                    
                                                                
 + 가우시안 prior P(w)         **MAP + L2 정칙화 (Ridge)**       
 + 라플라스 prior P(w)         **MAP + L1 정칙화 (LASSO)**       
                                                                
 위 모든 것 = 점 추정                                           
 ↓                                                              
 Full Bayesian = 분포 추정 (Stage 5)                             
```

→ MAP 가 MLE → Bayesian 의 자연스러운 다리.

---

## 14. 다음 단계 — Stage 5 (Full Bayesian + Kalman)

MAP 는 posterior 의 **정점만** 추정. 다음:

### Full Bayesian
- **전체 posterior 분포** 추정
- $w$ 의 신뢰구간, 예측 분산
- **MCMC, Variational Inference** 등의 알고리즘

### Kalman Filter
- **시간에 따라 변하는 상태** 의 MAP/Bayesian 갱신
- 예측 step (prior) + 업데이트 step (likelihood)
- 매 시간마다 posterior 를 다음 prior 로 사용

### 응용 — SLAM, 센서 퓨전, 로봇 localization
- 센서 데이터 + 로봇 운동 모델 (prior) → 위치 추정
- 모두 **MAP/Bayesian 의 시간 확장**.

---

## 15. 한 줄 요약

> **MAP = MLE + Prior**.
> 가우시안 prior → L2 정칙화 → **LM 의 λ 정체 = $\sigma^2/\tau^2$**.
> "데이터" 만에서 "데이터 + 사전 지식" 으로의 자연 진화.
