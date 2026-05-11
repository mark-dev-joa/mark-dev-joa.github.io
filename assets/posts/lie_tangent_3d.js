// Lie Theory — Tangent Space 3D 시각화
// Sphere (S² manifold) + 한 점 P + 그 점의 tangent plane + tangent vectors
// 마우스 드래그: 카메라 회전 (간단한 구현)
// 슬라이더: 점 P 의 위치 (위도, 경도)
(function () {
  const container = document.getElementById("lie-tangent-3d");
  if (!container) return;
  if (typeof THREE === "undefined") {
    container.textContent = "Three.js 로딩 실패";
    return;
  }

  // === UI ===
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "style") e.setAttribute("style", attrs[k]);
      else if (k in e) e[k] = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    if (children) for (const c of children) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    return e;
  }

  const latSlider = el("input", { type: "range", min: -85, max: 85, value: 30, step: 1, style: "width:160px;" });
  const lonSlider = el("input", { type: "range", min: -180, max: 180, value: 30, step: 1, style: "width:160px;" });
  const latLabel = el("span", { style: "min-width:40px; display:inline-block; text-align:right; color:#d32f2f; font-weight:600;" }, ["30°"]);
  const lonLabel = el("span", { style: "min-width:40px; display:inline-block; text-align:right; color:#d32f2f; font-weight:600;" }, ["30°"]);
  const showPlaneCheck = el("input", { type: "checkbox", checked: true });
  const showVectorsCheck = el("input", { type: "checkbox", checked: true });

  const controls = el("div", { style: "display:flex; flex-wrap:wrap; gap:14px; align-items:center; margin-bottom:8px; font-family:system-ui,sans-serif; font-size:13px;" }, [
    el("label", null, ["위도: ", latSlider, " ", latLabel]),
    el("label", null, ["경도: ", lonSlider, " ", lonLabel]),
    el("label", null, [showPlaneCheck, " 접평면"]),
    el("label", null, [showVectorsCheck, " 접벡터"]),
  ]);

  const canvas = el("div", { style: "width:100%; height:420px; background:#fafbfc; border-radius:6px; cursor:grab;" });

  const legend = el("div", { style: "font-size:12px; color:#555; margin-top:6px; line-height:1.5;" });
  legend.appendChild(el("b", null, ["검은 점 I"]));
  legend.appendChild(document.createTextNode(" = identity (북극 고정) | "));
  legend.appendChild(el("b", null, ["빨간 점 R"]));
  legend.appendChild(document.createTextNode(" = 회전 행렬 (슬라이더로 이동) | "));
  legend.appendChild(el("b", null, ["주황 평면"]));
  legend.appendChild(document.createTextNode(" = I 의 tangent space (= so(3)) | "));
  legend.appendChild(el("b", null, ["주황 화살표"]));
  legend.appendChild(document.createTextNode(" = I → R 의 tangent vector ω (axis-angle) | "));
  legend.appendChild(el("b", null, ["빨간 곡선"]));
  legend.appendChild(document.createTextNode(" = geodesic (I → R 최단 경로 = exp(ω))."));

  container.appendChild(controls);
  container.appendChild(canvas);
  container.appendChild(legend);

  // === Three.js Setup ===
  const W = canvas.clientWidth;
  const H = 420;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafbfc);

  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  // 카메라 spherical 좌표 (수동 orbit)
  let camR = 5;
  let camTheta = Math.PI / 4;   // 수평 각도
  let camPhi = Math.PI / 3;     // 수직 각도 (위에서)
  function updateCamera() {
    camera.position.set(
      camR * Math.sin(camPhi) * Math.cos(camTheta),
      camR * Math.cos(camPhi),
      camR * Math.sin(camPhi) * Math.sin(camTheta)
    );
    camera.lookAt(0, 0, 0);
  }
  updateCamera();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);
  canvas.appendChild(renderer.domElement);

  // === 조명 ===
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const light = new THREE.DirectionalLight(0xffffff, 0.6);
  light.position.set(5, 10, 5);
  scene.add(light);

  // === 좌표축 (작게) ===
  const axesHelper = new THREE.AxesHelper(1.3);
  scene.add(axesHelper);
  // 라벨 (sprite 로)
  function addLabel(text, pos, color) {
    const cv = document.createElement("canvas");
    cv.width = 64; cv.height = 64;
    const ctx = cv.getContext("2d");
    ctx.font = "bold 40px system-ui, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 32, 32);
    const tex = new THREE.CanvasTexture(cv);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sp = new THREE.Sprite(mat);
    sp.position.set(pos.x, pos.y, pos.z);
    sp.scale.set(0.25, 0.25, 1);
    scene.add(sp);
  }
  addLabel("X", { x: 1.45, y: 0, z: 0 }, "#e53935");
  addLabel("Y", { x: 0, y: 1.45, z: 0 }, "#43a047");
  addLabel("Z", { x: 0, y: 0, z: 1.45 }, "#1e88e5");

  // === Sphere (S² manifold) ===
  const sphereGeom = new THREE.SphereGeometry(1, 48, 32);
  const sphereMat = new THREE.MeshLambertMaterial({
    color: 0x1565c0,
    transparent: true,
    opacity: 0.18,
  });
  const sphere = new THREE.Mesh(sphereGeom, sphereMat);
  scene.add(sphere);

  // 격자 (위도/경도 선)
  const wireMat = new THREE.LineBasicMaterial({ color: 0x1565c0, transparent: true, opacity: 0.4 });
  // 위도 (경위도 격자)
  for (let lat = -75; lat <= 75; lat += 15) {
    const r = Math.cos(lat * Math.PI / 180);
    const y = Math.sin(lat * Math.PI / 180);
    const pts = [];
    for (let lon = 0; lon <= 360; lon += 6) {
      const a = lon * Math.PI / 180;
      pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    scene.add(new THREE.Line(g, wireMat));
  }
  // 경도
  for (let lon = 0; lon < 360; lon += 30) {
    const a = lon * Math.PI / 180;
    const pts = [];
    for (let lat = -90; lat <= 90; lat += 6) {
      const r = Math.cos(lat * Math.PI / 180);
      const y = Math.sin(lat * Math.PI / 180);
      pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    scene.add(new THREE.Line(g, wireMat));
  }

  // === I (고정 — 북극) ===
  const I_POS = new THREE.Vector3(0, 1, 0); // 북극에 I 고정

  const iGeom = new THREE.SphereGeometry(0.05, 16, 16);
  const iMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const iMesh = new THREE.Mesh(iGeom, iMat);
  iMesh.position.copy(I_POS);
  scene.add(iMesh);
  addLabel("I", { x: 0, y: 1.18, z: 0 }, "#222");

  // === R (이동 가능 — 빨간 점) ===
  const pointGeom = new THREE.SphereGeometry(0.05, 16, 16);
  const pointMat = new THREE.MeshLambertMaterial({ color: 0xd32f2f });
  const pointMesh = new THREE.Mesh(pointGeom, pointMat);
  scene.add(pointMesh);

  // === Tangent plane at I (북극에 고정) ===
  const planeGeom = new THREE.PlaneGeometry(1.8, 1.8);
  const planeMat = new THREE.MeshLambertMaterial({
    color: 0xff9800,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeom, planeMat);
  plane.position.copy(I_POS);
  // I 의 normal 은 (0, 1, 0). plane 기본 normal (0, 0, 1) → y 로 회전
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);

  // 평면 테두리
  const planeEdgeGeom = new THREE.EdgesGeometry(planeGeom);
  const planeEdge = new THREE.LineSegments(
    planeEdgeGeom,
    new THREE.LineBasicMaterial({ color: 0xe65100 })
  );
  planeEdge.position.copy(I_POS);
  planeEdge.rotation.x = Math.PI / 2;
  scene.add(planeEdge);

  // === Tangent vector at I (I → R 방향) ===
  const tangentArrow = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0),
    I_POS,
    0.5,
    0xbf360c,
    0.13,
    0.08
  );
  scene.add(tangentArrow);

  // === Geodesic 경로 (I → R 곡선) ===
  const geodesicMat = new THREE.LineBasicMaterial({ color: 0xd32f2f, linewidth: 2 });
  let geodesicLine = null;

  function updateGeodesic(R, theta) {
    if (geodesicLine) {
      scene.remove(geodesicLine);
      geodesicLine.geometry.dispose();
    }
    if (theta < 0.001) return;
    // I 에서 R 까지 great circle (slerp)
    const I_v = I_POS.clone();
    const N = I_v.clone().cross(R).normalize();
    const pts = [];
    const STEPS = 40;
    for (let s = 0; s <= STEPS; s++) {
      const t = s / STEPS;
      const angle = t * theta;
      // Rodrigues: rotate I_v by angle around N
      const cos_a = Math.cos(angle), sin_a = Math.sin(angle);
      const rot = I_v.clone().multiplyScalar(cos_a)
        .add(N.clone().cross(I_v).multiplyScalar(sin_a))
        .add(N.clone().multiplyScalar(N.dot(I_v) * (1 - cos_a)));
      pts.push(rot);
    }
    geodesicLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), geodesicMat);
    scene.add(geodesicLine);
  }

  // === Update R, tangent vector, geodesic ===
  function updatePoint() {
    const lat = parseFloat(latSlider.value) * Math.PI / 180;
    const lon = parseFloat(lonSlider.value) * Math.PI / 180;
    latLabel.textContent = latSlider.value + "°";
    lonLabel.textContent = lonSlider.value + "°";

    // R 점 위치 (구면 좌표)
    const r = 1.0;
    const x = r * Math.cos(lat) * Math.cos(lon);
    const y = r * Math.sin(lat);
    const z = r * Math.cos(lat) * Math.sin(lon);
    const R = new THREE.Vector3(x, y, z);
    pointMesh.position.copy(R);

    // I 와 R 사이 각도 (great circle distance)
    const cosTheta = Math.max(-1, Math.min(1, I_POS.dot(R)));
    const theta = Math.acos(cosTheta); // 라디안

    // I 의 tangent space 에서 R 방향 — initial velocity of geodesic
    // = (R - I*(I·R)) 정규화 후 길이 θ 로 (arc length)
    const tangent = R.clone().sub(I_POS.clone().multiplyScalar(cosTheta));
    if (tangent.length() > 0.001) {
      tangent.normalize();
      tangentArrow.position.copy(I_POS);
      tangentArrow.setDirection(tangent);
      tangentArrow.setLength(Math.max(0.05, theta * 0.6), 0.13, 0.08);
      tangentArrow.visible = showVectorsCheck.checked;
    } else {
      tangentArrow.visible = false;
    }

    // 평면 보이기
    plane.visible = showPlaneCheck.checked;
    planeEdge.visible = showPlaneCheck.checked;

    // Geodesic 곡선 업데이트
    updateGeodesic(R, theta);
  }
  updatePoint();

  // === 마우스 드래그 (간단한 orbit) ===
  let isDragging = false;
  let lastX = 0, lastY = 0;
  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.style.cursor = "grabbing";
  });
  window.addEventListener("mouseup", () => { isDragging = false; canvas.style.cursor = "grab"; });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    camTheta -= dx * 0.01;
    camPhi -= dy * 0.01;
    camPhi = Math.max(0.1, Math.min(Math.PI - 0.1, camPhi));
    updateCamera();
  });
  // 휠로 줌
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    camR *= e.deltaY > 0 ? 1.1 : 0.9;
    camR = Math.max(2, Math.min(15, camR));
    updateCamera();
  }, { passive: false });

  // === 슬라이더 이벤트 ===
  latSlider.addEventListener("input", updatePoint);
  lonSlider.addEventListener("input", updatePoint);
  showPlaneCheck.addEventListener("change", updatePoint);
  showVectorsCheck.addEventListener("change", updatePoint);

  // === 렌더 루프 ===
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  // 크기 변경 대응
  window.addEventListener("resize", () => {
    const newW = canvas.clientWidth;
    camera.aspect = newW / H;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, H);
  });
})();
