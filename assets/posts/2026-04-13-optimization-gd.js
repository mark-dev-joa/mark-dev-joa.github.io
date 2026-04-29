import * as THREE from '/assets/three/three.module.js';
import { OrbitControls } from '/assets/three/OrbitControls.js';

// ============================================
// Gradient Descent 3D Visualization
// f(x,y) = x^2 + y^2 위에서 경사 하강법 시각화
// ============================================

const container = document.getElementById('gd-canvas');
const width = container.clientWidth;
const height = container.clientHeight;

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

// Camera
const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
camera.position.set(8, 10, 8);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// --- Surface: f(x,y) = x^2 + y^2 ---
const surfaceSize = 5;
const segments = 60;
const surfaceGeometry = new THREE.PlaneGeometry(surfaceSize * 2, surfaceSize * 2, segments, segments);

// Deform plane into paraboloid
const positions = surfaceGeometry.attributes.position;
for (let i = 0; i < positions.count; i++) {
  const x = positions.getX(i);
  const z = positions.getY(i); // PlaneGeometry Y -> our Z
  const y = (x * x + z * z) * 0.15; // f(x,z) = 0.15*(x^2 + z^2)
  positions.setXYZ(i, x, y, z);
}
surfaceGeometry.computeVertexNormals();

const surfaceMaterial = new THREE.MeshPhongMaterial({
  color: 0x2196F3,
  transparent: true,
  opacity: 0.35,
  side: THREE.DoubleSide,
  wireframe: false,
});
const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
scene.add(surface);

// Wireframe overlay
const wireGeometry = surfaceGeometry.clone();
const wireMaterial = new THREE.MeshBasicMaterial({
  color: 0x2196F3,
  wireframe: true,
  transparent: true,
  opacity: 0.15,
});
const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
scene.add(wireframe);

// --- Grid (floor) ---
const gridHelper = new THREE.GridHelper(10, 20, 0x333333, 0x222222);
gridHelper.position.y = -0.01;
scene.add(gridHelper);

// --- Gradient Descent Path ---
// f(x,y) = 0.15*(x^2 + y^2)
// grad f = [0.3x, 0.3y]
function computeGDPath(startX, startZ, lr, steps) {
  const path = [];
  let x = startX;
  let z = startZ;
  for (let i = 0; i < steps; i++) {
    const y = (x * x + z * z) * 0.15;
    path.push(new THREE.Vector3(x, y, z));
    // Gradient descent update
    const gx = 0.3 * x;
    const gz = 0.3 * z;
    x = x - lr * gx;
    z = z - lr * gz;
  }
  // Final point
  const y = (x * x + z * z) * 0.15;
  path.push(new THREE.Vector3(x, y, z));
  return path;
}

// Three different learning rates for comparison
const paths = [
  { points: computeGDPath(4.5, 4.0, 0.5, 40), color: 0x4CAF50, label: 'α=0.5 (적절)' },
  { points: computeGDPath(4.5, 4.0, 0.1, 40), color: 0xFFC107, label: 'α=0.1 (느림)' },
  { points: computeGDPath(4.5, 4.0, 3.0, 40), color: 0xF44336, label: 'α=3.0 (발산)' },
];

// Draw paths and balls
const balls = [];
const pathLines = [];

paths.forEach((pathData, idx) => {
  // Path line
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(pathData.points);
  const lineMaterial = new THREE.LineBasicMaterial({ color: pathData.color, linewidth: 2 });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
  pathLines.push({ line, points: pathData.points });

  // Ball (animated along path)
  const ballGeometry = new THREE.SphereGeometry(0.12, 16, 16);
  const ballMaterial = new THREE.MeshPhongMaterial({ color: pathData.color, emissive: pathData.color, emissiveIntensity: 0.3 });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.copy(pathData.points[0]);
  scene.add(ball);
  balls.push({ mesh: ball, points: pathData.points, currentIdx: 0 });
});

// --- Minimum point marker ---
const minGeometry = new THREE.SphereGeometry(0.15, 16, 16);
const minMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });
const minMarker = new THREE.Mesh(minGeometry, minMaterial);
minMarker.position.set(0, 0, 0);
scene.add(minMarker);

// --- Animation ---
let frame = 0;
const speed = 0.03; // how fast balls move along path

function animate() {
  requestAnimationFrame(animate);
  frame++;

  // Animate balls along their paths
  const t = (Math.sin(frame * speed) + 1) / 2; // 0 to 1, oscillating
  balls.forEach(ball => {
    const idx = Math.floor(t * (ball.points.length - 1));
    const clampedIdx = Math.min(idx, ball.points.length - 1);
    ball.mesh.position.copy(ball.points[clampedIdx]);
  });

  // Pulse minimum marker
  const pulse = 0.15 + Math.sin(frame * 0.05) * 0.03;
  minMarker.scale.setScalar(pulse / 0.15);

  controls.update();
  renderer.render(scene, camera);
}

animate();
