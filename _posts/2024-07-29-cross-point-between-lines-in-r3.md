---
title: 공간에서 직선과 직선의 교차점
description: 직선과 직선의 교차점 구하기
author: mark
categories: [mathmatic, geometry]
tags: [three.js]
pin: true
math: true
mermaid: true
---

## 동일한 두 벡터와 외적은 0 이다.

$$ \vec a \times \vec a = 0 $$

<br>

## 외적의 성질

1. 반교환 법칙(Anti-commutative Law):

$$ a \times b = -(b \times a) $$

2. 분배 법칙(Distributive Law)

$$ a \times (b + c) = (a \times b) + (a \times c) $$

3. 상수항과 결합 법칙

$$ k(a \times b) = (ka) \times b = a \times (kb) $$

<br>

## 직선의 교점 방정식 유도

s, t 는 scalar

o1, o2는 직선위의 한점

d1, d2는 방향 벡터

<br>

### 두 직선의 벡터 방정식

$$ 
\begin{align}
r_1 = o_1 + sd_1 \\
r_2 = o_2 + td_2
\end{align}
$$

<br>

### 두 직선의 교점 구하기

$$
\begin{align}
r_1(s) &= r_2(t) \\
o_1 + sd_1 &=  o_2 + td_2
\end{align}
$$

$sd_1$과 $sd_2$ 항으로 정리

$$
\begin{align}
sd_1 = o_2 - o_1 + td_2 \\
td_2 = o_1 - o_2 + sd_1
\end{align}
$$

<br>

오른쪽에 $td_2, sd_1$ 항을 제거 하기 위해 양변에 $d_2, d_1$ 으로 외적을 취한다.

$$ 
\begin{align}
sd_1 \times d_2 &= (o_2 - o_1 + td_2) \times d_2 \\
sd_1 \times d_2 &= (o_2 - o_1) \times d_2 + td2 \times d_2\\
sd_1 \times d_2 &= (o_2 - o_1) \times d_2 \\
\end{align}
$$

$$
\begin{align}
td_2 \times d_1 &= (o_1 - o_2 + sd_1) \times d_1 \\
td_2 \times d_1 &= (o_1 - o_2) \times d_1 + sd1 \times d_1\\
td_2 \times d_1 &= (o_1 - o_2) \times d_1 \\
\end{align}
$$
<br>

$s, t$ 항을 구하기 위해 양변에 $ (d_1 \times d_2), (d_2 \times d_1 ) $ 으로 내적을 취한다.

$$ 
\begin{align}
s(d_1 \times d_2) \cdot (d_1 \times d_2) &= ((o_2 - o_1) \times d_2) \cdot (d_1 \times d_2) \\
s &= {((o_2 - o_1) \times d_2) \cdot (d_1 \times d_2) \over (d_1 \times d_2) \cdot (d_1 \times d_2)} \\
s &= {((o_2 - o_1) \times d_2) \cdot (d_1 \times d_2) \over \|d_1 \times d_2\|^2} \\
s &= {det(o_2-o_1, d_2, d_1 \times d_2) \over \|d_1 \times d_2\|^2} \\
\end{align}
$$

$$ 
\begin{align}
t(d_2 \times d_1) \cdot (d_2 \times d_1) &= ((o_1 - o_2) \times d_1) \cdot (d_2 \times d_1) \\
t &= {((o_1 - o_2) \times d_1) \cdot (d_2 \times d_1) \over (d_2 \times d_1) \cdot (d_2 \times d_1)} \\
t &= {((o_1 - o_2) \times d_1) \cdot (d_2 \times d_1) \over \|d_2 \times d_1\|^2} \\
t &= {det(o_1-o_2, d_2, d_2 \times d_1) \over \|d_2 \times d_1\|^2} \\
\end{align}
$$

(13) 외적의 결합법칙, $kd_1 \times d_2 = d_1 \times kd_2 = k(d_1 \times d_2)$  
(15) 동일 벡터의 내적, $\|\mathbf{a}\|^2 = \vec a \cdot \vec a = a_1a_1 + a_2a_2$  
(16) 유도 과정  
내적의 교환법칙, $ \vec a \cdot \vec b = \vec b \cdot \vec a $  
스칼라 삼중곱, $ \vec a \cdot ( \vec b \times \vec c) = \vec b \cdot ( \vec c \times \vec a) = \vec c \cdot ( \vec a \times \vec b) = det( \vec a, \vec b, \vec c)$  
$ ((o_2 - o_1) \times d_2) \cdot (d_1 \times d_2) $  
$ \vec a = o_2 - o_1 $  
$ \vec b = d2 $  
$ \vec c=(d_1 \times d_2)$  
$ (\vec a \times \vec b) \cdot \vec c = \vec c \cdot ( \vec a \times \vec b) = \vec a \cdot (\vec b \times \vec c)$  
$ (o_2 - o_1) \cdot (d_2 \times (d_1 \times d_2))$  
$ (o_2 - o_1) \cdot (d_2 \times (d_1 \times d_2)) = det(o_2 - o_1, d_2, d_1 \times d_2)$


<!-- code -->
<link rel="stylesheet" href="/assets/three/style.css">

<!-- Spinning Cube Demo -->
<div class='threejs'>
    <div id='canvas'></div>
</div>

<!-- Including the JavaScript module -->
<script type="module">
  import * as THREE from '/assets/three/three.module.js';
  import { OrbitControls } from "/assets/three/OrbitControls.js";

  var container = document.getElementById("canvas");
  var scene, camera, controls, renderer;

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
    camera.position.z = 10;
    camera.position.y = 10;
    const target = new THREE.Vector3(0, 0, 0);
    camera.lookAt(target);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // camera controls
    controls = new OrbitControls(camera, renderer.domElement);


    const origin1 = new THREE.Vector3(-5, 5, 3);
    const direction1 = new THREE.Vector3(1, 0, -1.4);    
    direction1.sub(origin1);
    direction1.normalize();

    createLine(origin1, direction1, 10, scene, 0xff0000);

    // Create the second line
    const origin2 = new THREE.Vector3(5, 5, 2);
    const direction2 = new THREE.Vector3(0, 0, -2);
    direction2.sub(origin2);
    direction2.normalize();
    createLine(origin2, direction2, 10, scene, 0x00ff00);

    // const a = origin2.clone().sub(origin1);
    // const b = direction2.clone();
    // const c = direction1.clone().cross(direction2);
    // const cSquared = c.lengthSq();

    // const matS = new THREE.Matrix3(
    //   a.x, a.y, a.z,
    //   b.x, b.y, b.z,
    //   c.x, c.y, c.z
    // );

    // console.log(matS);

    // const detS = matS.determinant();

    // const s = detS / cSquared;
    // console.log(s);

    // const r1 = origin1.clone().add(direction1.multiplyScalar(s));
    // console.log(r1);

    const r1 = _findIntersectionPoint(origin1, direction1, origin2, direction2);
    let geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    let material = new THREE.MeshNormalMaterial({ wireframe: true });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = r1.x;
    mesh.position.y = r1.y;
    mesh.position.z = r1.z;
    scene.add(mesh);

    const r2 = _findIntersectionPoint(origin2, direction2, origin1, direction1);
    geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    material = new THREE.MeshNormalMaterial({ wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = r2.x;
    mesh.position.y = r2.y;
    mesh.position.z = r2.z;
    scene.add(mesh);

    const points = [];
    points.push(r1);
    points.push(r2);

    // Create the geometry and line
    const matLine = new THREE.LineBasicMaterial({ color: 0xffffff });
    const geomLine = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geomLine, matLine);

    // Add the line to the scene
    scene.add(line);

    const cp = r1.add(r2.clone().sub(r1.clone()).multiplyScalar(0.5));
    geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = cp.x;
    mesh.position.y = cp.y;
    mesh.position.z = cp.z;
    scene.add(mesh);
    

    //createLine(origin1, direction1, s, scene, 0xff0000);

    //const d1 = new THREE.Vector3(2, 2, 2);
  }

  function _findIntersectionPoint(origin1, dir1, origin2, dir2) {
    const a = origin2.clone().sub(origin1);
    const b = dir2.clone();
    const c = dir1.clone().cross(dir2);
    const lengthSq = c.lengthSq();

    const matPt = new THREE.Matrix3(
      a.x, a.y, a.z,
      b.x, b.y, b.z,
      c.x, c.y, c.z
    );
    const detS = matPt.determinant();
    const s = detS / lengthSq;

    console.log(matPt);
    console.log(s);

    return origin1.clone().add(dir1.multiplyScalar(s));
  }

  function createLine(origin, direction, length, scene, color) {
    // Normalize the direction vector
    direction.normalize();

    // Create line material
    const matLine = new THREE.LineBasicMaterial({ color: color });

    // Create points for the line
    const points = [];
    points.push(new THREE.Vector3(
        origin.x + direction.x * -length,
        origin.y + direction.y * -length,
        origin.z + direction.z * -length
    ));
    points.push(new THREE.Vector3(
        origin.x + direction.x * length,
        origin.y + direction.y * length,
        origin.z + direction.z * length
    ));

    // Create the geometry and line
    const geomLine = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geomLine, matLine);

    // Add the line to the scene
    scene.add(line);
  }

  function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
  }  
  init();
  animate();
</script>

## Reference

[오다기리 박의 알고리즘 노트: 직선과 직선의 교차점 구하기](https://wjdgh283.tistory.com/entry/%EC%A7%81%EC%84%A0%EA%B3%BC-%EC%A7%81%EC%84%A0%EC%9D%98-%EA%B5%90%EC%B0%A8%EC%A0%90-%EA%B5%AC%ED%95%98%EA%B8%B0)

[jebae's dev blog: 벡터의 외적과 삼중곱](https://jebae.github.io/vector-cross-product)
