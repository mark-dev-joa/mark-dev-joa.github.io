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
