---
title: Part 1·5 확률 입문 — MLE 전에 알아야 할 5가지
description: PDF/PMF, 가우시안, 곱셈/독립, 조건부, 베이즈. 적분 직관과 가우시안 적분 전개까지 — MLE 들어가기 전 확률 격차 메우기.
author: mark
date: 2026-05-05 12:00:00 +0900
categories: [math, probability]
tags: [pdf, pmf, gaussian, bayes, mle, integration]
math: true
---


MLE, MAP, Bayesian 추정으로 들어가기 전에 알아두어야 할 확률 개념을 다섯 가지로 정리한다. 확률 질량 함수와 확률 밀도 함수의 구분, 가우시안 분포, 독립 사건의 곱셈 규칙, 조건부 확률, 베이즈 정리가 그것이다. 이 다섯 개의 도구는 이후 모든 추정 이론의 기반이 된다.

---

# 1. 확률 vs 확률 밀도 (PMF vs PDF)

## 두 종류의 확률 함수

확률 함수는 변수의 종류에 따라 두 가지로 나뉜다. 이산 변수 (주사위, 동전) 의 경우는 PMF (Probability Mass Function, 확률 질량 함수) 로 표현되며, 한 점의 값이 그 결과의 확률을 직접 의미한다. 연속 변수 (키, 시간, 측정값) 의 경우는 PDF (Probability Density Function, 확률 밀도 함수) 로 표현되며, 한 점의 값은 확률이 아닌 단위당 밀도를 의미한다. MLE 와 MAP 는 주로 연속 변수 (PDF) 를 다루므로 밀도의 미묘한 의미를 정확히 이해해야 한다.

## 이산 — 주사위, 동전 (PMF)

각 결과에 대해 확률을 직접 부여한다.

$$P(X = x_k) = p_k$$

주사위는 $P(X = 3) = 1/6$, 동전은 $P(\text{앞}) = 1/2$ 식으로 표현된다. 각 막대의 높이가 그대로 확률값 (0 과 1 사이) 이며, 모든 결과의 합은 항상 1 이다 ($\sum_k p_k = 1$).

## 인터랙티브 — "K 개 선택지 중 하나"

이산 변수는 K 개의 가지 중 정확히 하나가 골라지는 상황으로 이해할 수 있다. 회색 막대는 각 선택지의 진짜 확률, 주황 막대는 굴린 결과의 관측 빈도이며, 굴림 횟수를 늘리면 주황이 회색에 점점 수렴한다.

<div id="discrete-pmf-demo" style="width:100%; border:1px solid #d0d7de; border-radius:8px; overflow:hidden; padding:16px; background:#fafbfc;"></div>
<script src="/assets/posts/2026-05-05-probability-basics-discrete-pmf.js"></script>

K=2 (동전), K=6 (주사위) 모두 균등 분포일 때 막대 높이가 같고, "100번" 버튼을 여러 번 누르면 주황이 회색에 가까워진다 (대수의 법칙). 편향 분포로 바꾸면 막대 높이는 다 다르지만 합은 여전히 1 이다.

### 참고 — 샘플링은 어떻게 (역 누적분포 트릭)

데모가 "굴리기" 버튼을 누를 때마다 수행하는 절차는 세 단계로 이뤄진다. 먼저 0 부터 1 사이의 균등 난수 한 개를 뽑는다 (`Math.random()`). 다음으로 확률을 누적합으로 펼쳐 [0, 1) 구간을 칸으로 나눈다 (각 칸의 너비가 그 결과의 확률). 마지막으로 난수가 떨어진 칸의 인덱스를 보고 해당 결과의 카운트를 1 증가시킨다.

K=6 의 편향 분포 ($p_k = 0.463, 0.255, 0.140, 0.077, 0.042, 0.023$) 를 띠로 펼치면 다음과 같다.

<div><svg viewBox="0 0 720 170" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:720px; display:block; margin:8px 0;"><g font-family="system-ui, sans-serif" font-size="14"><rect x="30" y="60" width="660" height="40" fill="none" stroke="#444" stroke-width="1"/><rect x="30" y="60" width="305.58" height="40" fill="#ffd180" stroke="#444"/><rect x="335.58" y="60" width="168.30" height="40" fill="#ffab40" stroke="#444"/><rect x="503.88" y="60" width="92.40" height="40" fill="#ff9100" stroke="#444"/><rect x="596.28" y="60" width="50.82" height="40" fill="#ff6d00" stroke="#444"/><rect x="647.10" y="60" width="27.72" height="40" fill="#e65100" stroke="#444"/><rect x="674.82" y="60" width="15.18" height="40" fill="#bf360c" stroke="#444"/><g fill="#222" text-anchor="middle" font-weight="600"><text x="183" y="86">1</text><text x="420" y="86">2</text><text x="550" y="86">3</text><text x="621" y="86" fill="#fff">4</text><text x="661" y="86" fill="#fff" font-size="11">5</text><text x="682" y="86" fill="#fff" font-size="10">6</text></g><g fill="#444" text-anchor="middle" font-size="12"><text x="183" y="118">46.3%</text><text x="420" y="118">25.5%</text><text x="550" y="118">14.0%</text><text x="621" y="132">7.7%</text><text x="661" y="118">4.2%</text><text x="682" y="132">2.3%</text></g><g fill="#666" text-anchor="middle" font-size="11"><text x="30" y="52">0</text><text x="335.58" y="52">0.463</text><text x="503.88" y="52">0.718</text><text x="596.28" y="52">0.858</text><text x="647.10" y="44">0.935</text><text x="674.82" y="52">0.977</text><text x="690" y="44">1</text></g><g stroke="#444" stroke-width="1"><line x1="30" y1="56" x2="30" y2="60"/><line x1="335.58" y1="56" x2="335.58" y2="60"/><line x1="503.88" y1="56" x2="503.88" y2="60"/><line x1="596.28" y1="56" x2="596.28" y2="60"/><line x1="647.10" y1="56" x2="647.10" y2="60"/><line x1="674.82" y1="56" x2="674.82" y2="60"/><line x1="690" y1="56" x2="690" y2="60"/></g><g><line x1="426" y1="20" x2="426" y2="60" stroke="#d32f2f" stroke-width="2" marker-end="url(#arr)"/><text x="426" y="14" text-anchor="middle" fill="#d32f2f" font-weight="600" font-size="13">난수 r = 0.6</text></g><defs><marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#d32f2f"/></marker></defs><text x="360" y="158" text-anchor="middle" fill="#d32f2f" font-weight="600" font-size="13">결과 "2" 의 칸에 떨어짐 → "2" 카운트 +1</text></g></svg></div>

난수가 0.6 이면 0.463 부터 0.718 사이의 칸에 떨어지므로 결과는 "2" 가 된다. 칸의 너비가 확률에 비례하므로 자주 나오는 결과의 칸이 넓고, 자연스럽게 그 결과가 자주 뽑힌다.

이 방식이 작동하는 이유는 단순하다. 균등 난수가 길이 $L$ 인 구간에 떨어질 확률은 $L$ 이고, $i$ 번째 칸의 너비는 $p_i$ 이므로, 결과 $i$ 가 뽑힐 확률은 정확히 $p_i$ 가 된다. 관측 빈도는 다음과 같이 진짜 확률에 수렴한다.

$$\text{빈도}_i = \frac{\text{counts}[i]}{N} \;\xrightarrow{N \to \infty}\; p_i \quad \text{(대수의 법칙)}$$

굴림 횟수가 늘어날수록 주황 막대가 회색 막대에 수렴하는 이유가 여기에 있다.

## 식으로 정리 — 동전 vs 주사위

### 1. 동전 (K = 2)

표본 공간은 두 원소뿐이다.

$$\Omega = \lbrace \text{앞}, \text{뒤} \rbrace$$

PMF 는 결과별로 다음과 같이 정의된다.

$$P(\text{앞}) = p, \qquad P(\text{뒤}) = 1 - p$$

파라미터는 $p \in [0, 1]$ 하나뿐이며, 이 값으로 분포 전체가 정해진다. PMF 의 두 조건 (각 값 0 과 1 사이, 합 = 1) 은 자명하게 만족된다.

| 종류 | $p$ | $P(\text{앞})$ | $P(\text{뒤})$ |
|---|---|---|---|
| 공정 | 0.5 | 0.5 | 0.5 |
| 약한 편향 | 0.6 | 0.6 | 0.4 |
| 강한 편향 | 0.9 | 0.9 | 0.1 |

데모 K=2 에서 "균등" 옵션이 첫 줄, "편향" 옵션이 셋째 줄에 가깝다.

### 2. 주사위 (K = 6, 균등)

표본 공간은 여섯 개의 눈으로 구성된다.

$$\Omega = \lbrace 1, 2, 3, 4, 5, 6 \rbrace$$

PMF 는 모든 결과에 동일한 확률을 부여한다.

$$P(X = k) = \frac{1}{6}, \quad k \in \lbrace 1, 2, 3, 4, 5, 6 \rbrace$$

파라미터는 없다. "균등" 이라는 가정 하나로 분포가 결정된다. 합 조건도 곧바로 확인된다.

$$\sum_{k=1}^{6} P(X = k) = \underbrace{\frac{1}{6} + \frac{1}{6} + \frac{1}{6} + \frac{1}{6} + \frac{1}{6} + \frac{1}{6}}_{6 \text{ 항}} = \frac{6}{6} = 1$$

이산 변수의 구간 확률은 그 안에 포함된 값들의 확률을 단순히 더해 구한다. 예를 들어 짝수가 나올 확률은

$$P(X \in \lbrace 2, 4, 6 \rbrace) = P(X=2) + P(X=4) + P(X=6) = \frac{3}{6} = \frac{1}{2}$$

이고, 3 이하가 나올 확률은

$$P(X \le 3) = P(X=1) + P(X=2) + P(X=3) = \frac{3}{6} = \frac{1}{2}$$

이다. PDF 가 적분으로 구간 확률을 정의하는 것과 달리 PMF 는 단순한 합으로 구해진다.

### 3. 편향 주사위 — 카테고리컬 (K=6)

데모의 "편향" 옵션이 이 경우다. 각 눈마다 다른 확률을 갖는다.

$$P(X = k) = p_k, \quad k \in \lbrace 1, \ldots, 6 \rbrace$$

제약은 합이 1 이라는 조건뿐이다.

$$\sum_{k=1}^{6} p_k = 1$$

따라서 자유 파라미터는 다섯 개이다 ($p_6$ 은 나머지로 자동 결정).

데모에서 사용하는 편향 분포는 수학적으로 유도된 식이 아니라, "감소하는 막대 모양" 을 만들기 위해 임의로 고른 등비수열이다. 비율 $r = 0.55$ 도 시각적 선택이다.

먼저 모양을 정한다 (자의적 단계). 다음 막대는 이전 막대의 0.55 배가 되도록 둔다.

$$\text{raw}_k = 0.55^{k-1}$$

이대로는 합이 1 이 아니므로 정규화가 필요하다. 합으로 나눠 정규화하면 다음 식을 얻는다.

$$p_k = \frac{0.55^{k-1}}{\sum_{j=1}^{6} 0.55^{j-1}} = \frac{0.55^{k-1}}{Z}, \quad p_k \propto 0.55^{k-1}$$

여기서 $Z = \sum_j 0.55^{j-1}$ 는 정규화 상수로, 베이즈 정리의 $P(D)$ 와 같은 역할을 한다.

$Z$ 의 값은 직접 계산되거나 등비수열의 닫힌 형태로 구해진다.

$$Z = 1 + 0.55 + 0.3025 + 0.1664 + 0.0915 + 0.0503 = 2.1607$$

$$Z = \frac{1 - r^K}{1 - r} = \frac{1 - 0.55^6}{0.45} \approx 2.1607$$

최종 PMF 는 다음과 같다.

| $k$ | raw $= 0.55^{k-1}$ | $p_k = \text{raw} / 2.1607$ |
|---|---|---|
| 1 | 1.000 | 0.463 |
| 2 | 0.550 | 0.255 |
| 3 | 0.303 | 0.140 |
| 4 | 0.166 | 0.077 |
| 5 | 0.092 | 0.042 |
| 6 | 0.050 | 0.023 |
| 합 | 2.1607 | 1.000 |

1 이 가장 자주 나오고, 6 으로 갈수록 확률이 작아진다. 데모에서 "편향" 을 골랐을 때의 회색 막대 모양과 정확히 같다. 모양 자체는 자의적이지만 정규화는 필수이며, 어떤 양수 함수 $f(k)$ 든 $p_k = f(k) / \sum f(j)$ 의 절차로 PMF 를 만들 수 있다.

세 분포의 관계를 정리하면, 카테고리컬 분포가 가장 일반적인 형태이고 동전 (K=2) 과 균등 주사위 (모든 $p_k$ 가 같은 경우) 는 그 특수한 경우다. 어떤 PMF 든 두 조건 ($0 \le p_k \le 1$, $\sum_k p_k = 1$) 을 만족해야 하며, 데모에서 막대 높이를 모두 더했을 때 항상 1 이 되는 것이 이 조건의 시각적 표현이다.

## 연속 — 키, 시간, 측정값 (PDF)

연속 변수에서는 한 점의 확률이 의미를 갖지 않는다. 키가 정확히 175.000... cm 일 확률은 0 이다. 무한히 정밀한 한 점은 0 의 확률을 갖는다. 따라서 연속 변수는 구간의 확률만 의미를 갖는다.

$$P(174 < \text{키} < 176) = \text{어떤 값}$$

PDF $f(x)$ 는 확률 자체가 아니라 단위당 확률, 즉 밀도이다.

$$P(a < X < b) = \int_a^b f(x)\,dx$$

PDF 값이 아닌 그 아래 면적이 진짜 확률이다.

## 인터랙티브 — 키 분포로 적분 직관 잡기

한국 성인 키가 $\mathcal{N}(170, 7^2)$ cm 를 따른다고 가정하자. 빨강과 파랑 손잡이로 구간 $[a, b]$ 를 바꿔 보면, 주황으로 칠해진 면적이 곧 $P(a < X < b)$ 가 된다.

표기 $X \sim \mathcal{N}(\mu, \sigma^2)$ 의 의미는 다음과 같다. $X$ 는 확률변수 (예: 키), $\sim$ 은 "분포를 따른다", $\mathcal{N}$ 은 정규 (가우시안) 분포, $\mu$ 는 평균, 그리고 $\sigma^2$ 은 분산이다 (표준편차 $\sigma$ 가 아니라 분산이라는 점에 주의해야 한다). 이 데모의 분포는 $\mathcal{N}(170, 49)$ 이며, $\mu = 170$ cm, $\sigma = 7$ cm 에 해당한다.

데모가 그리는 식은 가우시안 PDF 에 $\mu = 170$, $\sigma = 7$ 을 대입한 형태다.

$$f(x) = \frac{1}{\sqrt{2\pi \cdot 7^2}} \exp\left(-\frac{(x - 170)^2}{2 \cdot 7^2}\right) = \frac{1}{7\sqrt{2\pi}} \exp\left(-\frac{(x - 170)^2}{98}\right)$$

정점 $f(170) = 1 / (7\sqrt{2\pi}) \approx 0.0570$ /cm 는 데모에서 손잡이를 170 에 두면 라벨 `f = 0.0570 /cm` 로 확인된다. 식의 유도와 적분 계산은 데모 아래 "적분 직접 계산" 섹션에서 다룬다.

<div id="pdf-height-demo" style="width:100%; border:1px solid #d0d7de; border-radius:8px; overflow:hidden; padding:16px; background:#fafbfc;"></div>
<script src="/assets/posts/2026-05-05-probability-basics-pdf-height.js"></script>

적분이 어렵게 느껴진다면 세 가지 시점이 도움이 된다. 첫째로 사각형 근사 (PDF × 폭) 는 폭이 좁아 PDF 값이 거의 일정한 경우에 해당하며, "한 칸의 확률" 을 의미한다. 둘째로 여러 사각형의 합은 폭이 넓어 PDF 값이 변하는 경우에 잘게 잘라 더한 형태이다. 셋째로 정확한 적분 $\int_a^b f(x)\,dx$ 는 사각형을 무한히 잘게 한 극한으로, 진짜 면적에 해당한다.

### 데모로 확인할 것

구간을 좁힐수록 면적이 0 에 점근한다 ("한 점 → 175 ± 0.001" 버튼). 이것이 단일 점 확률 = 0 이라는 사실의 시각적 확인이다. 가우시안의 유명한 규칙 $\pm 1\sigma \approx 68\%$, $\pm 2\sigma \approx 95\%$, $\pm 3\sigma \approx 99.7\%$ 도 데모로 확인된다. PDF × 폭과 정확한 적분은 폭이 좁으면 거의 같지만, 폭이 넓어지면 차이가 난다 (PDF 가 구간 안에서 변하기 때문이다).

PDF 값과 확률을 구별하는 것이 중요하다. 정보 패널에 "PDF 값 (중앙점)" 과 "정확한 적분" 이 따로 표시되며, PDF 값은 0.057 같이 작은 수일 뿐 그 자체가 확률이 아니다. 면적이 진짜 확률이다. 패널 맨 아래 노란 박스에는 자연스러운 문장으로 해석이 표시된다 (예: "169.5 부터 170.5 cm 사이 사람 비율 약 5.71%"). 이 표현이 적분 = 확률의 가장 직관적인 의미다. 퍼센트 변환은 단순히 100 배다 (확률 0.057 = 5.7%).

PDF 값 0.057 /cm 자체는 확률 5.7% 가 아니다. 1 cm 폭당 밀도일 뿐이다. 실제 5.7% 는 폭 1 cm 짜리 적분 값 ($f(170) \times 1$ cm) 이다. 좁은 구간에서는 두 값이 거의 같아 보이지만 단위와 의미가 다르다.

## 적분 직접 계산 — 데모의 숫자로

데모가 화면 뒤에서 어떤 식을 푸는지 단계별로 풀어 본다.

### 1단계 — 가우시안 PDF 식

가우시안 PDF 의 일반형은 다음과 같다.

$$f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)$$

여기서 $\mu$ 는 평균 (분포 중심), $\sigma^2$ 은 분산 (퍼짐 정도), $\sigma > 0$ 은 표준편차이다. 앞의 상수 $1/\sqrt{2\pi\sigma^2}$ 은 정규화 상수로, 적분이 1 이 되도록 보정하는 역할을 한다. 지수항 $\exp(-\,\cdot\,)$ 이 종 모양을 만든다.

데모 값 $\mu = 170$, $\sigma = 7$ 을 대입하면 다음과 같다.

$$f(x) = \frac{1}{7\sqrt{2\pi}} \exp\left(-\frac{(x - 170)^2}{98}\right)$$

정점은 $x = 170$ 일 때이다.

$$f(170) = \frac{1}{7\sqrt{2\pi}} \approx \frac{1}{17.547} \approx 0.0570$$

데모 패널의 "PDF 값 (중앙점) ≈ 0.0570" 과 정확히 일치한다.

### 2단계 — 적분 식 세우기

$$P(a < X < b) = \int_a^b \frac{1}{7\sqrt{2\pi}} \exp\left(-\frac{(x - 170)^2}{98}\right) dx$$

이 적분은 닫힌 형태로 풀리지 않는다. 가우시안 적분의 부정적분은 초등함수로 표현되지 않기 때문이다.

### 적분 기본 성질 복습

다음 단계의 치환이 갑자기 와닿지 않을 수 있어 필요한 적분 도구 두 개를 정리한다.

첫째는 상수의 선형성으로, 적분 안의 상수는 밖으로 빼도 결과가 같다.

$$\int_a^b c \cdot f(x)\,dx = c \int_a^b f(x)\,dx$$

둘째는 변수 치환으로, 두 가지 표준 형태가 존재한다. 같은 결과를 보는 시점이 다를 뿐이다.

#### 형태 A — u-치환 (정통 교과서 형태)

식 안에 합성함수 $f(g(x))$ 와 그 미분 $g'(x)$ 가 짝으로 있을 때 적용된다.

$$\int_a^b f(g(x)) \cdot g'(x)\,dx = \int_{g(a)}^{g(b)} f(u)\,du$$

안쪽 함수 $g(x)$ 를 $u$ 로 묶으면 $g'(x)\,dx$ 가 자동으로 $du$ 로 흡수된다.

작은 예로 $\int 2x \cos(x^2)\,dx$ 를 따라가 보자. 식을 두 부분으로 관찰하면 뒤 부분 $\cos(x^2)$ 는 합성함수이고 (안쪽 $x^2$, 바깥 $\cos$), 앞 부분 $2x$ 는 마침 $x^2$ 의 미분이다. 이 형태가 u-치환이 깔끔하게 통하는 신호다.

이름을 붙여 정리하면 $g(x) = x^2$, $f(u) = \cos u$ 가 되며, 원래 식은 $\int g'(x) \cdot f(g(x))\,dx$ 로 다시 쓰인다.

새 변수를 정의하고 미분소를 환산한다.

$$u = x^2 \;\Rightarrow\; \frac{du}{dx} = 2x \;\Rightarrow\; du = 2x\,dx$$

원래 식에 있던 $2x\,dx$ 덩어리가 통째로 $du$ 로 바뀐다. 치환을 적용하면 식이 한 변수의 깔끔한 형태로 변한다.

$$\int \cos(x^2) \cdot 2x\,dx = \int \cos u\, du$$

$\int \cos u\,du = \sin u + C$ 인 이유는 적분이 미분의 역연산이기 때문이다. 미분하면 $\cos u$ 가 되는 함수가 $\sin u$ 다.

##### 보조 — 왜 $(\sin u)' = \cos u$ 인가

미분의 정의로 풀면 다음과 같다.

$$\frac{d}{du}\sin u = \lim_{h \to 0} \frac{\sin(u + h) - \sin u}{h}$$

사인 덧셈 공식 $\sin(u+h) = \sin u \cos h + \cos u \sin h$ 을 대입하면

$$= \lim_{h \to 0} \left[\sin u \cdot \frac{\cos h - 1}{h} + \cos u \cdot \frac{\sin h}{h}\right]$$

이고, 두 가지 유명한 극한 $\lim_{h \to 0} \sin h / h = 1$ 과 $\lim_{h \to 0} (\cos h - 1) / h = 0$ 을 대입하면 $\cos u$ 가 남는다.

기하학적으로는 단위원 위 점 $(\cos u, \sin u)$ 의 속도 (= 위치의 미분 = 접선 방향) 가 $(-\sin u, \cos u)$ 라는 사실에서 같은 결과를 얻는다.

$$\frac{d}{du}\cos u = -\sin u, \qquad \frac{d}{du}\sin u = \cos u$$

부정적분에 임의 상수 $C$ 가 붙는 이유는 상수의 미분이 항상 0 이기 때문이다. $\sin u + 7$, $\sin u - 100$, $\sin u + C$ 모두 미분하면 $\cos u$ 가 된다. 미분하면 $\cos u$ 가 되는 함수는 무수히 많고, 부정적분은 이 모든 가능성을 임의 상수 $C$ 로 한꺼번에 표현한다.

검증으로 미분해 보면 원래 식으로 돌아온다.

$$\frac{d}{du}\left[\sin u + C\right] = \cos u$$

원래 변수 $x$ 로 복귀하기 위해 $u = x^2$ 를 다시 대입하면 $\sin(x^2) + C$ 가 답이다. 미분으로 검증해도 정확히 원래 피적분 함수와 일치한다.

$$\frac{d}{dx}\left[\sin(x^2)\right] = \cos(x^2) \cdot 2x$$

정리하면, "$2x\,dx$ 가 식에 마침 있어서 $du$ 로 흡수" 되는 것이 u-치환의 본질이다. 안쪽 함수의 미분이 식에 보일 때만 통한다.

#### 형태 B — 변수 변환 (강제 환산)

식에 $g'(x)$ 가 보이지 않아도 강제로 $z = g(x)$ 를 정의하고 미분소만 환산하면 된다.

$$\int_a^b F(x)\,dx = \int_{g(a)}^{g(b)} F(x(z)) \cdot \frac{dx}{dz}\,dz$$

세 가지를 동시에 환산한다. 변수 ($x$ 를 $z$ 로), 적분 한계 ($a, b$ 를 $g(a), g(b)$ 로), 미분소 ($dx$ 를 $(dx/dz)\,dz$ 로). 미분소의 환산은 단순한 기호 변경이 아니라 면적 보정이다. 적분은 사각형들의 합 (가로 = 폭, 세로 = 함수값) 이며, 변수의 단위가 바뀌면 폭의 의미도 바뀐다. 예를 들어 $z = (x - 170) / 7$ 의 경우 $z$ 가 1 늘어날 때 $x$ 는 7 늘어나므로 $dx = 7\,dz$ 의 환산이 필요하다. 이것을 빠뜨리면 면적이 7 배 작아진다.

두 형태의 사용 시점은 다음과 같다. 형태 A 는 식 안에 $g'(x)$ 가 이미 보일 때 자연스럽고 정통이다. 형태 B 는 그것이 보이지 않을 때도 무조건 통하므로 학습용으로 이해가 쉽다. 가우시안 표준화는 두 형태 모두 적용 가능하며, 다음 단계에서는 형태 B 로 풀고 그 아래에 형태 A 시점을 한 번 더 보인다.

---

### 3단계 — 표준화 치환 $z = (x - \mu) / \sigma$

위의 도구를 적용한다. 목표는 변수를 바꿔 표준정규 $\mathcal{N}(0, 1)$ 모양으로 통일하는 것이다. 데모 프리셋 $\pm 1\sigma$ 케이스로 진행한다.

$$P(163 < X < 177) = \int_{163}^{177} \frac{1}{7\sqrt{2\pi}} \exp\left(-\frac{(x-170)^2}{98}\right) dx$$

답이 0.6827 (= 68.27%) 가 나와야 한다.

#### (3-1) 치환 정의

$$z = \frac{x - 170}{7}$$

$z$ 는 단순한 새 이름이 아니라 $x$ 의 함수다. 입력 $x$ 하나에 출력 $z$ 하나가 대응한다. $z$ 는 z-score 로 해석된다.

| $x$ (cm) | $z = (x - 170) / 7$ | 의미 |
|---|---|---|
| 170 | 0 | 평균 |
| 177 | +1 | 평균 위로 1σ |
| 184 | +2 | 평균 위로 2σ |
| 163 | −1 | 평균 아래로 1σ |
| 156 | −2 | 평균 아래로 2σ |

기하학적으로는 두 단계를 거친다. 평행이동 ($x - 170$) 으로 분포 중심을 0 으로 옮기고 (μ = 0), 스케일링 ($/ 7$) 으로 가로 폭을 1 단위로 압축한다 (σ = 1). 결과적으로 어떤 가우시안이든 표준정규 $\mathcal{N}(0,1)$ 로 변환되며, 한 표 ($\Phi$ 표) 만으로 모든 가우시안이 처리된다.

#### (3-2) 세 가지 동시 환산

치환은 변수, 미분소, 적분 한계를 동시에 바꾼다. 변수 환산은 $x = 7z + 170$, 미분소 환산은 $dx/dz = 7$ 이므로 $dx = 7\,dz$, 적분 한계 환산은 $z_a = (163 - 170)/7 = -1$, $z_b = (177 - 170)/7 = +1$ 이다. $\pm 1\sigma$ 가 $z$ 좌표로 정확히 $[-1, +1]$ 이 된다.

#### (3-3) 식 안 표현 환산

지수부 $(x-170)^2 / 98$ 을 $z$ 로 표현하면 다음과 같이 깔끔하게 정리된다.

$$x - 170 = 7z \;\Rightarrow\; (x-170)^2 = 49 z^2$$

$$\frac{(x-170)^2}{98} = \frac{49 z^2}{98} = \frac{z^2}{2}$$

#### (3-4) 끼워넣기와 약분

원래 적분에 치환을 적용한다.

$$\int_{163}^{177} \frac{1}{7\sqrt{2\pi}} \exp\left(-\frac{(x-170)^2}{98}\right) dx = \int_{-1}^{+1} \frac{1}{7\sqrt{2\pi}} e^{-z^2/2} \cdot 7\,dz$$

상수 $1/7 \cdot 7 = 1$ 이 약분되며 다음 형태가 남는다.

$$= \int_{-1}^{+1} \frac{1}{\sqrt{2\pi}} e^{-z^2/2}\,dz$$

식에서 $\sigma$ 와 $\mu$ 가 사라지는 것이 표준화의 핵심이다. 모든 가우시안이 표준정규 한 식으로 환산되는 이유다.

#### (3-5) 형태 A 시점으로 다시 보기

같은 작업을 u-치환 정통 형태로 보면, 상수를 쪼개는 순간 $g'(x) = 1/7$ 이 자연스럽게 등장한다.

$$\frac{1}{7\sqrt{2\pi}} \exp\left(-\frac{(x-170)^2}{98}\right) = \frac{1}{\sqrt{2\pi}} \exp\left(-\frac{g(x)^2}{2}\right) \cdot \frac{1}{7}$$

우변의 두 부분이 각각 $f(g(x))$ (합성함수) 와 $g'(x)$ (안쪽 함수의 미분) 에 해당하므로 정확히 형태 A 의 $f(g(x)) \cdot g'(x)$ 모양이다. u-치환 공식을 그대로 적용하면 같은 결과가 나온다. 두 형태는 같은 일을 다른 시점에서 본 것이다.

### 4단계 — FTC 로 정적분 전개

#### 미적분 기본 정리 (FTC) 복습

$f$ 의 부정적분 (역도함수) 이 $F$ 일 때, 즉 $F'(x) = f(x)$ 일 때 정적분은 두 점 함수값의 차로 표현된다.

$$\int_a^b f(x)\,dx = F(b) - F(a) = \big[F(x)\big]_a^b$$

위 한계의 값에서 아래 한계의 값을 뺀다. 작은 예로 $\int_0^3 2x\,dx$ 의 경우 부정적분 $F(x) = x^2$ 을 사용해 $[x^2]_0^3 = 9 - 0 = 9$ 가 답이다. 부정적분이 초등이면 FTC 만으로 끝난다.

#### 표준정규 PDF 의 부정적분 = $\Phi$

표준정규 누적분포는 다음과 같이 정의된다.

$$\Phi(z) := \int_{-\infty}^{z} \frac{1}{\sqrt{2\pi}} e^{-t^2/2}\,dt, \quad \Phi'(z) = \frac{1}{\sqrt{2\pi}} e^{-z^2/2}$$

$\Phi$ 는 표준정규 PDF 의 부정적분에 해당하며, 닫힌 식이 없는 비초등 함수이다.

#### 우리 적분에 FTC 적용

3단계 끝에서 얻은 적분에 FTC 를 적용한다.

$$\int_{-1}^{+1} \frac{1}{\sqrt{2\pi}} e^{-z^2/2}\,dz = \big[\Phi(z)\big]_{-1}^{+1} = \Phi(+1) - \Phi(-1)$$

시각적으로는 "$-\infty$ 부터 $+1$ 까지의 면적" 에서 "$-\infty$ 부터 $-1$ 까지의 면적" 을 빼면 "$[-1, +1]$ 사이의 면적" 만 남는다. 위에서 아래를 뺀다는 것이 정적분의 결정적인 한 줄이다.

### 5단계 — 비초등이라 다항 근사 한 단계 더

$\Phi$ 자체가 비초등이므로 숫자 값은 다항 근사로 구한다.

$$\Phi(z) = \frac{1}{2}\left[1 + \mathrm{erf}\left(\frac{z}{\sqrt{2}}\right)\right]$$

데모 코드는 Abramowitz–Stegun 다항 근사 (계수 6 개, Remez 알고리즘으로 최적화) 로 erf 를 계산한다. 미리 계산된 주요 값은 다음과 같다.

| $z$ | $\Phi(z)$ |
|---|---|
| -3 | 0.0013 |
| -2 | 0.0228 |
| -1 | 0.1587 |
| 0 | 0.5000 |
| +1 | 0.8413 |
| +2 | 0.9772 |
| +3 | 0.9987 |

대입하면 답을 얻는다.

$$\Phi(+1) - \Phi(-1) = 0.8413 - 0.1587 = 0.6827$$

### 6단계 — 답

$$P(163 < X < 177) = 0.6827 = 68.27\%$$

데모의 $\pm 1\sigma$ 버튼 결과와 정확히 일치한다.

### 7단계 — 다른 데모 프리셋 직접 계산

같은 절차로 다른 구간들을 계산한다.

$\pm 2\sigma$ 의 경우 $[156, 184]$ 에서 $z_a = -2$, $z_b = +2$ 이고

$$P = \Phi(2) - \Phi(-2) = 0.9772 - 0.0228 = 0.9545$$

로 95% 규칙이 확인된다. $\pm 3\sigma$ 의 경우 $[149, 191]$ 에서

$$P = \Phi(3) - \Phi(-3) = 0.9987 - 0.0013 = 0.9973$$

로 99.7% 규칙이 확인된다.

좁은 구간 $[174.9, 175.1]$ 에서는 $z_a = 0.700$, $z_b = 0.7286$ 이고

$$P = \Phi(0.7286) - \Phi(0.700) \approx 0.7669 - 0.7580 = 0.00891$$

이다. 사각형 근사 (PDF × 폭) 로는 중앙 $x = 175$, $z = 0.7143$ 에서

$$f(175) = \frac{1}{7\sqrt{2\pi}} e^{-0.7143^2/2} \approx 0.0570 \times 0.7748 \approx 0.0442$$

이고 근사값은 $0.0442 \times 0.2 = 0.00884$ 이다. 정확값 0.00891 과 사각형 근사 0.00884 가 폭이 좁아 거의 일치한다. 사각형 근사가 적분의 본질이다.

한 점 점근 $[174.999, 175.001]$ 에서는 $P = \Phi(0.7144) - \Phi(0.7142) \approx 0.000089$ 가 되어 폭이 0 으로 가면 면적도 0 이 되는 것이 확인된다. 이것이 단일 점 확률 = 0 의 정체다.

전체 구간 (데모 화면은 $\pm 5\sigma$) 에서는 $P = \Phi(5) - \Phi(-5) \approx 1.0000$ 으로, PDF 의 정의 조건 $\int_{-\infty}^{\infty} f(x)\,dx = 1$ 이 만족된다.

가우시안 적분의 핵심은 표준화, FTC, 다항 근사 (Φ 표 조회) 의 세 단계로 요약된다. 손으로 닫힌 식에 도달하지 못하므로 표나 근사, 소프트웨어로 계산해야 한다. 그래도 개념은 단순하다 — 곡선 아래의 면적이다. 데모 패널의 숫자는 위 식 그대로 계산한 결과이며 직접 검증할 수 있다.

## 적분 종합 정리

가우시안 확률 계산은 두 단계의 변환을 거친다. 첫 단계에서 PDF 를 적분으로 바꾸고, 두 번째 단계에서 부정적분을 평가한다. 부정적분이 초등이면 (예: 다항식) FTC 만으로 계산이 끝나지만, 비초등이면 (예: 가우시안) 다항 근사가 추가로 필요하다. 가우시안은 두 단계를 모두 거쳐야 한다.

핵심 도구는 네 가지다. PDF 의 적분이 연속 확률을 정의하고, 표준화 치환이 모든 가우시안을 표준정규 한 식으로 환산하며, FTC 가 적분을 두 점 함수값의 차로 바꾸고, 다항 근사가 비초등 $\Phi$ 의 숫자 값을 만든다. 어느 하나가 빠지면 답에 도달하지 못한다.

다항식과 가우시안의 비교가 이 차이를 명확히 보여 준다. $\int_0^3 2x\,dx$ 의 경우 부정적분 $x^2$ 이 초등이므로 FTC 만으로 $9 - 0 = 9$ 의 답을 얻는다. $\int_{-1}^{+1} \varphi(z)\,dz$ 의 경우 부정적분 $\Phi(z)$ 가 비초등이므로 FTC 로 $\Phi(+1) - \Phi(-1)$ 까지 도달한 뒤 다항 근사로 $0.8413 - 0.1587 = 0.6827$ 의 숫자를 얻는다. 같은 틀이지만 부정적분의 성질만 다르다.

## 적분 예제 모음 — 다항식부터 가우시안까지

### A. 다항식 — FTC 만으로 끝

$\int_0^3 2x\,dx$ 의 경우 부정적분은 $x^2$ 이고 FTC 로 $3^2 - 0^2 = 9$ 가 답이다. 직선 $y = 2x$ 의 $[0, 3]$ 삼각형 면적과 일치한다.

$\int_1^2 x^3\,dx$ 의 경우 부정적분이 $x^4/4$ 이므로 $16/4 - 1/4 = 15/4 = 3.75$ 가 답이다.

$\int_0^2 (x^3 + 2x^2 + 3x)\,dx$ 의 경우 부정적분이 $x^4/4 + 2x^3/3 + 3x^2/2$ 이고, $F(2) = 4 + 16/3 + 6 = 46/3 \approx 15.33$ 이 답이다.

$\int_{-1}^{2} (3x^2 - 2x + 1)\,dx$ 의 경우 부정적분이 $x^3 - x^2 + x$ 이고, $F(2) = 6$, $F(-1) = -3$ 이므로 $6 - (-3) = 9$ 가 답이다.

### B. 일반 초등함수 — FTC 로 깔끔

$\int_0^\pi \sin x\,dx$ 의 경우 부정적분 $-\cos x$ 로 $[-\cos x]_0^\pi = 1 + 1 = 2$ 가 답이다. 사인 곡선 한 봉우리의 면적이 2 라는 결과다.

$\int_0^{\pi/2} \cos x\,dx$ 의 경우 $[\sin x]_0^{\pi/2} = 1 - 0 = 1$ 이다.

$\int_0^1 e^x\,dx$ 의 경우 $[e^x]_0^1 = e - 1 \approx 1.718$ 이며, 지수함수의 자기복제 성질로 미분과 적분 모두 $e^x$ 가 된다.

$\int_1^e (1/x)\,dx$ 의 경우 $[\ln x]_1^e = 1 - 0 = 1$ 이다. 자연로그의 정의가 "$1/x$ 곡선 아래 면적이 1 이 되는 지점이 $e$" 임을 보여 준다.

### C. u-치환 활용 — 가우시안과 같은 패턴

$\int_0^1 2x \cos(x^2)\,dx$ 에서 $u = x^2$, $du = 2x\,dx$ 로 치환하면 한계가 $0$ 부터 $1$ 로 그대로 유지되고 식은 $\int_0^1 \cos u\,du$ 가 된다. 부정적분 $\sin u$ 로 $\sin 1 - \sin 0 = \sin 1 \approx 0.841$ 이 답이다. 안쪽 함수 $x^2$ 와 그 미분 $2x$ 가 식에 마침 함께 있어 u-치환이 통한다. 가우시안 표준화와 정확히 같은 발상이다.

### D. 비초등 — 가우시안 (대조)

$\int_{-1}^{+1} (1/\sqrt{2\pi}) e^{-z^2/2}\,dz$ 의 경우 부정적분 $\Phi(z)$ 가 비초등이라 닫힌 식이 없다. FTC 로 $\Phi(+1) - \Phi(-1)$ 까지 도달한 뒤 다항 근사로 $0.8413 - 0.1587 = 0.6827$ 의 숫자를 얻는다. 추가 근사 단계 한 번이 가우시안의 특수성이다.

### 9 개 비교표

| # | 적분 | 부정적분 | 초등 | FTC 만으로 |
|---|---|---|---|---|
| A1 | $\int_0^3 2x\,dx$ | $x^2$ | 예 | 9 |
| A2 | $\int_1^2 x^3\,dx$ | $x^4/4$ | 예 | 15/4 |
| A3 | $\int_0^2 (x^3 + 2x^2 + 3x)\,dx$ | $\frac{x^4}{4} + \frac{2x^3}{3} + \frac{3x^2}{2}$ | 예 | 46/3 |
| A4 | $\int_{-1}^2 (3x^2 - 2x + 1)\,dx$ | $x^3 - x^2 + x$ | 예 | 9 |
| B1 | $\int_0^\pi \sin x\,dx$ | $-\cos x$ | 예 | 2 |
| B2 | $\int_0^{\pi/2} \cos x\,dx$ | $\sin x$ | 예 | 1 |
| B3 | $\int_0^1 e^x\,dx$ | $e^x$ | 예 | $e - 1$ |
| B4 | $\int_1^e \frac{1}{x}\,dx$ | $\ln x$ | 예 | 1 |
| C1 | $\int_0^1 2x \cos(x^2)\,dx$ | $\sin(x^2)$ | 예 | $\sin 1$ |
| D1 | $\int_{-1}^{+1} \frac{1}{\sqrt{2\pi}} e^{-z^2/2}\,dz$ | $\Phi(z)$ | 아니오 | 근사 필요 |

아홉 개 중 여덟 개는 FTC 만으로 끝나고, 가우시안만 추가 근사를 필요로 한다.

### 적분 공식 핸드북

| 함수 $f(x)$ | 부정적분 $\int f(x)\,dx$ |
|---|---|
| $x^n$ ($n \neq -1$) | $\dfrac{x^{n+1}}{n+1} + C$ |
| $\dfrac{1}{x}$ | $\ln \lvert x\rvert + C$ |
| $\sin x$ | $-\cos x + C$ |
| $\cos x$ | $\sin x + C$ |
| $\sec^2 x$ | $\tan x + C$ |
| $e^x$ | $e^x + C$ |
| $a^x$ | $\dfrac{a^x}{\ln a} + C$ |
| $\dfrac{1}{1 + x^2}$ | $\arctan x + C$ |
| $\dfrac{1}{\sqrt{1 - x^2}}$ | $\arcsin x + C$ |

미분 표를 거꾸로 읽은 표에 해당한다. 미분을 외우면 적분도 따라온다.

모든 적분의 절차는 같다. 부정적분을 찾고 (또는 치환으로 단순화), FTC 로 위에서 아래를 빼고, 두 점에서의 함수값을 숫자로 평가한다. 초등 함수는 직접 산수로, 비초등 함수는 다항 근사나 표 조회로 평가한다. 다항식과 대부분의 초등함수는 한 페이지 안에 풀리고, 가우시안 같은 비초등 함수는 마지막에 다항 근사 한 단계가 추가될 뿐이다. 아홉 개 예제 중 여덟 개가 FTC 만으로 끝나며, 가우시안 한 개만 근사를 거친다는 점에서 가우시안의 비초등성이 예외적인 사례임을 알 수 있다.

## 빵의 밀도 비유

빵 한 덩어리 (1 kg, 30 cm) 를 생각한다. 총 무게는 1 kg, 밀도는 1 cm 당 무게로 kg/cm 단위, 한 점 (예: 12.345 cm) 의 무게는 0 (점은 폭이 없으므로), 구간 (10 부터 15 cm) 의 무게는 밀도 × 5 = 0.17 kg 이 된다. PDF 도 같은 구조다. 한 점의 확률은 0, 구간 확률은 PDF 와 폭의 곱 (적분), PDF 자체는 단위당 확률 = 밀도이다.

## PDF 값은 1 보다 클 수 있다

좁고 높은 가우시안을 생각해 보자. $\sigma = 1$ 인 넓은 가우시안의 정점은 약 0.4 인 반면, $\sigma = 0.05$ 인 좁은 가우시안의 정점은 8 을 넘는다. 두 분포 모두 적분은 1 이다. 분포가 좁아질수록 정점이 무한히 높아질 수 있다. 밀도는 무제한이지만 면적 (확률) 은 0 과 1 사이로 제한된다. PDF 는 확률 밀도이며, 한 점의 값은 항상 0, 면적 (적분) 만이 진짜 확률이다.

---

# 2. 가우시안 분포

## 식

$$P(x) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)$$

평균 $\mu$ 는 종의 중심 위치, 분산 $\sigma^2$ 은 종의 퍼짐 정도 (클수록 넓고 낮아짐), 표준편차 $\sigma$ 는 분산의 제곱근이다.

## 종 모양

<div><svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block; margin:8px 0;"><g font-family="system-ui, sans-serif" font-size="12"><line x1="30" y1="200" x2="580" y2="200" stroke="#666" stroke-width="1"/><line x1="30" y1="20" x2="30" y2="200" stroke="#666" stroke-width="1"/><rect x="210" y="40" width="180" height="160" fill="#fff3e0" opacity="0.6"/><path d="M30,198 L48,197 L66,195 L84,191 L102,186 L120,178 L138,168 L156,156 L174,140 L192,122 L210,103 L228,84 L246,67 L264,53 L282,44 L300,40 L318,44 L336,53 L354,67 L372,84 L390,103 L408,122 L426,140 L444,156 L462,168 L480,178 L498,186 L516,191 L534,195 L552,197 L570,198" fill="none" stroke="#1565c0" stroke-width="2.2"/><circle cx="300" cy="40" r="4" fill="#d32f2f"/><line x1="300" y1="40" x2="300" y2="200" stroke="#d32f2f" stroke-width="1" stroke-dasharray="4,3"/><text x="300" y="32" text-anchor="middle" fill="#d32f2f" font-weight="600">정점 = μ</text><line x1="210" y1="103" x2="210" y2="200" stroke="#fb8c00" stroke-width="1" stroke-dasharray="3,3"/><line x1="390" y1="103" x2="390" y2="200" stroke="#fb8c00" stroke-width="1" stroke-dasharray="3,3"/><text x="210" y="216" text-anchor="middle" fill="#fb8c00" font-weight="600">μ−σ</text><text x="390" y="216" text-anchor="middle" fill="#fb8c00" font-weight="600">μ+σ</text><text x="300" y="216" text-anchor="middle" fill="#444">μ</text><text x="100" y="216" text-anchor="middle" fill="#666">멀수록 낮음</text><text x="500" y="216" text-anchor="middle" fill="#666">멀수록 낮음</text><text x="585" y="204" fill="#666">x</text><text x="14" y="24" fill="#666">f(x)</text><text x="300" y="180" text-anchor="middle" fill="#bf360c" font-size="11">μ ± σ ≈ 68%</text></g></svg></div>

중심 $\mu$ 에서 가장 높고 양옆으로 갈수록 지수적으로 빠르게 낮아진다. $\pm \sigma$ 영역 (주황) 안에 약 68% 의 확률이 모여 있다.

## μ, σ 의 역할

평균 $\mu$ 의 변화는 종의 위치를 평행이동시킨다. 모양은 그대로이고 좌우로만 옮겨진다.

<div><svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block; margin:8px 0;"><g font-family="system-ui, sans-serif" font-size="12"><line x1="20" y1="170" x2="580" y2="170" stroke="#666" stroke-width="1"/><line x1="20" y1="10" x2="20" y2="170" stroke="#666" stroke-width="1"/><path d="M40,168 L70,164 L100,153 L130,134 L160,108 L190,80 L220,57 L235,49 L250,46 L265,49 L280,57 L310,80 L340,108 L370,134 L400,153 L430,164 L460,168" fill="none" stroke="#1565c0" stroke-width="2"/><line x1="250" y1="46" x2="250" y2="170" stroke="#1565c0" stroke-width="1" stroke-dasharray="3,3"/><text x="250" y="186" text-anchor="middle" fill="#1565c0" font-weight="600">μ = −1.5</text><path d="M170,168 L200,164 L230,153 L260,134 L290,108 L320,80 L350,57 L365,49 L380,46 L395,49 L410,57 L440,80 L470,108 L500,134 L530,153 L560,164 L580,168" fill="none" stroke="#e65100" stroke-width="2"/><line x1="380" y1="46" x2="380" y2="170" stroke="#e65100" stroke-width="1" stroke-dasharray="3,3"/><text x="380" y="186" text-anchor="middle" fill="#e65100" font-weight="600">μ = +1.5</text><text x="585" y="174" fill="#666">x</text></g></svg></div>

표준편차 $\sigma$ 의 변화는 폭과 높이를 동시에 바꾼다. $\sigma$ 가 작으면 좁고 높은 (정밀한) 분포, 크면 넓고 낮은 (부정확한) 분포가 된다. 두 경우 모두 면적은 1 로 동일하다.

<div><svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block; margin:8px 0;"><g font-family="system-ui, sans-serif" font-size="12"><line x1="20" y1="190" x2="580" y2="190" stroke="#666" stroke-width="1"/><line x1="20" y1="10" x2="20" y2="190" stroke="#666" stroke-width="1"/><line x1="300" y1="190" x2="300" y2="20" stroke="#bbb" stroke-width="0.5" stroke-dasharray="3,3"/><path d="M20,185 L55,181 L90,177 L125,172 L160,166 L195,160 L230,155 L265,151 L300,150 L335,151 L370,155 L405,160 L440,166 L475,172 L510,177 L545,181 L580,185" fill="none" stroke="#1565c0" stroke-width="2.4"/><path d="M160,190 L195,188 L230,168 L247,138 L265,93 L282,49 L300,30 L317,49 L335,93 L352,138 L370,168 L405,188 L440,190" fill="none" stroke="#d32f2f" stroke-width="2.4"/><text x="300" y="22" text-anchor="middle" fill="#d32f2f" font-weight="600">σ = 0.5 (좁고 높음)</text><text x="540" y="143" text-anchor="end" fill="#1565c0" font-weight="600">σ = 2 (넓고 낮음)</text><text x="300" y="206" text-anchor="middle" fill="#444">μ = 0</text><text x="20" y="206" text-anchor="middle" fill="#666" font-size="10">−4</text><text x="580" y="206" text-anchor="middle" fill="#666" font-size="10">+4</text><text x="300" y="220" text-anchor="middle" fill="#666" font-size="11">두 곡선 모두 ∫ f(x) dx = 1 (전체 면적 같음)</text></g></svg></div>

## $1\sigma, 2\sigma, 3\sigma$ 직관

| 범위 | 그 안에 들어갈 확률 |
|---|---|
| $\mu \pm \sigma$ | 68% |
| $\mu \pm 2\sigma$ | 95% |
| $\mu \pm 3\sigma$ | 99.7% |

$3\sigma$ 밖의 사건은 거의 발생하지 않는다는 직관이 여기에서 나온다.

## 표준정규 CDF — Φ(z)

CDF 는 Cumulative Distribution Function (누적분포함수) 의 약자다. 표준정규 CDF 는 표준정규 분포 $\mathcal{N}(0, 1)$ 의 CDF 이며, 기호 $\Phi(z)$ 로 쓴다.

### 정의

$$\Phi(z) = \int_{-\infty}^{z} \frac{1}{\sqrt{2\pi}} e^{-t^2/2}\,dt = P(Z \le z)$$

$-\infty$ 부터 $z$ 까지의 표준정규 PDF 누적 면적이며, $Z$ 가 $z$ 이하일 누적 확률에 해당한다.

### PDF 와 CDF — 시각적

<div><svg viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:700px; display:block; margin:8px 0;"><g font-family="system-ui, sans-serif" font-size="12"><text x="170" y="18" text-anchor="middle" font-weight="600" fill="#444">표준정규 PDF — φ(z)</text><line x1="20" y1="200" x2="320" y2="200" stroke="#666" stroke-width="1"/><line x1="20" y1="35" x2="20" y2="200" stroke="#666" stroke-width="1"/><path d="M20,200 L25,200 L40,199 L55,198 L70,196 L85,193 L100,189 L115,182 L130,172 L145,160 L160,144 L175,124 L190,100 L205,80 L210,76 L210,200 Z" fill="#ffb74d" opacity="0.55" stroke="none"/><path d="M25,199 L40,199 L55,198 L70,196 L85,193 L100,189 L115,182 L130,172 L145,160 L160,144 L175,124 L190,100 L205,80 L220,62 L235,49 L250,42 L265,40 L280,42 L295,49 L310,62 L325,80 L340,100 L355,124 L370,144" fill="none" stroke="#1565c0" stroke-width="2"/><line x1="210" y1="76" x2="210" y2="200" stroke="#d32f2f" stroke-width="1.5" stroke-dasharray="3,3"/><circle cx="210" cy="76" r="3" fill="#d32f2f"/><text x="210" y="216" text-anchor="middle" fill="#d32f2f" font-weight="600">z = 1</text><text x="115" y="160" text-anchor="middle" fill="#bf360c" font-size="11" font-weight="600">Φ(1) = 0.8413</text><text x="115" y="175" text-anchor="middle" fill="#bf360c" font-size="10">(누적 면적)</text><text x="170" y="216" text-anchor="middle" fill="#666">0</text><text x="20" y="216" text-anchor="middle" fill="#666">−3</text><text x="320" y="216" text-anchor="middle" fill="#666">+3</text><text x="328" y="204" fill="#666">z</text><text x="525" y="18" text-anchor="middle" font-weight="600" fill="#444">표준정규 CDF — Φ(z)</text><line x1="375" y1="200" x2="675" y2="200" stroke="#666" stroke-width="1"/><line x1="375" y1="35" x2="375" y2="200" stroke="#666" stroke-width="1"/><line x1="375" y1="118" x2="675" y2="118" stroke="#ddd" stroke-width="0.5" stroke-dasharray="3,3"/><text x="370" y="121" text-anchor="end" fill="#999" font-size="10">0.5</text><text x="370" y="40" text-anchor="end" fill="#999" font-size="10">1.0</text><text x="370" y="203" text-anchor="end" fill="#999" font-size="10">0.0</text><path d="M375,200 L405,200 L420,199 L435,198 L450,196 L465,193 L480,189 L495,182 L510,172 L525,158 L540,140 L555,118 L565,100 L575,82 L585,67 L595,55 L605,46 L620,40 L635,37 L650,35 L665,35 L675,35" fill="none" stroke="#1565c0" stroke-width="2"/><line x1="565" y1="61" x2="565" y2="200" stroke="#d32f2f" stroke-width="1.5" stroke-dasharray="3,3"/><line x1="375" y1="61" x2="565" y2="61" stroke="#d32f2f" stroke-width="1.5" stroke-dasharray="3,3"/><circle cx="565" cy="61" r="4" fill="#d32f2f"/><text x="565" y="216" text-anchor="middle" fill="#d32f2f" font-weight="600">z = 1</text><text x="572" y="56" fill="#d32f2f" font-weight="600" font-size="11">Φ(1) = 0.8413</text><text x="525" y="216" text-anchor="middle" fill="#666">0</text><text x="375" y="216" text-anchor="middle" fill="#666">−3</text><text x="675" y="216" text-anchor="middle" fill="#666">+3</text><text x="683" y="204" fill="#666">z</text><path d="M345,118 Q360,118 372,118" fill="none" stroke="#666" stroke-width="1" marker-end="url(#arrcdf)"/><defs><marker id="arrcdf" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#666"/></marker></defs><text x="335" y="100" text-anchor="end" fill="#666" font-size="11">PDF 면적</text><text x="335" y="114" text-anchor="end" fill="#666" font-size="11">→ CDF 높이</text></g></svg></div>

PDF 아래의 음영 면적 (왼쪽) 이 곧 CDF 의 $z$ 시점 높이 (오른쪽) 다. 같은 정보의 두 표현이다.

### 주요 값

| $z$ | $\Phi(z)$ | 의미 |
|---|---|---|
| $-\infty$ | 0 | 완전 왼쪽 |
| -3 | 0.0013 | |
| -2 | 0.0228 | |
| -1 | 0.1587 | |
| 0 | 0.5 | 평균 = 정확히 절반 (대칭) |
| +1 | 0.8413 | |
| +2 | 0.9772 | |
| +3 | 0.9987 | |
| $+\infty$ | 1 | 완전 오른쪽 = 전체 |

### 핵심 성질

$\Phi$ 는 항상 0 과 1 사이의 값을 가지며 (확률), 단조 증가한다 ($z$ 가 클수록 누적이 크다). 대칭성이 성립한다 ($\Phi(-z) = 1 - \Phi(z)$). 미분은 PDF 가 된다 ($\Phi'(z) = \varphi(z)$, FTC 의 직접 결과). 닫힌 식이 없는 비초등 함수이며 다항 근사 (erf 변환) 로 계산된다.

### 어디에 쓰나

가장 중요한 용도는 구간 확률 계산이다. $P(z_a < Z < z_b) = \Phi(z_b) - \Phi(z_a)$ 가 데모의 정체이기도 하다. 이 외에도 z-score 테이블 (통계학, 시험, 품질관리), 신뢰구간 ("95% 신뢰구간" 의 경우 $\Phi^{-1}(0.975) \approx 1.96$), 가설 검정의 p-value 계산 등에 쓰인다.

### 일반 가우시안의 CDF 와의 관계

$X \sim \mathcal{N}(\mu, \sigma^2)$ 의 CDF $F_X(x)$ 는 표준화 치환 후 $\Phi$ 호출로 표현된다.

$$F_X(x) = P(X \le x) = \Phi\left(\frac{x - \mu}{\sigma}\right)$$

이래서 $\Phi$ 표 한 장으로 모든 가우시안이 처리된다. 키 분포 ($\mu = 170, \sigma = 7$) 에서 키가 177 이하일 확률은

$$F_X(177) = \Phi\left(\frac{177 - 170}{7}\right) = \Phi(1) = 0.8413 = 84.13\%$$

로 계산된다.

### 데모 코드와의 매핑

```js
function gaussianCDF(x) {
  return 0.5 * (1 + erf((x - MU) / (SIGMA * Math.SQRT2)));
}

function intervalProb(a, b) {
  return gaussianCDF(b) - gaussianCDF(a);
}
```

표준정규 CDF $\Phi(z)$ 는 $Z$ 가 $z$ 이하일 누적 확률이며, PDF 아래의 누적 면적에 해당한다. $\Phi(0) = 0.5$, $\Phi(\pm\infty) = 0/1$ 이고 단조 증가의 S 모양을 가진다. 비초등 함수이므로 다항 근사로 계산되며, 가우시안 구간 확률은 $\Phi(z_b) - \Phi(z_a)$ 로 표현된다 — 이것이 PDF 적분의 핵심이다.

## 왜 가우시안이 흔한가

세 가지 이유가 있다. 첫째는 중심극한정리 (CLT) 이다. 작은 무작위 효과를 더하면 가우시안에 수렴한다. 둘째는 수학적 편의이다. 미분, 적분, conjugate 등이 모두 깔끔하게 닫힌 형태로 정리된다. 셋째는 자연 현상에서의 보편성이다. 키, 시험점수, 측정 노이즈 등 실제 데이터의 많은 부분이 가우시안에 가깝다. 모르는 분포를 가정해야 할 때 가우시안이 디폴트로 쓰이는 배경이다. 가우시안은 평균 $\mu$ 와 분산 $\sigma^2$ 두 숫자로 정의되는 종 모양 분포이며, 자연 현상의 보편성과 수학적 편의 덕분에 MLE 와 MAP 의 기본 분포로 자리잡았다.

---

# 3. 독립 + 곱셈 규칙

## 독립이란

독립이란 한 사건이 다른 사건에 영향을 주지 않는 관계를 의미한다. 동전을 두 번 던질 때 첫째가 앞이든 뒤든 둘째의 확률은 변하지 않으므로 두 시행은 독립이다. 반면 카드 두 장을 (뽑은 카드를 다시 넣지 않고) 연달아 뽑는 경우에는 첫째의 결과가 둘째의 확률에 영향을 주므로 종속이다.

## 독립 사건 곱셈 규칙

두 독립 사건이 동시에 일어날 확률은 각각의 확률의 곱이다.

$$P(A \text{ AND } B) = P(A) \cdot P(B) \quad (\text{A, B 독립})$$

동전 두 번 던져 둘 다 앞이 나올 확률은 $1/2 \times 1/2 = 1/4$ 가 된다. 나무 그림으로 보면 첫째가 앞일 확률 1/2 의 가지에서 둘째가 앞일 확률 1/2 의 가지로 내려가는 경로 하나의 확률이 두 단계의 곱으로 표현된다. 가지를 따라가며 곱한 값이 그 잎의 확률이다.

## N 개로 일반화

$N$ 개의 독립 사건에 대한 일반식은 다음과 같다.

$$P(A_1 \text{ AND } A_2 \text{ AND } \ldots \text{ AND } A_N) = \prod_{i=1}^{N} P(A_i)$$

곱 기호 $\prod$ 가 이 단계에서 등장한다.

## MLE/MAP 와 연결

데이터 $N$ 개가 독립일 때 likelihood 는 각 점 PDF 값의 곱으로 정의된다.

$$L(w) = \prod_{i=1}^{N} p(y_i \mid w)$$

회귀처럼 $y$ 가 연속인 경우 엄밀히는 확률이 아닌 밀도이지만, argmax 에는 영향을 주지 않는다. log 를 취하면 곱이 합으로 바뀐다.

$$\log L(w) = \sum_{i=1}^{N} \log P(y_i \mid w)$$

이것이 MLE 의 출발점이다. 독립 사건이 동시에 일어날 확률은 곱이며, $N$ 개 데이터의 likelihood 는 $\prod P_i$ 의 형태로, log 를 취하면 $\sum$ 으로 바뀐다.

---

# 4. 조건부 확률 P(A|B)

## 정의

$$P(A \mid B) = \text{"B 가 일어났을 때 A 의 확률"}$$

"B 를 알 때" 라는 조건이 붙은 확률이다.

## 식

$$P(A \mid B) = \frac{P(A \text{ AND } B)}{P(B)}$$

두 사건이 동시에 일어날 확률을 $B$ 자체의 확률로 나눈 비율이다.

## 직관 — 카드

카드 한 장을 뽑을 때 하트가 나올 확률은 $13/52 = 1/4$, 빨강 (하트 + 다이아) 이 나올 확률은 $26/52 = 1/2$ 이다. 빨강이 나왔다는 조건 하에서 하트일 확률은 다음과 같이 계산된다.

$$P(\text{하트} \mid \text{빨강}) = \frac{P(\text{하트 AND 빨강})}{P(\text{빨강})} = \frac{13/52}{26/52} = \frac{1}{2}$$

빨강 안에서만 보면 절반이 하트라는 의미다. 시각적으로는 전체 52 장의 카드 중 빨강 26 장으로 우주를 좁힌 뒤, 그 안에서 하트가 차지하는 비율 13/26 = 1/2 를 얻는 절차다. 조건이 우주를 좁히는 것이 조건부 확률의 본질이다.

## MLE/MAP 와 연결

$P(D \mid w)$ 는 $w$ 가 정해졌을 때 데이터 $D$ 가 나올 확률로, likelihood 라 부른다. $P(w \mid D)$ 는 $D$ 를 봤을 때 $w$ 의 분포로, posterior 라 부른다. 이 둘은 서로 다른 확률이며, 베이즈 정리로 연결된다. $P(A \mid B)$ 는 "B 일 때 A 의 확률" 인 조건부 확률이며, B 가 우주를 좁히는 효과를 갖는다. likelihood $P(D \mid w)$ 와 posterior $P(w \mid D)$ 는 다른 확률이라는 점을 기억해야 한다.

---

# 5. 베이즈 정리

## 식

$$P(w \mid D) = \frac{P(D \mid w) \cdot P(w)}{P(D)}$$

$P(w \mid D)$ 는 posterior (사후) 로 데이터를 본 후 $w$ 의 분포, $P(D \mid w)$ 는 likelihood 로 $w$ 를 알 때 데이터의 그럴듯함, $P(w)$ 는 prior (사전) 로 데이터 없을 때 $w$ 의 분포, $P(D)$ 는 evidence 로 데이터 자체의 확률 ($w$ 와 무관한 상수) 을 의미한다.

## 유도

조인트 확률을 두 가지 방식으로 분해할 수 있다.

$$P(D, w) = P(D \mid w) \cdot P(w) = P(w \mid D) \cdot P(D)$$

양변을 $P(D)$ 로 나누면 베이즈 정리가 얻어진다.

$$P(w \mid D) = \frac{P(D \mid w) \cdot P(w)}{P(D)}$$

## 직관

베이즈 정리는 "사전 정보 + 새 데이터 → 종합 추정" 의 수학적 표현이다. 사전 정보 $P(w)$ 와 데이터 적합도 $P(D \mid w)$ 의 곱이 posterior $P(w \mid D)$ 가 된다. 두 정보를 모두 만족하는 $w$ 가 진짜 답이라는 발상이다.

새 사람의 키를 추측하는 예를 들면, prior 로 "한국 평균 170 ± 7 cm" 의 사전 분포가 주어지고, likelihood 로 "측정 1 회 = 168 cm (자 ±5 cm)" 의 데이터가 들어오면, posterior 로 "169 cm 정도" 라는 종합 추정이 나온다. 두 정보가 동의하는 위치가 가장 그럴듯하다.

## $P(D)$ 무시 가능

MAP 풀이에서 $P(D)$ 는 $w$ 와 무관한 상수이므로 정점의 위치를 바꾸지 않는다.

$$\arg\max_w P(w \mid D) = \arg\max_w \frac{P(D \mid w) P(w)}{P(D)} = \arg\max_w \big[P(D \mid w) \cdot P(w)\big]$$

따라서 자주 쓰이는 비례 표현은 다음과 같다.

$$P(w \mid D) \;\propto\; P(D \mid w) \cdot P(w)$$

베이즈 정리는 사전 정보와 새 데이터를 결합해 사후 분포를 얻는 수학이며, $P(w \mid D) \propto L(w) \cdot P(w)$ 의 비례 표현으로 자주 쓰인다. 두 정보를 모두 만족하는 (AND) 영역을 곱으로 표현하는 것이 핵심이다.

---

# 종합 — MLE/MAP 와 연결

## MLE 시점

MLE 는 다음 단계로 전개된다. 먼저 모델 $y = \hat{y}(w) + \varepsilon$ 을 가정하고, 노이즈를 가우시안 $\varepsilon \sim \mathcal{N}(0, \sigma^2)$ 으로 가정한다. 한 점의 PDF 는 $P(y \mid w) = (1/\sqrt{\cdots}) \exp(-r^2 / 2\sigma^2)$ 이고, $N$ 점 likelihood 는 독립 가정에 의해 곱 $L(w) = \prod P(y_i \mid w)$ 가 된다. log 를 취하면 곱이 합으로 바뀌어 $\ell(w) = \sum \log P(y_i \mid w) = C - \text{SSE}/2\sigma^2$ 가 되고, MLE 는 $\arg\max \ell = \arg\min \text{SSE}$ 로 정리된다. PDF, 곱셈 규칙, log, 가우시안이 모두 등장하는 흐름이다.

## MAP 시점

MAP 는 prior 가정 $P(w) = \mathcal{N}(0, \tau^2)$ 을 추가한다. 베이즈 정리로 posterior 는 $P(w \mid D) \propto L(w) \cdot P(w)$ 가 되고, log 와 가우시안 가정에 의해 $\text{SSE} + \lambda \lVert w \rVert^2$ 형태로 전개된다. 결과적으로 MAP 는 $\arg\min [\text{SSE} + \lambda \lVert w \rVert^2]$ 로 정리된다. 여기에는 베이즈 정리와 조건부 확률이 추가로 등장한다.

다섯 개의 도구가 어디에서 사용되는지 정리하면 다음과 같다. PDF 는 한 점 확률의 정의 (가우시안 식) 에, 가우시안은 노이즈와 prior 의 가정 (likelihood, prior) 에, 곱셈 규칙은 $N$ 점 likelihood ($\prod P(y_i)$) 에, 조건부 확률은 likelihood 자체 ($P(D \mid w)$) 에, 베이즈 정리는 posterior 정의 (MAP) 에 사용된다. 이 다섯 가지가 MLE 와 MAP 의 기본 도구다.

---

# 한 줄 요약

확률 입문의 다섯 가지 핵심은 다음과 같다. PDF 는 확률 밀도이며 면적이 진짜 확률이다. 가우시안은 평균과 분산 두 숫자로 정의되는 종 모양 분포이다. 독립 사건은 곱셈 규칙을 따르며, log 를 취하면 합으로 바뀐다. 조건부 확률 $P(A \mid B)$ 는 "B 일 때 A 의 확률" 이다. 베이즈 정리는 $P(w \mid D) \propto L(w) \cdot P(w)$ 의 형태로 사전 정보와 데이터를 결합한다. 이 다섯 개의 도구로 MLE, MAP, Bayesian 추정 전체를 이해할 수 있다.

---

## 다음 단계

다음 글에서 다룰 주제는 다음과 같다. Part 2·1 MLE 기초 — 동전 던지기로 likelihood 첫 만남. Part 2·2 MLE = SSE — 가우시안 가정의 자연스러운 결과. Part 2·3 WLS — 점마다 다른 $\sigma_i$. Part 2·4 MAP — prior 추가와 LM 의 $\lambda$ 정체.
