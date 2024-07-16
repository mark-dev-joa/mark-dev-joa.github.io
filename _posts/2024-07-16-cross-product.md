---
title: 벡터의 외적(cross product)
author: mark
categories: [mathmatic, linear algebra, cross product]
tags: [three.js]
math: true
---


## 3차원 공간$ ^{R^3}$ 상의 두 벡터 $\mathbf a$, $\mathbf b$ 로 이루어진 평면의 수직인 벡터를 생성


## 외적의 정의

$$
\mathbf{a} \times \mathbf{b} = \begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
a_1 & a_2 & a_3 \\
b_1 & b_2 & b_3 \\
\end{vmatrix}
$$


$ \vec r = \begin{bmatrix}3 \\ 2 \end{bmatrix} $


$$ 
\mathbf{a} \times \mathbf{b} = (a_2b_3 - a_3b_2)\mathbf{i} - (a_1b_3 - a_3b_1)\mathbf{j} + (a_1b_2 - a_2b_1)\mathbf{k} 
$$




The mathematics powered by [**MathJax**](https://www.mathjax.org/):


$$ R^3

$$
\begin{equation}
  \sum_{n=1}^\infty 1/n^2 = \frac{\pi^2}{6}
  \label{eq:series}
\end{equation}
$$

We can reference the equation as \eqref{eq:series}.

When $a \ne 0$, there are two solutions to $ax^2 + bx + c = 0$ and they are

$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

<!-- Spinning Cube Demo -->
<div class='threejs'>
    <div id='canvas'></div>
</div>


## Reference
 R Markdown (https://www.statpower.net/Content/310/R%20Stuff/SampleMarkdown.html)


<!-- code -->
<link rel="stylesheet" href="/assets/three/style.css">
<script type="module" src='/assets/posts/2024-07-16-cross-product.js'></script>
