import * as THREE from '/assets/three/three.module.js';
import { OrbitControls } from "/assets/three/OrbitControls.js";
import * as HELPER from '/assets/three/helper.js';
//import { findIntersectionBetweenRayAndSphere } from './geometry'

var camera, scene, renderer, stats;
var geometry, group;
var mouseX = 0,
  mouseY = 0;

var window = document.getElementById("canvas");

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
createGeometry();
animate();

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

  //
  if (D === 0) {
    const t1 = (-b - Math.sqrt(D)) / (2 * a)
    const p1 = new THREE.Vector3().addVectors(
      F,
      s.clone().multiplyScalar(t1)
    );

    return [p1]
  }
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
  else {
    return []
  }
}


function createGeometry() {

  ///////////////////////////////////////////////////////
  // a sphere
  //
  // equation
  // |P - Q| - r = 0
  //
  // radius 5,
  const r = 5;
  // center of sphere
  const Q = new THREE.Vector3(0, 0, 0)
  const sphere = HELPER.createSphere(r, 12, 12);
  sphere.position.x = Q.x
  sphere.position.y = Q.y
  sphere.position.z = Q.z

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
  const F = new THREE.Vector3(0, 5, 20)
  // ray direction
  const s = new THREE.Vector3(0, -0.2, -1)

  const E = F.clone().add(s.clone().multiplyScalar(50))


  const line = HELPER.createLine([F, E], 0xff00ff)
  scene.add(line)
  ///////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////
  // intersection points
  const intersections = findIntersectionBetweenRayAndSphere(Q, r, F, s);
  console.log(intersections)

  for (let i in intersections) {
    const point = HELPER.createPoint(0xff0000, 1)
    point.position.x = intersections[i].x
    point.position.y = intersections[i].y
    point.position.z = intersections[i].z

    scene.add(point)
  }

  ///////////////////////////////////////////////////////
  camera.lookAt(sphere.position);
}

function init() {
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 30;
  camera.position.y = 5;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2b2b2b);
  scene.fog = new THREE.Fog(0x2b2b2b, 1, 10000);

  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // axes
  const axes = new THREE.AxesHelper(20);
  scene.add(axes);

  // camera controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Create a grid helper (size, divisions, gridColor1, gridColor2)
  const gridHelper = new THREE.GridHelper(1000, 1000);

  // Add the grid to the scene
  scene.add(gridHelper);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 10;
  mouseY = (event.clientY - windowHalfY) * 10;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

