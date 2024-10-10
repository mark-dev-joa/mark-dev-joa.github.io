---
title: 공간에서 구와 직선의 교차 및 교점
description: 연립방정식, 이차방정식의 근의 공식, 판별식
author: mark
categories: [mathmatic]
tags: [three.js]
math: true
mermaid: true
---

## 구의 정의

### 공간에서 구의 중심을 기준으로 반지름 r만큼 떨어진 모든점의 집합

$$
r = \sqrt{x^2+y^2+z^2}
$$

## 구의 벡터 방정식

구의 중점 $\vec{Q}$, 구의 반지름 $r$,  원점을 중심으로 $r$ 만큼 떨어진 임의의 점 $\vec{P}$

$$
\begin{align}
(\vec{P} - \vec{Q}) \cdot (\vec{P} - \vec{Q}) &= r^2 \\
|\vec{P} - \vec{Q}| &= r \\
|\vec{P} - \vec{Q}| - r &= 0
\end{align}
$$

## 직선의 벡터 방정식

3차원 상의 임의의 두 점을 잇는 직선의 방정식

직선의 시작점 $\vec{F}$, 직선의 방향 벡터 $\vec{s}$, 매개변수 $\lambda$, 직선위의 임의의 점 $\vec{P}$

$$
\vec{P} = \vec{F} + \lambda\vec{s}
$$

직선에 시작점 $\vec{F}$ 에서 $\lambda$ 만큼 상수배한 방향 벡터 $\vec{s}$ 는 임의의 점 $\vec{P}$ 와같다.

## 두 식을 연립하여 하나의 방정식을 세운다.

직선의 시작점 $\vec{F}$ 에서 방향 벡터 $\vec{s}$ 로 발사된 직선위의 한점 $\vec{P}$ 가 구에 중점 $\vec{Q}$ 에서 $r$만큼 떨어진 $\vec{P}$ 와 같다.

$$
\begin{align}
|\vec{P} - \vec{Q}| &= r \\
\vec{P} &= \vec{F} + \lambda\vec{s}
\end{align}
$$

두 식을 연립한다.

$$
\begin{align}
|\vec{F} + \lambda\vec{s} - \vec{Q}| &= r \\
(\vec{F} + \lambda\vec{s} - \vec{Q})^2 &= r^2 \\
(\lambda\vec{s} + \vec{F} - \vec{Q}) &= r^2 \\
(\lambda\vec{s} + \vec{F} - \vec{Q})(\lambda\vec{s} + \vec{F} - \vec{Q}) &= r^2 \\
\lambda\vec{s}(\lambda\vec{s} + \vec{F} - \vec{Q}) + \vec{F}(\lambda\vec{s} + \vec{F} - \vec{Q}) - \vec{Q}(\lambda\vec{s} + \vec{F} - \vec{Q}) &= r^2 \\
\lambda^2(\vec{s} \cdot \vec{s}) + 2\lambda(\vec{s} \cdot (\vec{F} - \vec{Q})) + (\vec{F} - \vec{Q}) \cdot (\vec{F} - \vec{Q}) &= r^2 \\
\lambda^2(\vec{s} \cdot \vec{s}) + 2\lambda(\vec{s} \cdot (\vec{F} - \vec{Q})) + (\vec{F} - \vec{Q}) \cdot (\vec{F} - \vec{Q}) - r^2 &= 0
\end{align}
$$

정규화된 방향 벡터 $\vec{s}$ 의 길이는 1, $(\vec{s} \cdot \vec{s})$ 내적은 1

$$
\begin{align}
\lambda^2 + 2\lambda(\vec{s} \cdot (\vec{F} - \vec{Q})) + (\vec{F} - \vec{Q}) \cdot (\vec{F} - \vec{Q}) - r^2 &= 0
\end{align}
$$

이차방정식의 근의 공식과 판별식을 이용해 구와 직선의 교차 여부 및 교점을 구할 수 있다.


## 이차방정식의 해

### 근의 공식

이차방정식의 근은 인수분해를 하거나 근의 공식을 통해 구할 수 있다. 

근의 공식으로 구해진 근은 실수 인지 허수 인지에 따라 실근 또는 허근이라고 표현한다.

이차방정식 $ax^2 + bx + c = 0$ 의 근의 공식 ($a \neq 0$)

$$ 
x = {-b \pm \sqrt{b^2-4ac} \over 2a} 
$$

이차방정식 $ax^2 + 2b'x + c = 0$ 의 근의 공식 ($a \neq 0$)

$x$ 의 일차항의 계수가 $2b'$ 일때 짝수 공식을 사용 가능

$$ 
x = {-b' \pm \sqrt{b'^2-ac} \over a} 
$$

### 실근

이차방정식 $x^2 + 3x + 2 = 0$ 의 해 구하기

$$ 
\begin{align}
x^2 + 3x + 2 &= 0 \\
(x+1)(x+2) &= 0 \\
x &= -1, -2
\end{align}
$$

두 개의 실근(실수의 근)

### 중근

$x^2 + 4x + 4 = 0$ 의 해 구하기

$$ 
\begin{align}
x^2 + 4x + 4 &= 0 \\
(x+2)^2 &= 0 \\
x &= -2
\end{align}
$$

같은 근이 중복되어 중근

### 허근

$x^2 + x + 1 = 0$ 의 해 구하기

인수분해를 할 수 없어 근의 공식으로 해 구하기

$$ 
\begin{align}
x^2 + x + 1 &= 0 \\
x &= {-b \pm \sqrt{b^2-ac} \over 2a}  \\
x &= {-1 \pm \sqrt{1^2-4 \times 1 \times 1} \over 2 \times 1}  \\
x &= {-1 \pm \sqrt{-3} \over 2}  \\
x &= {-1 \pm \sqrt{3}\sqrt{-1} \over 2}  \\
x &= {-1 \pm \sqrt{3}i \over 2}  \\
\end{align}
$$

근이 허수라 허근

### 판별식(Discriminant)

이차방정식의 판별식 D는 이차방정식의 근의 개수를 구하는데 사용한다.

$$
D = b^2 - 4ac
$$ 


짝수 일때 판별식

$$
D = b^2 - ac
$$

근의 공식에서 제곱근 내부에 포함된 판별식 D

$$ 
x = {-b \pm \sqrt{b^2-4ac} \over 2a} = {-b \pm \sqrt{D} \over 2a} 
$$

D > 0, 실근 $\sqrt{D}$

D = 0, 중근 $\sqrt{0}$

D < 0, 허근 $\sqrt{-D} = \sqrt{D}i$

## 구와 직선의 교차 여부 판별

$\vec{Q}$ = 구의 중점

$ r $ = 구의 반지름

$\vec{F}$ = 직선의 시작점

$\vec{s}$ = 직선의 방향 벡터

$$
\begin{align}
ax^2 + bx + c &= 0 \\
\lambda^2 + 2\lambda(\vec{s} \cdot (\vec{F} - \vec{Q})) + (\vec{F} - \vec{Q}) \cdot (\vec{F} - \vec{Q}) - r^2 &= 0 \\
\textcolor{red}{1}\lambda^2 + \textcolor{blue}{2(\vec{s} \cdot (\vec{F} - \vec{Q}))}\lambda + \textcolor{green}{(\vec{F} - \vec{Q}) \cdot (\vec{F} - \vec{Q}) - r^2} &= 0
\end{align}
$$

이차방정식의 계수 $a, b, c$

$$ 
\begin{align}
a &= \textcolor{red}{1} \\
b &= \textcolor{blue}{2(\vec{s} \cdot (\vec{F} - \vec{Q}))} \\
c &= \textcolor{green}{(\vec{F} - \vec{Q}) \cdot (\vec{F} - \vec{Q}) - r^2} \\
\end{align}
$$

판별식 계산

$$
D = b^2 - 4ac
$$


$D \geq 0$ 일때 구와 직선의 한점 또는 두점에서 교차

## 구와 직선의 교점 구하기

판별식 $D$ 로 교차 여부를 판단하고 $D \geq 0$ 일때 근의 공식을 이용해 두 개의 $\lambda_1, \lambda_2$  계산한다.


$$ 
\begin{align}
{\lambda}_1 &= {-b + \sqrt{D} \over 2a }\\
{\lambda}_2 &= {-b - \sqrt{D} \over 2a } 
\end{align}
$$

계산된 $\lambda_1, \lambda_2$ 를 이용해 교차점 $ p_1, p_2 $를 구한다.

$$
p_1 = \vec{F} + {\lambda}_1\vec{s}
$$

$$
p_2 = \vec{F} + {\lambda}_2\vec{s}
$$

## 실행 코드

<div class='threejs'>
    <div id='canvas'></div>
</div>

<!-- code -->
<link rel="stylesheet" href="/assets/three/style.css">
<script type="module" src='/assets/posts/2024-10-01-intersection-between-sphere-ray.js'></script>
<br>

## 구현 코드

```javascript

import * as THREE from '/assets/three/three.module.js';
import { OrbitControls } from "/assets/three/OrbitControls.js";

var container = document.getElementById("canvas");
var scene, camera, controls, renderer;

init();
animate();

// 교차 여부와 교점 구하기
function findIntersectionBetweenRayAndSphere(Q, r, F, s) {

  console.log(F, r, Q, s);
  // F = center of the sphere
  // r = radius of the sphere
  // Q = origin of the line
  // s = direction of the line

  // t*t + 2*(s(F-Q))t+(F-Q)(F-Q) - r*r = 0
  // s is normal vector
  s.normalize();

  // oc = F-Q
  const oc = new THREE.Vector3().subVectors(F, Q)

  // a, b, c for Discriminant
  const a = 1;
  const b = 2 * s.dot(oc);
  const c = oc.dot(oc) - r * r;

  // discrimnanat
  // D = b^2 + 4ac
  const D = b * b - 4 * a * c;
  console.log(D)

  // 한점 교차
  if (D === 0) {
    const t1 = (-b - Math.sqrt(D)) / (2 * a)
    const p1 = new THREE.Vector3().addVectors(
      F,
      s.clone().multiplyScalar(t1)
    );

    return [p1]
  }
  // 두점 교차
  else if (D > 0) {
    // calc t1, t2
    const t1 = (-b - Math.sqrt(D)) / (2 * a)
    const t2 = (-b + Math.sqrt(D)) / (2 * a)

    const p1 = new THREE.Vector3().addVectors(
      F,
      s.clone().multiplyScalar(t1)
    );

    const p2 = new THREE.Vector3().addVectors(
      F,
      s.clone().multiplyScalar(t2)
    );
    return [p1, p2]
  }
  // 교차점 없음
  else {
    return []
  }
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function init() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // grid helper
  const size = 20;
  const divisions = 20;
  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  // axes
  const axes = new THREE.AxesHelper(5);
  scene.add(axes);

  // camera
  camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
  camera.position.x = 0;
  camera.position.z = 25;
  camera.position.y = 7;
  const target = new THREE.Vector3(0, 0, 0);
  camera.lookAt(target);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // camera controls
  controls = new OrbitControls(camera, renderer.domElement);

  ///////////////////////////////////////////////////////
  // a sphere
  //
  // equation
  // |P - Q| - r = 0
  //
  // radius 5,
  const r = 5;
  // center of sphere
  const Q = new THREE.Vector3(0, 5, 0)
  // Create a sphere geometry (radius, width segments, height segments)
  const geometry = new THREE.SphereGeometry(r, 20, 20);

  // Create a basic material and set its color
  const material = new THREE.MeshBasicMaterial({
    color: 0x0077ff,
    wireframe: true,
  });

  // Combine geometry and material into a mesh
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = Q.x;
  sphere.position.y = Q.y;
  sphere.position.z = Q.z;

  // Add the sphere to the scene
  scene.add(sphere);
  ///////////////////////////////////////////////////////


  ///////////////////////////////////////////////////////
  // a line
  //
  // equation
  // P = F + (t * s)
  //
  // start point of a line
  const F = new THREE.Vector3(0, 5, 20);

  // ray direction
  const s = new THREE.Vector3(getRandomFloat(-0.2, 0.2), getRandomFloat(-0.2, 0.2), -1);
  s.normalize();

  const E = F.clone().add(s.clone().multiplyScalar(50));

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([F, E]);
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
  ///////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////
  // intersection points
  const intersections = findIntersectionBetweenRayAndSphere(Q, r, F, s);
  console.log(intersections)

  for (let i in intersections) {
    // Create a geometry for the point
    const ptGeom = new THREE.BufferGeometry();
    const vertices = new Float32Array([0, 0, 0]); // Point position at origin
    ptGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    // Create a material for the point
    const ptMtrl = new THREE.PointsMaterial({ color: 0xff0000, size: 1 });

    // Create the point mesh
    const point = new THREE.Points(ptGeom, ptMtrl);

    point.position.x = intersections[i].x
    point.position.y = intersections[i].y
    point.position.z = intersections[i].z

    scene.add(point)
  }

  ///////////////////////////////////////////////////////
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

```

## Reference

[Overleaf](https://www.overleaf.com/)  

