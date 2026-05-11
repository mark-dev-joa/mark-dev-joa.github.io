---
title: Lie 이론 기초 — 회전이 더할 수 없는 이유부터 BCH 까지
description: SO(3) 와 SE(3) 위의 회전과 강체 변환을 다루는 Lie 이론 입문. Group, smooth manifold, tangent space, Lie algebra, Rodrigues 공식, exp/log map, IK/SLAM 응용, BCH 공식까지 한 cycle 정리.
author: mark
date: 2026-05-11 12:00:00 +0900
categories: [math, optimization, slam]
tags: [lie-theory, so3, se3, manifold, tangent-space, exp-log, rodrigues, bch, ik]
math: true
---


회전 행렬 $R$ 은 두 제약 ($R^T R = I$, $\det R = 1$) 으로 정의되는 곡면 SO(3) 위의 점이며, 이 제약 때문에 두 회전 행렬을 단순히 더하거나 뺄 수 없다. 따라서 회전을 미분하거나 작은 변화량을 합산하는 모든 연산은 곡면 위에서 직접 수행할 수 없다.

이 한계를 우회하기 위해 회전을 평면 공간 so(3) 로 사상한 뒤 그 위에서 산술을 수행하고, 결과를 다시 SO(3) 위로 되돌리는 절차가 필요하다. so(3) 와 SO(3) 사이의 사상 (exp, log) 과 그 위에서의 미분·적분 구조를 다루는 수학이 Lie 이론이다.

SLAM, 역기구학 (IK), 로봇 자세 추정 등 3D 공간의 모든 추정 문제는 SO(3) 또는 그 확장 SE(3) 위에서 정의되며, 이들 문제의 최적화·미분·보간은 Lie 이론을 기반으로 형식화된다.

---

## 1. 동기 — 위치는 더할 수 있지만 회전은 더할 수 없다

3D 공간에서 강체의 자세는 **위치** $\mathbf{p} \in \mathbb{R}^3$ 와 **방향** $R \in SO(3)$ 로 표현된다. 이 두 양은 합성 방식이 근본적으로 다르다. 위치는 벡터 덧셈으로 누적할 수 있지만, 방향은 같은 방식으로 합산할 수 없다. 이 차이가 회전을 다루는 모든 수학 — Lie 이론 — 의 출발점이다.

### 1.1 — 시나리오: 강체가 회전하면서 이동

강체가 시점 $k \to k+1 \to k+2$ 로 움직인다고 하자.

<div><svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <!-- 배경 -->
  <rect x="0" y="0" width="600" height="300" fill="#fafbfc"/>

  <!-- 제목 -->
  <text x="300" y="25" text-anchor="middle" fill="#222" font-size="14" font-weight="700">각 시점마다 위치 + 방향 이 변함</text>
  <text x="300" y="44" text-anchor="middle" fill="#666" font-size="12">자세 = 위치 (3D vector) + 방향 (rotation matrix)</text>

  <!-- 경로 (곡선) -->
  <path d="M 100,240 Q 150,160 250,150 Q 380,140 460,80" fill="none" stroke="#d32f2f" stroke-width="2.5" stroke-dasharray="6,4"/>

  <!-- 변환 화살표 라벨 -->
  <text x="170" y="200" fill="#bf360c" font-size="12" font-weight="600">first move</text>
  <text x="370" y="120" fill="#bf360c" font-size="12" font-weight="600">second move</text>

  <!-- 시점 0 -->
  <g transform="translate(100, 240)">
    <circle cx="0" cy="0" r="6" fill="#d32f2f"/>
    <line x1="0" y1="0" x2="30" y2="0" stroke="#d32f2f" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="0" y2="-30" stroke="#43a047" stroke-width="2.5"/>
    <text x="35" y="5" fill="#d32f2f" font-size="11" font-weight="600">x</text>
    <text x="3" y="-32" fill="#43a047" font-size="11" font-weight="600">y</text>
  </g>
  <text x="100" y="278" text-anchor="middle" fill="#222" font-size="14" font-weight="700">시점 k</text>

  <!-- 시점 1 -->
  <g transform="translate(250, 150) rotate(-30)">
    <circle cx="0" cy="0" r="6" fill="#d32f2f"/>
    <line x1="0" y1="0" x2="30" y2="0" stroke="#d32f2f" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="0" y2="-30" stroke="#43a047" stroke-width="2.5"/>
    <text x="35" y="5" fill="#d32f2f" font-size="11" font-weight="600">x</text>
    <text x="3" y="-32" fill="#43a047" font-size="11" font-weight="600">y</text>
  </g>
  <text x="250" y="188" text-anchor="middle" fill="#222" font-size="14" font-weight="700">시점 k+1</text>

  <!-- 시점 2 -->
  <g transform="translate(460, 80) rotate(-50)">
    <circle cx="0" cy="0" r="6" fill="#d32f2f"/>
    <line x1="0" y1="0" x2="30" y2="0" stroke="#d32f2f" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="0" y2="-30" stroke="#43a047" stroke-width="2.5"/>
    <text x="35" y="5" fill="#d32f2f" font-size="11" font-weight="600">x</text>
    <text x="3" y="-32" fill="#43a047" font-size="11" font-weight="600">y</text>
  </g>
  <text x="460" y="118" text-anchor="middle" fill="#222" font-size="14" font-weight="700">시점 k+2</text>

  <!-- 하단 메모 -->
  <text x="300" y="295" text-anchor="middle" fill="#444" font-size="11">→ 위치는 벡터 덧셈으로, 방향은 행렬 곱으로 누적</text>
</svg></div>

각 시점의 자세는 위치 $\mathbf{p}_k$ 와 방향 $R_k$ 로 분해된다. 두 시점 사이의 변환을 하나로 묶으면 다음과 같이 합성된다.

$$T_{k \to k+2} = T_{k+1 \to k+2} \cdot T_{k \to k+1}$$

이 식은 회전 부분 ($R$) 과 위치 부분 ($\mathbf{p}$) 을 모두 포함한다. 두 부분이 어떻게 누적되는지 따로 보면 차이가 명확해진다.

### 1.2 — 위치 — 벡터 덧셈으로 누적된다

위치의 누적은 단순한 벡터 덧셈이다.

$$\begin{bmatrix} x_{k+2} \\\\ y_{k+2} \\\\ z_{k+2} \end{bmatrix} = \begin{bmatrix} x_k \\\\ y_k \\\\ z_k \end{bmatrix} + \begin{bmatrix} \Delta x_{k \to k+1} \\\\ \Delta y_{k \to k+1} \\\\ \Delta z_{k \to k+1} \end{bmatrix} + \begin{bmatrix} \Delta x_{k+1 \to k+2} \\\\ \Delta y_{k+1 \to k+2} \\\\ \Delta z_{k+1 \to k+2} \end{bmatrix}$$

벡터의 합은 다시 벡터다. 더하기·빼기·스칼라 곱이 모두 정의되며, 결과 또한 같은 공간에 머문다. 이 성질을 **vector space (벡터 공간)** 라 부른다.

### 1.3 — 방향 — 더할 수 없다

방향 (회전) 은 같은 방식으로 누적할 수 없다. 두 회전을 합성하려면 행렬 곱을 사용해야 한다.

$$R_{k \to k+2} = R_{k+1 \to k+2} \cdot R_{k \to k+1}$$

만약 회전을 단순 덧셈으로 합성할 수 있다면 다음과 같이 쓸 수 있어야 한다.

$$R_3 \;\overset{?}{=}\; R_1 + R_2$$

그러나 이 결과는 회전 행렬이 아니다. 그 이유를 보려면 회전 행렬이 만족해야 할 조건부터 확인해야 한다.

#### SO(3) — 회전 행렬의 정의

3D 회전 행렬 전체의 집합을 **SO(3)** (special orthogonal group) 라 한다.

$$SO(3) = \lbrace\, R \in \mathbb{R}^{3 \times 3} \;\mid\; R^T R = I, \;\; \det(R) = 1 \,\rbrace$$

3×3 행렬이 회전 행렬이 되려면 두 가지 제약을 동시에 만족해야 한다.

| 조건 | 의미 |
|---|---|
| $R^T R = I$ (직교성) | 길이와 각도를 보존한다 (모양이 변하지 않음) |
| $\det(R) = 1$ (방향성) | 거울 반사가 아니다 (손방향이 유지됨) |

이 두 조건이 회전 행렬의 제약이다. 새로 만들어진 행렬이 회전 행렬이라 인정받으려면 두 조건 모두 통과해야 한다.

#### 덧셈이 회전을 깨뜨리는 이유

$R_1, R_2 \in SO(3)$ 일 때, $R_3 = R_1 + R_2$ 는 두 조건 모두 위반한다.

| 행렬 | 직교성 | 방향성 | 회전 자격 |
|---|---|---|---|
| $R_1$ | 만족 | 만족 | $\in SO(3)$ |
| $R_2$ | 만족 | 만족 | $\in SO(3)$ |
| $R_3 = R_1 + R_2$ | 깨짐 | 깨짐 | $\notin SO(3)$ |

각 조건이 어떻게 깨지는지 차례로 검증하자.

#### 💡 Tip — 직교행렬 (Orthogonal Matrix) 과 항등행렬 (Identity Matrix)

##### 항등행렬 $I$

$$I = \begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \end{bmatrix}$$

특징:

- 대각선이 모두 1, 나머지 0
- **곱셈의 항등원**: $A \cdot I = I \cdot A = A$ (어떤 행렬에 곱해도 그대로)
- 자신을 자신과 곱해도 변화 없음: $I \cdot I = I$
- 역행렬도 자기 자신: $I^{-1} = I$
- 전치도 자기 자신: $I^T = I$
- 행렬식 = 1: $\det(I) = 1$

→ "**아무것도 안 함**" 의 행렬. 곱셈에서 숫자 1 의 역할.

##### 직교행렬 (Orthogonal Matrix)

정의: **$R^T R = R R^T = I$** 인 정방행렬.

특징:

- **역행렬 = 전치**: $R^{-1} = R^T$ (계산 매우 쉬움)
- **길이 보존**: $\|R \mathbf{x}\| = \|\mathbf{x}\|$ (벡터 크기 안 변함)
- **각도 보존**: $(R\mathbf{x}) \cdot (R\mathbf{y}) = \mathbf{x} \cdot \mathbf{y}$ (내적 보존)
- **열 (column) 들이 orthonormal**: 서로 수직 + 단위 벡터
- **행 (row) 들도 orthonormal**: 마찬가지
- 행렬식 = ±1: $\det(R) = \pm 1$
  - $\det(R) = +1$ → **회전** (rotation, 같은 손방향)
  - $\det(R) = -1$ → **반사** (reflection, 손방향 뒤집힘)

##### O(n) vs SO(n) 차이

| 그룹 | 조건 | 의미 |
|---|---|---|
| **O(n)** (orthogonal group) | $R^T R = I$ | 직교행렬 전체 (회전 + 반사) |
| **SO(n)** (special orthogonal) | $R^T R = I$ **+ $\det(R) = +1$** | 회전만 (반사 X) |

→ "**S**" = "**Special**" = "$\det = +1$" 추가 제약. SO(3) 가 우리가 다루는 **순수한 회전** 의 모임.

##### 왜 이 두 조건이 회전을 정의하나

회전을 두 조건 ($R^T R = I$ 와 $\det R = +1$) 으로 정의하는 이유는, 두 조건이 각각 "회전" 이라는 물리 운동의 두 측면을 강제하기 때문이다. 한 조건이 빠지면 회전이 아닌 다른 변환이 끼어든다.

알파벳 'F' 한 글자를 종이에 그렸다고 하자. 이 종이를 손으로 어떻게 다루느냐에 따라 네 가지 결과가 나온다.

<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:720px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="720" height="220" fill="#fafbfc"/>
  <!-- Original F -->
  <g transform="translate(60, 60)">
    <text x="30" y="60" font-size="80" font-weight="700" fill="#222">F</text>
    <text x="30" y="110" text-anchor="middle" fill="#222" font-size="13" font-weight="600">원본</text>
    <text x="30" y="128" text-anchor="middle" fill="#666" font-size="11">아무 변환 없음</text>
  </g>
  <!-- Rotated F -->
  <g transform="translate(220, 60)">
    <text x="30" y="60" font-size="80" font-weight="700" fill="#1565c0" transform="rotate(45 50 35)">F</text>
    <text x="30" y="110" text-anchor="middle" fill="#1565c0" font-size="13" font-weight="600">회전 (45°)</text>
    <text x="30" y="128" text-anchor="middle" fill="#666" font-size="11">$R^T R{=}I$, $\det{=}{+}1$</text>
    <text x="30" y="148" text-anchor="middle" fill="#43a047" font-size="11" font-weight="600">✓ 회전</text>
  </g>
  <!-- Squished F -->
  <g transform="translate(380, 60)">
    <text x="30" y="60" font-size="80" font-weight="700" fill="#e53935" transform="scale(0.5,1) translate(30,0)">F</text>
    <text x="30" y="110" text-anchor="middle" fill="#e53935" font-size="13" font-weight="600">찌그러짐</text>
    <text x="30" y="128" text-anchor="middle" fill="#666" font-size="11">$R^T R \neq I$</text>
    <text x="30" y="148" text-anchor="middle" fill="#e53935" font-size="11" font-weight="600">✗ 직교성 깨짐</text>
  </g>
  <!-- Mirrored F -->
  <g transform="translate(540, 60)">
    <text x="30" y="60" font-size="80" font-weight="700" fill="#fb8c00" transform="scale(-1,1) translate(-60,0)">F</text>
    <text x="30" y="110" text-anchor="middle" fill="#fb8c00" font-size="13" font-weight="600">거울 반사</text>
    <text x="30" y="128" text-anchor="middle" fill="#666" font-size="11">$R^T R{=}I$, $\det{=}{-}1$</text>
    <text x="30" y="148" text-anchor="middle" fill="#fb8c00" font-size="11" font-weight="600">✗ 손방향 뒤집힘</text>
  </g>
</svg>

회전 (두 번째 그림) 은 'F' 모양 자체는 그대로 유지하면서 방향만 바꾼다. 종이 위의 'F' 를 손가락으로 돌려 본 것과 같다. 이 변환은 두 조건을 모두 만족하므로 SO(2) (또는 3D 라면 SO(3)) 의 원소다.

찌그러짐 (세 번째 그림) 은 가로 폭이 줄어들어 'F' 의 모양 자체가 망가진다. 여기서 깨진 것은 길이 보존 — 원래 같은 길이였던 두 점이 변환 후 다른 길이가 된다. 이것이 $R^T R \neq I$ 의 의미다. 직교성 조건은 변환이 모양을 보존한다 (rigid 강체 운동이다) 는 것을 강제한다.

거울 반사 (네 번째 그림) 는 모양은 그대로지만 좌우가 뒤집혔다. 'F' 가 아니라 'F' 의 거울상 (마치 ' Ⅎ' 처럼) 이 됐다. 신기하게도 이 변환은 $R^T R = I$ 를 만족한다 — 길이도, 각도도 보존된다. 하지만 $\det R = -1$ 이다. 평면 위에서 종이를 아무리 돌려도 'F' 를 그 거울상으로 만들 수 없다 (종이를 들어 뒤집어야만 가능). 3D 에서도 마찬가지로 오른손 좌표계가 왼손 좌표계로 바뀌는 것은 회전으로는 불가능하고 거울이 필요하다.

이런 손방향 (chirality, 왼손/오른손 구별) 의 보존 여부를 결정하는 것이 행렬식의 부호다. $\det R = +1$ 은 "손방향 유지", $\det R = -1$ 은 "손방향 뒤집힘 (거울)" 을 뜻한다. 회전은 손방향을 바꾸지 못하므로 SO(3) 정의에 $\det R = +1$ 이 들어간다.

직교성 조건은 모양 보존을 강제하고, 행렬식 조건은 거울 반사를 배제한다. 두 조건을 모두 만족할 때만 "물리적으로 가능한 회전" — 종이를 평면에서 들어 올리지 않고 손가락으로 돌려서 도달할 수 있는 변환 — 이 된다.

#### 이유 1 — 직교성이 깨진다

$R_1, R_2$ 가 각각 $R_i R_i^T = I$ 를 만족한다. 합 $R_3 = R_1 + R_2$ 의 $R_3 R_3^T$ 를 계산하면:

$$R_3 R_3^T = (R_1 + R_2)(R_1^T + R_2^T)$$

$$= R_1 R_1^T + R_1 R_2^T + R_2 R_1^T + R_2 R_2^T$$

$$= I + R_1 R_2^T + R_2 R_1^T + I$$

$$= 2I + R_1 R_2^T + R_2 R_1^T \;\neq\; I$$

결과는 항등행렬이 아니므로 직교 조건을 만족하지 않는다.

#### 이유 2 — 행렬식이 1 이 아니다

행렬식은 합에 대해 분배되지 않는다. 따라서

$$\det(R_1 + R_2) \neq \det(R_1) + \det(R_2)$$

이며, 일반적으로 $\det(R_1 + R_2) \neq 1$ 이다. 두 번째 조건도 깨진다.

#### 결론

두 조건이 모두 깨지므로 $R_1 + R_2 \notin SO(3)$ 이다. 회전 행렬끼리 단순히 더한 결과는 회전 행렬이 아니며, SO(3) 는 덧셈에 대해 닫혀 있지 않다.

### 1.4 — 위치와 회전은 다른 수학적 구조에 속한다

위치와 회전이 합성되는 방식의 차이를 다음 표로 정리할 수 있다.

| 양 | 합성 방식 | 수학적 구조 |
|---|---|---|
| 위치 $\mathbf{p}$ | 덧셈 ($\mathbf{p}_1 + \mathbf{p}_2$) | Vector space |
| 회전 $R$ | 행렬 곱 ($R_2 \cdot R_1$) | Lie group |

위치는 **벡터** 로서 자유롭게 더하고 뺄 수 있는 평면 공간에 산다. 반면 회전은 **연산자** 로서 곱셈으로만 합성되는 곡면 공간 SO(3) 에 산다. 이 곡면 공간을 다루는 수학적 틀이 Lie group 이다.

<div><svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="600" height="280" fill="#fafbfc"/>

  <!-- 가운데 식 -->
  <text x="300" y="50" text-anchor="middle" fill="#222" font-size="22" font-weight="700">
    <tspan fill="#1565c0">y</tspan>
    <tspan fill="#666"> = </tspan>
    <tspan fill="#d32f2f">R</tspan>
    <tspan fill="#1565c0">x</tspan>
  </text>

  <!-- y 라벨 -->
  <line x1="225" y1="65" x2="200" y2="105" stroke="#1565c0" stroke-width="1.5" marker-end="url(#arrLT)"/>
  <text x="180" y="125" text-anchor="middle" fill="#1565c0" font-size="13" font-weight="600">출력 벡터</text>
  <text x="180" y="142" text-anchor="middle" fill="#1565c0" font-size="11">(Vector)</text>

  <!-- R 라벨 (가운데) -->
  <line x1="298" y1="65" x2="298" y2="105" stroke="#d32f2f" stroke-width="1.5" marker-end="url(#arrLT)"/>
  <text x="298" y="125" text-anchor="middle" fill="#d32f2f" font-size="13" font-weight="700">Operator</text>
  <text x="298" y="142" text-anchor="middle" fill="#d32f2f" font-size="13" font-weight="700">(★ Lie Group)</text>

  <!-- x 라벨 -->
  <line x1="370" y1="65" x2="395" y2="105" stroke="#1565c0" stroke-width="1.5" marker-end="url(#arrLT)"/>
  <text x="415" y="125" text-anchor="middle" fill="#1565c0" font-size="13" font-weight="600">입력 벡터</text>
  <text x="415" y="142" text-anchor="middle" fill="#1565c0" font-size="11">(Vector)</text>

  <!-- 화살표 정의 -->
  <defs>
    <marker id="arrLT" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#444"/>
    </marker>
  </defs>

  <!-- 두 박스로 구분 -->
  <rect x="60" y="180" width="220" height="70" rx="8" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="170" y="207" text-anchor="middle" fill="#0d47a1" font-size="13" font-weight="700">Vector Space</text>
  <text x="170" y="226" text-anchor="middle" fill="#0d47a1" font-size="11">x, y — 더하기 가능</text>
  <text x="170" y="242" text-anchor="middle" fill="#0d47a1" font-size="11">평면 (flat)</text>

  <rect x="320" y="180" width="220" height="70" rx="8" fill="#fff3e0" stroke="#d32f2f" stroke-width="1.5"/>
  <text x="430" y="207" text-anchor="middle" fill="#bf360c" font-size="13" font-weight="700">Lie Group</text>
  <text x="430" y="226" text-anchor="middle" fill="#bf360c" font-size="11">R — 곱셈만 가능</text>
  <text x="430" y="242" text-anchor="middle" fill="#bf360c" font-size="11">곡면 (curved)</text>

  <!-- 하단 메모 -->
  <text x="300" y="270" text-anchor="middle" fill="#444" font-size="12">두 종류의 양은 본질적으로 다른 수학적 구조</text>
</svg></div>

### 1.5 — SLAM 과 IK 에서 회전 다루기

3D 공간의 모든 추정·제어 문제에는 회전이 등장하며, 회전에 대해 수행해야 할 연산은 단순 행렬 곱을 넘어선다.

| 연산 | 예시 |
|---|---|
| 회전 합성 | 여러 좌표 변환을 하나로 결합 |
| 회전 보간 | 두 자세 사이의 부드러운 경로 (SLERP 등) |
| 회전 반전 | 역회전 계산 |
| 회전 미분 | Jacobian 유도, gradient 기반 최적화 |
| 회전 적분 | 시간에 따른 자세 누적 (IMU) |
| 회전 불확실성 | 확률 분포 정의 (covariance) |

이 가운데 미분과 적분은 IK 의 Newton 반복, SLAM 의 비선형 최소제곱, 베이지안 추정 등에서 필수적이다. 그러나 SO(3) 는 곡면이라 직접 미분할 수 없으며, 회전을 평면 공간으로 사상한 뒤 산술을 수행하는 우회 경로가 필요하다. Lie 이론이 이 사상 (exp, log) 과 그 위에서의 미분 구조를 제공한다.

---

---

## 2. Group 기초

### 2.1 — Group 정의

Group (군) 은 원소들의 집합과 그 위의 이항연산 한 쌍으로 정의된다. 집합 $G = \lbrace X, Y, Z, \ldots \rbrace$ 와 연산 $\cdot$ 가 아래 네 조건을 모두 만족할 때 $(G, \cdot)$ 를 group 이라 부른다.

| 조건 | 식 | 의미 |
|---|---|---|
| (1) Closure (닫힘) | $X \cdot Y \in G$ | 두 원소 곱이 다시 그룹 안에 |
| (2) Identity (항등원) | $\exists I: \;I \cdot X = X \cdot I = X$ | 곱해도 변화 없는 원소 존재 |
| (3) Inverse (역원) | $\exists X^{-1}: \;X^{-1} \cdot X = X \cdot X^{-1} = I$ | 모든 원소의 역원이 그룹 안에 |
| (4) Associativity (결합법칙) | $(X \cdot Y) \cdot Z = X \cdot (Y \cdot Z)$ | 괄호 위치 무관 |

이 네 조건이 "수학적으로 정상적인 합성 시스템" 의 최소 요구사항이다.

### 2.2 — 친숙한 Group 예시

| 그룹 | 집합 $G$ | 연산 $\cdot$ | 항등원 $I$ | 역원 |
|---|---|---|---|---|
| 정수 덧셈 $(\mathbb{Z}, +)$ | $\lbrace \ldots, -2, -1, 0, 1, 2, \ldots \rbrace$ | $+$ | 0 | $-x$ |
| 실수 덧셈 $(\mathbb{R}, +)$ | 모든 실수 | $+$ | 0 | $-x$ |
| 양의 실수 곱 $(\mathbb{R}^+, \cdot)$ | $\lbrace x > 0 \rbrace$ | $\cdot$ | 1 | $1/x$ |
| 3D 벡터 $(\mathbb{R}^3, +)$ | 3D 벡터 전체 | $+$ | $\mathbf{0}$ | $-\mathbf{v}$ |
| 회전 $(SO(3), \cdot)$ | 3×3 회전 행렬 | 행렬 곱 | $I$ | $R^T$ |

합성이 가능한 모든 시스템이 group 이며, 회전도 그중 하나이다.

### 2.3 — SO(3) 가 Group 인가? (4 조건 검증)

$SO(3) = \lbrace R \in \mathbb{R}^{3 \times 3} \mid R^T R = I, \det(R) = 1 \rbrace$ 와 연산 = 행렬 곱 에 대해 네 조건을 차례로 확인한다.

#### (1) Closure — $R_1, R_2 \in SO(3) \Rightarrow R_1 R_2 \in SO(3)$?

$R_3 = R_1 R_2$ 라 두고 두 제약을 각각 검증한다. 직교성은

$$R_3 R_3^T = (R_1 R_2)(R_1 R_2)^T = R_1 R_2 R_2^T R_1^T$$

에서 $R_2 R_2^T = I$ 를 이용하면 $R_1 \cdot I \cdot R_1^T = I$ 가 된다. 방향성은 행렬식 곱셈 성질로

$$\det(R_3) = \det(R_1) \cdot \det(R_2) = 1 \cdot 1 = 1$$

이 따라온다. 두 조건 모두 만족하므로 $R_3 \in SO(3)$ 이고 closure 가 성립한다. 회전끼리 더하면 회전이 깨지지만 곱하면 다시 회전이 된다는 것이 핵심이다.

#### (2) Identity — $I \in SO(3)$?

$I \cdot I^T = I$, $\det(I) = 1$ 로 항등행렬이 SO(3) 안에 들어 있다. 모든 $R$ 에 대해 $I R = R I = R$ 이므로 "아무 회전도 하지 않은 상태" 가 항등원 역할을 한다.

#### (3) Inverse — $R \in SO(3) \Rightarrow R^{-1} \in SO(3)$?

직교행렬은 $R^{-1} = R^T$ 라는 성질을 가진다. $R^T (R^T)^T = R^T R = I$, $\det(R^T) = \det(R) = 1$ 이므로 역행렬도 SO(3) 안에 머문다. 모든 회전은 되돌릴 수 있다는 사실이 역원 조건으로 표현된 것이다.

#### (4) Associativity — $(R_1 R_2) R_3 = R_1 (R_2 R_3)$?

행렬 곱은 항상 결합법칙을 만족하므로 자동으로 성립한다.

#### 결론

| 조건 | 만족? |
|---|---|
| (1) Closure | OK |
| (2) Identity | OK |
| (3) Inverse | OK |
| (4) Associativity | OK |

$(SO(3), \cdot)$ 는 group 이다.

### 2.4 — Group Action

Group 이 벡터에 작용하는 방식을 group action 이라 한다. 집합 $G$ 와 벡터 공간 $V$ 위의 연산 $\cdot : G \times V \to V$ 가 다음을 만족하면 된다.

| 조건 | 식 |
|---|---|
| Identity | $E \cdot \mathbf{v} = \mathbf{v}$ |
| Compatibility | $(X \cdot Y) \cdot \mathbf{v} = X \cdot (Y \cdot \mathbf{v})$ |

SO(3) 가 3D 벡터에 작용하는 경우는 단순히 행렬-벡터 곱이다.

$$R \cdot \mathbf{v} = R \mathbf{v}$$

$I \mathbf{v} = \mathbf{v}$ 와 $(R_1 R_2) \mathbf{v} = R_1 (R_2 \mathbf{v})$ 가 모두 성립하므로 회전이 3D 벡터를 돌리는 방식 자체가 group action 의 자연스러운 예가 된다.

### 2.5 — 정리

Group 은 closure, identity, inverse, associativity 네 조건을 만족하는 (집합 + 연산) 구조이고, SO(3) 는 행렬 곱 연산 아래 이 모두를 만족한다. 다만 Lie group 이 되려면 group 구조 위에 smooth manifold 라는 또 다른 층이 필요하다. 다음 절에서 manifold 의 직관과 SO(3) 가 manifold 조건도 만족하는지를 다룬다.

---

## 3. Smooth Manifold

### 3.1 — Manifold 의 직관

Manifold (다양체) 는 작게 보면 평면 (Euclidean 공간) 처럼 생긴 공간이다. 큰 그림에서는 곡면이지만 충분히 작은 영역만 보면 평평한 공간처럼 보이는 대상을 가리킨다.

<div><svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="600" height="280" fill="#fafbfc"/>
  <text x="300" y="22" text-anchor="middle" fill="#222" font-size="14" font-weight="700">전체적으론 곡면, 작게 보면 평면</text>

  <!-- 왼쪽: 큰 곡면 -->
  <text x="160" y="50" text-anchor="middle" fill="#444" font-size="12">전체 (구 표면)</text>
  <ellipse cx="160" cy="155" rx="100" ry="40" fill="none" stroke="#1565c0" stroke-width="1.5"/>
  <ellipse cx="160" cy="155" rx="100" ry="80" fill="none" stroke="#1565c0" stroke-width="1.5"/>
  <line x1="60" y1="155" x2="260" y2="155" stroke="#1565c0" stroke-width="1.5"/>
  <line x1="160" y1="75" x2="160" y2="235" stroke="#1565c0" stroke-width="1.5"/>
  <circle cx="190" cy="120" r="4" fill="#d32f2f"/>
  <text x="195" y="115" fill="#d32f2f" font-size="11" font-weight="600">한 점</text>

  <!-- 화살표 -->
  <line x1="290" y1="155" x2="350" y2="155" stroke="#666" stroke-width="2" marker-end="url(#arrM)"/>
  <text x="320" y="148" text-anchor="middle" fill="#666" font-size="11">확대</text>

  <!-- 오른쪽: 한 점 주변 (평면) -->
  <text x="470" y="50" text-anchor="middle" fill="#444" font-size="12">그 점 주변 확대</text>
  <rect x="380" y="80" width="180" height="150" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <!-- 격자 -->
  <g stroke="#1565c0" stroke-width="0.5" opacity="0.4">
    <line x1="380" y1="110" x2="560" y2="110"/>
    <line x1="380" y1="140" x2="560" y2="140"/>
    <line x1="380" y1="170" x2="560" y2="170"/>
    <line x1="380" y1="200" x2="560" y2="200"/>
    <line x1="410" y1="80" x2="410" y2="230"/>
    <line x1="440" y1="80" x2="440" y2="230"/>
    <line x1="470" y1="80" x2="470" y2="230"/>
    <line x1="500" y1="80" x2="500" y2="230"/>
    <line x1="530" y1="80" x2="530" y2="230"/>
  </g>
  <circle cx="470" cy="155" r="4" fill="#d32f2f"/>
  <text x="475" y="150" fill="#d32f2f" font-size="11" font-weight="600">한 점</text>
  <text x="470" y="265" text-anchor="middle" fill="#1565c0" font-size="12" font-weight="600">평평한 Euclidean 공간</text>

  <defs>
    <marker id="arrM" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#666"/>
    </marker>
  </defs>
</svg></div>

지구 표면이 전형적인 비유다. 전체적으로는 둥글지만 내가 서 있는 작은 영역은 평평해 보인다.

### 3.2 — Smooth (Differentiable) Manifold 정의

Smooth manifold 는 모든 점에서 미분 가능한 manifold 이다. 위상 공간 (topological space) 이면서 국소적으로 Euclidean 공간을 닮고, 어떤 점에서도 끊김이나 singularity 없이 미분이 정의된다. 미분의 결과로 등장하는 공간은 항상 vector space 형태의 Euclidean 공간이며, 이것이 뒤에서 다룰 tangent space 와 Lie algebra 의 출발점이 된다.

### 3.3 — Smooth vs Non-smooth

<div><svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="600" height="280" fill="#fafbfc"/>
  <text x="300" y="22" text-anchor="middle" fill="#222" font-size="14" font-weight="700">Smooth vs Non-smooth Manifold</text>

  <!-- Smooth (왼쪽) -->
  <text x="150" y="55" text-anchor="middle" fill="#1565c0" font-size="13" font-weight="700">Smooth ✓</text>
  <path d="M 50,180 Q 100,100 150,120 Q 200,140 250,90" fill="none" stroke="#1565c0" stroke-width="2.5"/>
  <text x="150" y="220" text-anchor="middle" fill="#1565c0" font-size="11">부드러움</text>
  <text x="150" y="238" text-anchor="middle" fill="#666" font-size="11">모든 점에서 미분 가능</text>
  <text x="150" y="256" text-anchor="middle" fill="#666" font-size="11">접선 / 접평면 정의됨</text>

  <!-- Non-smooth: edge (가운데) -->
  <text x="350" y="55" text-anchor="middle" fill="#e65100" font-size="13" font-weight="700">Non-smooth (Edge) ❌</text>
  <path d="M 270,180 L 350,90 L 430,180" fill="none" stroke="#e65100" stroke-width="2.5"/>
  <circle cx="350" cy="90" r="6" fill="#fff" stroke="#e65100" stroke-width="2"/>
  <text x="370" y="95" fill="#e65100" font-size="11" font-weight="600">edge!</text>
  <text x="350" y="220" text-anchor="middle" fill="#e65100" font-size="11">날카로운 모서리</text>
  <text x="350" y="238" text-anchor="middle" fill="#666" font-size="11">그 점에서 미분 X</text>
  <text x="350" y="256" text-anchor="middle" fill="#666" font-size="11">접선 정의 모호</text>

  <!-- Non-smooth: spike (오른쪽) -->
  <text x="530" y="55" text-anchor="middle" fill="#e65100" font-size="13" font-weight="700">Non-smooth (Spike) ❌</text>
  <path d="M 470,170 Q 510,160 525,90 Q 540,160 570,170" fill="none" stroke="#e65100" stroke-width="2.5"/>
  <circle cx="525" cy="90" r="6" fill="#fff" stroke="#e65100" stroke-width="2"/>
  <text x="540" y="95" fill="#e65100" font-size="11" font-weight="600">spike!</text>
  <text x="520" y="220" text-anchor="middle" fill="#e65100" font-size="11">뾰족한 점</text>
  <text x="520" y="238" text-anchor="middle" fill="#666" font-size="11">그 점에서 미분 X</text>
</svg></div>

Smooth 는 어디서든 미분이 가능한 경우, non-smooth 는 edge, spike, kink 같이 어떤 점에서 미분이 무너지는 경우를 말한다.

### 3.4 — Tangent Space (접공간)

Tangent space 는 smooth manifold 의 한 점에서 곡면에 접하는 평면 또는 직선의 모임이다.

<div><svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="600" height="300" fill="#fafbfc"/>
  <text x="300" y="22" text-anchor="middle" fill="#222" font-size="14" font-weight="700">Tangent Space — 한 점에 접하는 평면</text>

  <!-- 곡면 -->
  <ellipse cx="220" cy="180" rx="160" ry="60" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5" opacity="0.7"/>
  <ellipse cx="220" cy="180" rx="160" ry="100" fill="none" stroke="#1565c0" stroke-width="1.5" opacity="0.5"/>

  <!-- 한 점 -->
  <circle cx="280" cy="125" r="6" fill="#d32f2f"/>
  <text x="290" y="120" fill="#d32f2f" font-size="13" font-weight="700">P (한 점)</text>

  <!-- Tangent plane (기울어진 평면) -->
  <polygon points="180,80 470,55 460,140 170,165" fill="#fff3e0" stroke="#e65100" stroke-width="1.5" opacity="0.85"/>
  <text x="475" y="60" fill="#e65100" font-size="12" font-weight="700">Tangent Plane</text>

  <!-- Tangent vectors -->
  <line x1="280" y1="125" x2="380" y2="105" stroke="#bf360c" stroke-width="2" marker-end="url(#arrT1)"/>
  <line x1="280" y1="125" x2="240" y2="80" stroke="#bf360c" stroke-width="2" marker-end="url(#arrT1)"/>
  <line x1="280" y1="125" x2="320" y2="155" stroke="#bf360c" stroke-width="2" marker-end="url(#arrT1)"/>

  <defs>
    <marker id="arrT1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#bf360c"/>
    </marker>
  </defs>

  <!-- 라벨 -->
  <text x="385" y="110" fill="#bf360c" font-size="11">tangent vector</text>

  <!-- 하단 설명 -->
  <text x="300" y="270" text-anchor="middle" fill="#444" font-size="12">한 점 P 에서 곡면에 "접하는" 모든 벡터의 모임</text>
  <text x="300" y="288" text-anchor="middle" fill="#444" font-size="12">→ 접평면 = vector space (평평!)</text>
</svg></div>

한 점 $P$ 에서 곡면을 선형 근사한 평면이며, 평면이기 때문에 더하기와 스케일링이 자유로운 vector space 이다. 차원은 본래 manifold 의 차원과 같아서 2D 곡면이면 2D 평면이 된다. 곡면 위에서 직접 정의하기 어려운 미분과 적분이 tangent space 위에서 가능해지는 것이 이 공간을 도입하는 이유이다.

#### 인터랙티브 — 3D 시각화

직접 회전하거나 확대해서 관찰할 수 있다.

<div id="lie-tangent-3d" style="width:100%; border:1px solid #d0d7de; border-radius:8px; overflow:hidden; padding:16px; background:#fafbfc;"></div>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script src="/assets/posts/lie_tangent_3d.js"></script>

구성 요소는 다음과 같다.

- 검은 점 I — identity (북극 고정, 항등회전)
- 빨간 점 R — 회전 행렬 한 점 (슬라이더로 이동)
- 주황 평면 — I 의 tangent space (so(3), Lie algebra)
- 주황 화살표 — I 에서 R 방향의 tangent vector $\omega$ (axis-angle)
- 빨간 곡선 — I 에서 R 까지의 geodesic ($R = \exp(\omega)$)

마우스 드래그로 카메라를 돌리고, 휠로 줌, 위도/경도 슬라이더로 R 을 이동시키며 체크박스로 평면과 벡터 표시를 켜고 끌 수 있다. R 을 움직이면 tangent vector 의 방향이 회전축의 변화를 따라 평면 위에서 함께 회전하고, R 이 I 에서 멀어질수록 벡터의 길이가 커져 회전각이 커짐을 보여준다. R 이 I 근처일 때 tangent vector 는 0 으로 수렴한다. 빨간 곡선은 tangent vector 만큼 곡면을 따라간 결과로서 exp 사상의 시각화이며, 모든 회전 R 이 결국 I 에서 출발한 점이라는 Lie 이론의 핵심 직관을 보여준다.

#### 인터랙티브 — Lie Algebra 산술 (log → 산술 → exp)

두 회전 $R_1, R_2$ 를 so(3) 로 변환한 뒤 더하거나 빼고, exp 로 다시 SO(3) 로 돌아오는 흐름을 보여준다.

<div id="lie-algebra-arithmetic-3d" style="width:100%; border:1px solid #d0d7de; border-radius:8px; overflow:hidden; padding:16px; background:#fafbfc;"></div>
<script src="/assets/posts/lie_algebra_arithmetic_3d.js"></script>

구성 요소는 다음과 같다.

- 검은 점 I — identity (북극 고정)
- 파란 점 $R_1$ — 첫 번째 회전 (슬라이더 R₁ 으로 이동)
- 초록 점 $R_2$ — 두 번째 회전 (슬라이더 R₂ 로 이동)
- 보라 점 $R_r$ — 산술 결과 $\exp(\omega_1 \pm \omega_2)$
- 각 색 화살표 — 해당 회전의 tangent vector (so(3) 위)
- 각 색 곡선 — I 에서 그 점까지 가는 geodesic

R₁, R₂ 슬라이더로 두 회전을 움직이고, 연산을 $\omega_1 + \omega_2$ 또는 $\omega_1 - \omega_2$ 중에서 선택할 수 있다. 정보 패널에는 $\omega_1 = \log(R_1)$, $\omega_2 = \log(R_2)$, 평면에서의 산술 결과 $\omega_r$, 그리고 다시 곡면으로 복귀한 $R_r = \exp(\omega_r)$ 가 실시간으로 표시된다. 두 tangent vector 가 모두 I 에서 출발해 평면 위에 놓이므로 vector space 의 자유로운 산술이 가능하고, 그 결과를 다시 exp 으로 곡면에 사상하면 $R_r$ 에 도달한다. 곡면에서는 직접 할 수 없는 산술이 평면에서는 가능해진다는 점이 Lie algebra 도입의 핵심이다. 단, 작은 회전에는 정확하지만 큰 회전에는 BCH 공식의 추가 항이 필요한 근사임에 유의한다.

### 3.5 — SO(3) 는 Smooth Manifold 인가?

#### 차원 계산

SO(3) 는 9 차원 행렬 공간 $\mathbb{R}^{3 \times 3}$ 의 부분집합으로, 두 제약 조건이 차원을 깎아낸다.

| 조건 | 독립 식의 수 |
|---|---|
| $R^T R = I$ | 6 (대칭 행렬이라 9 가 아닌 6) |
| $\det(R) = 1$ | 0 (직교 조건 + 연속성으로 자동 결정) |

따라서

$$\dim(SO(3)) = 9 - 6 = 3$$

이 된다. SO(3) 는 9차원 공간 안에 박힌 3차원 manifold 이며, 회전이 3 자유도 (yaw, pitch, roll 또는 axis-angle 의 세 성분) 를 가진다는 사실과 일치한다.

#### Smoothness 검증

두 제약 조건 $R^T R = I$, $\det = 1$ 은 다항식, 즉 smooth function 으로 표현된다. 이러한 제약을 만족하는 표면은 자체로 smooth surface 이며, 모든 점에서 tangent space 가 정의되므로 SO(3) 는 smooth manifold 의 조건을 갖춘다.

#### 시각화 — SO(3) 는 어떻게 생겼나?

3차원이기 때문에 직접 그릴 수는 없으나 추상적으로는 다음과 같이 표현할 수 있다.

<div><svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="600" height="280" fill="#fafbfc"/>
  <text x="300" y="22" text-anchor="middle" fill="#222" font-size="14" font-weight="700">SO(3) — 3차원 곡면 (개념도)</text>

  <!-- 구 (개념적 표현) -->
  <ellipse cx="300" cy="155" rx="170" ry="80" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5" opacity="0.6"/>
  <ellipse cx="300" cy="155" rx="170" ry="50" fill="none" stroke="#1565c0" stroke-width="1.2" opacity="0.5"/>
  <ellipse cx="300" cy="155" rx="170" ry="20" fill="none" stroke="#1565c0" stroke-width="1.2" opacity="0.5"/>
  <line x1="130" y1="155" x2="470" y2="155" stroke="#1565c0" stroke-width="1.2" opacity="0.5"/>
  <line x1="300" y1="75" x2="300" y2="235" stroke="#1565c0" stroke-width="1.2" opacity="0.5"/>

  <!-- 점 = 회전들 -->
  <circle cx="300" cy="155" r="5" fill="#222"/>
  <text x="305" y="150" fill="#222" font-size="11" font-weight="600">I (항등회전)</text>

  <circle cx="380" cy="120" r="4" fill="#d32f2f"/>
  <text x="388" y="118" fill="#d32f2f" font-size="10">R₁</text>

  <circle cx="240" cy="180" r="4" fill="#d32f2f"/>
  <text x="220" y="195" fill="#d32f2f" font-size="10">R₂</text>

  <circle cx="350" cy="200" r="4" fill="#d32f2f"/>
  <text x="358" y="207" fill="#d32f2f" font-size="10">R₃</text>

  <!-- 라벨 -->
  <text x="100" y="155" text-anchor="end" fill="#666" font-size="11">SO(3)</text>

  <!-- 하단 설명 -->
  <text x="300" y="262" text-anchor="middle" fill="#444" font-size="12">SO(3) 위의 각 점 = 하나의 회전. 점 사이 부드러운 곡면으로 연결.</text>
</svg></div>

인터랙티브 확인은 3.4 의 두 번째 데모 ($\omega_1, \omega_2, \omega_r$) 가 좋다. 파란 sphere 가 SO(3) 의 비유 (smooth manifold) 이고, 검은 점 I 가 identity, 컬러 점 $R_1, R_2, R_r$ 가 manifold 위의 다른 회전들이다. 슬라이더를 움직이면 점이 부드럽게 곡면을 따라 이동하면서 smooth manifold 의 직관을 확인할 수 있다. 데모의 주황 평면은 tangent space $\mathfrak{so}(3)$ 로 vector space 이며, 기술적으로 평면도 flat manifold 의 일종이지만 이 절에서 "smooth manifold" 라고 부르는 대상은 본 공간 SO(3) 인 sphere 쪽이다. 두 공간의 역할이 다르다는 점에 주의해야 한다 — sphere 는 점들이 사는 공간이고, 평면은 한 점에 접하는 선형 근사이다.

각 점이 하나의 회전 행렬에 대응하고 전체가 부드러운 곡면을 이루는 모습이 3차원 manifold 의 시각화이다.

### 3.6 — Smooth Manifold 의 의의 — 왜 중요한가

"SO(3) 위에서 직접 미분을 하는 일이 거의 없는데 smooth 라는 성질이 왜 중요한가" 라는 의문이 자주 등장한다. 답은 smooth 가 Lie 이론의 모든 도구를 떠받치는 전제조건이라는 데 있다. smooth 가 없으면 그 위에 쌓는 도구가 전부 무너진다.

#### 의존 관계 — smooth 가 모든 다리

```
SO(3) smooth
    │
    ├─→ tangent space 정의됨 (모든 점에서)
    │       │
    ├─→ I 의 tangent space = so(3) (Lie algebra)
    │       │
    ├─→ exp / log map smooth function 으로 정의됨
    │       │
    ├─→ 곡면과 평면을 자유롭게 오가는 변환 가능
    │       │
    └─→ 회전 미분 / 최적화 / IK / SLAM 가능

   smooth 가 없으면 위 모든 단계가 무너진다
```

핵심 한 문장으로 정리하면 smooth 는 곡면을 평면으로 폈다가 다시 곡면으로 돌아오는 왕복이 가능하다는 보장이다. SO(3) 가 smooth 이기 때문에 so(3) 라는 Lie algebra 가 존재하고, log/exp 라는 다리가 정의되어 평면에서 산술을 한 뒤 다시 SO(3) 로 사상할 수 있다.

#### 실용적 의미

| 작업 | smooth 덕분에 가능한 이유 |
|---|---|
| log: $R \to \omega$ | 곡면 점에서 평면 벡터로 |
| 평면 산술 ($\omega_1 + \omega_2$, 미분 등) | so(3) 가 vector space |
| exp: $\omega \to R$ | 평면 벡터에서 곡면 점으로 |
| 회전 미분 / 업데이트 | IK / SLAM / 회전 최적화 가능 |

평면에서 자유롭게 계산한 결과를 곡면으로 사상하는 Lie 이론 특유의 패턴이 모두 smooth 라는 성질에서 따라온다.

#### 비유 — 함수 미분 가능성

일반 함수에서 "$f(x)$ 를 직접 미분하지 않는데 미분 가능성을 왜 신경 쓰냐" 는 질문에 대한 답이 smooth 의 역할과 똑같다. 미분 가능성은 기울기와 테일러 근사를 정의하고 연속성을 보장하며 Newton method 의 수렴과 일반적인 최적화 알고리즘의 적용을 가능하게 한다. 미분을 직접 수행하지 않아도 모든 도구의 기반이 되는 성질이라는 점에서, SO(3) 의 smoothness 가 so(3), exp/log, 회전 업데이트의 기반이 되는 것과 동일한 구조이다.

#### 거꾸로 — Non-smooth 면?

만약 SO(3) 가 smooth 가 아니라면 어떤 점에서는 tangent plane 이 정의되지 않으므로 so(3) 가 존재하지 않고, exp/log 라는 다리도 사라지며, IK 업데이트식 $R \exp(\Delta\omega)$ 자체가 의미를 잃는다. 결과적으로 모든 회전 최적화 도구가 무력해진다. smooth 는 수학적 사치가 아니라 도구 전체의 전제조건이다.

### 3.7 — 정리

Smooth manifold 는 모든 점에서 평면으로 부드럽게 근사되는 공간이고, SO(3) 는 9D 공간 안에 박힌 3D smooth manifold 로서 회전의 3 자유도와 일치한다. Smooth 라는 성질 덕분에 모든 점에 tangent space 라는 vector space 가 정의되며, 이것이 회전 미분과 최적화의 기반이 된다. 다음 절은 group 과 smooth manifold 를 결합한 Lie group 의 정의와 로보틱스에서 자주 만나는 분류표를 다룬다.

---

## 4. Lie Group — Group + Smooth Manifold

### 4.1 — 정의

Lie group 은 group 의 성질을 가진 smooth manifold 이다. 세 조건이 동시에 성립해야 한다.

| 조건 | 의미 |
|---|---|
| (1) Group | 네 조건 (Closure, Identity, Inverse, Associativity) — §2 |
| (2) Smooth manifold | 부드러운 곡면 (모든 점에서 미분 가능) — §3 |
| (3) 연산이 smooth | 곱셈 ($G \times G \to G$) 과 역원 ($G \to G$) 둘 다 smooth function |

연산이 가능한 부드러운 곡면, 이것이 Lie group 의 본질이다.

### 4.2 — SO(3) 는 Lie Group (종합 확인)

| 조건 | 검증 위치 |
|---|---|
| (1) Group | §2.3 (네 조건 모두 만족) |
| (2) Smooth manifold | §3.5 (3D manifold + smoothness) |
| (3) 연산 smooth | 행렬 곱이 다항식이며 전치와 역원도 smooth |

세 조건이 모두 성립하므로 $SO(3)$ 는 Lie group 이다.

### 4.3 — Lie Group 의 핵심 성질

Lie group 이라는 사실 하나로부터 다음 도구들이 자동으로 따라온다.

| 도구 | 의미 |
|---|---|
| Tangent space at every point | 모든 점 근처에서 선형 근사 |
| Lie algebra $\mathfrak{g} = T_I G$ | I 의 tangent space (vector space) |
| Exponential map $\exp: \mathfrak{g} \to G$ | Lie algebra 에서 Lie group 으로 |
| Logarithm map $\log: G \to \mathfrak{g}$ | Lie group 에서 Lie algebra 로 |
| Geodesic | 곡면 위 최단 경로 |
| 연속 회전 보간 (SLERP 등) | 두 자세 사이 부드러운 경로 |

Lie group 의 자격만 인정하면 나머지 도구는 별도의 가정 없이 자동으로 작동한다.

### 4.4 — 로보틱스에서 사용하는 Lie Group

| 종류 | 2D | 3D | 비고 |
|---|---|---|---|
| Rotations | $S^1$ — Unit complex | $S^3$ — Unit quaternion | 단위원/단위 4D 구 |
| | SO(2) — Rotation matrix | SO(3) — Rotation matrix | 회전 행렬 |
| Translations | $\mathbb{R}^2$ — Vectors | $\mathbb{R}^3$ — Vectors | 평행이동 (벡터) |
| Rotation + Translation | SE(2) — Motion matrix | SE(3) — Motion matrix | 강체 변환 |
| Rotation + Translation + Scaling | Sim(2) — Affine matrix | Sim(3) — Affine matrix | Monocular VSLAM (스케일 모호) |
| Rotation + Translation + Velocity | — | SE_2(3) — Extension of SE(3) | IMU / VIO / LIO (자세+속도) |

무엇을 표현하느냐 (회전, 이동, 스케일, 속도) 와 몇 차원이냐 (2D, 3D) 의 조합으로 자연스럽게 분류된다.

### 4.5 — 자주 만나는 Lie Group 표

| Lie Group | 차원 | 무엇 | 응용 |
|---|---|---|---|
| $\mathbb{R}^n$ | $n$ | 평행이동 (vector space) | 위치 표현 |
| $S^1$ | 1 | 단위원 (2D 회전) | 각도 |
| SO(2) | 1 | 2D 회전 행렬 | 평면 회전 |
| $S^3$ | 3 | 단위 quaternion | 3D 회전 (효율적 표현) |
| SO(3) | 3 | 3D 회전 행렬 | 로봇 자세, 카메라 회전 |
| SE(2) | 3 | 2D 강체 변환 | 모바일 로봇 (평면) |
| SE(3) | 6 | 3D 강체 변환 | 3D 로봇, SLAM, AR/VR |
| Sim(3) | 7 | SE(3) + 스케일 | Monocular VSLAM (스케일 모호성) |
| SE_2(3) | 9 | SE(3) + velocity | IMU 융합 (VIO/LIO) |

표의 차원이 곧 자유도 (DOF) 이며 각 Lie group 의 본질을 결정한다.

### 4.6 — 로보틱스 응용 매핑

| 분야 | 주요 Lie Group |
|---|---|
| 2D 모바일 로봇 | SE(2) (위치 + 방향) |
| 로봇팔 IK / FK | SE(3) (end-effector 자세) |
| 3D SLAM | SE(3) (카메라/라이다 자세 추정) |
| Visual SLAM (mono) | Sim(3) (스케일 모호) |
| IMU/VIO/LIO | SE_2(3) (자세 + 속도) |
| 컴퓨터 그래픽스 | SO(3), SE(3) (모델 변환) |
| 드론 | SO(3), SE(3) (자세 + 위치) |
| AR/VR | SE(3) (헤드셋 자세) |

거의 모든 3D 추정과 제어가 SE(3) 위에서 이루어지므로, SE(3) 를 능숙하게 다루는 일이 핵심 역량이다.

### 4.7 — 같은 회전, 여러 표현 (S³ vs SO(3))

3D 회전은 두 가지 Lie group 으로 표현할 수 있다.

| 표현 | Lie Group | 형태 | 차원 | 메모 |
|---|---|---|---|---|
| 회전 행렬 | SO(3) | 3×3 행렬 | 9 (제약 6) → 3 DOF | 직관적 |
| 단위 quaternion | $S^3$ (4D unit sphere) | 4-튜플 $(w, x, y, z)$ | 4 (제약 1) → 3 DOF | 컴팩트, gimbal lock 없음 |

두 표현은 동등하다. 다만 $S^3$ 가 더 컴팩트하고 수치적으로도 안정적이라 실무에서 자주 사용된다.

### 4.8 — Sim(3) 와 SE_2(3) — 더 큰 Lie Group

#### Sim(3) — Similarity transformation

$$\text{Sim}(3) = \text{SE}(3) + \text{스케일} = (R, \mathbf{p}, s)$$

회전, 이동에 균등 스케일링이 추가된 형태이다. Monocular VSLAM 에서 쓰는 이유는 단일 카메라는 절대 스케일을 알 수 없기 때문이다. 깊이가 불확실하고 모든 점이 같은 비율로 커지거나 작아져도 같은 이미지가 만들어지므로, 스케일을 자유도로 두어야 일관된 추정이 가능하다.

#### SE_2(3) — Extended SE(3)

$$\text{SE}_2(3) = \text{SE}(3) + \text{linear velocity} = (R, \mathbf{p}, \mathbf{v})$$

자세에 속도가 더해진 표현이다. IMU 는 가속도와 각속도를 측정하고 이를 적분하여 자세와 속도를 동시에 추정해야 하므로 속도 자체가 상태 변수가 된다. VIO 와 LIO 같은 융합 시스템에서 자연스러운 선택이다.

### 4.9 — 정리

Lie group 은 group, smooth manifold, 그리고 smooth 연산까지 갖춘 구조이며, tangent space, Lie algebra, exp/log map, geodesic 같은 도구들이 자동으로 따라온다. 로보틱스에서는 SO(3) 가 3D 회전을, SE(3) 가 3D 강체 변환을 표현하는 표준이고, $S^3$ 는 회전의 컴팩트한 표현으로 쓰이며, Sim(3) 는 VSLAM 의 스케일 모호성을, SE_2(3) 는 IMU/VIO/LIO 에서 자세와 속도를 함께 다룰 때 등장한다. 다음 절에서는 Lie 이론의 핵심 구조 — sphere, tangent, exp/log, geodesic 을 하나의 통합 그림으로 정리한다.

---

## 5. Lie 이론의 구조 — 통합 그림

### 5.1 — 여덟 가지 핵심 용어

PDF 자료의 핵심 그림은 하나의 도형 안에 Lie 이론의 모든 개념을 담아 보여준다. 여덟 가지 용어가 등장한다.

| 용어 | 의미 | 데모에서의 표현 |
|---|---|---|
| Lie group: manifold | 곡면 자체 (회전들이 사는 공간) | 파란 sphere |
| Identity element | 항등원 ($I$, 회전 없음) | 검은 점 (북극) |
| Group element | 한 회전 ($R$) | 컬러 점 ($R_1, R_2$ 등) |
| Lie algebra: tangent space at identity | $I$ 의 접공간 (vector space) | 주황 평면 |
| Tangent vector | 평면 위의 한 벡터 ($\omega$) | 주황 화살표 |
| Geodesic | 곡면 위 최단 경로 (great circle) | 곡면 위 곡선 |
| exp map | 평면에서 곡면으로 ($\omega \to R$) | 화살표에서 점으로 |
| log map | 곡면에서 평면으로 ($R \to \omega$) | 점에서 화살표로 |

### 5.2 — 통합 시각화 (인터랙티브)

R 이 sphere 위를 자동으로 움직이며 여덟 가지 용어가 모두 실시간으로 시각화된다.

<div id="lie-structure-3d" style="width:100%; border:1px solid #d0d7de; border-radius:8px; overflow:hidden; padding:16px; background:#fafbfc;"></div>
<script src="/assets/posts/lie_structure_3d.js"></script>

이 시각화는 비유적 표현이다. 실제 SO(3) 는 9D 공간 안의 3D 곡면이라 직접 그릴 수 없으므로 2D sphere $S^2$ 로 대체했다. 곡면, 평면, 두 다리라는 구조 자체는 정확하다.

<details>
<summary>참고 — 정적 SVG 그림 (간소화)</summary>

<div><svg viewBox="0 0 720 380" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:720px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="720" height="380" fill="#fafbfc"/>

  <!-- 제목 -->
  <text x="360" y="25" text-anchor="middle" fill="#222" font-size="14" font-weight="700">Lie 이론의 구조 — 곡면, 평면, 그리고 다리</text>

  <!-- 곡면 (Lie group) -->
  <ellipse cx="280" cy="220" rx="170" ry="120" fill="#bbdefb" stroke="#1565c0" stroke-width="2" opacity="0.55"/>
  <ellipse cx="280" cy="220" rx="170" ry="40" fill="none" stroke="#1565c0" stroke-width="1" opacity="0.5"/>
  <ellipse cx="280" cy="220" rx="80" ry="120" fill="none" stroke="#1565c0" stroke-width="1" opacity="0.5"/>

  <!-- Identity 점 -->
  <circle cx="280" cy="100" r="6" fill="#222"/>
  <text x="290" y="98" fill="#222" font-size="12" font-weight="700">I</text>
  <text x="245" y="92" text-anchor="end" fill="#222" font-size="11">Identity</text>

  <!-- Group element 점 -->
  <circle cx="380" cy="270" r="5" fill="#43a047"/>
  <text x="390" y="270" fill="#43a047" font-size="11" font-weight="600">R (group element)</text>

  <!-- Geodesic (I → R 곡선) -->
  <path d="M 280,100 Q 320,170 380,270" fill="none" stroke="#43a047" stroke-width="2.5"/>
  <text x="305" y="200" fill="#43a047" font-size="11" font-weight="600">geodesic</text>

  <!-- 접평면 (Lie algebra) -->
  <polygon points="120,40 510,20 510,120 120,140" fill="#ffe0b2" stroke="#e65100" stroke-width="1.5" opacity="0.65"/>
  <!-- 격자 -->
  <g stroke="#e65100" stroke-width="0.5" opacity="0.5">
    <line x1="180" y1="35" x2="180" y2="135"/>
    <line x1="240" y1="32" x2="240" y2="133"/>
    <line x1="300" y1="29" x2="300" y2="130"/>
    <line x1="360" y1="26" x2="360" y2="127"/>
    <line x1="420" y1="23" x2="420" y2="124"/>
    <line x1="120" y1="50" x2="510" y2="40"/>
    <line x1="120" y1="80" x2="510" y2="70"/>
    <line x1="120" y1="110" x2="510" y2="100"/>
  </g>

  <text x="510" y="35" text-anchor="end" fill="#e65100" font-size="12" font-weight="700">Lie algebra (so(3))</text>
  <text x="510" y="50" text-anchor="end" fill="#e65100" font-size="11">tangent space at I</text>

  <!-- Tangent vector (I 에서 평면 안으로) -->
  <line x1="280" y1="100" x2="400" y2="60" stroke="#bf360c" stroke-width="2.5" marker-end="url(#arrLT5)"/>
  <text x="335" y="55" fill="#bf360c" font-size="11" font-weight="600">ω (tangent vector)</text>

  <defs>
    <marker id="arrLT5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#bf360c"/>
    </marker>
    <marker id="arrExp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#ff9800"/>
    </marker>
    <marker id="arrLog" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#9c27b0"/>
    </marker>
  </defs>

  <!-- exp map 화살표 (평면의 ω → 곡면의 R) -->
  <path d="M 400,60 Q 470,200 380,270" fill="none" stroke="#ff9800" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arrExp)"/>
  <text x="490" y="160" fill="#ff9800" font-size="12" font-weight="700">exp map</text>

  <!-- log map 화살표 (곡면의 R → 평면의 ω) -->
  <path d="M 380,270 Q 320,300 250,180 Q 220,100 380,80" fill="none" stroke="#9c27b0" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arrLog)"/>
  <text x="155" y="320" fill="#9c27b0" font-size="12" font-weight="700">log map</text>

  <!-- Lie group 라벨 -->
  <text x="80" y="270" fill="#1565c0" font-size="13" font-weight="700">Lie group:</text>
  <text x="80" y="285" fill="#1565c0" font-size="12">manifold</text>

  <!-- 하단 설명 -->
  <text x="360" y="365" text-anchor="middle" fill="#444" font-size="12">평면과 곡면을 잇는 두 다리: exp (산술 → 회전), log (회전 → 산술)</text>
</svg></div>

</details>

한 그림 안에 곡면 (Lie group), 곡면 위의 점 ($I$, $R$), 접평면 (Lie algebra), 평면 위의 벡터 ($\omega$), 곡면 위의 곡선 (geodesic), 그리고 두 공간을 잇는 화살표 (exp, log) 가 모두 들어 있다.

### 5.3 — 두 공간 사이 다리 — exp / log

<div><svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block; margin:8px 0; font-family:system-ui, sans-serif;">
  <rect x="0" y="0" width="600" height="240" fill="#fafbfc"/>

  <!-- 좌: Lie group -->
  <rect x="40" y="60" width="180" height="120" rx="10" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
  <text x="130" y="98" text-anchor="middle" fill="#0d47a1" font-size="15" font-weight="700">Lie Group</text>
  <text x="130" y="120" text-anchor="middle" fill="#0d47a1" font-size="13">SO(3)</text>
  <text x="130" y="142" text-anchor="middle" fill="#666" font-size="11">곡면 (manifold)</text>
  <text x="130" y="160" text-anchor="middle" fill="#666" font-size="11">회전 행렬 R</text>

  <!-- 우: Lie algebra -->
  <rect x="380" y="60" width="180" height="120" rx="10" fill="#fff3e0" stroke="#e65100" stroke-width="2"/>
  <text x="470" y="98" text-anchor="middle" fill="#bf360c" font-size="15" font-weight="700">Lie Algebra</text>
  <text x="470" y="120" text-anchor="middle" fill="#bf360c" font-size="13">so(3)</text>
  <text x="470" y="142" text-anchor="middle" fill="#666" font-size="11">평면 (vector space)</text>
  <text x="470" y="160" text-anchor="middle" fill="#666" font-size="11">3D 벡터 ω</text>

  <!-- log 화살표 (좌 → 우, 위쪽) -->
  <path d="M 220,100 L 380,100" stroke="#9c27b0" stroke-width="3" marker-end="url(#arrLogS)"/>
  <text x="300" y="92" text-anchor="middle" fill="#9c27b0" font-size="14" font-weight="700">log</text>

  <!-- exp 화살표 (우 → 좌, 아래쪽) -->
  <path d="M 380,150 L 220,150" stroke="#ff9800" stroke-width="3" marker-end="url(#arrExpS)"/>
  <text x="300" y="170" text-anchor="middle" fill="#ff9800" font-size="14" font-weight="700">exp</text>

  <defs>
    <marker id="arrLogS" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#9c27b0"/>
    </marker>
    <marker id="arrExpS" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#ff9800"/>
    </marker>
  </defs>

  <!-- 제목 -->
  <text x="300" y="30" text-anchor="middle" fill="#222" font-size="14" font-weight="700">Lie Group ↔ Lie Algebra</text>

  <!-- 하단 -->
  <text x="300" y="220" text-anchor="middle" fill="#444" font-size="11">log: R → ω (회전 → 벡터)  |  exp: ω → R (벡터 → 회전)</text>
</svg></div>

exp map 은 평면 위의 벡터를 곡면 위의 점으로 사상한다.

$$\exp: \mathfrak{so}(3) \to SO(3), \quad \omega \mapsto \exp(\omega)$$

평면의 벡터만큼 곡면을 따라 진행한 결과로 도달한 회전이라는 뜻이며, 데모에서는 주황 화살표 끝에서 geodesic 을 따라 곡면 위의 점에 도달하는 모습으로 표현된다.

log map 은 그 역방향이다.

$$\log: SO(3) \to \mathfrak{so}(3), \quad R \mapsto \log(R)$$

회전 $R$ 의 axis-angle 표현을 추출하는 작업이며, 데모에서는 곡면 위의 점에서 곡선을 거꾸로 따라가 평면의 벡터에 도달하는 흐름이다.

### 5.4 — 작업 흐름 — 어디서 무엇을 하나

| 작업 | 어디서 (공간) | 왜 |
|---|---|---|
| 회전 저장 | Lie group (SO(3)) | manifold 위의 점이 본래 자세 |
| 회전 합성 ($R_1 R_2$) | Lie group | 행렬 곱으로 자연스럽다 |
| 회전 차이 / error | Lie algebra | 빼기가 가능한 vector space |
| 회전 미분 | Lie algebra | 평면이라 미분이 자유롭다 |
| 최적화 산술 | Lie algebra | 더하기/빼기로 step 계산 |
| 회전 보간 (SLERP) | Lie algebra ↔ Lie group | exp/log 로 왕복 |

연산은 평면 so(3) 에서 수행하고 결과는 다시 곡면 SO(3) 로 가져오는 것이 표준 패턴이다.

### 5.5 — Geodesic — "평면의 직선이 곡면에서는 곡선"

평면 위의 직선이 곡면에서는 geodesic, 즉 곡면 위 최단 경로로 대응된다.

```
[평면]   직선 (Euclidean shortest path)
   ω ────→  (벡터 자체)
       │ exp
       ▼
[곡면]   geodesic (manifold shortest path)
   I ──→ R  (great circle 호)

   평면의 직선과 곡면의 geodesic 이 1:1 로 대응
```

$\exp(t \cdot \omega)$ 는 시간 $t$ 에 따라 곡면 위의 한 점을 기술하며, 직선 운동의 일반화에 해당한다. $t = 0$ 에서 $I$, $t = 1$ 에서 $R$ 에 도달하고 그 사이는 geodesic 위의 점들로 채워진다. 데모의 빨간 곡선이 바로 이 geodesic 이며, 평면의 화살표를 곡면 위에 펴 그린 결과이다.

### 5.6 — IK / SLAM 의 표준 흐름

이 구조 위에서 IK 와 SLAM 의 회전 업데이트는 다음 흐름을 따른다.

```
1. 현재 R, 목표 R_t                          [Lie group]
2. e = log(R_t · R⁻¹)                         [log: 평면으로]
3. 평면에서 미분 / 자코비안 / Δω 계산        [Lie algebra]
4. R_new = R · exp(Δω)                        [exp: 곡면으로]
5. 반복

   평면에서 계산하고 곡면 위에 안전하게 머무는 패턴
```

이 흐름이 모든 회전 최적화의 정통 패턴이다.

### 5.7 — 정리

Lie 이론의 핵심은 곡면 (Lie group) 과 평면 (Lie algebra) 을 잇는 exp / log 두 다리이다. 여덟 개의 용어 — manifold (곡면), identity (기준점), group element (다른 점), tangent space at I = Lie algebra (접평면), tangent vector (평면 위 벡터), geodesic (곡면 위 최단 경로), exp (평면에서 곡면으로), log (곡면에서 평면으로) — 이 하나의 그림 안에서 서로 맞물린다. 연산은 평면에서 수행하고, 표현은 곡면 위에서 유지하며, 두 공간을 exp/log 로 왕복한다는 작업 패턴을 기억하면 된다. 다음 절에서는 Lie algebra so(3) 의 명시적 정의와 skew-symmetric 행렬, hat 연산자를 다룬다.

---

## 6. Lie Algebra — so(3) 명시 정의

### 6.1 — 일반 정의

Lie algebra 는 Lie group 의 identity 에서의 tangent space 로 정의된다.

$$\mathfrak{g} = T_I G$$

| Lie group $G$ | Lie algebra $\mathfrak{g}$ |
|---|---|
| SO(3) | $\mathfrak{so}(3)$ |
| SE(3) | $\mathfrak{se}(3)$ |
| SO(2) | $\mathfrak{so}(2)$ |
| Sim(3) | $\mathfrak{sim}(3)$ |

소문자에 frak 폰트 ($\mathfrak{}$) 를 쓰는 것이 Lie algebra 표기 관습이다.

### 6.2 — so(3) 의 정확한 형태

so(3) 는 3×3 skew-symmetric 행렬의 모임이다.

$$\mathfrak{so}(3) = \lbrace\, \Omega \in \mathbb{R}^{3 \times 3} \;\mid\; \Omega^T = -\Omega \,\rbrace$$

Skew-symmetric (반대칭) 의 의미는 전치가 자기 자신의 음수가 된다는 것이다.

$$\Omega^T = -\Omega$$

자기 자신의 음수와 같아야 하는 대각 성분은 모두 0 이고, 비대각 성분은 부호가 서로 반대이다.

### 6.3 — Skew-symmetric 행렬 형태

3×3 skew 행렬은 자유 파라미터를 세 개만 가진다.

$$\Omega = \begin{bmatrix} 0 & -\omega_z & \omega_y \\\\ \omega_z & 0 & -\omega_x \\\\ -\omega_y & \omega_x & 0 \end{bmatrix}$$

대각 성분 세 개는 모두 0 이고, 위 삼각 성분 $-\omega_z, \omega_y, -\omega_x$ 의 세 값이 자유 파라미터이며, 아래 삼각은 부호만 반대로 자동 결정된다. 따라서 자유도는 3 이고, so(3) 의 차원이 SO(3) 의 차원과 같다는 사실 — tangent space 의 차원은 본 manifold 의 차원과 같다는 일반 성질 — 과 일치한다.

### 6.4 — Hat 연산자 — 벡터와 행렬의 대응

3D 벡터와 3×3 skew 행렬은 hat 연산자 $\wedge$ 를 통해 1:1 로 대응된다. 벡터 형태는

$$\boldsymbol{\omega} = \begin{bmatrix} \omega_x \\\\ \omega_y \\\\ \omega_z \end{bmatrix} \in \mathbb{R}^3$$

이고, 여기에 hat 연산자를 적용하면 skew 행렬이 된다.

$$\hat{\boldsymbol{\omega}} = \begin{bmatrix} 0 & -\omega_z & \omega_y \\\\ \omega_z & 0 & -\omega_x \\\\ -\omega_y & \omega_x & 0 \end{bmatrix} \in \mathfrak{so}(3)$$

| 표기 | 의미 |
|---|---|
| $\hat{\boldsymbol{\omega}}$ ("omega hat") | Hat 연산자: 벡터에서 skew 행렬로 |
| $\boldsymbol{\omega}^\vee$ ("omega vee") | Vee 연산자: skew 행렬에서 벡터로 (역방향) |

두 표현은 자유롭게 오갈 수 있으며 다음 항등식이 성립한다.

$$(\hat{\boldsymbol{\omega}})^\vee = \boldsymbol{\omega}, \quad \widehat{\boldsymbol{\omega}^\vee} = \hat{\boldsymbol{\omega}}$$

### 6.5 — Cross product 와의 관계

Hat 연산자의 본질적 의미는 벡터 cross product 를 행렬 곱으로 표현한다는 데 있다.

$$\hat{\boldsymbol{\omega}} \cdot \mathbf{v} = \boldsymbol{\omega} \times \mathbf{v}$$

$\boldsymbol{\omega} = (\omega_x, \omega_y, \omega_z)$, $\mathbf{v} = (v_x, v_y, v_z)$ 에 대해 직접 계산하면

$$\hat{\boldsymbol{\omega}} \mathbf{v} = \begin{bmatrix} 0 & -\omega_z & \omega_y \\\\ \omega_z & 0 & -\omega_x \\\\ -\omega_y & \omega_x & 0 \end{bmatrix} \begin{bmatrix} v_x \\\\ v_y \\\\ v_z \end{bmatrix} = \begin{bmatrix} \omega_y v_z - \omega_z v_y \\\\ \omega_z v_x - \omega_x v_z \\\\ \omega_x v_y - \omega_y v_x \end{bmatrix}$$

이고, 이는 정확히 cross product 의 결과와 일치한다.

$$\boldsymbol{\omega} \times \mathbf{v} = \begin{bmatrix} \omega_y v_z - \omega_z v_y \\\\ \omega_z v_x - \omega_x v_z \\\\ \omega_x v_y - \omega_y v_x \end{bmatrix}$$

따라서 hat 은 cross product 를 행렬로 표현한 형태이다.

### 6.6 — 직관 — 회전축과 각속도

so(3) 의 원소는 순간 회전을 표현한다. 벡터 $\boldsymbol{\omega} \in \mathbb{R}^3$ 의 크기 $|\boldsymbol{\omega}|$ 가 회전 속도 (rad/s) 를, 단위 벡터 $\boldsymbol{\omega}/|\boldsymbol{\omega}|$ 가 회전축의 방향을 의미한다. 결국 $\boldsymbol{\omega}$ 는 "회전축 곱하기 회전 속도" 의 형태로 한 종류의 순간 회전을 코드화한다.

| $\boldsymbol{\omega}$ | 의미 |
|---|---|
| $(0, 0, \pi)$ | z축 둘레로 $\pi$ rad/s 회전 |
| $(1, 0, 0)$ | x축 둘레로 1 rad/s 회전 |
| $(\pi/2, \pi/2, 0)$ | xy 사이 대각축, 빠른 회전 |
| $(0, 0, 0)$ | 회전 없음 (identity) |

각 $\boldsymbol{\omega}$ 가 한 가지 순간 회전의 방향과 강도를 동시에 담는다.

### 6.7 — Vector Space 성질 (자유로운 산술)

so(3) 는 3차원 vector space 이므로 다음 산술이 자유롭게 정의된다.

| 작업 | 정의 |
|---|---|
| 덧셈 | $\boldsymbol{\omega}_1 + \boldsymbol{\omega}_2$ — 성분별 합 |
| 스칼라 곱 | $c \cdot \boldsymbol{\omega}$ — 모든 성분에 $c$ 를 곱함 |
| 0 원소 | $\mathbf{0}$ (회전 없음, identity 의 tangent) |
| basis | 표준 기저 세 개 ($\mathbf{e}_x, \mathbf{e}_y, \mathbf{e}_z$) |

Lie group 인 SO(3) 자체에서는 직접 더하거나 빼는 일이 회전을 깨뜨리지만, vector space 인 so(3) 에서는 같은 작업이 자유롭게 가능하다는 점이 평면을 도입하는 실질적 이점이다.

### 6.8 — 표준 기저 (basis)

so(3) 의 표준 기저는 각 축에 대한 회전 generator 세 개로 구성된다.

$$\hat{\mathbf{e}}_x = \begin{bmatrix} 0 & 0 & 0 \\\\ 0 & 0 & -1 \\\\ 0 & 1 & 0 \end{bmatrix}, \quad \hat{\mathbf{e}}_y = \begin{bmatrix} 0 & 0 & 1 \\\\ 0 & 0 & 0 \\\\ -1 & 0 & 0 \end{bmatrix}, \quad \hat{\mathbf{e}}_z = \begin{bmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 0 \end{bmatrix}$$

세 기저가 각각 x, y, z 축 둘레의 회전에 대응하며, 임의의 $\boldsymbol{\omega}$ 는 이들의 선형결합으로 쓸 수 있다.

$$\hat{\boldsymbol{\omega}} = \omega_x \hat{\mathbf{e}}_x + \omega_y \hat{\mathbf{e}}_y + \omega_z \hat{\mathbf{e}}_z$$

어떤 회전 방향이든 세 축 회전의 합으로 표현된다는 의미이다.

### 6.9 — Lie bracket [·, ·]

so(3) 는 vector space 위에 Lie bracket 이라는 추가 구조를 가진다.

$$[\hat{\boldsymbol{\omega}}_1, \hat{\boldsymbol{\omega}}_2] = \hat{\boldsymbol{\omega}}_1 \hat{\boldsymbol{\omega}}_2 - \hat{\boldsymbol{\omega}}_2 \hat{\boldsymbol{\omega}}_1$$

두 행렬의 commutator 형태이며, so(3) 의 경우 다음 항등식이 성립한다.

$$[\hat{\boldsymbol{\omega}}_1, \hat{\boldsymbol{\omega}}_2] = \widehat{(\boldsymbol{\omega}_1 \times \boldsymbol{\omega}_2)}$$

두 벡터 cross product 의 hat 이라는 형태이며, 이 양은 회전의 비가환성을 직접 측정한다.

#### 비가환성이란

비가환성은 $A \cdot B \neq B \cdot A$, 즉 순서를 바꾸면 결과가 달라진다는 성질이다. 숫자 덧셈처럼 $AB = BA$ 가 성립하면 가환, 3D 회전처럼 순서가 결정적으로 중요하면 비가환이라 부른다.

#### 친숙한 예 — 양말과 신발

양말을 먼저 신고 신발을 신으면 정상이지만, 신발을 먼저 신고 양말을 그 위에 신으려 하면 신발이 들어가지 않는다. 순서를 바꾸면 결과가 다르다는 비가환의 일상적 예이다.

#### 회전의 비가환성 — 책 한 권으로 실험

책 한 권을 들고 두 가지 순서로 회전시켜 보면 차이가 명확하다. 순서 A 로 x 축 90° 회전 후 y 축 90° 회전을 하면 책은 한 자세가 되고, 순서 B 로 y 축 90° 회전 후 x 축 90° 회전을 하면 책은 다른 자세가 된다. $R_x R_y \neq R_y R_x$ 라는 사실, 즉 3D 회전이 비가환이라는 사실이 Lie 이론을 필요하게 만든 근본 원인이다.

#### Lie bracket 의 사용 흐름

먼저 $[\boldsymbol{\omega}_1, \boldsymbol{\omega}_2] = \boldsymbol{\omega}_1 \times \boldsymbol{\omega}_2$ 를 계산해서 그 값이 0 이면 가환이라 $\boldsymbol{\omega}_1 + \boldsymbol{\omega}_2$ 만으로 정확하다. 0 이 아니면 비가환이므로 BCH 보정을 적용해야 하며, 이 경우

$$\exp(\boldsymbol{\omega}_1) \exp(\boldsymbol{\omega}_2) = \exp\left(\boldsymbol{\omega}_1 + \boldsymbol{\omega}_2 + \tfrac{1}{2}[\boldsymbol{\omega}_1, \boldsymbol{\omega}_2] + \cdots\right)$$

가 성립한다. 실무에서는 매 step 의 $|\Delta\boldsymbol{\omega}|$ 를 작게 잡아 bracket 항이 거의 0 이 되도록 우회하는 편이 일반적이다. 이론적으로는 bracket 으로 비가환성을 측정한 뒤 필요하면 BCH 를 적용하고, 실무적으로는 작은 step 을 반복해 bracket 을 무시할 수 있게 만드는 두 갈래로 정리된다. BCH 공식의 보정 항 $\tfrac{1}{2}[\boldsymbol{\omega}_1, \boldsymbol{\omega}_2]$ 가 바로 이 비가환성을 보정하는 항이다.

### 6.10 — 정리 — so(3) 의 모든 모습

so(3) 의 원소는 3D 벡터 $\boldsymbol{\omega} = (\omega_x, \omega_y, \omega_z) \in \mathbb{R}^3$ 와 $3 \times 3$ skew 행렬 $\hat{\boldsymbol{\omega}}$ 라는 두 형태로 쓸 수 있고, 두 표현은 hat/vee 로 자유롭게 변환된다. 같은 정보의 두 표면이며 용도가 다르다 — 벡터 형태는 저장과 산술에 (숫자 세 개로 충분), 행렬 형태는 적용에 (행렬 곱 $\hat{\boldsymbol{\omega}} \mathbf{v} = \boldsymbol{\omega} \times \mathbf{v}$) 쓰인다. 의미는 어느 쪽이든 동일하다 — 회전축과 각속도로 코드화된 순간 회전이며, SO(3) 위의 작은 회전 변화량이고, exp 으로 SO(3) 의 회전을 만들어 낼 재료이다.

### 6.11 — 정리

so(3) 는 3×3 skew-symmetric 행렬과 3D 벡터의 두 표현을 가진 vector space 로, hat/vee 로 1:1 대응된다. 차원은 3 으로 SO(3) 의 차원이자 회전의 자유도와 일치하며, vector space 라는 성질 덕분에 덧셈, 스칼라 곱, 미분이 자유롭다. 의미는 회전축과 각속도로 표현되는 순간 회전이며, 다음 절에서 위치와 회전을 통합한 강체 변환의 Lie algebra 인 se(3) 로 확장한다.

---

## 7. se(3) — 위치 + 회전 통합

### 7.1 — 동기 — 회전만으로는 부족

so(3) 는 회전만을 다루는 3 DOF 의 공간이지만, 실제 로봇과 SLAM 은 위치와 회전을 합한 6 DOF 가 필요하다. SO(3) 를 확장한 SE(3) (Special Euclidean group) 는 회전과 평행이동을 함께 표현하는 강체 변환의 Lie group 이고, 그 Lie algebra 인 se(3) 는 위치와 회전의 변화량을 통합적으로 표현한다.

### 7.2 — SE(3) 복습 — 4×4 동차 행렬

SE(3) 의 원소는 위치와 자세를 함께 담는 강체 변환이다.

$$T = \begin{bmatrix} R & \mathbf{p} \\\\ \mathbf{0}^T & 1 \end{bmatrix} \in \mathbb{R}^{4 \times 4}$$

| 부분 | 의미 |
|---|---|
| $R \in SO(3)$ | 회전 (3×3) |
| $\mathbf{p} \in \mathbb{R}^3$ | 평행이동 (3D 벡터) |
| 마지막 행 $[0\;0\;0\;1]$ | 동차좌표 표기용 |

회전 3 자유도와 평행이동 3 자유도를 합한 차원 6 의 Lie group 이다.

### 7.3 — se(3) 의 정의

se(3) 는 SE(3) 의 identity 에서의 tangent space 로 정의된다.

$$\mathfrak{se}(3) = T_I SE(3)$$

원소는 다음과 같은 4×4 행렬 형태를 가진다.

$$\hat{\boldsymbol{\xi}} = \begin{bmatrix} \hat{\boldsymbol{\omega}} & \mathbf{v} \\\\ \mathbf{0}^T & 0 \end{bmatrix} \in \mathfrak{se}(3)$$

| 부분 | 의미 |
|---|---|
| $\hat{\boldsymbol{\omega}} \in \mathfrak{so}(3)$ | 각속도 (3×3 skew, 좌상단 블록) |
| $\mathbf{v} \in \mathbb{R}^3$ | 선속도 (3D 벡터, 우상단 블록) |
| 마지막 행 $[0\;0\;0\;0]$ | so(3) 의 0 을 동차 형태로 자연 확장 |

행렬 자체는 4×4 이지만 자유 파라미터는 위 3×3 skew 의 3 개와 우측 벡터의 3 개를 합쳐 6 이다.

### 7.4 — Twist 좌표 — 6D 벡터 표현

se(3) 원소는 6D 벡터로 표현할 수 있다.

$$\boldsymbol{\xi} = \begin{bmatrix} \mathbf{v} \\\\ \boldsymbol{\omega} \end{bmatrix} \in \mathbb{R}^6$$

이 벡터를 twist (트위스트) 라 부른다.

| 부분 | 차원 | 의미 |
|---|---|---|
| $\mathbf{v}$ | 3 | 선속도 (linear velocity) |
| $\boldsymbol{\omega}$ | 3 | 각속도 (angular velocity) |

위치와 회전의 순간 변화량을 6D 로 묶은 표현이다.

### 7.5 — Hat 연산자 (se(3) 버전)

6D twist 와 4×4 행렬은 hat/vee 로 자유롭게 변환된다.

$$\hat{\boldsymbol{\xi}} = \begin{bmatrix} \hat{\boldsymbol{\omega}} & \mathbf{v} \\\\ \mathbf{0}^T & 0 \end{bmatrix}, \quad \boldsymbol{\xi} = \begin{bmatrix} \mathbf{v} \\\\ \boldsymbol{\omega} \end{bmatrix}$$

6 개 숫자와 4×4 행렬은 동일한 자유도 6 의 두 표현이다.

### 7.6 — 표 — so(3) vs se(3)

| 항목 | so(3) | se(3) |
|---|---|---|
| Lie group | SO(3) | SE(3) |
| 의미 | 3D 회전 | 강체 변환 (회전 + 이동) |
| 차원 | 3 | 6 |
| 행렬 형태 | 3×3 skew | 4×4 (skew + 벡터) |
| 벡터 표현 | $\boldsymbol{\omega} \in \mathbb{R}^3$ | $\boldsymbol{\xi} = (\mathbf{v}, \boldsymbol{\omega}) \in \mathbb{R}^6$ |
| 물리적 의미 | 각속도 | 각속도 + 선속도 |

se(3) 는 so(3) 에 평행이동 부분을 더한 자연 확장이다.

### 7.7 — Twist 의 직관

6D twist $\boldsymbol{\xi} = (\mathbf{v}, \boldsymbol{\omega})$ 에서 $\mathbf{v}$ 는 평행이동의 변화량인 선속도, $\boldsymbol{\omega}$ 는 회전의 변화량인 각속도이다. 두 양이 합쳐져 강체의 순간 운동 — 위치와 자세 양쪽 — 을 한 벡터에 담으며, 시간에 대해 적분하면 실제 자세 ($SE(3)$ 의 한 점) 가 된다. twist 는 6D 운동 벡터라는 한 단어로 요약할 수 있다.

### 7.8 — Lie bracket of se(3)

se(3) 에도 Lie bracket 이 정의된다.

$$[\hat{\boldsymbol{\xi}}_1, \hat{\boldsymbol{\xi}}_2] = \hat{\boldsymbol{\xi}}_1 \hat{\boldsymbol{\xi}}_2 - \hat{\boldsymbol{\xi}}_2 \hat{\boldsymbol{\xi}}_1$$

강체 변환의 비가환성을 측정하는 양으로, so(3) 의 Lie bracket 을 회전과 이동을 함께 다루는 형태로 일반화한 것이다.

### 7.9 — 정리

se(3) 는 so(3) 에 평행이동을 더한 강체 변환의 Lie algebra 이다. 6D twist $\boldsymbol{\xi} = (\mathbf{v}, \boldsymbol{\omega})$ 는 선속도와 각속도를 묶은 표현이며, 4×4 행렬 형태와 hat/vee 로 자유롭게 오갈 수 있다. IK 의 6D 자코비안 $\dot{\mathbf{x}} = J \dot{\mathbf{q}}$ 에서 $\dot{\mathbf{x}}$ 가 정확히 se(3) 의 twist 라는 점에서, se(3) 는 우리가 다루는 IK 와 가장 직접적으로 만나는 Lie algebra 이다. 다음 절에서는 exp / log map 의 명시적 식 — Rodrigues 공식의 직접 유도와 so(3) → SO(3), se(3) → SE(3) 의 사상 — 을 다룬다.

---

## 8. Exp / Log Map — Rodrigues 공식 유도

so(3) 의 벡터 $\boldsymbol{\omega} \in \mathbb{R}^3$ 가 하나 주어졌을 때, 이것을 SO(3) 의 회전 행렬 $R$ 로 보내는 사상이 exponential map 이다. 지금까지는 "이런 사상이 있다" 정도로만 쓰고 명시적 식은 미뤄두었는데, 여기서는 직접 계산해서 닫힌 형태 — Rodrigues 공식 — 까지 끌어낸다.

### 8.1 — 행렬 지수의 정의

스칼라 지수 $e^x$ 의 테일러 전개

$$e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots$$

를 행렬에 그대로 옮겨 쓴 것이 행렬 지수이다.

$$\exp(A) = I + A + \frac{A^2}{2!} + \frac{A^3}{3!} + \cdots$$

$A$ 가 $n \times n$ 행렬일 때, 우변의 모든 항이 같은 크기의 행렬이고 합도 수렴한다. 이 정의를 $A = \hat{\boldsymbol{\omega}} \in \mathfrak{so}(3)$ 에 적용한 결과가 바로 $\exp \colon \mathfrak{so}(3) \to SO(3)$ 의 명시적 식이다.

$$\exp(\hat{\boldsymbol{\omega}}) = I + \hat{\boldsymbol{\omega}} + \frac{\hat{\boldsymbol{\omega}}^2}{2!} + \frac{\hat{\boldsymbol{\omega}}^3}{3!} + \cdots$$

문제는 이 무한합을 그대로 두면 계산할 수 없다는 점이다. 닫힌 형태로 줄이려면 $\hat{\boldsymbol{\omega}}$ 의 거듭제곱이 어떤 패턴을 갖는지 봐야 한다.

### 8.2 — $\hat{\boldsymbol{\omega}}$ 거듭제곱의 패턴

$\boldsymbol{\omega} = \theta \mathbf{u}$ 로 놓는다. 여기서 $\theta = \|\boldsymbol{\omega}\|$ 는 회전 각도, $\mathbf{u}$ 는 단위 회전축이다. 그러면

$$\hat{\boldsymbol{\omega}} = \theta \hat{\mathbf{u}}$$

가 된다. 단위벡터 $\mathbf{u}$ 의 hat 행렬 $\hat{\mathbf{u}}$ 의 거듭제곱을 계산해 보자.

$$\hat{\mathbf{u}}^2 = \mathbf{u} \mathbf{u}^T - I$$

이 식은 직접 곱해서 확인할 수 있고, 또는 $\hat{\mathbf{u}} \mathbf{v} = \mathbf{u} \times \mathbf{v}$ 와 $\mathbf{u} \times (\mathbf{u} \times \mathbf{v}) = (\mathbf{u} \cdot \mathbf{v}) \mathbf{u} - \mathbf{v}$ 로부터 나온다 ($|\mathbf{u}| = 1$ 이므로 $\mathbf{u} \cdot \mathbf{u} = 1$).

이제 $\hat{\mathbf{u}}^3$ 을 계산한다.

$$\hat{\mathbf{u}}^3 = \hat{\mathbf{u}} \cdot \hat{\mathbf{u}}^2 = \hat{\mathbf{u}}(\mathbf{u}\mathbf{u}^T - I) = \hat{\mathbf{u}}\mathbf{u}\mathbf{u}^T - \hat{\mathbf{u}} = -\hat{\mathbf{u}}$$

여기서 $\hat{\mathbf{u}}\mathbf{u} = \mathbf{u} \times \mathbf{u} = \mathbf{0}$ 을 사용했다. 핵심 결과를 모으면

$$\hat{\mathbf{u}}^2 = \mathbf{u}\mathbf{u}^T - I, \qquad \hat{\mathbf{u}}^3 = -\hat{\mathbf{u}}$$

가 된다. 이 두 관계식이 모든 차수의 거듭제곱을 결정한다.

| $k$ | $\hat{\mathbf{u}}^k$ |
|---|---|
| 1 | $\hat{\mathbf{u}}$ |
| 2 | $\hat{\mathbf{u}}^2$ |
| 3 | $-\hat{\mathbf{u}}$ |
| 4 | $-\hat{\mathbf{u}}^2$ |
| 5 | $\hat{\mathbf{u}}$ |
| 6 | $\hat{\mathbf{u}}^2$ |

홀수 차수는 부호만 바뀌면서 $\pm \hat{\mathbf{u}}$, 짝수 차수는 $\pm \hat{\mathbf{u}}^2$ 로 순환한다. 이 주기성이 무한합을 두 개의 익숙한 테일러 급수로 분해해 준다.

### 8.3 — 무한합을 sin / cos 로 분해

$\hat{\boldsymbol{\omega}} = \theta \hat{\mathbf{u}}$ 를 행렬 지수에 대입한다.

$$\exp(\theta \hat{\mathbf{u}}) = I + \theta \hat{\mathbf{u}} + \frac{\theta^2}{2!} \hat{\mathbf{u}}^2 + \frac{\theta^3}{3!} \hat{\mathbf{u}}^3 + \frac{\theta^4}{4!} \hat{\mathbf{u}}^4 + \cdots$$

§8.2 의 패턴을 대입하면 ($\hat{\mathbf{u}}^3 = -\hat{\mathbf{u}}$, $\hat{\mathbf{u}}^4 = -\hat{\mathbf{u}}^2$, $\cdots$)

$$\exp(\theta \hat{\mathbf{u}}) = I + \left(\theta - \frac{\theta^3}{3!} + \frac{\theta^5}{5!} - \cdots \right) \hat{\mathbf{u}} + \left(\frac{\theta^2}{2!} - \frac{\theta^4}{4!} + \frac{\theta^6}{6!} - \cdots \right) \hat{\mathbf{u}}^2$$

괄호 안의 두 급수는 정확히 $\sin\theta$ 와 $1 - \cos\theta$ 의 테일러 전개이다.

$$\sin\theta = \theta - \frac{\theta^3}{3!} + \frac{\theta^5}{5!} - \cdots$$

$$1 - \cos\theta = \frac{\theta^2}{2!} - \frac{\theta^4}{4!} + \frac{\theta^6}{6!} - \cdots$$

따라서

$$\boxed{\exp(\theta \hat{\mathbf{u}}) = I + \sin\theta \cdot \hat{\mathbf{u}} + (1 - \cos\theta) \cdot \hat{\mathbf{u}}^2}$$

이것이 Rodrigues 공식이다. 무한합이 세 항으로 줄어들었고, 모두 닫힌 식으로 계산 가능하다.

### 8.4 — 다른 형태 (mathbf{u}\mathbf{u}^T 형)

$\hat{\mathbf{u}}^2 = \mathbf{u}\mathbf{u}^T - I$ 를 다시 대입하면 동등한 다른 표현을 얻는다.

$$\exp(\theta \hat{\mathbf{u}}) = I + \sin\theta \cdot \hat{\mathbf{u}} + (1 - \cos\theta)(\mathbf{u}\mathbf{u}^T - I)$$

$$= \cos\theta \cdot I + \sin\theta \cdot \hat{\mathbf{u}} + (1 - \cos\theta) \mathbf{u}\mathbf{u}^T$$

이 형태는 회전 행렬을 세 부분 — 단위행렬, skew, 외적 (outer product) — 의 가중합으로 보여준다. 두 형태 모두 Rodrigues 공식이라고 불린다.

### 8.5 — 수치 예시

$\boldsymbol{\omega} = (0, 0, \frac{\pi}{2})$ 일 때, 즉 $z$ 축으로 90° 회전을 직접 계산해 본다.

$\theta = \frac{\pi}{2}$, $\mathbf{u} = (0, 0, 1)$, $\sin\theta = 1$, $\cos\theta = 0$.

$$\hat{\mathbf{u}} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}, \qquad \hat{\mathbf{u}}^2 = \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$

$$R = I + 1 \cdot \hat{\mathbf{u}} + 1 \cdot \hat{\mathbf{u}}^2 = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

$z$ 축 90° 회전 행렬과 정확히 일치한다.

### 8.6 — Log Map 유도

$R \in SO(3)$ 가 주어졌을 때 $\boldsymbol{\omega} = \log R \in \mathfrak{so}(3)$ 를 구하는 식은 Rodrigues 의 역과정이다. exp 가 $\boldsymbol{\omega} \to R$ 의 명시적 닫힌 식이라면, log 는 $R$ 의 성분으로부터 $\theta$ 와 $\mathbf{u}$ 를 분리해서 다시 끄집어내는 절차이다. exp 식의 두 가지 형태 — skew 항과 대칭 항 — 가 행렬의 어느 부분에 들어 있는지 보면 자연스럽게 각도와 축이 추출된다.

#### 8.6.1 — 회전 각도 $\theta$ 추출 (trace 법)

Rodrigues 의 두 번째 형태에서 출발한다.

$$R = \cos\theta \cdot I + \sin\theta \cdot \hat{\mathbf{u}} + (1 - \cos\theta) \mathbf{u}\mathbf{u}^T$$

양변에 trace 를 취한다. 세 항을 분리하면

$$\mathrm{tr}(R) = \cos\theta \cdot \mathrm{tr}(I) + \sin\theta \cdot \mathrm{tr}(\hat{\mathbf{u}}) + (1 - \cos\theta) \cdot \mathrm{tr}(\mathbf{u}\mathbf{u}^T)$$

각 trace 를 계산한다. $\mathrm{tr}(I) = 3$, $\mathrm{tr}(\hat{\mathbf{u}}) = 0$ (skew 행렬의 대각은 모두 0), $\mathrm{tr}(\mathbf{u}\mathbf{u}^T) = \mathbf{u}^T \mathbf{u} = 1$ (단위벡터). 대입하면

$$\mathrm{tr}(R) = 3\cos\theta + 0 + (1 - \cos\theta) = 1 + 2\cos\theta$$

$\cos\theta$ 에 대해 풀면

$$\cos\theta = \frac{\mathrm{tr}(R) - 1}{2}, \qquad \theta = \arccos\left(\frac{\mathrm{tr}(R) - 1}{2}\right)$$

회전 각도는 $R$ 의 trace 한 값으로 결정된다. 행렬 전체가 아닌 대각합 하나로 충분하다는 것이 trace 법의 핵심이다.

#### 8.6.2 — 회전축 $\mathbf{u}$ 추출 ($R - R^T$ 법)

$R$ 그 자체에서 $\mathbf{u}$ 를 바로 끄집어내려고 하면 $\cos\theta \cdot I$ 와 $(1-\cos\theta)\mathbf{u}\mathbf{u}^T$ 항이 섞여 있어 깔끔하지 않다. 대신 $R$ 에서 $R^T$ 를 빼면 대칭 항들이 모두 상쇄되고 skew 항만 남는다.

먼저 $R^T$ 를 쓴다. $I^T = I$, $(\mathbf{u}\mathbf{u}^T)^T = \mathbf{u}\mathbf{u}^T$ 는 대칭이고 $\hat{\mathbf{u}}^T = -\hat{\mathbf{u}}$ 는 skew 이므로

$$R^T = \cos\theta \cdot I - \sin\theta \cdot \hat{\mathbf{u}} + (1 - \cos\theta) \mathbf{u}\mathbf{u}^T$$

차를 계산하면 대칭 두 항이 사라진다.

$$R - R^T = 2 \sin\theta \cdot \hat{\mathbf{u}}$$

이제 이 식에 vee 연산을 취해 벡터로 내려보낸다. $\hat{\mathbf{u}}^{\vee} = \mathbf{u}$ 이므로

$$(R - R^T)^{\vee} = 2 \sin\theta \cdot \mathbf{u}$$

양변을 $2\sin\theta$ 로 나누면

$$\mathbf{u} = \frac{1}{2 \sin\theta} (R - R^T)^{\vee}$$

회전축이 $R$ 의 반대칭 부분에서 직접 얻어진다.

#### 8.6.3 — 최종 식

$\boldsymbol{\omega} = \theta \mathbf{u}$ 로 합치면

$$\theta = \arccos\left(\frac{\mathrm{tr}(R) - 1}{2}\right)$$

$$\boldsymbol{\omega} = \log R = \frac{\theta}{2 \sin\theta} (R - R^T)^{\vee}$$

이것이 SO(3) 에서 so(3) 로 가는 명시적 log map 이다. 한 줄로 보면 "$R$ 의 대각 합으로 각도를, $R - R^T$ 의 vee 로 축을" 이라는 두 단계 추출이다.

#### 8.6.4 — 특이점

$\theta \to 0$ 또는 $\theta \to \pi$ 에서 분모 $\sin\theta$ 가 0 에 가까워져 식이 발산하는 문제가 있다. 두 경우의 의미가 서로 달라 분기 처리가 필요하다.

**작은 회전 ($\theta \to 0$).** 이 경우 $R \approx I$ 이고, 분자 $R - R^T$ 도 함께 0 으로 가서 0/0 형태가 된다. 테일러 전개 $\sin\theta \approx \theta$ 를 쓰면

$$\boldsymbol{\omega} = \log R \approx \frac{1}{2}(R - R^T)^{\vee}$$

축 자체는 정의 자체가 모호하지만 (회전이 없으면 축이 의미 없음), $\boldsymbol{\omega}$ 벡터는 0 에 가까운 안전한 값으로 잘 떨어진다.

**180° 회전 ($\theta \to \pi$).** 이 경우 $R - R^T \to 0$ 이지만 회전 자체는 0 이 아니다 ($R \neq I$). skew 항이 사라져 축을 끄집어낼 수 없으므로 대칭 항에서 추출해야 한다. $\theta = \pi$ 이면 $\sin\theta = 0$, $\cos\theta = -1$ 이므로 Rodrigues 의 두 번째 형태가

$$R = -I + 2 \mathbf{u}\mathbf{u}^T \quad \Longrightarrow \quad \mathbf{u}\mathbf{u}^T = \frac{R + I}{2}$$

가 된다. 우변 행렬의 대각 성분에서 $u_i^2 = (R_{ii} + 1)/2$ 를 얻어 $\mathbf{u}$ 의 각 성분의 절대값을 결정하고, 비대각 성분 $u_i u_j = (R_{ij} + R_{ji})/4$ (또는 등가 식) 로 부호를 맞춘다. 부호는 한 성분을 양수로 고정하고 나머지를 결정하는 식으로 잡는다 ($\mathbf{u}$ 와 $-\mathbf{u}$ 는 같은 회전을 주므로 한 쪽만 선택해도 무방).

실전 구현은 보통 $|\theta| < \epsilon$, $|\theta - \pi| < \epsilon$ 두 가지 분기 + 일반 경우의 세 가지로 나누어 처리한다.

### 8.7 — 정리

행렬 지수의 무한합을 $\hat{\mathbf{u}}^3 = -\hat{\mathbf{u}}$ 의 주기성으로 분해하면 sin / cos 의 테일러 급수가 자연스럽게 나타나고, 결과는 세 항짜리 닫힌 식 — Rodrigues 공식 — 이 된다. 역방향인 log map 은 trace 와 $R - R^T$ 의 skew 성분으로부터 회전 각도와 축을 복원한다. 이로써 so(3) ↔ SO(3) 사이의 명시적 전환 식을 손에 넣었다. 다음 섹션에서는 이 사상을 IK / SLAM 에 적용하는 흐름 — 평면에서의 산술 → exp 로 다시 그룹으로 — 을 다룬다.

---

## 9. 응용 — log → 평면 산술 → exp 흐름

지금까지 정의한 도구들 — Lie group, tangent space, Lie algebra, exp / log map — 이 실제로 어떻게 쓰이는지 정리한다. 추상적인 구조가 IK 와 SLAM 같은 응용에서 어떤 형태로 나타나는지 보면, §1 에서 던진 질문 ("회전은 왜 그냥 더할 수 없는가") 에 자연스럽게 답이 닫힌다.

### 9.1 — 왜 평면 산술이 필요한가

회전 행렬 두 개를 단순히 더하면 결과는 회전 행렬이 아니다. SO(3) 가 곡면이고, 곡면 위의 두 점을 평면처럼 더하면 곡면 밖으로 튀어나간다. 그렇다고 곡면 위에 머무는 연산만으로는 "두 회전의 평균" 이나 "오차의 가중치 곱" 같은 산술적 조작이 어렵다.

해법은 곡면을 잠시 떠나는 것이다. 한 점에서 평면 (tangent space) 으로 내려가서 거기서 산술을 수행하고, 결과를 다시 곡면으로 올린다. log map 으로 내려가고 exp map 으로 올라온다.

```
곡면 위 회전 R   ──log──>   so(3) 평면 벡터 ω
                              │
                       산술 (덧셈, 빼기, 평균, 가중합)
                              │
                              v
곡면 위 회전 R'  <──exp──   결과 벡터 ω'
```

이 세 단계 흐름이 Lie 이론을 응용하는 모든 곳에서 반복된다.

### 9.2 — IK 한 step 의 풀 흐름

목표 자세 $T_t \in SE(3)$ 와 현재 자세 $T_c$ 가 주어진 IK 한 step 을 Lie 시점으로 풀어낸다.

먼저 두 자세 사이의 상대 변환을 만든다.

$$\Delta T = T_t T_c^{-1}$$

$T_c$ 를 거쳐 $T_t$ 까지 가는 변환이 $\Delta T$ 이다. 이것이 $I$ (단위 변환) 에서 떨어진 정도를 측정해야 하는데, 곡면 위의 두 점 사이의 거리를 직접 빼서는 안 된다. log 로 평면에 내려간다.

$$\boldsymbol{\xi}_e = \log(\Delta T)^{\vee} \in \mathfrak{se}(3) \cong \mathbb{R}^6$$

이 $\boldsymbol{\xi}_e$ 가 6D 오차 벡터이다. 위치 3 차원과 회전 3 차원을 한 묶음으로 다룰 수 있게 평면화된 형태이다 (실용 구현에서는 §7.7 에서 다룬 대로 위치는 단순 차이, 회전은 $\log(R_t R_c^T)$ 로 분리해서 계산한다).

평면 공간이므로 자코비안이 정의되고, 선형 풀이가 가능하다.

$$J(\mathbf{q}) \in \mathbb{R}^{6 \times n}, \qquad \boldsymbol{\xi}_e \approx J(\mathbf{q}) \Delta \mathbf{q}$$

$$\Delta \mathbf{q} = J^{+} \boldsymbol{\xi}_e \quad \text{(또는 DLS)}$$

관절 공간에서의 변화량 $\Delta \mathbf{q}$ 를 얻은 뒤 업데이트한다.

$$\mathbf{q} \leftarrow \mathbf{q} + \Delta \mathbf{q}$$

새 $\mathbf{q}$ 로 FK 를 다시 계산하면 새 $T_c$ 가 나오고, 다시 $\Delta T$ → log → 자코비안 → 풀이 → 업데이트 의 한 cycle 을 반복한다. 오차 norm 이 충분히 작아지면 수렴한 것이다.

이 절차에서 Lie 이론이 들어간 자리는 정확히 한 줄 — $\boldsymbol{\xi}_e = \log(\Delta T)^{\vee}$ — 이다. 곡면 위의 차이를 평면 벡터로 변환하는 단계이며, 나머지는 모두 평면에서 일어나는 표준 선형 산술이다.

### 9.3 — 왜 한 step 만으로는 끝나지 않는가

위 절차는 한 cycle 을 1차 근사로 푼다. $\Delta T$ 가 작을 때만 $\boldsymbol{\xi}_e \approx J \Delta \mathbf{q}$ 가 성립하기 때문이다. $\Delta \mathbf{q}$ 만큼 움직여도 새 $T_c$ 가 정확히 $T_t$ 가 되지는 않고, 작은 오차가 남는다. 그 오차로 다시 다음 step 을 푸는 것이다.

이 1차 근사의 한계는 평면 산술의 한계와 같다. $\exp$ 이 비선형이라 $\log(\exp(A)\exp(B)) = A + B$ 가 성립하지 않고, 보정 항 (Lie bracket) 이 따라붙는다 (BCH 공식, §10 에서 다룸). 한 step 에서는 그 보정 항을 무시하고 진행하므로, 큰 회전 오차가 남으면 한 step 으로는 다 못 풀고 반복이 필요하다.

작은 오차 영역에서는 평면이 곡면을 잘 근사하므로 Newton 식 수렴 속도 (이차 수렴) 가 나오고, 큰 오차에서는 step 을 잘게 나누거나 line search / DLS 같은 안정화 기법이 필요하다.

### 9.4 — SLAM 의 같은 패턴

SLAM (Simultaneous Localization and Mapping) 의 자세 그래프 최적화도 동일한 흐름을 따른다. 노드는 강체 자세이고 (각각이 SE(3) 의 한 점), 엣지는 두 자세 사이의 측정된 상대 변환이다. 측정값과 현재 추정값으로 계산한 상대 변환의 차이를 오차로 잡는다.

$$\Delta T = T_{\text{measured}}^{-1} \cdot T_{\text{predicted}}$$

$$\mathbf{e} = \log(\Delta T)^{\vee} \in \mathbb{R}^6$$

모든 엣지 오차를 가중합으로 묶은 비용

$$F = \sum_{\text{edges}} \mathbf{e}^T W \mathbf{e}$$

을 최소화한다. 최적화는 각 노드 자세의 tangent space 에서 update 벡터를 구한 뒤, exp 로 곡면 위 새 자세로 되돌리는 식으로 진행된다.

IK 와 다른 점은 변수의 종류 — IK 는 관절각이 변수, SLAM 은 강체 자세 자체가 변수 — 이지만, "곡면 위 점을 직접 다루지 못해 평면으로 내려가서 산술하고 다시 올린다" 는 패턴은 정확히 같다.

### 9.5 — §1 동기에 대한 답

§1 에서 위치는 더할 수 있는데 회전은 그냥 더할 수 없다는 사실에서 출발했다. $R_1 + R_2$ 가 회전 행렬이 아니라는 단순한 관찰이 Lie 이론 전체를 끌어낸 동기였다.

지금까지의 흐름을 답으로 정리하면 다음과 같다. SO(3) 가 곡면이라 더하기가 깨졌다. 이를 우회하려면 곡면을 잠시 떠나야 한다. 곡면의 한 점 — 단위 행렬 $I$ — 에서 평면 (tangent space, so(3)) 으로 내려간다. 평면에서는 모든 산술이 자유롭다. 산술 결과를 다시 곡면으로 되돌리는 다리가 exp map 이고, 반대 방향이 log map 이다. 이 한 쌍의 사상으로 곡면 위의 산술이 가능해진다.

회전을 직접 더할 수 없다는 한계가 Lie 이론의 출발점이었고, log / exp 라는 다리가 그 한계를 우회하는 도구이다. IK 와 SLAM 은 이 다리를 매 step 건너가면서 작동한다. 곡면 위의 산술이 곡면을 떠나지 않고는 풀리지 않는다는 사실 — 그것이 Lie 이론이 등장하는 이유이다.

---

## 10. BCH 공식 — 평면 산술의 한계

§9.3 에서 IK 의 한 step 이 1차 근사라고 적었다. 그 한계의 정확한 수식적 근거가 BCH 공식 (Baker–Campbell–Hausdorff formula) 이다. 이 절은 일반 Lie 이론 차원에서 BCH 가 무엇을 말하는지 정리하고, 왜 평면 산술이 곡면을 정확히 재현하지 못하는지 닫는다.

### 10.1 — 스칼라 지수와의 차이

스칼라 지수에서는 $e^a \cdot e^b = e^{a+b}$ 가 항상 성립한다. 그래서 곱셈을 덧셈으로 옮길 수 있고, 로그를 취하면 $\log(e^a e^b) = a + b$ 로 깔끔하게 떨어진다.

행렬 지수에서는 이 식이 일반적으로 깨진다. $A$ 와 $B$ 가 서로 가환 (commute) 이면 — $AB = BA$ — 같은 식이 성립하지만, 일반적인 행렬은 가환이 아니다. 회전 행렬도 가환이 아니다 ($R_x R_y \neq R_y R_x$).

### 10.2 — BCH 공식

두 비가환 행렬 $A, B$ 에 대해

$$\log(\exp(A) \exp(B)) = A + B + \frac{1}{2}[A, B] + \frac{1}{12}[A, [A, B]] - \frac{1}{12}[B, [A, B]] + \cdots$$

가 성립한다. 우변은 $A + B$ 에 Lie bracket $[A, B] = AB - BA$ 의 무한급수 보정 항이 따라붙은 형태이다.

가환 행렬이라면 모든 bracket 이 0 이 되어 $A + B$ 만 남는다. 비가환일수록 bracket 항이 남고, 평면에서의 단순한 덧셈이 곡면 위 곱셈을 정확히 재현하지 못한다는 사실이 한 줄로 표현된다.

### 10.3 — 1차 근사로서의 평면 산술

$A$ 와 $B$ 의 크기가 작으면 (작은 회전, 작은 변환) 1차 항 $A + B$ 가 지배적이고, $[A, B]$ 같은 2차 보정 항은 무시할 수 있다. IK 한 step 이 작은 $\Delta T$ 영역에서만 정확한 이유가 이것이다.

$\boldsymbol{\xi}_e = \log(T_t T_c^{-1})^{\vee}$ 를 자코비안으로 풀어 $\Delta \mathbf{q}$ 를 얻은 뒤 $\mathbf{q} \leftarrow \mathbf{q} + \Delta \mathbf{q}$ 로 업데이트하는 절차는, 사실 곡면 위 합성을 평면 위 덧셈으로 근사하는 과정이다. BCH 공식의 1차 항만 사용하는 셈이다. 보정 항을 무시했으므로 한 step 으로는 정확히 목표에 도달하지 못하고 잔여 오차가 남으며, 다음 step 에서 다시 풀어야 한다.

큰 회전이 한 번에 안 풀리는 것도 같은 이유다. $|\Delta \boldsymbol{\xi}|$ 가 커질수록 무시한 보정 항의 비중이 커져 1차 근사가 점점 부정확해진다. 실용 IK 가 step 을 작게 잘라가며 반복하거나, DLS 나 line search 같은 안정화 기법을 쓰는 것은 이 1차 근사의 한계 안에서 안전한 영역을 유지하기 위한 장치이다.

### 10.4 — Lie bracket 의 의미

§6 에서 Lie bracket $[\hat{\boldsymbol{\omega}}_1, \hat{\boldsymbol{\omega}}_2]$ 가 두 회전이 얼마나 비가환인지를 측정한다고 적었다. BCH 공식에서 그 의미가 더 분명해진다. bracket 이 0 인 곳에서는 평면 산술이 곡면 산술을 정확히 재현하고, bracket 이 클수록 보정 항이 커진다.

so(3) 에서는 $[\hat{\boldsymbol{\omega}}_1, \hat{\boldsymbol{\omega}}_2] = \widehat{\boldsymbol{\omega}_1 \times \boldsymbol{\omega}_2}$ 이므로, 두 회전축이 평행할 때만 가환이고 ($\boldsymbol{\omega}_1 \times \boldsymbol{\omega}_2 = 0$), 일반적으로는 비가환이다. 같은 축으로의 회전들은 단순 더해도 정확하지만, 다른 축의 회전들을 더하면 BCH 보정이 필요해진다는 직관과도 맞는다.

### 10.5 — 정리

BCH 공식은 비가환 곡면 위 곱셈과 평면 위 덧셈 사이의 정확한 차이를 무한급수로 표현한다. Lie bracket 항이 그 차이를 측정하며, bracket 이 작을수록 1차 근사가 잘 맞는다. IK 한 step 이 1차 근사라는 사실, 그래서 반복이 필요하다는 사실은 모두 BCH 공식의 직접적인 결과이다.

이로써 Lie 이론 입문 — 곡면 위 회전이 더할 수 없다는 동기에서 출발해, group / manifold / tangent space / Lie algebra / exp-log map / 응용 / BCH 보정까지 — 의 한 cycle 을 닫는다. 더 깊은 주제 (Adjoint, body / spatial frame, left / right Jacobian, 연속 시간 적분) 는 응용 문서 (`fk_6dof_theory.md` 등) 에서 필요할 때 도입한다.
