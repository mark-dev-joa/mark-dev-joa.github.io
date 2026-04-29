import * as THREE from '/assets/three/three.module.js';
import { OrbitControls } from '/assets/three/OrbitControls.js';

// ============================================
// MLE / Gauss-Newton Curve Fitting 3D Visualization
// y = a * exp(-b * t) 모델에 대한 반복 최적화 과정
// 데이터 포인트 + 모델 곡선이 매 Iteration 업데이트
// ============================================

const container = document.getElementById('mle-canvas');
const width = container.clientWidth;
const height = container.clientHeight;

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
camera.position.set(6, 5, 8);
camera.lookAt(2, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(2, 1.5, 0);

// --- Lighting ---
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
dLight.position.set(5, 10, 5);
scene.add(dLight);

// --- Real Data from the blog post ---
// y = a * exp(-b * t) + noise
// True: a=5.0, b=0.3
const dataPoints = [
  { t: 0.0, y: 5.2 },
  { t: 1.0, y: 3.9 },
  { t: 2.0, y: 2.8 },
  { t: 3.0, y: 2.3 },
  { t: 5.0, y: 1.1 },
  { t: 7.0, y: 0.7 },
  { t: 10.0, y: 0.3 },
];

// Gauss-Newton iterations (from blog computation)
const iterations = [
  { a: 3.0, b: 0.1, E: 160.27, label: 'Initial' },
  { a: 5.289, b: 0.327, E: 2.25, label: 'Iter 1' },
  { a: 5.089, b: 0.296, E: 1.55, label: 'Iter 2' },
  { a: 5.078, b: 0.294, E: 1.547, label: 'Iter 3' },
  { a: 5.078, b: 0.294, E: 1.547, label: 'Converged' },
];

// Scale factors for visualization
const scaleT = 0.5;   // t축 스케일
const scaleY = 0.6;   // y축 스케일
const zSpacing = 2.5;  // iteration 간 z 간격

// --- Axes ---
function createAxes() {
  const axesMat = new THREE.LineBasicMaterial({ color: 0x666666 });

  // T axis (x direction)
  const tAxisPts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(10 * scaleT + 0.5, 0, 0)];
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(tAxisPts), axesMat));

  // Y axis (y direction)
  const yAxisPts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 6 * scaleY + 0.3, 0)];
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(yAxisPts), axesMat));

  // Z axis (iteration direction)
  const zAxisPts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -(iterations.length - 1) * zSpacing - 0.5)];
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(zAxisPts), axesMat));
}
createAxes();

// --- Grid on floor ---
const gridSize = 12;
const gridDiv = 24;
const grid = new THREE.GridHelper(gridSize, gridDiv, 0x222222, 0x1a1a1a);
grid.position.set(gridSize / 4, -0.01, -(iterations.length - 1) * zSpacing / 2);
scene.add(grid);

// --- Data Points (red spheres at each iteration plane) ---
function createDataPoints(zOffset, opacity) {
  const group = new THREE.Group();
  dataPoints.forEach(d => {
    const geo = new THREE.SphereGeometry(0.08, 12, 12);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xFF5252,
      emissive: 0xFF5252,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: opacity,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(d.t * scaleT, d.y * scaleY, -zOffset);
    group.add(mesh);
  });
  scene.add(group);
  return group;
}

// --- Model Curve ---
function modelFunc(t, a, b) {
  return a * Math.exp(-b * t);
}

function createCurve(a, b, zOffset, color, opacity) {
  const pts = [];
  for (let t = 0; t <= 11; t += 0.2) {
    const y = modelFunc(t, a, b);
    pts.push(new THREE.Vector3(t * scaleT, y * scaleY, -zOffset));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({
    color: color,
    linewidth: 2,
    transparent: true,
    opacity: opacity,
  });
  const line = new THREE.Line(geo, mat);
  scene.add(line);
  return line;
}

// --- Error Lines (vertical lines from data to curve) ---
function createErrorLines(a, b, zOffset, color, opacity) {
  const group = new THREE.Group();
  dataPoints.forEach(d => {
    const predicted = modelFunc(d.t, a, b);
    const pts = [
      new THREE.Vector3(d.t * scaleT, d.y * scaleY, -zOffset),
      new THREE.Vector3(d.t * scaleT, predicted * scaleY, -zOffset),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity * 0.6,
    });
    group.add(new THREE.Line(geo, mat));
  });
  scene.add(group);
  return group;
}

// --- Create all iterations ---
const iterColors = [0xFF9800, 0xFFC107, 0x8BC34A, 0x4CAF50, 0x00BCD4];
const curveObjects = [];
const errorLineObjects = [];
const dataPointObjects = [];

iterations.forEach((iter, idx) => {
  const zOff = idx * zSpacing;
  const opacity = idx === 0 ? 0.5 : (idx === iterations.length - 1 ? 1.0 : 0.7);
  const color = iterColors[idx % iterColors.length];

  dataPointObjects.push(createDataPoints(zOff, opacity));
  curveObjects.push(createCurve(iter.a, iter.b, zOff, color, opacity));
  errorLineObjects.push(createErrorLines(iter.a, iter.b, zOff, 0xFF5252, opacity));
});

// --- Connecting arrows between iterations ---
function createIterationArrow(fromIdx, toIdx) {
  const z1 = -fromIdx * zSpacing;
  const z2 = -toIdx * zSpacing;
  const midT = 5 * scaleT;
  const y = 0.1;

  const pts = [
    new THREE.Vector3(midT, y, z1 - 0.3),
    new THREE.Vector3(midT, y, z2 + 0.3),
  ];
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.4 });
  scene.add(new THREE.Line(geo, mat));

  // Arrowhead
  const dir = new THREE.Vector3(0, 0, -1);
  const origin = new THREE.Vector3(midT, y, z2 + 0.3);
  const arrowHelper = new THREE.ArrowHelper(dir, origin, 0.001, 0x666666, 0.15, 0.08);
  scene.add(arrowHelper);
}

for (let i = 0; i < iterations.length - 1; i++) {
  createIterationArrow(i, i + 1);
}

// --- Animated "current fit" ball that traces the curve ---
const traceGeo = new THREE.SphereGeometry(0.1, 16, 16);
const traceMat = new THREE.MeshPhongMaterial({
  color: 0x00BCD4,
  emissive: 0x00BCD4,
  emissiveIntensity: 0.5,
});
const traceBall = new THREE.Mesh(traceGeo, traceMat);
scene.add(traceBall);

// --- Error energy bars (show E decreasing) ---
function createEnergyBar(iter, idx) {
  const maxE = 160;
  const barHeight = (iter.E / maxE) * 3.0;
  const barGeo = new THREE.BoxGeometry(0.15, barHeight, 0.15);
  const barMat = new THREE.MeshPhongMaterial({
    color: iterColors[idx % iterColors.length],
    transparent: true,
    opacity: 0.8,
  });
  const bar = new THREE.Mesh(barGeo, barMat);
  bar.position.set(-0.8, barHeight / 2, -idx * zSpacing);
  scene.add(bar);
  return bar;
}

const energyBars = iterations.map((iter, idx) => createEnergyBar(iter, idx));

// --- Minimum marker (converged position) ---
const lastIter = iterations[iterations.length - 1];
const convGeo = new THREE.SphereGeometry(0.12, 16, 16);
const convMat = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 0.5,
});
const convMarker = new THREE.Mesh(convGeo, convMat);
const convZ = -(iterations.length - 1) * zSpacing;
convMarker.position.set(0, modelFunc(0, lastIter.a, lastIter.b) * scaleY, convZ);
scene.add(convMarker);

// --- Animation ---
let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  frame++;

  // Trace ball: moves along iterations over time
  const totalDuration = iterations.length * 120; // frames per full cycle
  const cycleFrame = frame % totalDuration;
  const iterFloat = (cycleFrame / totalDuration) * (iterations.length - 1);
  const iterIdx = Math.min(Math.floor(iterFloat), iterations.length - 2);
  const frac = iterFloat - iterIdx;

  // Interpolate between iteration params
  const a0 = iterations[iterIdx].a;
  const b0 = iterations[iterIdx].b;
  const a1 = iterations[iterIdx + 1].a;
  const b1 = iterations[iterIdx + 1].b;
  const aLerp = a0 + (a1 - a0) * frac;
  const bLerp = b0 + (b1 - b0) * frac;

  // Trace ball follows the curve along t, at current interpolated params
  const tTrace = (Math.sin(frame * 0.04) + 1) / 2 * 10;
  const yTrace = modelFunc(tTrace, aLerp, bLerp);
  const zTrace = -(iterIdx + frac) * zSpacing;
  traceBall.position.set(tTrace * scaleT, yTrace * scaleY, zTrace);

  // Pulse converged marker
  const pulse = 1 + Math.sin(frame * 0.05) * 0.2;
  convMarker.scale.setScalar(pulse);

  // Pulse energy bars subtly
  energyBars.forEach((bar, i) => {
    const p = 1 + Math.sin(frame * 0.03 + i * 0.5) * 0.05;
    bar.scale.x = p;
    bar.scale.z = p;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
