---
title: 부록 확률 분포 개관 — PDF/PMF 와 자주 쓰는 10 개 분포
description: 확률 분포의 큰 지도. 연속/이산 분류, 자주 쓰는 10 개 분포의 식·적분·평균·분산 카탈로그, Lambert W 등 비초등 함수 정리.
author: mark
date: 2026-05-05 12:30:00 +0900
categories: [math, probability]
tags: [distributions, pdf, pmf, gaussian, beta, gamma, lambert-w]
math: true
---

## 확률 분포 개관 — 큰 지도

> **확률 분포의 우주 한눈에**.
> 가우시안, 포아송, 균등 등 — 모두 **확률 분포** 라는 큰 카테고리의 멤버.
> 이 문서: 분포의 분류 + 자주 쓰는 9 개 한 줄 정리.

---

## 한 줄 요약

> **확률 분포 → 연속/이산 → 구체 분포** 의 3 층 계층.
> **연속** 분포는 **PDF** 로, **이산** 분포는 **PMF** 로 표현.
> 모든 분포의 공통 조건: **합/적분 = 1** (확률의 정의).

---

## 큰 그림 — 분포의 계통도

<div><svg viewBox="0 0 820 540" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:820px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <!-- 루트 -->
  <rect x="320" y="20" width="180" height="50" rx="8" fill="#37474f" stroke="#263238" stroke-width="1.5"/>
  <text x="410" y="42" text-anchor="middle" fill="#fff" font-size="15" font-weight="700">확률 분포</text>
  <text x="410" y="60" text-anchor="middle" fill="#cfd8dc" font-size="11">(probability distribution)</text>
  <!-- 연결선 -->
  <line x1="410" y1="70" x2="410" y2="100" stroke="#666" stroke-width="1.5"/>
  <line x1="200" y1="100" x2="620" y2="100" stroke="#666" stroke-width="1.5"/>
  <line x1="200" y1="100" x2="200" y2="125" stroke="#666" stroke-width="1.5"/>
  <line x1="620" y1="100" x2="620" y2="125" stroke="#666" stroke-width="1.5"/>
  <!-- 좌: 연속 -->
  <rect x="80" y="125" width="240" height="68" rx="8" fill="#1565c0" stroke="#0d47a1" stroke-width="1.5"/>
  <text x="200" y="148" text-anchor="middle" fill="#fff" font-size="14" font-weight="700">연속 분포</text>
  <text x="200" y="166" text-anchor="middle" fill="#bbdefb" font-size="11">변수: 실수 (키, 시간 등)</text>
  <text x="200" y="183" text-anchor="middle" fill="#fff176" font-size="12" font-weight="600">표현: PDF (∫ f dx = 1)</text>
  <g transform="translate(330, 138)">
    <path d="M0,40 Q15,40 22,30 T44,5 T66,30 T88,40" fill="none" stroke="#90caf9" stroke-width="1.5"/>
  </g>
  <!-- 우: 이산 -->
  <rect x="500" y="125" width="240" height="68" rx="8" fill="#e65100" stroke="#bf360c" stroke-width="1.5"/>
  <text x="620" y="148" text-anchor="middle" fill="#fff" font-size="14" font-weight="700">이산 분포</text>
  <text x="620" y="166" text-anchor="middle" fill="#ffe0b2" font-size="11">변수: 정수 (눈, 횟수 등)</text>
  <text x="620" y="183" text-anchor="middle" fill="#fff176" font-size="12" font-weight="600">표현: PMF (Σ p = 1)</text>
  <g transform="translate(750, 145)" fill="#ffcc80">
    <rect x="0" y="30" width="6" height="10"/>
    <rect x="10" y="20" width="6" height="20"/>
    <rect x="20" y="10" width="6" height="30"/>
    <rect x="30" y="20" width="6" height="20"/>
    <rect x="40" y="30" width="6" height="10"/>
  </g>
  <!-- 좌 자식 연결선 -->
  <line x1="200" y1="193" x2="200" y2="225" stroke="#1565c0" stroke-width="1.2"/>
  <line x1="200" y1="225" x2="200" y2="490" stroke="#1565c0" stroke-width="1.2"/>
  <!-- 좌 자식 -->
  <g font-size="12">
    <line x1="200" y1="245" x2="240" y2="245" stroke="#1565c0" stroke-width="1.2"/>
    <rect x="240" y="225" width="200" height="40" rx="6" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.2"/>
    <text x="252" y="245" fill="#0d47a1" font-weight="700">가우시안</text>
    <text x="335" y="245" fill="#1565c0">𝒩(μ, σ²)</text>
    <text x="252" y="259" fill="#666" font-size="10">키, 노이즈, MLE 기본</text>
    <line x1="200" y1="295" x2="240" y2="295" stroke="#1565c0" stroke-width="1.2"/>
    <rect x="240" y="275" width="200" height="40" rx="6" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.2"/>
    <text x="252" y="295" fill="#0d47a1" font-weight="700">균등</text>
    <text x="335" y="295" fill="#1565c0">U(a, b)</text>
    <text x="252" y="309" fill="#666" font-size="10">난수, 무지의 표현</text>
    <line x1="200" y1="345" x2="240" y2="345" stroke="#1565c0" stroke-width="1.2"/>
    <rect x="240" y="325" width="200" height="40" rx="6" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.2"/>
    <text x="252" y="345" fill="#0d47a1" font-weight="700">지수</text>
    <text x="335" y="345" fill="#1565c0">Exp(λ)</text>
    <text x="252" y="359" fill="#666" font-size="10">대기 시간, 수명</text>
    <line x1="200" y1="395" x2="240" y2="395" stroke="#1565c0" stroke-width="1.2"/>
    <rect x="240" y="375" width="200" height="40" rx="6" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.2"/>
    <text x="252" y="395" fill="#0d47a1" font-weight="700">베타</text>
    <text x="335" y="395" fill="#1565c0">Beta(α, β)</text>
    <text x="252" y="409" fill="#666" font-size="10">베이지안 prior</text>
    <line x1="200" y1="445" x2="240" y2="445" stroke="#1565c0" stroke-width="1.2"/>
    <rect x="240" y="425" width="200" height="40" rx="6" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.2"/>
    <text x="252" y="445" fill="#0d47a1" font-weight="700">감마</text>
    <text x="335" y="445" fill="#1565c0">Gamma(α, β)</text>
    <text x="252" y="459" fill="#666" font-size="10">대기/수명, 분산 prior</text>
    <line x1="200" y1="490" x2="240" y2="490" stroke="#1565c0" stroke-width="1.2"/>
    <text x="245" y="495" fill="#666" font-size="10">... (무수히 많음)</text>
  </g>
  <!-- 우 자식 연결선 -->
  <line x1="620" y1="193" x2="620" y2="225" stroke="#e65100" stroke-width="1.2"/>
  <line x1="620" y1="225" x2="620" y2="490" stroke="#e65100" stroke-width="1.2"/>
  <!-- 우 자식 -->
  <g font-size="12">
    <line x1="620" y1="245" x2="660" y2="245" stroke="#e65100" stroke-width="1.2"/>
    <rect x="500" y="225" width="200" height="40" rx="6" fill="#fff3e0" stroke="#e65100" stroke-width="1.2"/>
    <text x="512" y="245" fill="#bf360c" font-weight="700">베르누이</text>
    <text x="610" y="245" fill="#e65100" text-anchor="end">Bern(p)</text>
    <text x="512" y="259" fill="#666" font-size="10">동전 한 번</text>
    <line x1="620" y1="295" x2="660" y2="295" stroke="#e65100" stroke-width="1.2"/>
    <rect x="500" y="275" width="200" height="40" rx="6" fill="#fff3e0" stroke="#e65100" stroke-width="1.2"/>
    <text x="512" y="295" fill="#bf360c" font-weight="700">이항</text>
    <text x="610" y="295" fill="#e65100" text-anchor="end">Bin(N, p)</text>
    <text x="512" y="309" fill="#666" font-size="10">동전 N 번</text>
    <line x1="620" y1="345" x2="660" y2="345" stroke="#e65100" stroke-width="1.2"/>
    <rect x="500" y="325" width="200" height="40" rx="6" fill="#fff3e0" stroke="#e65100" stroke-width="1.2"/>
    <text x="512" y="345" fill="#bf360c" font-weight="700">포아송</text>
    <text x="610" y="345" fill="#e65100" text-anchor="end">Poi(λ)</text>
    <text x="512" y="359" fill="#666" font-size="10">단위 시간당 사건 수</text>
    <line x1="620" y1="395" x2="660" y2="395" stroke="#e65100" stroke-width="1.2"/>
    <rect x="500" y="375" width="200" height="40" rx="6" fill="#fff3e0" stroke="#e65100" stroke-width="1.2"/>
    <text x="512" y="395" fill="#bf360c" font-weight="700">카테고리컬</text>
    <text x="610" y="395" fill="#e65100" text-anchor="end">Cat(p₁,...,pₖ)</text>
    <text x="512" y="409" fill="#666" font-size="10">주사위 한 번, 분류</text>
    <line x1="620" y1="445" x2="660" y2="445" stroke="#e65100" stroke-width="1.2"/>
    <rect x="500" y="425" width="200" height="40" rx="6" fill="#fff3e0" stroke="#e65100" stroke-width="1.2"/>
    <text x="512" y="445" fill="#bf360c" font-weight="700">다항</text>
    <text x="610" y="445" fill="#e65100" text-anchor="end">Mult(N, p)</text>
    <text x="512" y="459" fill="#666" font-size="10">주사위 N 번</text>
    <line x1="620" y1="490" x2="660" y2="490" stroke="#e65100" stroke-width="1.2"/>
    <text x="665" y="495" fill="#666" font-size="10">... (무수히 많음)</text>
  </g>
  <!-- 하단 메모 -->
  <rect x="60" y="510" width="700" height="22" rx="4" fill="#f5f5f5" stroke="#ccc"/>
  <text x="410" y="525" text-anchor="middle" fill="#444" font-size="11">공통 조건: 모든 분포는 합/적분이 정확히 1 (확률의 정의 조건)</text>
</svg></div>

---

## 분포 ↔ PDF/PMF — 같은 대상의 두 이름

연속 분포는 **PDF 가 곧 분포**, 이산 분포는 **PMF 가 곧 분포**.

| 시점 | 뉘앙스 |
|---|---|
| **분포** (distribution) | 추상적 — "확률변수 $X$ 가 어떻게 행동하는가" |
| **PDF / PMF** | 구체적 — "그 행동을 묘사하는 함수" |

→ 같은 대상. "**가우시안 분포** = **가우시안 PDF**", "**포아송 분포** = **포아송 PMF**".

---

## 공통 조건 — 합/적분 = 1 ★

어떤 분포든 **확률 분포 자격을 갖추려면**:

| 종류 | 조건 |
|---|---|
| **연속 (PDF)** | $\displaystyle\int_{-\infty}^{\infty} f(x)\,dx = 1$ |
| **이산 (PMF)** | $\displaystyle\sum_k p_k = 1$ |

→ "**확률은 0~1, 전체 = 100%**" 콜모고로프 공리의 시각적 표현.

---

## 자주 쓰는 분포 — 한 페이지 카탈로그

### 연속 분포 (PDF)

#### 1. 가우시안 (Normal) — $\mathcal{N}(\mu, \sigma^2)$

<div><svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:320px; display:block; margin:6px 0;">
  <g font-family="system-ui, sans-serif" font-size="10" fill="#666">
    <line x1="40" y1="150" x2="310" y2="150" stroke="#888" stroke-width="1"/>
    <line x1="40" y1="20" x2="40" y2="150" stroke="#888" stroke-width="1"/>
    <path d="M40,149 L49,148 L57,146 L66,144 L75,140 L83,134 L92,127 L101,118 L109,107 L118,94 L127,80 L135,66 L144,54 L153,44 L161,37 L170,35 L179,37 L187,44 L196,54 L205,66 L213,80 L222,94 L231,107 L239,118 L248,127 L257,134 L265,140 L274,144 L283,146 L291,148 L300,149 L300,150 L40,150 Z" fill="rgba(21,101,192,0.18)" stroke="#1565c0" stroke-width="2"/>
    <text x="170" y="14" text-anchor="middle" fill="#0d47a1" font-weight="600">𝒩(0, 1) — 표준정규</text>
    <text x="40" y="164" text-anchor="middle">−3</text>
    <text x="170" y="164" text-anchor="middle">0</text>
    <text x="300" y="164" text-anchor="middle">+3</text>
    <text x="312" y="153">x</text>
  </g>
</svg></div>

**PDF**:

$$f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$$

**정규화 (∫ = 1)**:

$$\int_{-\infty}^{\infty} \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right) dx = 1$$

→ 비초등 적분, $\Phi$ 표 / erf 다항 근사로 계산. 부분 적분: $P(a < X < b) = \Phi\left(\frac{b-\mu}{\sigma}\right) - \Phi\left(\frac{a-\mu}{\sigma}\right)$

**기댓값 / 분산**:

$$E[X] = \int_{-\infty}^{\infty} x f(x)\,dx = \mu, \qquad \mathrm{Var}[X] = \int_{-\infty}^{\infty} (x-\mu)^2 f(x)\,dx = \sigma^2$$

- **모양**: 종 곡선 (대칭)
- **파라미터**: $\mu$ (평균), $\sigma^2$ (분산)
- **응용**: 키/시험점수/측정 노이즈, MLE/MAP 의 기본
- **특징**: 중심극한정리의 자연스러운 결과 / 자연 현상 어디나 등장
- 자세히 → [`/blog/2026/probability-basics/` § 2](/blog/2026/probability-basics/)

#### 2. 균등 (Uniform) — $U(a, b)$

<div><svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:320px; display:block; margin:6px 0;">
  <g font-family="system-ui, sans-serif" font-size="10" fill="#666">
    <line x1="40" y1="150" x2="310" y2="150" stroke="#888" stroke-width="1"/>
    <line x1="40" y1="20" x2="40" y2="150" stroke="#888" stroke-width="1"/>
    <!-- 사각형 [0, 1] -->
    <rect x="92" y="60" width="156" height="90" fill="rgba(21,101,192,0.18)" stroke="#1565c0" stroke-width="2"/>
    <text x="170" y="14" text-anchor="middle" fill="#0d47a1" font-weight="600">U(0, 1) — 균등</text>
    <text x="40" y="164" text-anchor="middle">−0.2</text>
    <text x="92" y="164" text-anchor="middle">0</text>
    <text x="248" y="164" text-anchor="middle">1</text>
    <text x="312" y="153">x</text>
    <text x="170" y="55" text-anchor="middle" fill="#0d47a1" font-size="11">f(x) = 1</text>
  </g>
</svg></div>

**PDF**:

$$f(x) = \begin{cases} \dfrac{1}{b - a} & a \le x \le b \\ 0 & \text{otherwise} \end{cases}$$

**정규화 (∫ = 1)**:

$$\int_a^b \frac{1}{b-a}\,dx = \frac{1}{b-a} \cdot (b - a) = 1 \;\;\checkmark$$

**CDF**:

$$F(x) = \frac{x - a}{b - a} \quad (a \le x \le b)$$

**기댓값 / 분산**:

$$E[X] = \frac{a + b}{2}, \qquad \mathrm{Var}[X] = \frac{(b-a)^2}{12}$$

- **모양**: 사각형 (평평)
- **응용**: 난수 생성, "그 구간 안 어디든 같은 확률" 무지 표현
- **특징**: 베이지안에서 "정보 없음" prior 으로 자주 사용

#### 3. 지수 (Exponential) — $\mathrm{Exp}(\lambda)$

<div><svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:320px; display:block; margin:6px 0;">
  <g font-family="system-ui, sans-serif" font-size="10" fill="#666">
    <line x1="40" y1="150" x2="310" y2="150" stroke="#888" stroke-width="1"/>
    <line x1="40" y1="20" x2="40" y2="150" stroke="#888" stroke-width="1"/>
    <path d="M40,32 L53,58 L66,78 L79,94 L92,107 L105,116 L118,124 L131,129 L144,134 L157,138 L170,140 L183,142 L196,144 L209,145 L222,146 L235,147 L248,148 L261,148 L274,149 L287,149 L300,149 L300,150 L40,150 Z" fill="rgba(21,101,192,0.18)" stroke="#1565c0" stroke-width="2"/>
    <text x="170" y="14" text-anchor="middle" fill="#0d47a1" font-weight="600">Exp(1) — 지수</text>
    <text x="40" y="164" text-anchor="middle">0</text>
    <text x="170" y="164" text-anchor="middle">2.5</text>
    <text x="300" y="164" text-anchor="middle">5</text>
    <text x="312" y="153">x</text>
  </g>
</svg></div>

**PDF**:

$$f(x) = \lambda e^{-\lambda x}, \quad x \ge 0$$

**정규화 (∫ = 1)** — 단계별:

**(1) 부정적분 찾기** — "미분하면 $e^{-\lambda x}$ 가 되는 함수?"

$$\frac{d}{dx}\left[-\frac{1}{\lambda} e^{-\lambda x}\right] = -\frac{1}{\lambda} \cdot (-\lambda) e^{-\lambda x} = e^{-\lambda x} \;\;\checkmark$$

→ 따라서:

$$\int e^{-\lambda x}\,dx = -\frac{1}{\lambda} e^{-\lambda x} + C$$

전체 식 (앞에 $\lambda$ 곱):

$$\int \lambda e^{-\lambda x}\,dx = \lambda \cdot \left(-\frac{1}{\lambda} e^{-\lambda x}\right) + C = -e^{-\lambda x} + C$$

→ $\lambda$ 와 $1/\lambda$ 약분, 깔끔.

**(2) FTC 적용** — 위 (∞) − 아래 (0):

$$\int_0^\infty \lambda e^{-\lambda x}\,dx = \big[-e^{-\lambda x}\big]_0^\infty$$

각 한계 평가:

| $x$ | $-e^{-\lambda x}$ | 이유 |
|---|---|---|
| **0** (아래) | $-e^{-\lambda \cdot 0} = -e^0 = \mathbf{-1}$ | 어떤 수의 0 제곱 = 1 |
| **∞** (위) | $-e^{-\lambda \cdot \infty} = -e^{-\infty} = -0 = \mathbf{0}$ | 음수 큰 지수 → $1/e^\infty \to 0$ |

→ 위 − 아래:

$$= 0 - (-1) = 0 + 1 = \mathbf{1} \;\;\checkmark$$

**(3) 시각적** — 부정적분 $G(x) = -e^{-\lambda x}$ 의 그래프 (λ=1):

<div><svg viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:420px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <!-- 축 -->
  <line x1="50" y1="200" x2="400" y2="200" stroke="#888" stroke-width="1"/>
  <line x1="50" y1="20" x2="50" y2="220" stroke="#888" stroke-width="1"/>
  <!-- y=0 강조선 -->
  <line x1="50" y1="40" x2="400" y2="40" stroke="#bbb" stroke-width="0.6" stroke-dasharray="3,3"/>
  <!-- y=-1 강조선 -->
  <line x1="50" y1="200" x2="400" y2="200" stroke="#bbb" stroke-width="0.6"/>
  <!-- y 라벨 -->
  <text x="44" y="44" text-anchor="end" fill="#666" font-size="11">0</text>
  <text x="44" y="124" text-anchor="end" fill="#666" font-size="11">−0.5</text>
  <text x="44" y="204" text-anchor="end" fill="#666" font-size="11">−1</text>
  <!-- x 라벨 -->
  <text x="50" y="216" text-anchor="middle" fill="#666" font-size="11">0</text>
  <text x="125" y="216" text-anchor="middle" fill="#666" font-size="11">1</text>
  <text x="200" y="216" text-anchor="middle" fill="#666" font-size="11">2</text>
  <text x="275" y="216" text-anchor="middle" fill="#666" font-size="11">3</text>
  <text x="350" y="216" text-anchor="middle" fill="#666" font-size="11">→ ∞</text>
  <text x="405" y="204" fill="#666" font-size="12">x</text>
  <text x="36" y="22" text-anchor="end" fill="#666" font-size="12">G(x)</text>
  <!-- 곡선 G(x) = -e^{-x} (x: 0~5, sx: 50~400, sy: -1=200, 0=40, 즉 y = 200 + G*160 = 200 + (-e^{-x})*160) -->
  <path d="M50,200 L65,176 L80,154 L95,135 L110,118 L125,103 L140,90 L155,79 L170,69 L185,60 L200,53 L220,46 L240,42 L260,40 L290,40 L320,40 L400,40" fill="none" stroke="#1565c0" stroke-width="2.4"/>
  <!-- 양 끝 점 강조 -->
  <circle cx="50" cy="200" r="5" fill="#d32f2f" stroke="#fff" stroke-width="1.5"/>
  <circle cx="395" cy="40" r="5" fill="#d32f2f" stroke="#fff" stroke-width="1.5"/>
  <!-- 양 끝 라벨 -->
  <text x="62" y="200" fill="#d32f2f" font-weight="600" font-size="12">x = 0 → G = −1</text>
  <text x="385" y="56" text-anchor="end" fill="#d32f2f" font-weight="600" font-size="12">x = ∞ → G = 0</text>
  <!-- 변화량 화살표 -->
  <line x1="425" y1="200" x2="425" y2="40" stroke="#43a047" stroke-width="2" marker-start="url(#arrow1)" marker-end="url(#arrow2)"/>
  <text x="430" y="124" fill="#43a047" font-weight="600" font-size="11">변화량 = 1</text>
  <defs>
    <marker id="arrow1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#43a047"/>
    </marker>
    <marker id="arrow2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#43a047"/>
    </marker>
  </defs>
  <!-- 제목 -->
  <text x="225" y="14" text-anchor="middle" fill="#0d47a1" font-weight="700" font-size="13">G(x) = −e^(−x) — 부정적분 그래프</text>
</svg></div>

→ $G(x) = -e^{-\lambda x}$ 가 **−1 에서 시작 → 0 으로 증가**.
→ 변화량 = $G(\infty) - G(0) = 0 - (-1) = \mathbf{1}$.
→ 이게 곧 **PDF 곡선 아래 전체 면적 = 정규화 조건 ✓**.

**CDF** (FTC 로 풀림 — 초등):

$$F(x) = 1 - e^{-\lambda x}$$

**기댓값 / 분산**:

$$E[X] = \frac{1}{\lambda}, \qquad \mathrm{Var}[X] = \frac{1}{\lambda^2}$$

- **모양**: 0 에서 시작해 감소
- **파라미터**: $\lambda$ (rate, 단위 시간당 사건 수)
- **응용**: 대기 시간, 부품 수명, 다음 사건까지 걸린 시간
- **특징**: 무기억성 (memoryless) — 과거가 미래에 영향 X

#### 4. 베타 (Beta) — $\mathrm{Beta}(\alpha, \beta)$

<div><svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:320px; display:block; margin:6px 0;">
  <g font-family="system-ui, sans-serif" font-size="10" fill="#666">
    <line x1="40" y1="150" x2="310" y2="150" stroke="#888" stroke-width="1"/>
    <line x1="40" y1="20" x2="40" y2="150" stroke="#888" stroke-width="1"/>
    <path d="M40,150 L53,91 L66,55 L79,37 L92,32 L105,36 L118,46 L131,60 L144,75 L157,90 L170,105 L183,117 L196,128 L209,136 L222,142 L235,146 L248,148 L261,149 L274,150 L287,150 L300,150 L300,150 L40,150 Z" fill="rgba(21,101,192,0.18)" stroke="#1565c0" stroke-width="2"/>
    <text x="170" y="14" text-anchor="middle" fill="#0d47a1" font-weight="600">Beta(2, 5) — 오른쪽으로 치우침</text>
    <text x="40" y="164" text-anchor="middle">0</text>
    <text x="170" y="164" text-anchor="middle">0.5</text>
    <text x="300" y="164" text-anchor="middle">1</text>
    <text x="312" y="153">x</text>
    <text x="92" y="28" text-anchor="middle" fill="#d32f2f" font-size="10">↓ mode = 0.2</text>
  </g>
</svg></div>

**PDF**:

$$f(x) = \frac{x^{\alpha-1}(1-x)^{\beta-1}}{B(\alpha, \beta)}, \quad 0 \le x \le 1$$

**정규화 상수 — 베타 함수**:

$$B(\alpha, \beta) = \int_0^1 x^{\alpha-1}(1-x)^{\beta-1}\,dx = \frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)}$$

→ 이 자체로 비초등 (감마 함수 사용). 정의상 $\int_0^1 f(x)\,dx = 1$.

**기댓값 / 분산**:

$$E[X] = \frac{\alpha}{\alpha+\beta}, \qquad \mathrm{Var}[X] = \frac{\alpha\beta}{(\alpha+\beta)^2 (\alpha+\beta+1)}$$

- **모양**: $\alpha, \beta$ 에 따라 매우 다양 (U, J, 종 등)
- **응용**: 베이지안 prior (특히 비율/확률에 대한 prior), A/B 테스트
- **특징**: 베르누이/이항 분포의 conjugate prior

#### 5. 감마 (Gamma) — $\mathrm{Gamma}(\alpha, \beta)$

<div><svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:320px; display:block; margin:6px 0;">
  <g font-family="system-ui, sans-serif" font-size="10" fill="#666">
    <line x1="40" y1="150" x2="310" y2="150" stroke="#888" stroke-width="1"/>
    <line x1="40" y1="20" x2="40" y2="150" stroke="#888" stroke-width="1"/>
    <path d="M40,150 L49,90 L59,56 L68,40 L77,36 L86,39 L96,46 L105,56 L114,66 L124,77 L133,87 L142,96 L151,104 L161,111 L170,117 L179,123 L189,127 L198,131 L207,135 L216,137 L226,140 L235,142 L244,143 L254,144 L263,145 L272,146 L281,147 L291,148 L300,148 L300,150 L40,150 Z" fill="rgba(21,101,192,0.18)" stroke="#1565c0" stroke-width="2"/>
    <text x="170" y="14" text-anchor="middle" fill="#0d47a1" font-weight="600">Gamma(2, 1) — 오른꼬리 분포</text>
    <text x="40" y="164" text-anchor="middle">0</text>
    <text x="170" y="164" text-anchor="middle">3.5</text>
    <text x="300" y="164" text-anchor="middle">7</text>
    <text x="312" y="153">x</text>
    <text x="77" y="32" text-anchor="middle" fill="#d32f2f" font-size="10">↓ mode = 1</text>
  </g>
</svg></div>

**PDF**:

$$f(x) = \frac{\beta^\alpha}{\Gamma(\alpha)} x^{\alpha-1} e^{-\beta x}, \quad x > 0$$

**정규화 상수 — 감마 함수**:

$$\Gamma(\alpha) = \int_0^\infty x^{\alpha-1} e^{-x}\,dx$$

→ 비초등. 정수에서: $\Gamma(n) = (n-1)!$. 정의상 $\int_0^\infty f(x)\,dx = 1$.

**기댓값 / 분산**:

$$E[X] = \frac{\alpha}{\beta}, \qquad \mathrm{Var}[X] = \frac{\alpha}{\beta^2}$$

- **모양**: 오른쪽으로 긴 꼬리 (skewed)
- **응용**: 대기 시간 (지수의 일반화), 분산의 prior
- **특징**: 지수 + 카이제곱 + 감마 모두 한 가족 ($\alpha = 1$ 이면 지수)

---

### 이산 분포 (PMF)

#### 6. 베르누이 (Bernoulli) — $\mathrm{Bern}(p)$

<div><svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:320px; display:block; margin:6px 0;">
  <g font-family="system-ui, sans-serif" font-size="10" fill="#666">
    <line x1="40" y1="150" x2="310" y2="150" stroke="#888" stroke-width="1"/>
    <line x1="40" y1="20" x2="40" y2="150" stroke="#888" stroke-width="1"/>
    <!-- 두 막대 -->
    <rect x="100" y="57" width="50" height="93" fill="rgba(230,81,0,0.7)" stroke="#bf360c" stroke-width="1"/>
    <rect x="200" y="57" width="50" height="93" fill="rgba(230,81,0,0.7)" stroke="#bf360c" stroke-width="1"/>
    <text x="170" y="14" text-anchor="middle" fill="#bf360c" font-weight="600">Bern(0.5) — 동전</text>
    <text x="125" y="164" text-anchor="middle">0 (실패)</text>
    <text x="225" y="164" text-anchor="middle">1 (성공)</text>
    <text x="125" y="51" text-anchor="middle" fill="#bf360c">0.5</text>
    <text x="225" y="51" text-anchor="middle" fill="#bf360c">0.5</text>
  </g>
</svg></div>

**PMF**:

$$P(X = 1) = p, \quad P(X = 0) = 1 - p$$

**정규화 (Σ = 1)**:

$$\sum_{k=0}^{1} P(X = k) = (1 - p) + p = 1 \;\;\checkmark$$

**기댓값 / 분산**:

$$E[X] = \sum_k k \cdot P(X=k) = 0 \cdot (1-p) + 1 \cdot p = p$$

$$\mathrm{Var}[X] = E[X^2] - E[X]^2 = p - p^2 = p(1-p)$$

- **변수**: 0 / 1 (실패 / 성공)
- **응용**: 동전 한 번, 단일 시도의 성공/실패
- **특징**: 가장 단순한 확률 분포

#### 7. 이항 (Binomial) — $\mathrm{Bin}(N, p)$

<div><svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:320px; display:block; margin:6px 0;">
  <g font-family="system-ui, sans-serif" font-size="10" fill="#666">
    <line x1="40" y1="150" x2="310" y2="150" stroke="#888" stroke-width="1"/>
    <line x1="40" y1="20" x2="40" y2="150" stroke="#888" stroke-width="1"/>
    <!-- 11 막대 (k=0..10), bar_w=18, step=23.6 -->
    <g fill="rgba(230,81,0,0.7)" stroke="#bf360c" stroke-width="1">
      <rect x="42.8" y="150" width="18" height="0.45"/>
      <rect x="66.4" y="146" width="18" height="4"/>
      <rect x="90" y="130" width="18" height="20"/>
      <rect x="113.6" y="96" width="18" height="54"/>
      <rect x="137.2" y="55" width="18" height="95"/>
      <rect x="160.8" y="36" width="18" height="114"/>
      <rect x="184.4" y="55" width="18" height="95"/>
      <rect x="208" y="96" width="18" height="54"/>
      <rect x="231.6" y="130" width="18" height="20"/>
      <rect x="255.2" y="146" width="18" height="4"/>
      <rect x="278.8" y="150" width="18" height="0.45"/>
    </g>
    <text x="170" y="14" text-anchor="middle" fill="#bf360c" font-weight="600">Bin(10, 0.5) — 동전 10번 중 앞면 수</text>
    <text x="51.8" y="164" text-anchor="middle">0</text>
    <text x="169.8" y="164" text-anchor="middle">5</text>
    <text x="287.8" y="164" text-anchor="middle">10</text>
    <text x="312" y="153">k</text>
  </g>
</svg></div>

**PMF**:

$$P(X = k) = \binom{N}{k} p^k (1-p)^{N-k}$$

**정규화 (Σ = 1)** — 이항정리 활용:

$$\sum_{k=0}^{N} \binom{N}{k} p^k (1-p)^{N-k} = (p + (1-p))^N = 1^N = 1 \;\;\checkmark$$

**기댓값 / 분산**:

$$E[X] = Np, \qquad \mathrm{Var}[X] = Np(1-p)$$

- **변수**: $0, 1, \ldots, N$ (성공 횟수)
- **응용**: 동전 N 번, N 회 시도 중 성공 횟수
- **특징**: 베르누이의 N 번 반복 합

#### 8. 포아송 (Poisson) — $\mathrm{Poi}(\lambda)$

<div><svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:320px; display:block; margin:6px 0;">
  <g font-family="system-ui, sans-serif" font-size="10" fill="#666">
    <line x1="40" y1="150" x2="310" y2="150" stroke="#888" stroke-width="1"/>
    <line x1="40" y1="20" x2="40" y2="150" stroke="#888" stroke-width="1"/>
    <!-- 10 막대 (k=0..9), bar_w=20, step=26 -->
    <g fill="rgba(230,81,0,0.7)" stroke="#bf360c" stroke-width="1">
      <rect x="43" y="126" width="20" height="24"/>
      <rect x="69" y="78" width="20" height="72"/>
      <rect x="95" y="42" width="20" height="108"/>
      <rect x="121" y="42" width="20" height="108"/>
      <rect x="147" y="69" width="20" height="81"/>
      <rect x="173" y="101" width="20" height="49"/>
      <rect x="199" y="126" width="20" height="24"/>
      <rect x="225" y="140" width="20" height="10"/>
      <rect x="251" y="146" width="20" height="4"/>
      <rect x="277" y="149" width="20" height="1"/>
    </g>
    <text x="170" y="14" text-anchor="middle" fill="#bf360c" font-weight="600">Poi(3) — 단위 시간당 평균 3 번</text>
    <text x="53" y="164" text-anchor="middle">0</text>
    <text x="131" y="164" text-anchor="middle">3</text>
    <text x="287" y="164" text-anchor="middle">9</text>
    <text x="312" y="153">k</text>
  </g>
</svg></div>

**PMF**:

$$P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}$$

**정규화 (Σ = 1)** — 지수 함수 테일러 전개 활용:

$$\sum_{k=0}^{\infty} \frac{\lambda^k e^{-\lambda}}{k!} = e^{-\lambda} \sum_{k=0}^{\infty} \frac{\lambda^k}{k!} = e^{-\lambda} \cdot e^{\lambda} = 1 \;\;\checkmark$$

**기댓값 / 분산**:

$$E[X] = \lambda, \qquad \mathrm{Var}[X] = \lambda$$

→ 평균 = 분산이라는 독특한 성질.

- **변수**: $0, 1, 2, \ldots$ (사건 횟수)
- **파라미터**: $\lambda$ (단위 시간당 평균 사건 수)
- **응용**: 단위 시간/공간당 사건 수 (이메일/시간, 사고/일, 별/평방도)
- **특징**: 이항분포의 극한 ($N \to \infty, p \to 0, Np = \lambda$)

#### 9. 카테고리컬 (Categorical) — $\mathrm{Cat}(p_1, \ldots, p_K)$

<div><svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:320px; display:block; margin:6px 0;">
  <g font-family="system-ui, sans-serif" font-size="10" fill="#666">
    <line x1="40" y1="150" x2="310" y2="150" stroke="#888" stroke-width="1"/>
    <line x1="40" y1="20" x2="40" y2="150" stroke="#888" stroke-width="1"/>
    <!-- 6 막대 (주사위, 균등), bar_w=32, step=43.33 -->
    <g fill="rgba(230,81,0,0.7)" stroke="#bf360c" stroke-width="1">
      <rect x="45.7" y="63" width="32" height="87"/>
      <rect x="89" y="63" width="32" height="87"/>
      <rect x="132.3" y="63" width="32" height="87"/>
      <rect x="175.7" y="63" width="32" height="87"/>
      <rect x="219" y="63" width="32" height="87"/>
      <rect x="262.3" y="63" width="32" height="87"/>
    </g>
    <text x="170" y="14" text-anchor="middle" fill="#bf360c" font-weight="600">Cat(K=6, 균등) — 주사위</text>
    <text x="61.7" y="164" text-anchor="middle">1</text>
    <text x="105" y="164" text-anchor="middle">2</text>
    <text x="148.3" y="164" text-anchor="middle">3</text>
    <text x="191.7" y="164" text-anchor="middle">4</text>
    <text x="235" y="164" text-anchor="middle">5</text>
    <text x="278.3" y="164" text-anchor="middle">6</text>
    <text x="170" y="58" text-anchor="middle" fill="#bf360c" font-size="10">각 1/6</text>
  </g>
</svg></div>

**PMF**:

$$P(X = k) = p_k, \quad k \in \{1, \ldots, K\}$$

**정규화 (Σ = 1)** — 정의 자체:

$$\sum_{k=1}^{K} p_k = 1 \;\;\text{(파라미터 제약)}$$

**기댓값 (수치 인덱스 가정)**:

$$E[X] = \sum_{k=1}^{K} k \cdot p_k$$

→ 카테고리컬은 라벨 분포라 평균이 늘 의미 있진 않음 (분류 등에선 무의미).

- **변수**: $1, 2, \ldots, K$ (K 개 결과 중 하나)
- **응용**: 주사위 한 번, 분류 모델의 출력
- **특징**: 베르누이의 K-차원 일반화 / "한 번 굴리기" 의 일반형
- 자세히 → [`/blog/2026/probability-basics/` § 1.3](/blog/2026/probability-basics/)

#### 10. 다항 (Multinomial) — $\mathrm{Mult}(N, p_1, \ldots, p_K)$

<div><svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:320px; display:block; margin:6px 0;">
  <g font-family="system-ui, sans-serif" font-size="10" fill="#666">
    <line x1="40" y1="150" x2="310" y2="150" stroke="#888" stroke-width="1"/>
    <line x1="40" y1="20" x2="40" y2="150" stroke="#888" stroke-width="1"/>
    <!-- N=60 주사위 굴리기, 각 카테고리 평균 빈도 ≈ 10 -->
    <g fill="rgba(230,81,0,0.7)" stroke="#bf360c" stroke-width="1">
      <rect x="45.7" y="60" width="32" height="90"/>
      <rect x="89" y="65" width="32" height="85"/>
      <rect x="132.3" y="55" width="32" height="95"/>
      <rect x="175.7" y="68" width="32" height="82"/>
      <rect x="219" y="58" width="32" height="92"/>
      <rect x="262.3" y="63" width="32" height="87"/>
    </g>
    <text x="170" y="14" text-anchor="middle" fill="#bf360c" font-weight="600">Mult(N=60, 균등) — 주사위 60번 빈도</text>
    <text x="61.7" y="164" text-anchor="middle">n₁</text>
    <text x="105" y="164" text-anchor="middle">n₂</text>
    <text x="148.3" y="164" text-anchor="middle">n₃</text>
    <text x="191.7" y="164" text-anchor="middle">n₄</text>
    <text x="235" y="164" text-anchor="middle">n₅</text>
    <text x="278.3" y="164" text-anchor="middle">n₆</text>
    <text x="170" y="50" text-anchor="middle" fill="#666" font-size="10">∑ n = 60, 평균 ~10</text>
  </g>
</svg></div>

> **다항은 사실 $K$ 차원 벡터** $(n_1, \ldots, n_K)$ 의 분포라 진짜 PMF 는 $K$ 차원. 위 그림은 한 표본 결과의 빈도 막대 (한 trial 의 결과 시각화).

**PMF**:

$$P(n_1, \ldots, n_K) = \frac{N!}{n_1! \cdots n_K!} \, p_1^{n_1} \cdots p_K^{n_K}$$

**정규화 (Σ = 1)** — 다항정리 활용:

$$\sum_{\substack{n_1, \ldots, n_K \\ \sum n_k = N}} \frac{N!}{n_1! \cdots n_K!} \, p_1^{n_1} \cdots p_K^{n_K} = (p_1 + p_2 + \cdots + p_K)^N = 1^N = 1 \;\;\checkmark$$

**기댓값 / 분산** (각 카테고리별):

$$E[n_k] = N p_k, \qquad \mathrm{Var}[n_k] = N p_k (1 - p_k)$$

- **변수**: 각 결과의 횟수 $(n_1, \ldots, n_K)$, $\sum n_k = N$
- **응용**: 주사위 N 번, N 개 표본 중 각 카테고리 빈도
- **특징**: 카테고리컬의 N 번 반복 합 / 이항의 K-차원 일반화

---

## 비초등 함수 카탈로그 — 분포 적분이 만나는 친구들

가우시안 ($\Phi$, erf), 베타 ($B$), 감마 ($\Gamma$) 등 — 모두 **닫힌 식 없는 비초등 함수**. 어떻게 정의되고, 컴퓨터는 어떻게 **다항식으로 근사**하는지 한눈에.

### 표 — 자주 만나는 비초등 함수

| 이름 | 기호 | 정의 | 어디서 등장 | 근사 방식 |
|---|---|---|---|---|
| **오차 함수** | $\mathrm{erf}(x)$ | $\dfrac{2}{\sqrt{\pi}} \int_0^x e^{-t^2}\,dt$ | 가우시안 적분 / $\Phi$ | Abramowitz–Stegun 유리식 (5차 다항) |
| **표준정규 CDF** | $\Phi(z)$ | $\int_{-\infty}^z \dfrac{1}{\sqrt{2\pi}} e^{-t^2/2}\,dt$ | 모든 가우시안 확률 | erf 변환: $\frac{1}{2}[1 + \mathrm{erf}(z/\sqrt{2})]$ |
| **감마 함수** | $\Gamma(\alpha)$ | $\int_0^\infty x^{\alpha-1} e^{-x}\,dx$ | 감마/카이/베타 분포 | Lanczos 근사 / Stirling |
| **베타 함수** | $B(\alpha,\beta)$ | $\int_0^1 x^{\alpha-1}(1-x)^{\beta-1}\,dx$ | 베타 분포 정규화 | $\Gamma(\alpha)\Gamma(\beta)/\Gamma(\alpha+\beta)$ |
| **사인 적분** | $\mathrm{Si}(x)$ | $\int_0^x \dfrac{\sin t}{t}\,dt$ | 신호 처리, 푸리에 | 테일러 + 점근 분기 |
| **코사인 적분** | $\mathrm{Ci}(x)$ | $-\int_x^\infty \dfrac{\cos t}{t}\,dt$ | 신호 처리 | 테일러 + 점근 |
| **프레넬 C/S** | $C(x), S(x)$ | $\int_0^x \cos(\pi t^2/2)\,dt$ 등 | 광학, 회절 | 다항 근사 |
| **로그 적분** | $\mathrm{Li}(x)$ | $\int_0^x \dfrac{1}{\ln t}\,dt$ | 소수 정리 | Ramanujan 급수 |
| **Lambert W (Omega 함수)** ★ | $W(x)$ | $W(x) e^{W(x)} = x$ 의 해 | 지수 방정식, 큐잉 이론 | Halley 반복 + 점근 |
| **Wright omega** | $\omega(z)$ | $W_0(e^z)$ — 단일분지 | Lambert W 의 단순화 | 직접 다항 근사 |
| **베셀 함수** | $J_n, Y_n$ | $\sum$ 또는 적분 정의 | 진동, 회절, 원통 좌표 | 다항/점근 근사 분기 |
| **리만 제타** | $\zeta(s)$ | $\sum 1/n^s$ | 해석적 정수론 | Euler–Maclaurin |

→ **모두 적분 / 무한급수 / 방정식의 해** 로 정의 — 닫힌 초등 식 없음.

### Lambert W (Omega) — 더 자세히

**정의**: $W$ 는 $x e^x$ 의 **역함수**.

$$x = W(y) \;\Leftrightarrow\; y = x e^x$$

→ "지수와 곱이 섞인 방정식의 해" 를 부르는 새 이름.

**왜 비초등인가**:

$y = x e^x$ 를 $x$ 에 대해 풀려고 하면:

- $\log$, 다항 등 어떤 초등함수 조합으로도 못 풂 (Lambert 정리, 1758)
- 그래서 **새 함수 $W$** 정의

**그래프**:

```
y                                                       
   │                                                    
 1 ┤              ╱──────                              
   │           ╱                                        
 0 ┼────●───────────► x                                
   │  ╱                                                 
-1 ┤╱                                                   
   │                                                    
   주 분지 W₀(x) — x ≥ -1/e 에서 정의                  
```

**Omega 상수**:

$$\Omega = W(1) \approx 0.5671432904\ldots$$

→ $\Omega \cdot e^\Omega = 1$ 만족하는 **유일한 양의 실수**. "Omega 함수" 의 대표 값.

**근사 방식** — Halley 반복:

$$x_{n+1} = x_n - \frac{x_n e^{x_n} - z}{e^{x_n}(x_n + 1) - \dfrac{(x_n + 2)(x_n e^{x_n} - z)}{2x_n + 2}}$$

→ 초기값 잘 잡고 4~5 번 반복하면 double precision 정밀도 도달. 라이브러리 (scipy.special.lambertw) 가 이 방식.

**어디서 나오나** — 응용 예:

- "**$x = e^x \cdot c$ 풀기**" 같은 형태 → Lambert W
- 큐잉 이론 (대기 시간 분포)
- 회로 (다이오드 방정식)
- 인구 동역학
- 컴퓨터 과학 (alpha 알고리즘 분석)

### 근사 방식 정리 — "어떤 함수로 근사하나?"

비초등 함수를 컴퓨터에서 빠르게 계산하는 방법:

| 방법 | 형태 | 장단점 |
|---|---|---|
| **테일러 급수** | $\sum a_n x^n$ | 0 근처 정확, 큰 $x$ 에선 수렴 느림 |
| **점근전개** | $\sum b_n / x^n$ | 큰 $x$ 정확, 작은 $x$ 에선 무용 |
| **유리식 (Padé/Remez)** | $P(x) / Q(x)$ | 균일하게 정확, 가장 표준 |
| **Chebyshev 다항** | $\sum c_n T_n(x)$ | 최적 균일 근사 |
| **Lanczos 근사** | 감마 함수용 특화 식 | 매우 정확 (16 자리) |
| **Halley/Newton 반복** | $x_{n+1} = \ldots$ | 방정식 해법 (Lambert W) |
| **Stirling 근사** | $\Gamma(x) \approx \sqrt{2\pi/x}(x/e)^x$ | 큰 $x$ 에 빠름 |
| **룩업 테이블 + 보간** | 미리 계산한 표 | 메모리 ↔ 속도 트레이드오프 |

→ **모두 결국 "다항식 (또는 다항식 비)" 으로 환원**. 컴퓨터가 빠르게 할 수 있는 것 = 곱셈/덧셈 = 다항식.

### 한 줄 ★

> 분포 적분에서 만나는 비초등 함수들 — **erf, Γ, B, Lambert W (Omega)** 등.
> 정의 = 적분/급수/방정식의 해. **닫힌 초등 식 없음**.
> 컴퓨터는 **다항식 근사** (Remez, Chebyshev, Halley 등) 로 빠르게 계산.
> 라이브러리 (scipy.special, numpy) 안에 다 구현되어 있음.

---

## 분포 가족 관계 — 어디서 어디로?

```
이산 ───────────────                                     
                                                         
   베르누이 ───── N 번 반복 ─────► 이항                 
      │                                                  
      │ K 차원으로                                       
      ▼                                                  
   카테고리컬 ── N 번 반복 ─────► 다항                   
                                                         
   이항 ── (N→∞, p→0) ──────────► 포아송                
                                                         
                                                         
연속 ───────────────                                     
                                                         
   균등 ───── 변환 ─────────► 가우시안 (CLT 통해)      
                                                         
   지수 ── α 개 합 ─────────► 감마                       
   감마 ── 특정 case ──────► 카이제곱, 지수              
                                                         
   베타 ── α=β=1 ──────────► 균등 (0,1)                 
                                                         
                                                         
이산 ↔ 연속 다리 ─────────                               
                                                         
   이항 (N 큼) ───────► 가우시안 (de Moivre–Laplace)    
   포아송 (λ 큼) ─────► 가우시안                        
```

→ **분포들은 가족** — 극한, 합, 일반화로 서로 연결.

---

## 어떤 분포 언제 쓰나 — 빠른 가이드

| 상황 | 추천 분포 |
|---|---|
| 측정 노이즈 / 자연 현상 | **가우시안** |
| 키, 시험점수, 오차 | **가우시안** |
| 단위 시간당 사건 횟수 | **포아송** |
| 다음 사건까지 걸린 시간 | **지수** |
| 동전 한 번 | **베르누이** |
| 동전 N 번 중 앞면 수 | **이항** |
| 주사위 한 번 | **카테고리컬** |
| 주사위 N 번 결과 분포 | **다항** |
| "어떤 분포인지 모름, 0~1 사이" | **균등** (정보 없음 prior) |
| 비율/확률에 대한 prior | **베타** |
| 양수 (수명, 대기 시간 등) | **감마, 지수** |

---

## 한 줄 ★

> **확률 분포 = 큰 카테고리, 갈래는 연속/이산.**
> **연속 → PDF, 이산 → PMF**.
> 모두 **합/적분 = 1**.
> 가우시안, 포아송 등은 그 안의 **구체 멤버**.

---

## 다음 / 관련 문서

- 확률 입문 (PDF/PMF/가우시안/곱셈/조건부/베이즈) → [`/blog/2026/probability-basics/`](/blog/2026/probability-basics/)
- MLE 기초 (가우시안 likelihood) → 다음 글
- MAP 기초 (가우시안 prior) → [블로그 Part 2·4](https://mark-dev-joa.github.io/)
