import * as THREE from '/assets/three/three.module.js';
import { OrbitControls } from '/assets/three/OrbitControls.js';

// ============================================
// Gauss-Newton vs Levenberg-Marquardt 비교 시각화
// Rosenbrock-like function: f(x,y) = (1-x)^2 + 5*(y-x^2)^2
// 좁고 긴 골짜기를 가진 함수에서 두 알고리즘의 수렴 경로 비교
// ============================================

const container = document.getElementById('lm-canvas');
const width = container.clientWidth;
const height = container.clientHeight;

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
camera.position.set(6, 8, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- Lighting ---
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
dLight.position.set(5, 10, 5);
scene.add(dLight);

// --- Surface: modified Rosenbrock (scaled for visualization) ---
// f(x,z) = (1-x)^2 + 5*(z - x^2)^2, scaled to fit view
const range = 3;
const segments = 80;
const surfaceGeometry = new THREE.PlaneGeometry(range * 2, range * 2, segments, segments);
const positions = surfaceGeometry.attributes.position;

function rosenbrock(x, z) {
  return ((1 - x) * (1 - x) + 5 * (z - x * x) * (z - x * x)) * 0.06;
}

for (let i = 0; i < positions.count; i++) {
  const x = positions.getX(i);
  const z = positions.getY(i);
  const y = Math.min(rosenbrock(x, z), 4); // clamp height
  positions.setXYZ(i, x, y, z);
}
surfaceGeometry.computeVertexNormals();

const surfaceMaterial = new THREE.MeshPhongMaterial({
  color: 0x9C27B0,
  transparent: true,
  opacity: 0.3,
  side: THREE.DoubleSide,
});
scene.add(new THREE.Mesh(surfaceGeometry, surfaceMaterial));

// Wireframe
const wireGeometry = surfaceGeometry.clone();
scene.add(new THREE.Mesh(wireGeometry, new THREE.MeshBasicMaterial({
  color: 0x9C27B0, wireframe: true, transparent: true, opacity: 0.12,
})));

// Grid
const grid = new THREE.GridHelper(6, 20, 0x333333, 0x222222);
grid.position.y = -0.01;
scene.add(grid);

// --- Optimization Paths ---
// Numerical gradient
function gradRosenbrock(x, z) {
  const h = 0.0001;
  const fx = rosenbrock(x, z);
  const gx = (rosenbrock(x + h, z) - fx) / h;
  const gz = (rosenbrock(x, z + h) - fx) / h;
  return [gx, gz];
}

// Gauss-Newton path (aggressive, fixed step)
function computeGNPath(startX, startZ, steps) {
  const path = [];
  let x = startX, z = startZ;
  for (let i = 0; i < steps; i++) {
    const y = Math.min(rosenbrock(x, z), 4);
    path.push(new THREE.Vector3(x, y, z));
    const [gx, gz] = gradRosenbrock(x, z);
    const norm = Math.sqrt(gx * gx + gz * gz) + 1e-8;
    // Gauss-Newton: large fixed step (can overshoot)
    const lr = 0.8;
    x -= lr * gx / norm;
    z -= lr * gz / norm;
    // Clamp
    x = Math.max(-range, Math.min(range, x));
    z = Math.max(-range, Math.min(range, z));
  }
  path.push(new THREE.Vector3(x, Math.min(rosenbrock(x, z), 4), z));
  return path;
}

// Levenberg-Marquardt path (adaptive damping)
function computeLMPath(startX, startZ, steps) {
  const path = [];
  let x = startX, z = startZ;
  let mu = 1.0; // damping factor
  for (let i = 0; i < steps; i++) {
    const y = Math.min(rosenbrock(x, z), 4);
    path.push(new THREE.Vector3(x, y, z));
    const [gx, gz] = gradRosenbrock(x, z);
    const norm = Math.sqrt(gx * gx + gz * gz) + 1e-8;
    // LM: adaptive step with damping
    const lr = 1.0 / (1.0 + mu);
    const newX = x - lr * gx;
    const newZ = z - lr * gz;
    // Check if cost decreased
    if (rosenbrock(newX, newZ) < rosenbrock(x, z)) {
      x = newX;
      z = newZ;
      mu *= 0.7; // decrease damping (more aggressive)
    } else {
      mu *= 2.0; // increase damping (more conservative)
      x -= (0.1 / mu) * gx;
      z -= (0.1 / mu) * gz;
    }
    x = Math.max(-range, Math.min(range, x));
    z = Math.max(-range, Math.min(range, z));
  }
  path.push(new THREE.Vector3(x, Math.min(rosenbrock(x, z), 4), z));
  return path;
}

const startX = -1.5, startZ = 2.0;
const gnPath = computeGNPath(startX, startZ, 60);
const lmPath = computeLMPath(startX, startZ, 60);

// Draw paths
function drawPath(points, color) {
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color, linewidth: 2 });
  scene.add(new THREE.Line(geom, mat));

  // Start marker
  const startGeo = new THREE.SphereGeometry(0.08, 12, 12);
  const startMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const startMesh = new THREE.Mesh(startGeo, startMat);
  startMesh.position.copy(points[0]);
  scene.add(startMesh);

  // Animated ball
  const ballGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const ballMat = new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: 0.3 });
  const ball = new THREE.Mesh(ballGeo, ballMat);
  ball.position.copy(points[0]);
  scene.add(ball);
  return ball;
}

const gnBall = drawPath(gnPath, 0xFF9800); // Orange: Gauss-Newton
const lmBall = drawPath(lmPath, 0x00BCD4); // Cyan: Levenberg-Marquardt

// Minimum marker at (1, 0, 1) since rosenbrock min is at (1,1)
const minY = rosenbrock(1, 1);
const minGeo = new THREE.SphereGeometry(0.12, 16, 16);
const minMat = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });
const minMesh = new THREE.Mesh(minGeo, minMat);
minMesh.position.set(1, minY, 1);
scene.add(minMesh);

// --- Animation ---
let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  frame++;

  const t = (Math.sin(frame * 0.025) + 1) / 2;

  const gnIdx = Math.min(Math.floor(t * (gnPath.length - 1)), gnPath.length - 1);
  gnBall.position.copy(gnPath[gnIdx]);

  const lmIdx = Math.min(Math.floor(t * (lmPath.length - 1)), lmPath.length - 1);
  lmBall.position.copy(lmPath[lmIdx]);

  // Pulse min
  const pulse = 1 + Math.sin(frame * 0.05) * 0.2;
  minMesh.scale.setScalar(pulse);

  controls.update();
  renderer.render(scene, camera);
}

animate();
