---
title: Part 2·5 MAP
description: MLE 위에 prior 를 추가한 MAP. 가우시안 prior 가 어떻게 L2 정칙화로 자연 도출되는지, LM 의 λ 가 사실 prior 강도임을 밝히는 글. 동전 예제로 MLE vs MAP 전 과정 포함.
author: mark
date: 2026-05-02 12:00:00 +0900
categories: [math, optimization]
tags: [map, prior, regularization, ridge, lasso, lm, dls, bayesian]
math: true
---


WLS 가 관측 데이터의 신뢰도를 추정에 반영하는 단계라면, MAP (Maximum a Posteriori) 는 파라미터 자체에 대한 사전 지식을 반영하는 단계다. 가우시안 prior 를 도입하면 SSE 에 $\|w\|^2$ 페널티가 자연스럽게 더해져 L2 정칙화 (Ridge regression) 가 도출되고, 이때 정칙화의 강도 $\lambda$ 는 LM 알고리즘에서 임의의 안전장치로 등장하던 그 $\lambda$ 와 정확히 같은 형태의 정규방정식을 만든다. 이 문서는 그 동치 관계를 유도하고, $\lambda$ 의 진짜 의미가 prior 정밀도 $\sigma^2/\tau^2$ 임을 밝힌다.

핵심 등식은 다음 한 줄로 압축된다.

$$\text{Loss}_{\text{MAP}}(w) = \text{SSE}(w) + \lambda \|w\|^2, \quad \lambda = \sigma^2/\tau^2$$

첫 항은 데이터 적합도 (잔차 제곱합), 둘째 항은 사전 지식에서 오는 정칙화 페널티이며, $\lambda$ 가 두 항의 가중치를 결정한다. 노이즈 분산 $\sigma^2$ 이 크거나 prior 분산 $\tau^2$ 이 작을수록 $\lambda$ 가 커져 사전 지식 쪽으로 추정이 끌린다.

---

## 1. 출발점 — MLE 의 한계

MLE 는 데이터만으로 $w$ 를 추정한다.

$$w_{\text{MLE}} = \arg\max_w L(w) = \arg\min_w \text{SSE}(w)$$

데이터가 충분하고 노이즈 가정이 맞는 경우 MLE 는 정답에 수렴한다. 그러나 데이터가 적은 상황에서는 모델이 잡음까지 외워 새로운 데이터에 대한 일반화 성능이 떨어지고 (overfitting), 여러 $w$ 조합이 동일한 적합도를 주는 다중공선성에서는 풀이가 불안정해지며, 초기값이 나쁘면 발산하기도 한다. 데이터만으로는 부족한 상황에서 사전 지식이 도움이 된다.

전형적인 예가 회귀에서의 overfitting 이다. 5 점의 데이터에 4 차 다항식을 적합시키면 다섯 개의 계수가 잡음까지 정확히 맞추는 형태로 결정되어 새 데이터에서 큰 오차를 낸다. 이 문제는 "계수가 너무 크지 않을 것이다" 라는 사전 가정을 모델에 도입함으로써 해결된다.

### 인터랙티브 데모 — MLE 의 한계

<div id="map-overfitting-demo"></div>
<script src="/assets/posts/2026-05-02-map-basics.js"></script>

회색 점선은 진짜 함수 $y = \sin(2t)$, 파란 점은 노이즈 있는 관측, 빨간 점선은 MLE fit ($\lambda \to 0$), 보라 실선은 MAP fit ($\lambda > 0$) 이다. Overfit 시나리오 버튼 (N=10, 5 점, λ=0) 을 누르면 MLE 가 심하게 흔들리고 계수가 폭발한다. 같은 조건에서 λ=0.01 로 MAP 를 적용하면 부드러운 적합이 회복된다. 데이터 점 수를 늘리면 두 적합이 가까워지고, $\lambda$ 를 너무 키우면 둘 다 거의 직선이 되어 under-fit 이 발생한다.

---

## 2. 사전 지식 (Prior) 추가

데이터를 보기 전에 $w$ 에 대해 가지고 있는 가정이 사전 분포 (prior) $P(w)$ 다. "사전 (prior)" 은 데이터를 보기 전, "사후 (posterior)" 는 데이터를 본 후의 분포를 가리키며, MAP 는 이 둘을 베이지안 정리로 연결한다.

흔히 쓰이는 prior 는 균일 분포, 가우시안, 라플라스 정도다. 균일 prior 는 모든 $w$ 에 같은 확률을 주어 "아무것도 모름" 을 의미하며 결과적으로 정칙화가 사라져 MLE 와 동일한 풀이가 된다. 가우시안 prior $\mathcal{N}(0, \tau^2)$ 는 $w$ 가 0 근처에 있을 것이라는 가정이며 L2 정칙화 (Ridge) 를 도출한다. 라플라스 prior $\propto e^{-\|w\|/b}$ 는 $w$ 의 일부가 정확히 0 일 가능성을 강조하며 L1 정칙화 (LASSO) 와 sparsity 를 유도한다. prior 형태의 선택이 곧 어떤 정칙화를 사용할지의 선택이다.

### 가우시안 prior 의 선택

이 문서는 가우시안 prior 로 진행한다.

$$P(w) = \frac{1}{\sqrt{2\pi\tau^2}} \exp\left(-\frac{w^2}{2\tau^2}\right)$$

평균 $\mu_p = 0$ 은 표준 Ridge 의 관행이며, 분산 $\tau^2$ 이 사전 지식의 강도를 결정한다. $\tau$ 가 작을수록 "강한 사전 지식" 으로 $w$ 가 0 근처에 있다는 확신이 크고, $\tau$ 가 클수록 "약한 사전 지식" 이 되어 거의 무지에 가까워진다. 가우시안을 선택하는 이유는 세 가지다. "$w$ 가 0 근처일 것" 이라는 가정의 가장 단순한 표현이라는 점, 가우시안 likelihood 와 결합할 때 conjugate 관계로 posterior 도 가우시안이 되어 닫힌 형태가 가능하다는 점, 로그를 취하면 $w^2$ 페널티가 자연스럽게 등장하여 L2 정칙화로 환원된다는 점이다.

가우시안 prior 가 객관적 진실은 아니다. 데이터와 문제의 성격에 따라 sparsity 가 필요하면 라플라스가, 양수 제약이 있으면 log-normal 이, 시간 따라 갱신되는 추정에서는 Kalman 의 동적 prior 가 더 적절하다. 가우시안은 표준 디폴트일 뿐이며, prior 는 우리가 부과하는 모델 가정이다.

### 결정해야 할 것 — 사실상 $\lambda$ 한 개

가우시안 prior 는 $(\mu_p, \tau^2)$ 두 요소로 정의되지만, 실무에서는 $\mu_p = 0$ 으로 고정하고 $\tau^2$ 도 노이즈 분산 $\sigma^2$ 와 묶어 $\lambda = \sigma^2/\tau^2$ 한 값으로 통합한다. 결정해야 할 것은 $\lambda$ 한 개이며, 그 결정 방법은 §11 에서 다룬다. Kalman 이나 Bayesian DL 처럼 $\mu_p$ 가 의미를 갖는 응용도 있지만 (예: Kalman 의 $\mu_p$ = 직전 추정값), 표준 Ridge / MAP 에서는 0 으로 고정한다.

---

## 3. 베이지안 정리 — Posterior

데이터를 본 후의 $w$ 분포는 베이지안 정리로 주어진다.

$$P(w \mid D) = \frac{P(D \mid w) \cdot P(w)}{P(D)}$$

좌변 $P(w \mid D)$ 가 posterior, $P(D \mid w)$ 가 likelihood $L(w)$, $P(w)$ 가 prior, 분모 $P(D)$ 가 evidence 라 불리는 정규화 상수다.

### Likelihood 의 정확한 정의

$P(D \mid w)$ 는 "파라미터 $w$ 가 주어졌을 때 데이터 $D$ 가 관측될 확률" 이며, 이는 MLE 에서 다뤄온 likelihood 와 같다. 가우시안 노이즈 가정 ($N$ 개 점, 독립) 하에서는 다음과 같다.

$$P(D \mid w) = \prod_{i=1}^{N} P(y_i \mid w) = \prod_i \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(y_i - \hat{y}_i)^2}{2\sigma^2}\right)$$

여기서 $D = \lbrace (t_1, y_1), \ldots, (t_N, y_N) \rbrace$ 는 전체 데이터셋, $\hat{y}_i = \hat{y}(t_i; w)$ 는 $w$ 에 의존하는 모델 예측이다. MLE 는 $\arg\max_w P(D \mid w)$, MAP 는 $\arg\max_w P(D \mid w) P(w)$, 전체 베이지안 추론은 분포 $P(w \mid D)$ 자체를 다루며, 모든 추정은 이 likelihood 를 출발점으로 삼는다.

### 비례 형태와 $P(D)$ 의 무시

MAP 의 핵심 관계식은 다음과 같다.

$$P(w \mid D) \propto L(w) \cdot P(w)$$

분모 $P(D) = \int P(D \mid w) P(w) \, dw$ 는 $w$ 에 대한 적분이 끝난 양이므로 $w$ 의 함수가 아니며 상수다. argmax 의 핵심 성질에 의해 양의 상수로 나누거나 상수를 더해도 정점 위치는 바뀌지 않으므로, MAP 추정값은 $P(D)$ 를 무시하고 분자만으로 결정된다.

$$\arg\max_w P(w \mid D) = \arg\max_w \frac{P(D \mid w) P(w)}{P(D)} = \arg\max_w \big[P(D \mid w) P(w)\big]$$

$P(D)$ 가 필요한 경우는 신뢰구간이나 분산을 정량화할 때, Bayes factor 로 모델을 비교할 때, 전체 posterior 분포를 다루는 full Bayesian 추론을 수행할 때다. 점 추정인 MAP 에서는 무시할 수 있고, 분포 추정 단계 (Stage 5) 에서 다시 마주하게 된다.

---

## 4. MAP 정의

MAP 추정값은 posterior 의 최댓값 위치다.

$$w_{\text{MAP}} = \arg\max_w P(w \mid D) = \arg\max_w \big[L(w) \cdot P(w)\big]$$

MLE 와의 차이는 prior 를 곱하느냐의 한 가지다. MLE 는 $L(w)$ 만 최대화하여 사전 지식을 무시하고, MAP 는 $L(w) \cdot P(w)$ 를 최대화하여 데이터와 사전 지식을 모두 반영한다. prior 가 균일 분포 $P(w) = $ 상수인 경우 $\arg\max_w [L(w) \cdot \text{상수}] = \arg\max_w L(w)$ 이므로 MAP 는 MLE 와 일치한다. MLE 는 MAP 의 특수한 경우이며, MAP 가 더 일반적인 추정 틀이다.

---

## 5. log-posterior 유도

likelihood 와 prior 모두 가우시안이라 곱을 합으로 바꾸기 위해 로그를 취한다.

$$\log P(w \mid D) = \log L(w) + \log P(w) - \log P(D)$$

마지막 항 $-\log P(D)$ 는 $w$ 와 무관한 상수다. 가우시안 노이즈 가정 하에서 likelihood 의 로그는 MLE 유도에서 본 것과 같다.

$$\log L(w) = C_1 - \frac{\text{SSE}(w)}{2\sigma^2}$$

WLS 의 경우 (점마다 다른 $\sigma_i$) 도 같은 흐름으로 전개되며, 두 가정을 결합한 형태는 §9 에서 다룬다. 가우시안 prior 의 로그는 다음과 같다.

$$\log P(w) = \log\frac{1}{\sqrt{2\pi\tau^2}} - \frac{w^2}{2\tau^2} = C_2 - \frac{w^2}{2\tau^2}$$

세 항을 합치면 다음 식이 얻어진다.

$$\log P(w \mid D) = (C_1 + C_2 - \log P(D)) - \frac{\text{SSE}(w)}{2\sigma^2} - \frac{w^2}{2\tau^2}$$

상수항을 $C$ 로 묶으면 핵심 등식이 된다.

$$\log P(w \mid D) = C - \frac{\text{SSE}(w)}{2\sigma^2} - \frac{w^2}{2\tau^2}$$

$C$ 는 $w$ 무관한 상수, $\sigma^2$ 은 노이즈 분산, $\tau^2$ 은 prior 분산이다. 두 음수 항이 데이터 항 (잔차) 과 사전 항 (prior 페널티) 으로 분리되며, 이 분리가 다음 절의 L2 정칙화 도출의 출발점이다.

---

## 6. L2 정칙화의 등장

posterior 의 최대화는 음수 항들의 최소화와 동치다.

$$\arg\max_w \log P(w \mid D) = \arg\min_w \left[\frac{\text{SSE}(w)}{2\sigma^2} + \frac{w^2}{2\tau^2}\right]$$

$w^2$ 가 등장하는 이유는 prior 평균 $\mu_p = 0$ 의 가정 때문이며, 일반 형태는 $(w - \mu_p)^2$ 다. 양변에 양의 상수 $2\sigma^2$ 을 곱해도 $\arg\min$ 은 보존되므로 다음과 같이 정리된다.

$$\arg\min_w \left[\text{SSE}(w) + \frac{\sigma^2}{\tau^2} \cdot w^2\right]$$

여기서 $\lambda = \sigma^2/\tau^2$ 로 정의하면 MAP 의 손실 함수가 얻어진다.

$$\text{Loss}_{\text{MAP}}(w) = \text{SSE}(w) + \lambda \cdot w^2$$

$\text{SSE}(w) = \sum_i (y_i - \hat{y}_i)^2$ 가 데이터 항, $\lambda \cdot w^2$ 가 정칙화 페널티이며, $\lambda = \sigma^2/\tau^2$ 가 두 항의 무게추 역할을 한다. 이 형태가 정확히 Ridge regression 의 손실 함수이며, 가우시안 prior 가 L2 정칙화를 자연스럽게 도출함을 보여준다. MAP 추정은 데이터 적합도와 $w$ 의 크기 제약 사이의 균형을 맞추는 최소화 문제다.

---

## 7. 다른 Prior, 다른 정칙화

prior 가정만 바꾸면 다른 정칙화가 같은 절차로 도출된다.

| Prior | $\log P(w)$ | 정칙화 항 | 이름 |
|---|---|---|---|
| 균일 | 상수 | (없음) | OLS / MLE |
| 가우시안 $\mathcal{N}(0, \tau^2)$ | $-w^2/2\tau^2$ | $\lambda \|w\|^2$ | L2 / Ridge |
| 라플라스 $\propto e^{-\|w\|/b}$ | $-\|w\|/b$ | $\lambda \|w\|_1$ | L1 / LASSO |
| 가우시안 + 라플라스 | 혼합 | $\alpha \|w\|^2 + \beta \|w\|_1$ | Elastic Net |

모든 정칙화는 어떤 prior 의 MAP 도출 결과로 해석할 수 있다. L2 (Ridge) 와 L1 (LASSO) 의 차이는 prior 분포 모양의 차이에서 비롯된다. 가우시안 prior 는 종 모양으로 0 근처를 부드럽게 선호하므로 최적 $w$ 가 0 근처로 끌리되 정확히 0 이 되지는 않는다. 라플라스 prior 는 0 에서 첨두형 (cusp) 을 가지므로 일부 $w$ 가 정확히 0 으로 떨어지는 sparsity 를 유도한다. Feature selection 같은 작업에는 L1 (LASSO) 이, 일반 회귀에는 L2 (Ridge) 가 표준으로 쓰인다. 이 문서는 가우시안 prior → L2 의 경로를 따라가며, 다음 절에서 LM 알고리즘과의 동치 관계를 보인다.

---

## 8. LM 의 λ 정체

LM (Levenberg-Marquardt) 의 정규방정식은 다음과 같다.

$$(J^T J + \lambda I) \Delta w = -J^T \mathbf{e}$$

$J^T J$ 가 가우스-뉴턴 헤시안 (데이터 항의 곡률), $\lambda I$ 가 안전장치 역할의 정칙화 항, $J^T \mathbf{e}$ 가 그래디언트다. 이 식이 사실 MAP + 가우시안 prior 의 정규방정식과 정확히 같은 형태다. LM 에서 임의의 수치 트릭으로 도입되었던 $\lambda I$ 가 확률론적으로는 prior 의 강도에 해당한다는 것이 이 절의 결론이다.

### 단계별 유도

GN 풀이와 같은 흐름으로 진행한다. 잔차를 1차 테일러 근사하고, MAP loss 에 대입하여 $\Delta w$ 의 이차함수로 만든 뒤, 미분 = 0 으로 푼다.

MAP loss 는 다음과 같다.

$$\text{Loss}(w) = \text{SSE}(w) + \lambda \|w\|^2 = \sum_i e_i^2 + \lambda \|w\|^2$$

현재 $w_n$ 근처에서 잔차의 1차 테일러 근사는 $e_i(w_n + \Delta w) \approx e_i(w_n) + J_i \cdot \Delta w$ 다. 여기서 $e_i$, $J_i$ 는 $w_n$ 에서 계산된 상수, $\Delta w$ 가 변수다. $\|w\|^2$ 는 다항식이므로 직접 전개한다.

$$\|w_n + \Delta w\|^2 = \|w_n\|^2 + 2 w_n^T \Delta w + \|\Delta w\|^2$$

MAP loss 에 대입하면 다음과 같다.

$$\widetilde{\text{Loss}}(\Delta w) = \sum_i [e_i + J_i \Delta w]^2 + \lambda (w_n + \Delta w)^2$$

SSE 부분과 정칙화 부분을 각각 전개한다.

$$\sum_i [e_i + J_i \Delta w]^2 = \sum_i e_i^2 + 2 \sum_i e_i J_i \cdot \Delta w + \sum_i J_i^2 \cdot \Delta w^2$$

$$\lambda (w_n + \Delta w)^2 = \lambda w_n^2 + 2\lambda w_n \cdot \Delta w + \lambda \Delta w^2$$

합치면 $\Delta w$ 의 이차함수 $\widetilde{\text{Loss}} = \tilde{a} + 2 \tilde{b} \Delta w + \tilde{c} \Delta w^2$ 가 되며, 계수는 다음과 같다.

$$\tilde{b} = \sum_i e_i J_i + \lambda w_n, \quad \tilde{c} = \sum_i J_i^2 + \lambda$$

GN 의 계수 $b = \sum e_i J_i$, $c = \sum J_i^2$ 와 비교하면 정칙화 항 $\lambda w_n$, $\lambda$ 가 추가된 형태임을 알 수 있다. $\Delta w$ 로 미분하여 0 으로 두면 $\tilde{c} \Delta w = -\tilde{b}$ 가 되고, 풀면 다음과 같다.

$$\Delta w = -\frac{\sum_i e_i J_i + \lambda w_n}{\sum_i J_i^2 + \lambda}$$

### 행렬 형태와 두 가지 표기

스칼라 합을 행렬로 옮긴다. $\sum_i e_i J_i = J^T \mathbf{e}$, $\sum_i J_i^2 = J^T J$, $\lambda w_n = \lambda I \cdot \mathbf{w}_n$ 이므로 다음 정규방정식이 도출된다.

$$(J^T J + \lambda I) \Delta w = -(J^T \mathbf{e} + \lambda \mathbf{w}_n)$$

이것이 MAP 의 정확한 정규방정식이며, 우변에 $-\lambda \mathbf{w}_n$ 항이 포함되어 결과 $w$ 가 0 으로 끌리는 효과가 명시적으로 나타난다. Marquardt (1963) 가 제안한 LM 의 표준형은 이 항을 생략한다.

$$(J^T J + \lambda I) \Delta w = -J^T \mathbf{e}$$

두 형태 모두 헤시안 $J^T J + \lambda I$ 는 동일하며 우변만 다르다. LM 표준형은 $\Delta w$ 자체의 수치 안정성을 강조하는 시점이고, MAP 정확형은 $w$ 의 prior 끌림까지 포함하는 시점이다.

### $\lambda I$ 의 출처

$J^T J$ 는 SSE 의 GN 헤시안에서, $\lambda I$ 는 $\|w\|^2$ 의 2차 미분에서, $J^T \mathbf{e}$ 는 SSE 의 그래디언트에서 온다. $\|w\|^2$ 의 헤시안이 단위행렬에 비례하는 ($2I$) 형태이므로, 정칙화 계수 $\lambda$ 가 곱해져 $\lambda I$ 로 헤시안에 더해지는 구조가 자연스럽게 등장한다.

LM 시점에서는 $\lambda$ 가 $J^T J$ 가 거의 singular 일 때 풀이를 안정화하는 임의의 수치 트릭이며, SSE 변화를 보고 적응적으로 조정한다. MAP 시점에서는 같은 $\lambda$ 가 $\sigma^2/\tau^2$ 라는 명확한 통계적 의미를 갖는다. prior 분산 $\tau^2$ 이 작을수록 (사전 지식이 강할수록) $\lambda$ 가 커지는 관계가 성립한다. 두 시점은 같은 식을 다른 각도에서 본 것이며, IK 의 DLS (Damped Least Squares) 도 이 동일한 정규방정식의 한 응용이다.

---

## 9. WLS + MAP 의 결합

지금까지 본 두 흐름을 정리하면 다음과 같다. WLS 는 점마다 다른 $\sigma_i$ 를 반영하여 가중 SSE 를 최소화하며 정규방정식 $(J^T W J)\Delta w = -J^T W \mathbf{e}$ 를 푼다. MAP 는 파라미터 prior 를 도입하여 SSE + $\lambda \|w\|^2$ 를 최소화하며 정규방정식 $(J^T J + \lambda I)\Delta w = -J^T \mathbf{e}$ 를 푼다. 두 가정을 모두 적용하면 손실 함수는 가중 데이터 항과 prior 페널티의 합이 된다.

$$\text{Loss} = \sum_i w_i r_i^2 + \lambda \|w\|^2$$

대응하는 정규방정식은 다음과 같다.

$$(J^T W J + \lambda I) \Delta w = -J^T W \mathbf{e}$$

헤시안에 가중 행렬 $W$ 와 정칙화 행렬 $\lambda I$ 가 모두 포함된다. WLS 의 가우시안 가정은 관측 $y_i$ 에 대한 것이고 (관측 공간의 분포), MAP 의 가우시안 가정은 파라미터 $w$ 에 대한 것이다 (파라미터 공간의 분포). 두 가정이 서로 다른 차원에서 작동하며, 결합 추정은 두 정보를 모두 반영한다.

이 결합 형태는 현대 추정 프레임워크의 중심을 이룬다. Bundle Adjustment 에서는 reprojection error 별 정밀도가 $W$, 카메라/점 변화 작게 유지하는 사전 가정이 $\lambda I$ 의 역할을 한다. ICP + Robust 에서는 매칭 거리/법선 가중이 $W$, 변환 안정성이 $\lambda I$ 가 된다. Kalman Filter 에서는 센서 측정 분산의 역수 $R^{-1}$ 이 $W$, 이전 추정 공분산의 역수 $P^{-1}$ 이 $\lambda I$ 에 대응한다. IK 의 DLS 도 위치/방향별 정밀도와 관절 변화 페널티를 같은 틀로 다룬다. Ridge regression 에 sample weight 를 더한 형태도 같은 식이다.

---

## 10. Prior 강도의 직관

$\lambda = \sigma^2 / \tau^2$ 의 의미는 두 분산의 비율이다. $\tau^2$ 이 매우 크면 ($\tau \to \infty$) $\lambda \to 0$ 이 되어 사전 지식이 사라지고 MLE 와 같아진다. $\tau^2$ 이 매우 작으면 ($\tau \to 0$) $\lambda \to \infty$ 가 되어 $w = 0$ 강제와 다름없게 되고 데이터는 무시된다. 그 사이에서 $\lambda$ 가 작으면 약한 prior 로 데이터 적합이 우세하고, $\lambda$ 가 크면 강한 prior 로 $w$ 가 0 근처로 끌린다.

| $\tau^2$ | $\lambda$ | 의미 | 결과 |
|---|---|---|---|
| 매우 큼 ($\tau \to \infty$) | $\approx 0$ | "사전 지식 없음" | MLE 와 동일 |
| 큼 | 작음 | 약한 prior | MLE 에 가까움 |
| 중간 | 중간 | 보통 prior | 균형 |
| 작음 | 큼 | 강한 prior | $w$ 가 0 으로 끌림 |
| 매우 작음 ($\tau \to 0$) | $\to \infty$ | "$w = 0$ 확신" | $w \to 0$ |

손실 지형 (loss landscape) 에서 보면, $\lambda = 0$ 이면 SSE 그대로의 지형이고, $\lambda$ 가 커질수록 $w^2$ 페널티가 더해져 0 근처에 깊은 골이 생긴다. $\lambda$ 가 너무 커지면 $w^2$ 항이 SSE 를 압도하여 데이터에 대한 적합이 약해진다. $\lambda$ 가 데이터와 사전 지식 사이의 무게 추 역할을 한다.

---

## 11. λ 결정 방법

실무에서 가장 까다로운 부분이며 상황별로 다른 방법이 적용된다. 가장 흔한 방법은 교차검증 (Cross-Validation, CV) 이다. 데이터를 train / validation 으로 나누고 여러 후보 $\lambda \in \lbrace 10^{-6}, 10^{-4}, 10^{-2}, 1, 100 \rbrace$ 에 대해 train 으로 학습한 모델을 validation 에 평가하여 가장 낮은 오차를 주는 $\lambda$ 를 선택한다. k-fold CV (보통 $k=5$) 가 표준이며 `sklearn.linear_model.RidgeCV` 같은 도구가 자동화한다.

비선형 최적화에서는 적응형 방법이 표준이다. LM 의 Marquardt 규칙은 매 iteration 마다 SSE 변화에 따라 $\lambda$ 를 조정한다. SSE 가 감소하면 $\lambda$ 를 10 으로 나누어 정칙화를 약화하고 GN 에 가까운 step 으로 진행하며, SSE 가 증가하면 $\lambda$ 를 10 배로 키워 정칙화를 강화하고 gradient descent 에 가까운 step 으로 후퇴한다. 이 적응 규칙은 비선형 최소제곱 풀이에서 가장 표준적인 $\lambda$ 결정 방식이다.

도메인 지식에 따른 경험적 범위도 자주 활용된다. Ridge regression 은 보통 $10^{-3} \sim 1$, LM 비선형은 $10^{-4} \sim 10^{2}$ 의 적응 범위, IK DLS 는 $10^{-3} \sim 10^{-1}$ 정도가 흔한 시작점이며, Kalman 의 process noise $Q$ 는 시스템 모델에서 직접 도출된다. L-Curve 방법은 $\log\|\mathbf{r}\|^2$ 와 $\log\|w\|^2$ 의 trade-off 곡선에서 무릎점 (corner) 을 찾는 시각적 진단법이고, Empirical Bayes 는 marginal likelihood 를 최대화하여 $\lambda$ 자체를 데이터로 추정하는 수학적으로 엄격한 방법이지만 계산 비용이 크다. 실무에서는 CV 와 적응형 두 방법이 대부분의 경우를 커버한다.

---

## 12. 응용 — Overfitting / DLS / Bayesian 입문

### Overfitting 방지

데이터가 적고 ($N=5$) 모델이 복잡한 (4 차 다항) 상황에서 MLE 는 데이터 다섯 점을 잡음까지 외워 새 데이터에 대한 일반화 성능이 무너진다. 가우시안 prior 와 적절한 $\lambda$ 를 도입한 MAP 추정은 계수의 크기를 제약하여 새 데이터에서도 합리적인 예측을 유지한다. 이것이 머신러닝에서 정칙화 (regularization) 라 부르는 표준 기법의 통계적 정당화다.

### IK 의 DLS (Damped Least Squares)

IK 에서는 자코비안 $J$ 가 특이점 근처에서 거의 singular 가 되어 $J^T J$ 의 역행렬이 매우 큰 값을 갖고, 결과적으로 $\Delta\theta$ 가 폭발하여 관절이 비현실적으로 크게 움직이는 문제가 발생한다. DLS 는 이를 다음 식으로 안정화한다.

$$\Delta\theta = (J^T J + \lambda I)^{-1} J^T \mathbf{e}$$

$\Delta\theta$ 가 관절 변화량, $J = \partial \text{end-effector} / \partial \theta$ 가 자코비안, $\mathbf{e}$ 가 end-effector 위치/방향 오차, $\lambda I$ 가 안정성 항이다. $\lambda I$ 의 추가로 $J^T J + \lambda I$ 는 항상 invertible 하며 풀이가 안정된다. MAP 의 시점에서 보면 이는 "$\theta$ 의 변화가 작은 것이 사전적으로 그럴듯하다" 는 가우시안 prior 의 적용이며, 로보틱스 IK 의 표준 안전장치가 본질적으로 MAP 추정임을 의미한다.

### Full Bayesian 으로의 확장

MAP 는 posterior 분포의 정점만을 추정하는 점 추정이다. Full Bayesian 추론은 전체 분포 $P(w \mid D)$ 를 직접 다루며, $w$ 의 평균과 분산, 신뢰구간을 모두 정량화하여 의사결정에 불확실성을 반영한다. Stage 5 에서 다룰 Kalman, MCMC, Variational Inference 가 그 알고리즘들이다. MAP 는 MLE 에서 full Bayesian 으로 가는 자연스러운 디딤돌이다.

---

## 13. 동전 예제 — MLE 와 MAP 의 전 과정

회귀에서 전개한 흐름을 이산 사례인 동전 던지기로 처음부터 끝까지 따라간다. 파라미터 $w$ 는 앞면이 나올 확률이고 ($0 \le w \le 1$), 데이터 $D$ 는 $N$ 번 던져 앞면이 $k$ 번 나온 결과이다. 각 던짐은 독립이다.

### MLE — 데이터만 사용

각 던짐이 독립이므로 likelihood 는 앞면 $k$ 번과 뒷면 $N-k$ 번의 곱이다.

$$L(w) = P(D \mid w) = w^k (1-w)^{N-k}$$

곱을 합으로 바꾸기 위해 로그를 취한다.

$$\ell(w) = k \log w + (N-k) \log(1-w)$$

$w$ 에 대해 미분한다. 두 번째 항은 연쇄법칙으로 $\log(1-w)$ 의 미분이 $-1/(1-w)$ 가 된다.

$$\frac{d\ell}{dw} = \frac{k}{w} - \frac{N-k}{1-w}$$

극값 조건 $d\ell/dw = 0$ 을 풀면 다음과 같다.

$$\frac{k}{w} = \frac{N-k}{1-w} \;\;\Rightarrow\;\; k(1-w) = (N-k)w \;\;\Rightarrow\;\; k = Nw$$

$$\hat{w}_{\text{MLE}} = \frac{k}{N}$$

MLE 추정값은 관찰 빈도 그 자체이다.

### MAP — 데이터와 사전 지식 결합

posterior 는 likelihood 와 prior 의 곱에 비례한다.

$$P(w \mid D) \propto w^k (1-w)^{N-k} \cdot P(w)$$

$w \in [0, 1]$ 에 자연스러운 prior 는 Beta 분포이며, likelihood 와 같은 형태라 계산이 깔끔하다 (conjugate prior).

$$P(w) = \text{Beta}(\alpha, \beta) \propto w^{\alpha-1} (1-w)^{\beta-1}$$

$\alpha, \beta$ 는 사전 믿음의 강도를 정한다. $\alpha = \beta$ 는 공정한 동전 ($w \approx 0.5$) 에 대한 믿음이며, 값이 클수록 그 믿음이 강하다. likelihood 와 prior 를 곱하면 지수가 더해진다.

$$P(w \mid D) \propto w^{(k+\alpha-1)} (1-w)^{(N-k+\beta-1)}$$

로그를 취해 미분하고 극값 조건을 풀면 MLE 와 같은 대수 과정을 거쳐 다음을 얻는다.

$$\hat{w}_{\text{MAP}} = \frac{k+\alpha-1}{N+\alpha+\beta-2}$$

### 수치 비교

세 번 던져 세 번 모두 앞면이 나온 경우 ($k = 3$, $N = 3$) 를 본다. MLE 는 데이터만 사용한다.

$$\hat{w}_{\text{MLE}} = \frac{3}{3} = 1.0$$

세 번의 관측만으로 "항상 앞면" 이라는 극단적 결론에 도달한다. MAP 은 약한 공정 동전 믿음인 Beta(2, 2) prior 를 결합한다.

$$\hat{w}_{\text{MAP}} = \frac{3+2-1}{3+2+2-2} = \frac{4}{5} = 0.8$$

prior 가 극단값 1.0 을 완화하여 0.8 로 이동시킨다.

### Prior 는 가상의 사전 관측

MAP 식을 다시 정리하면 prior 의 역할이 분명해진다.

$$\hat{w}_{\text{MAP}} = \frac{k + (\alpha-1)}{N + (\alpha-1) + (\beta-1)}$$

$\alpha-1$ 은 미리 관측한 가상의 앞면 수, $\beta-1$ 은 가상의 뒷면 수처럼 작동한다. Beta(2, 2) 는 앞면 1 회와 뒷면 1 회를 사전에 본 것과 같으며, 실제 데이터 (앞 3, 뒤 0) 에 이 가상 관측을 더한 빈도가 MAP 추정값이 된다. prior 가 사전 데이터로 해석된다는 사실이 식에 직접 드러난다.

### 데이터 양에 따른 수렴

같은 Beta(2, 2) prior 로 던진 횟수를 늘리면 MAP 이 MLE 로 수렴한다.

| 데이터 | MLE $= k/N$ | MAP $= (k+1)/(N+2)$ |
|---|---|---|
| 앞 3 / 3 회 | 1.000 | 0.800 |
| 앞 30 / 30 회 | 1.000 | 0.969 |
| 앞 300 / 300 회 | 1.000 | 0.997 |

$N$ 이 커질수록 가상 관측 (앞 1, 뒤 1) 의 비중이 사라져 MAP 이 MLE 에 가까워진다. 데이터가 많으면 likelihood 가 prior 를 압도하고, 데이터가 적으면 prior 가 추정을 안정화한다. 이는 회귀에서 정칙화 항의 영향이 데이터 양에 따라 달라지는 것과 같은 현상이다.

## 14. 핵심 통찰

MLE 가 데이터만의 추정이라면, MAP 는 데이터와 사전 지식의 결합 추정이다. 손실 함수는 SSE (데이터 적합) 와 $\lambda \|w\|^2$ (사전 지식 = 정칙화) 의 합이며, $\lambda$ 가 두 항의 무게추 역할을 한다. LM 에서 임의의 안정성 항으로 도입되었던 $\lambda$ 가 MAP 시점에서는 $\sigma^2/\tau^2$ 라는 prior 정밀도로 해석된다.

확률 모델 가정과 손실 함수의 대응 관계를 가정 종류별로 정리하면 다음과 같다. 가우시안 노이즈 (모두 같은 $\sigma$) 는 OLS / MSE 로, 가우시안 노이즈 (점마다 $\sigma_i$) 는 WLS 로, 라플라스 노이즈는 LAD 로, 베르누이는 cross-entropy 로 환원된다. 여기에 가우시안 prior $P(w)$ 를 추가하면 MAP + L2 정칙화 (Ridge) 가, 라플라스 prior 를 추가하면 MAP + L1 정칙화 (LASSO) 가 도출된다. 이 모든 것이 점 추정이며, 다음 단계인 full Bayesian 에서는 분포 추정으로 확장된다.

---

## 15. 다음 단계 — Stage 5 (Full Bayesian + Kalman)

MAP 는 posterior 의 정점만을 추정한다. Full Bayesian 추론은 전체 posterior 분포를 추정하여 $w$ 의 신뢰구간과 예측 분산을 정량화하며, MCMC 와 Variational Inference 같은 알고리즘이 사용된다. Kalman Filter 는 시간에 따라 변하는 상태에 대한 MAP / Bayesian 갱신을 반복적으로 수행하는 형태로, 예측 step 이 prior 를, 업데이트 step 이 likelihood 를 제공하며 매 시간 단계의 posterior 가 다음 시간의 prior 가 된다. SLAM, 센서 퓨전, 로봇 localization 같은 응용은 모두 MAP / Bayesian 추정의 시간 확장으로 이해된다.

---

## 16. 한 줄 요약

MAP 는 MLE 에 prior 를 더한 추정이다. 가우시안 prior 가 L2 정칙화를 도출하며, LM 의 $\lambda$ 가 사실 $\sigma^2/\tau^2$ 라는 prior 정밀도라는 동치 관계가 성립한다. 데이터만의 추정에서 데이터와 사전 지식을 결합한 추정으로 가는 자연스러운 진화다.
